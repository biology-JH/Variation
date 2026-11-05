const SSL_CONNECTION_PARAMETERS = new Set([
  "ssl",
  "sslcert",
  "sslkey",
  "sslmode",
  "sslrootcert",
  "uselibpqcompat",
]);

export interface VerifiedPostgresOptions {
  connectionString: string;
  ssl: {
    ca: string;
    rejectUnauthorized: true;
  };
}

export interface DrizzlePostgresCredentials {
  host: string;
  port?: number;
  user: string;
  password: string;
  database: string;
  ssl: VerifiedPostgresOptions["ssl"];
}

export function getPostgresConnectionString(env: NodeJS.ProcessEnv = process.env): string | null {
  const connectionString =
    env.POSTGRES_DATABASE_URL?.trim() || env.DATABASE_URL?.trim() || env.DRIZZLE_DATABASE_URL?.trim();

  if (!connectionString) return null;

  let protocol: string;
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

/**
 * Remove URI SSL flags so node-postgres cannot override the explicit CA trust
 * configuration. Hostname and certificate-chain verification remain enabled.
 */
export function getVerifiedPostgresOptions(
  connectionString: string,
  caCertificate: string,
): VerifiedPostgresOptions {
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
      rejectUnauthorized: true,
    },
  };
}

/**
 * Drizzle Kit accepts TLS options alongside discrete connection fields, but
 * not alongside a URL. Parse the URL so direct CLI operations use the same CA.
 */
export function getDrizzlePostgresCredentials(
  connectionString: string,
  caCertificate: string,
): DrizzlePostgresCredentials {
  const url = new URL(connectionString);
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error("Only PostgreSQL connection URLs are supported by Drizzle Kit.");
  }

  const database = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
  if (!url.hostname || !database) {
    throw new Error("A PostgreSQL host and database name are required for Drizzle Kit.");
  }

  const { ssl } = getVerifiedPostgresOptions(connectionString, caCertificate);
  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : undefined,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
    ssl,
  };
}
