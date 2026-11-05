# Database setup

The active application schema and runtime use PostgreSQL through Drizzle ORM and `node-postgres`. There is no Prisma schema in this project. The current tables are `users` and `class_submissions`; the anonymous-submission fields, numeric precision, category enums, and query behavior are retained.

## Connection and TLS

The user-selected Aiven service `pg-12682151` was verified through a read-only TLS connection as PostgreSQL 18. Its public schema initially had no tables. The connection URI is stored in Manus as the protected `POSTGRES_DATABASE_URL`; do not print, commit, or paste it into chat.

The public Aiven project CA is bundled at `certs/aiven-ca.pem`. Both application queries and schema migrations use this certificate with `rejectUnauthorized: true`, preserving certificate-chain and hostname verification. The runtime removes `sslmode`, `sslrootcert`, `sslcert`, and `sslkey` URI parameters before passing the connection to `node-postgres`, so URI options cannot replace the explicit trusted-CA settings. Drizzle Kit's `drizzle.config.ts` also parses the URL into discrete connection fields and uses the same CA with strict verification. Never disable certificate verification. Refresh the bundled certificate from Aiven if the project's CA rotates.

On Vercel, set `DATABASE_URL` to a PostgreSQL URI. In this Manus project, the managed database capability remains enabled and injects a MySQL-compatible `DATABASE_URL`; the application rejects that URL and uses `POSTGRES_DATABASE_URL` instead. The Manus-managed MySQL resource is unchanged and is not used by this app.

## Migrations and existing data

Active PostgreSQL schema and migration history live in `drizzle/postgres/`. The old MySQL SQL files and Drizzle metadata are retained under `drizzle/legacy-mysql/` for reference only; they are not run by the active Drizzle configuration.

The initial additive migration has been applied successfully to the verified Aiven service. It created the PostgreSQL enum types, `users`, `class_submissions`, and Drizzle migration history. Read-only verification confirmed the two application tables contain zero rows. No MySQL data was copied or deleted.

For a new PostgreSQL target, run `pnpm db:migrate` to apply the checked-in additive schema. This command uses the same PostgreSQL-only URL selection and trusted CA as the application, and closes its connection pool when finished. `pnpm db:push` generates a migration and then calls this verified migration runner. Direct Drizzle Kit commands also load the explicit CA configuration; never point them at the Manus-managed MySQL DSN.

This conversion does not copy any existing rows from MySQL. Existing MySQL data remains in its original service. A data transfer, if needed, requires a separate migration plan and source/destination confirmation.
