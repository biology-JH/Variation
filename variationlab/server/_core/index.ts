import "dotenv/config";
import express, { type Response } from "express";
import { createServer } from "http";
import { randomUUID } from "node:crypto";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { publicPlatformScript } from "./publicConfig";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { clearClassSubmissions, insertClassSubmission, listClassSubmissions } from "../db";
import { buildSnapshot, cleanSubmission, exportRows } from "../variation";
import { teacherKeyIsValid } from "../teacher-key";

const streams = new Set<Response>();

async function dashboardPayload() {
  const rows = await listClassSubmissions();
  return buildSnapshot(rows);
}

async function broadcastSnapshot() {
  if (streams.size === 0) return;
  try {
    const payload = JSON.stringify(await dashboardPayload());
    for (const stream of streams) {
      try {
        stream.write(`event: snapshot\ndata: ${payload}\n\n`);
      } catch {
        streams.delete(stream);
      }
    }
  } catch (error) {
    console.error("[Dashboard] Failed to broadcast:", error);
  }
}

function csvCell(value: unknown) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replaceAll('"', '""')}"`;
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/platform/config.js", (_req, res) => {
    res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript());
  });

  app.get("/api/class-data", async (_req, res) => {
    try {
      res.set("Cache-Control", "no-store").json(await dashboardPayload());
    } catch (error) {
      console.error("[Dashboard] Snapshot failed:", error);
      res.status(503).json({ error: "Class data is temporarily unavailable." });
    }
  });

  app.get("/api/class-data/stream", async (_req, res) => {
    res.status(200).set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    res.flushHeaders();
    streams.add(res);
    try {
      res.write(`event: snapshot\ndata: ${JSON.stringify(await dashboardPayload())}\n\n`);
    } catch {
      res.write(`event: error\ndata: ${JSON.stringify({ error: "Class data is temporarily unavailable." })}\n\n`);
    }
    const heartbeat = setInterval(() => res.write(": keep-alive\n\n"), 15000);
    _req.on("close", () => {
      clearInterval(heartbeat);
      streams.delete(res);
    });
  });

  app.post("/api/class-data", async (req, res) => {
    try {
      const clean = cleanSubmission(req.body ?? {});
      await insertClassSubmission({
        id: randomUUID(),
        bodyMass: clean.bodyMass === undefined ? undefined : String(clean.bodyMass),
        height: clean.height === undefined ? undefined : String(clean.height),
        handSpan: clean.handSpan === undefined ? undefined : String(clean.handSpan),
        tongueRolling: clean.tongueRolling,
        eyeColour: clean.eyeColour,
        bloodGroup: clean.bloodGroup,
        leafLengths: clean.leafLengths ? JSON.stringify(clean.leafLengths) : undefined,
        seedMass: clean.seedMass === undefined ? undefined : String(clean.seedMass),
        seedMasses: clean.seedMasses ? JSON.stringify(clean.seedMasses) : undefined,
      });
      await broadcastSnapshot();
      res.status(201).json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save this submission.";
      const status = message.includes("Database") ? 503 : 400;
      res.status(status).json({ error: message });
    }
  });

  app.get("/api/export.csv", async (req, res) => {
    if (!teacherKeyIsValid(req.query.key)) return res.status(403).json({ error: "Teacher key required." });
    try {
      const rows = exportRows(await listClassSubmissions());
      const headers = ["id", "bodyMassKg", "heightCm", "handSpanCm", "tongueRolling", "eyeColour", "bloodGroup", "leafLengthsCm", "seedMassG", "submittedAt"];
      const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => csvCell(row[header as keyof typeof row])).join(","))].join("\n");
      res.set({ "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="variation-lab-${new Date().toISOString().slice(0, 10)}.csv"` }).send(csv);
    } catch (error) {
      console.error("[Dashboard] Export failed:", error);
      res.status(503).json({ error: "Export is temporarily unavailable." });
    }
  });

  app.delete("/api/class-data", async (req, res) => {
    if (!teacherKeyIsValid(req.body?.key)) return res.status(403).json({ error: "Teacher key required." });
    try {
      await clearClassSubmissions();
      await broadcastSnapshot();
      res.json({ ok: true });
    } catch (error) {
      console.error("[Dashboard] Clear failed:", error);
      res.status(503).json({ error: "Database clear is temporarily unavailable." });
    }
  });

  registerOAuthRoutes(app);
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  if (process.env.NODE_ENV === "development") await setupVite(app, server);
  else serveStatic(app);

  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  server.on("error", error => { console.error("Server failed:", error.message); process.exit(1); });
  server.listen(port, "0.0.0.0", () => console.log(`Server listening on port ${port}`));
}

startServer().catch(error => { console.error(error); process.exit(1); });
