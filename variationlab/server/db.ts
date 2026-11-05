import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { desc, eq } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../drizzle/schema";
import { classSubmissions, type InsertClassSubmission, type InsertUser, users } from "../drizzle/schema";
import { getPostgresConnectionString, getVerifiedPostgresOptions } from "./db-config";
import { ENV } from "./_core/env";

type Database = NodePgDatabase<typeof schema>;

let _db: Database | null = null;
let _pool: Pool | null = null;

function readPostgresCaCertificate(): string {
  return readFileSync(resolve(process.cwd(), "certs/aiven-ca.pem"), "utf8");
}

export async function getDb(): Promise<Database | null> {
  if (_db) return _db;

  try {
    const configuredUrl = getPostgresConnectionString();
    if (!configuredUrl) return null;

    const { connectionString, ssl } = getVerifiedPostgresOptions(
      configuredUrl,
      readPostgresCaCertificate(),
    );
    _pool = new Pool({
      connectionString,
      ssl,
      max: 5,
      idleTimeoutMillis: 30_000,
    });
    _db = drizzle(_pool, { schema });
    return _db;
  } catch {
    // Never include a connection URI, certificate or provider detail in application logs.
    console.warn("[Database] PostgreSQL configuration or trusted CA certificate is unavailable.");
    return null;
  }
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const values: InsertUser = { openId: user.openId };
  const updateSet: Partial<InsertUser> = {};
  const textFields = ["name", "email", "loginMethod"] as const;

  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  updateSet.updatedAt = new Date();

  await db.insert(users).values(values).onConflictDoUpdate({
    target: users.openId,
    set: updateSet,
  });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function listClassSubmissions() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select().from(classSubmissions).orderBy(desc(classSubmissions.submittedAt));
}

export async function insertClassSubmission(values: InsertClassSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(classSubmissions).values(values);
}

export async function clearClassSubmissions() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(classSubmissions);
}
