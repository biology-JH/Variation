import { describe, expect, it } from "vitest";
import {
  getDrizzlePostgresCredentials,
  getPostgresConnectionString,
  getVerifiedPostgresOptions,
} from "./db-config";

const caCertificate = "-----BEGIN CERTIFICATE-----\npublic-test-ca\n-----END CERTIFICATE-----";

describe("getPostgresConnectionString", () => {
  it("prefers the explicit PostgreSQL override over the managed Manus database URL", () => {
    const env = {
      POSTGRES_DATABASE_URL: "postgresql://app:placeholder@db.example.test/app?sslmode=require",
      DATABASE_URL: "mysql://managed-mysql.example.test/app",
    } as NodeJS.ProcessEnv;

    expect(getPostgresConnectionString(env)).toBe(env.POSTGRES_DATABASE_URL);
  });

  it("accepts a PostgreSQL DATABASE_URL for platforms such as Vercel", () => {
    const env = {
      DATABASE_URL: "postgres://app:placeholder@db.example.test/app?sslmode=require",
    } as NodeJS.ProcessEnv;

    expect(getPostgresConnectionString(env)).toBe(env.DATABASE_URL);
  });

  it("rejects a MySQL URL instead of passing it to a PostgreSQL driver", () => {
    expect(() =>
      getPostgresConnectionString({ DATABASE_URL: "mysql://managed-mysql.example.test/app" } as NodeJS.ProcessEnv),
    ).toThrow("Only PostgreSQL connection URLs are supported");
  });

  it("returns null when no database connection is configured", () => {
    expect(getPostgresConnectionString({} as NodeJS.ProcessEnv)).toBeNull();
  });
});

describe("getVerifiedPostgresOptions", () => {
  it("uses the supplied CA and strips URI TLS flags so strict verification cannot be overridden", () => {
    const result = getVerifiedPostgresOptions(
      "postgresql://app:placeholder@db.example.test/app?sslmode=require&sslrootcert=old.pem&sslcert=client.pem&sslkey=client.key&application_name=variationlab",
      caCertificate,
    );

    const url = new URL(result.connectionString);
    expect(url.hostname).toBe("db.example.test");
    expect(url.searchParams.get("application_name")).toBe("variationlab");
    expect(url.searchParams.has("sslmode")).toBe(false);
    expect(url.searchParams.has("sslrootcert")).toBe(false);
    expect(url.searchParams.has("sslcert")).toBe(false);
    expect(url.searchParams.has("sslkey")).toBe(false);
    expect(result.ssl).toEqual({ ca: caCertificate, rejectUnauthorized: true });
  });

  it("rejects a missing or non-PEM certificate", () => {
    expect(() => getVerifiedPostgresOptions("postgresql://db.example.test/app", "")).toThrow(
      "A PEM CA certificate is required",
    );
  });
});

describe("getDrizzlePostgresCredentials", () => {
  it("uses discrete credentials and the same strict CA for direct Drizzle Kit commands", () => {
    const credentials = getDrizzlePostgresCredentials(
      "postgresql://app%40user:pass%40word@db.example.test:25432/lab?sslmode=require&sslrootcert=ignored.pem",
      caCertificate,
    );

    expect(credentials).toEqual({
      host: "db.example.test",
      port: 25432,
      user: "app@user",
      password: "pass@word",
      database: "lab",
      ssl: { ca: caCertificate, rejectUnauthorized: true },
    });
  });

  it("rejects a MySQL URL", () => {
    expect(() => getDrizzlePostgresCredentials("mysql://db.example.test/lab", caCertificate)).toThrow(
      "Only PostgreSQL connection URLs are supported by Drizzle Kit",
    );
  });
});
