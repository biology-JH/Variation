var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import { randomUUID } from "node:crypto";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "webdev_app_session";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";
var OAUTH_STATE_COOKIE = "__Host-oauth_state";
var decodeOAuthState = (state) => {
  let decoded;
  try {
    decoded = atob(state);
  } catch {
    return { redirectUri: "" };
  }
  try {
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed.redirectUri === "string") return parsed;
  } catch {
  }
  return { redirectUri: decoded };
};

// server/_core/oauth.ts
import { parse as parseCookieHeader2 } from "cookie";

// server/db.ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bloodGroupChoice: () => bloodGroupChoice,
  classSubmissions: () => classSubmissions,
  eyeColourChoice: () => eyeColourChoice,
  tongueRollingChoice: () => tongueRollingChoice,
  userRole: () => userRole,
  users: () => users
});
import { numeric, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
var userRole = pgEnum("user_role", ["user", "admin"]);
var tongueRollingChoice = pgEnum("tongue_rolling_choice", ["can", "cannot"]);
var eyeColourChoice = pgEnum("eye_colour_choice", ["brown", "blue", "green", "hazel"]);
var bloodGroupChoice = pgEnum("blood_group_choice", ["A", "B", "AB", "O"]);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn", { withTimezone: true }).defaultNow().notNull()
});
var classSubmissions = pgTable("class_submissions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  bodyMass: numeric("bodyMass", { precision: 7, scale: 2 }),
  height: numeric("height", { precision: 7, scale: 2 }),
  handSpan: numeric("handSpan", { precision: 6, scale: 2 }),
  tongueRolling: tongueRollingChoice("tongueRolling"),
  eyeColour: eyeColourChoice("eyeColour"),
  bloodGroup: bloodGroupChoice("bloodGroup"),
  leafLengths: text("leafLengths"),
  seedMass: numeric("seedMass", { precision: 8, scale: 4 }),
  seedMasses: text("seedMasses"),
  submittedAt: timestamp("submittedAt", { withTimezone: true }).defaultNow().notNull()
});

// server/db-config.ts
var SSL_CONNECTION_PARAMETERS = /* @__PURE__ */ new Set([
  "ssl",
  "sslcert",
  "sslkey",
  "sslmode",
  "sslrootcert",
  "uselibpqcompat"
]);
function getPostgresConnectionString(env = process.env) {
  const connectionString = env.POSTGRES_DATABASE_URL?.trim() || env.DATABASE_URL?.trim() || env.DRIZZLE_DATABASE_URL?.trim();
  if (!connectionString) return null;
  let protocol;
  try {
    protocol = new URL(connectionString).protocol;
  } catch {
    throw new Error("The database connection string is not a valid URL.");
  }
  if (protocol !== "postgres:" && protocol !== "postgresql:") {
    throw new Error("Only PostgreSQL connection URLs are supported by this application.");
  }
  return connectionString;
}
function getVerifiedPostgresOptions(connectionString, caCertificate) {
  if (!caCertificate.includes("-----BEGIN CERTIFICATE-----") || !caCertificate.includes("-----END CERTIFICATE-----")) {
    throw new Error("A PEM CA certificate is required for verified PostgreSQL TLS.");
  }
  const url = new URL(connectionString);
  for (const name of [...url.searchParams.keys()]) {
    if (SSL_CONNECTION_PARAMETERS.has(name.toLowerCase())) {
      url.searchParams.delete(name);
    }
  }
  return {
    connectionString: url.toString(),
    ssl: {
      ca: caCertificate,
      rejectUnauthorized: true
    }
  };
}

// server/_core/env.ts
var ENV = {
  get appId() {
    return process.env.MANUS_PROJECT_ID ?? "";
  },
  get cookieSecret() {
    return process.env.MANUS_JWT_SECRET ?? "";
  },
  get databaseUrl() {
    return process.env.DATABASE_URL ?? "";
  },
  get oAuthServerUrl() {
    return process.env.MANUS_OAUTH_API_URL ?? "";
  },
  // Preserve the legacy hint when supplied; otherwise roles remain application data.
  get ownerOpenId() {
    return process.env.OWNER_OPEN_ID ?? "";
  },
  get isProduction() {
    return process.env.NODE_ENV === "production";
  },
  get forgeApiUrl() {
    return process.env.MANUS_API_URL ?? "";
  },
  get forgeApiKey() {
    return process.env.MANUS_API_KEY ?? "";
  }
};

// server/db.ts
var _db = null;
var _pool = null;
function readPostgresCaCertificate() {
  return readFileSync(resolve(process.cwd(), "certs/aiven-ca.pem"), "utf8");
}
async function getDb() {
  if (_db) return _db;
  try {
    const configuredUrl = getPostgresConnectionString();
    if (!configuredUrl) return null;
    const { connectionString, ssl } = getVerifiedPostgresOptions(
      configuredUrl,
      readPostgresCaCertificate()
    );
    _pool = new Pool({
      connectionString,
      ssl,
      max: 5,
      idleTimeoutMillis: 3e4
    });
    _db = drizzle(_pool, { schema: schema_exports });
    return _db;
  } catch {
    console.warn("[Database] PostgreSQL configuration or trusted CA certificate is unavailable.");
    return null;
  }
}
async function upsertUser(user) {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const values = { openId: user.openId };
  const updateSet = {};
  const textFields = ["name", "email", "loginMethod"];
  for (const field of textFields) {
    if (user[field] !== void 0) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== void 0) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== void 0) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = /* @__PURE__ */ new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = /* @__PURE__ */ new Date();
  updateSet.updatedAt = /* @__PURE__ */ new Date();
  await db.insert(users).values(values).onConflictDoUpdate({
    target: users.openId,
    set: updateSet
  });
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function listClassSubmissions() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select().from(classSubmissions).orderBy(desc(classSubmissions.submittedAt));
}
async function insertClassSubmission(values) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(classSubmissions).values(values);
}
async function clearClassSubmissions() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(classSubmissions);
}

// server/_core/cookies.ts
function getSessionCookieOptions(_req) {
  return { httpOnly: true, path: "/", sameSite: "none", secure: true };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: MANUS_OAUTH_API_URL is not configured! Set MANUS_OAUTH_API_URL environment variable."
      );
    }
  }
  decodeState(state) {
    return decodeOAuthState(state).redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    if (!secret) throw new Error("MANUS_JWT_SECRET is unavailable");
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || (!isNonEmptyString(appId) || appId !== ENV.appId) || typeof name !== "string") {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    let sessionToken = cookies.get(COOKIE_NAME);
    if (!sessionToken && req.path.startsWith("/api/scheduled/")) {
      const ticket = cookies.get("app_session_id");
      const identity = await this.verifySession(ticket);
      if (identity?.openId.startsWith(CRON_OPEN_ID_PREFIX)) sessionToken = ticket;
    }
    if (!sessionToken) {
      const authHeader = req.headers.authorization;
      if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        sessionToken = authHeader.slice(7);
      }
    }
    const session = await this.verifySession(sessionToken);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader2(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error instanceof Error ? error.message : "unknown error");
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/publicConfig.ts
function publicPlatformConfig(env = process.env) {
  return {
    projectId: env.MANUS_PROJECT_ID ?? "",
    oauthPortalUrl: env.MANUS_OAUTH_PORTAL_URL ?? "",
    apiUrl: env.MANUS_API_URL ?? "",
    apiBrowserKey: env.MANUS_API_BROWSER_KEY ?? ""
  };
}
function publicPlatformScript(env = process.env) {
  const json = JSON.stringify(publicPlatformConfig(env)).replaceAll("<", "\\u003c");
  return `window.__MANUS_CONFIG__=${json};`;
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  })
  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs2 from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
var PROJECT_ROOT = import.meta.dirname;
var LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
var MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
var TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}
function trimLogFile(logPath, maxSize) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }
    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines = [];
    let keptBytes = 0;
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}
`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }
    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
  }
}
function writeToLogFile(source, entries) {
  if (entries.length === 0) return;
  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);
  const lines = entries.map((entry) => {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });
  fs.appendFileSync(logPath, `${lines.join("\n")}
`, "utf-8");
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}
function vitePluginManusDebugCollector() {
  return {
    name: "manus-debug-collector",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js"
            },
            injectTo: "head"
          }
        ]
      };
    },
    configureServer(server) {
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }
        const handlePayload = (payload) => {
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };
        const reqBody = req.body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    }
  };
}
function vitePluginPublicPlatformConfig() {
  return {
    name: "manus-public-platform-config",
    configureServer(server) {
      server.middlewares.use("/api/platform/config.js", (_req, res) => {
        res.setHeader("Content-Type", "application/javascript");
        res.setHeader("Cache-Control", "no-store");
        res.end(publicPlatformScript());
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "api/platform/config.js", source: publicPlatformScript() });
    }
  };
}
var plugins = [vitePluginPublicPlatformConfig(), react(), tailwindcss(), jsxLocPlugin(), vitePluginManusDebugCollector()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.get("/404", (_req, res) => {
    res.status(404).sendFile(path2.resolve(distPath, "index.html"));
  });
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/variation.ts
var RANGES = {
  bodyMass: { min: 20, max: 300, label: "20\u2013300 kg" },
  height: { min: 80, max: 230, label: "80\u2013230 cm" },
  handSpan: { min: 5, max: 35, label: "5\u201335 cm" },
  leafLength: { min: 0.5, max: 60, label: "0.5\u201360 cm" },
  seedMass: { min: 1e-3, max: 10, label: "0.001\u201310 g" }
};
var optionalNumber = (value, range, label, field) => {
  if (value === void 0 || value === null || value === "") return void 0;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`${field} must be a valid number between ${label}.`);
  if (parsed < range.min || parsed > range.max) throw new Error(`${field} must be between ${label}.`);
  return Math.round(parsed * 1e4) / 1e4;
};
var hasSelectedValue = (value) => value !== void 0 && value !== null && value !== "";
function cleanSubmission(input) {
  if (input.consent !== true) {
    throw new Error("Give consent to share this result anonymously before submitting.");
  }
  const acceptedFields = /* @__PURE__ */ new Set(["consent", "bodyMass", "height", "handSpan", "tongueRolling", "eyeColour", "bloodGroup", "leafLengths", "seedMass", "seedMasses"]);
  if (Object.keys(input).some((field) => !acceptedFields.has(field))) {
    throw new Error("Only anonymous investigation results are accepted; personal information is not accepted.");
  }
  const clean = {};
  clean.bodyMass = optionalNumber(input.bodyMass, RANGES.bodyMass, RANGES.bodyMass.label, "Body mass");
  clean.height = optionalNumber(input.height, RANGES.height, RANGES.height.label, "Height");
  clean.handSpan = optionalNumber(input.handSpan, RANGES.handSpan, RANGES.handSpan.label, "Hand span");
  clean.seedMass = optionalNumber(input.seedMass, RANGES.seedMass, RANGES.seedMass.label, "Seed mass");
  if (input.seedMasses !== void 0) {
    if (!Array.isArray(input.seedMasses) || input.seedMasses.length < 1 || input.seedMasses.length > 40) {
      throw new Error("Add between 1 and 40 seed masses, or leave Investigation 8 blank.");
    }
    const masses = input.seedMasses.map((value) => optionalNumber(value, RANGES.seedMass, RANGES.seedMass.label, "Seed mass"));
    if (masses.some((value) => value === void 0)) throw new Error("Every seed mass must be a number.");
    clean.seedMasses = masses;
  }
  if (hasSelectedValue(input.tongueRolling) && input.tongueRolling !== "can" && input.tongueRolling !== "cannot") {
    throw new Error("Tongue rolling must be Can or Cannot.");
  }
  if (hasSelectedValue(input.eyeColour) && !["brown", "blue", "green", "hazel"].includes(String(input.eyeColour))) {
    throw new Error("Eye colour must be Brown, Blue, Green, or Hazel.");
  }
  if (hasSelectedValue(input.bloodGroup) && !["A", "B", "AB", "O"].includes(String(input.bloodGroup))) {
    throw new Error("Blood group must be A, B, AB, or O.");
  }
  if (hasSelectedValue(input.tongueRolling)) clean.tongueRolling = input.tongueRolling;
  if (hasSelectedValue(input.eyeColour)) clean.eyeColour = input.eyeColour;
  if (hasSelectedValue(input.bloodGroup)) clean.bloodGroup = input.bloodGroup;
  if (input.leafLengths !== void 0) {
    if (!Array.isArray(input.leafLengths) || input.leafLengths.length < 1 || input.leafLengths.length > 40) {
      throw new Error("Add between 1 and 40 leaf lengths, or leave Investigation 7 blank.");
    }
    const leaves = input.leafLengths.map((value) => optionalNumber(value, RANGES.leafLength, RANGES.leafLength.label, "Leaf length"));
    if (leaves.some((value) => value === void 0)) throw new Error("Every leaf length must be a number.");
    clean.leafLengths = leaves;
  }
  if (Object.values(clean).every((value) => value === void 0)) {
    throw new Error("Add at least one result before submitting.");
  }
  return clean;
}
function numeric2(value) {
  if (value === null || value === void 0 || value === "") return void 0;
  const result = Number(value);
  return Number.isFinite(result) ? result : void 0;
}
function parseJsonNumbers(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(Number).filter(Number.isFinite) : [];
  } catch {
    return [];
  }
}
var quantile = (sorted, p) => {
  if (sorted.length === 0) return 0;
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
};
function makeHistogram(values, unit, minimumBinWidth) {
  const clean = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (clean.length === 0) return { values: [], bins: [], min: null, max: null, unit };
  const min = clean[0];
  const max = clean[clean.length - 1];
  const alignedMin = Math.floor(min / minimumBinWidth) * minimumBinWidth;
  let alignedMax = Math.ceil(max / minimumBinWidth) * minimumBinWidth;
  if (alignedMax <= alignedMin) alignedMax = alignedMin + minimumBinWidth;
  const q1 = quantile(clean, 0.25);
  const q3 = quantile(clean, 0.75);
  const fdWidth = 2 * (q3 - q1) / Math.cbrt(clean.length);
  const sturgesBins = Math.ceil(1 + Math.log2(clean.length));
  const adaptiveWidth = Math.max(fdWidth || (alignedMax - alignedMin) / sturgesBins, minimumBinWidth);
  const binCount = Math.max(1, Math.min(12, Math.floor((alignedMax - alignedMin) / adaptiveWidth)));
  const width = (alignedMax - alignedMin) / binCount;
  const precision = width < 0.1 ? 3 : width < 1 ? 1 : 0;
  const format = (value) => Number(value.toFixed(precision)).toString();
  const bins = Array.from({ length: binCount }, (_, index) => {
    const start = alignedMin + index * width;
    const end = index === binCount - 1 ? alignedMax : alignedMin + (index + 1) * width;
    return { start, end, label: `${format(start)}\u2013${format(end)}`, frequency: 0 };
  });
  for (const value of clean) {
    const index = Math.min(binCount - 1, Math.max(0, Math.floor((value - alignedMin) / width)));
    bins[index].frequency += 1;
  }
  return { values: clean, bins, min, max, unit };
}
function publicHistogram(histogram) {
  return {
    unit: histogram.unit,
    bins: histogram.bins.map(({ label, frequency }) => ({ label, frequency }))
  };
}
function buildSnapshot(rows) {
  const leafValues = rows.flatMap((row) => parseJsonNumbers(row.leafLengths));
  const tally = (field, categories) => categories.map((label) => ({
    label,
    frequency: rows.filter((row) => row[field] === label).length
  }));
  return {
    totalSampleSize: rows.length,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    histograms: {
      bodyMass: publicHistogram(makeHistogram(rows.map((row) => numeric2(row.bodyMass)).filter((v) => v !== void 0), "kg", 10)),
      height: publicHistogram(makeHistogram(rows.map((row) => numeric2(row.height)).filter((v) => v !== void 0), "cm", 10)),
      handSpan: publicHistogram(makeHistogram(rows.map((row) => numeric2(row.handSpan)).filter((v) => v !== void 0), "cm", 2)),
      leafLength: publicHistogram(makeHistogram(leafValues, "cm", 5)),
      seedMass: publicHistogram(makeHistogram(rows.flatMap((row) => [...parseJsonNumbers(row.seedMasses), ...numeric2(row.seedMass) === void 0 ? [] : [numeric2(row.seedMass)]]), "g", 0.5))
    },
    categories: {
      tongueRolling: tally("tongueRolling", ["can", "cannot"]),
      eyeColour: tally("eyeColour", ["brown", "blue", "green", "hazel"]),
      bloodGroup: tally("bloodGroup", ["A", "B", "AB", "O"])
    }
  };
}
function exportRows(rows) {
  return rows.map((row) => ({
    id: row.id,
    bodyMassKg: row.bodyMass ?? "",
    heightCm: row.height ?? "",
    handSpanCm: row.handSpan ?? "",
    tongueRolling: row.tongueRolling ?? "",
    eyeColour: row.eyeColour ?? "",
    bloodGroup: row.bloodGroup ?? "",
    leafLengthsCm: row.leafLengths ?? "[]",
    seedMassG: row.seedMasses ?? row.seedMass ?? "",
    submittedAt: row.submittedAt.toISOString()
  }));
}

// server/teacher-key.ts
import { timingSafeEqual } from "node:crypto";
var DEVELOPMENT_TEACHER_KEY = "variationlab";
function teacherKeyIsValid(value) {
  const supplied = typeof value === "string" ? value : "";
  const configured = process.env.TEACHER_KEY;
  const expected = configured || (process.env.NODE_ENV === "development" ? DEVELOPMENT_TEACHER_KEY : "");
  if (!expected) return false;
  const left = Buffer.from(supplied);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

// server/_core/index.ts
var streams = /* @__PURE__ */ new Set();
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
        stream.write(`event: snapshot
data: ${payload}

`);
      } catch {
        streams.delete(stream);
      }
    }
  } catch (error) {
    console.error("[Dashboard] Failed to broadcast:", error);
  }
}
function csvCell(value) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replaceAll('"', '""')}"`;
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
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
      "X-Accel-Buffering": "no"
    });
    res.flushHeaders();
    streams.add(res);
    try {
      res.write(`event: snapshot
data: ${JSON.stringify(await dashboardPayload())}

`);
    } catch {
      res.write(`event: error
data: ${JSON.stringify({ error: "Class data is temporarily unavailable." })}

`);
    }
    const heartbeat = setInterval(() => res.write(": keep-alive\n\n"), 15e3);
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
        bodyMass: clean.bodyMass === void 0 ? void 0 : String(clean.bodyMass),
        height: clean.height === void 0 ? void 0 : String(clean.height),
        handSpan: clean.handSpan === void 0 ? void 0 : String(clean.handSpan),
        tongueRolling: clean.tongueRolling,
        eyeColour: clean.eyeColour,
        bloodGroup: clean.bloodGroup,
        leafLengths: clean.leafLengths ? JSON.stringify(clean.leafLengths) : void 0,
        seedMass: clean.seedMass === void 0 ? void 0 : String(clean.seedMass),
        seedMasses: clean.seedMasses ? JSON.stringify(clean.seedMasses) : void 0
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
      const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(","))].join("\n");
      res.set({ "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="variation-lab-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv"` }).send(csv);
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
  server.on("error", (error) => {
    console.error("Server failed:", error.message);
    process.exit(1);
  });
  server.listen(port, "0.0.0.0", () => console.log(`Server listening on port ${port}`));
}
startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
