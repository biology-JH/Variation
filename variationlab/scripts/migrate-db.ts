import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as schema from "../drizzle/schema";
import { getPostgresConnectionString, getVerifiedPostgresOptions } from "../server/db-config";

async function main() {
  const configuredUrl = getPostgresConnectionString();
  if (!configuredUrl) {
    throw new Error("POSTGRES_DATABASE_URL or a PostgreSQL DATABASE_URL is required to run migrations.");
  }

  const caCertificate = readFileSync(resolve(process.cwd(), "certs/aiven-ca.pem"), "utf8");
  const { connectionString, ssl } = getVerifiedPostgresOptions(configuredUrl, caCertificate);
  const pool = new Pool({
    connectionString,
    ssl,
    max: 1,
    connectionTimeoutMillis: 15_000,
  });

  try {
    const database = drizzle(pool, { schema });
    await migrate(database, { migrationsFolder: resolve(process.cwd(), "drizzle/postgres") });
    console.log("PostgreSQL migrations applied successfully.");
  } finally {
    await pool.end();
  }
}

main().catch(() => {
  console.error("PostgreSQL migration failed. Check the configured PostgreSQL service and CA certificate without sharing credentials.");
  process.exitCode = 1;
});
