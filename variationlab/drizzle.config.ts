import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "drizzle-kit";
import { getDrizzlePostgresCredentials, getPostgresConnectionString } from "./server/db-config";

const connectionString = getPostgresConnectionString();
if (!connectionString) {
  throw new Error("POSTGRES_DATABASE_URL or a PostgreSQL DATABASE_URL is required to run Drizzle commands.");
}

const caCertificate = readFileSync(resolve(process.cwd(), "certs/aiven-ca.pem"), "utf8");
const dbCredentials = getDrizzlePostgresCredentials(connectionString, caCertificate);

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/postgres",
  dialect: "postgresql",
  dbCredentials,
});
