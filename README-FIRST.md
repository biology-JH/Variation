# Variation Lab Live — Project Handoff

The application is in `variationlab/`. It is a React/Vite frontend with an Express API and a PostgreSQL database managed through Drizzle. The previous MySQL migrations remain archived under `variationlab/drizzle/legacy-mysql/`; they are not part of the active migration chain.

## Local commands

From `variationlab/`:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
pnpm dev
```

To apply the active PostgreSQL migrations, configure `POSTGRES_DATABASE_URL` and provide the public Aiven CA at `variationlab/certs/aiven-ca.pem`, then run `pnpm db:migrate`. Never paste a database URI into source files, Git, or chat. The Vercel production project uses `DATABASE_URL`; its value belongs in Vercel's encrypted Environment Variables settings, not in this repository.

## Vercel deployment

The Vercel project should use the `Container` framework preset with `variationlab/` as its Root Directory. The checked-in Dockerfile builds and serves the frontend and API together. Set `PORT=3000`, matching the container listener. The Aiven database schema has already been applied; deployment should not run the migration command again.

## Package checksums

`MANIFEST.sha256` covers the files under `variationlab/`, including the generated `dist/` output and supplied teaching assets. It excludes Git internals, dependencies, private logs, actual/local environment files, and transient caches.
