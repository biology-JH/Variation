# Variation Lab Live — Final Manus Rebuild Package

This is the complete portable workspace for rebuilding the website in a new Manus account.

## Exact restoration request

Open a new Manus session, upload this ZIP, and say:

> Restore the `variationlab/` directory as a managed web project with server and database enabled. Read `variationlab/variationlab-workspace-migration.md` completely. Restore all source files and PDF-derived assets, restore the database schema and JSON export, run the migrations, and reconstruct the website exactly as described. Do not omit the compiled output or original source materials.

## Local/project commands

From the `variationlab/` directory:

```bash
pnpm install
pnpm db:migrate
pnpm check
pnpm test
pnpm build
pnpm dev
```

## Database restoration

- Required database variable: `DATABASE_URL`.
- The current database snapshot is `database-export.json`; it currently contains zero rows in both `users` and `class_submissions`.
- Restore migrations before importing any future rows.
- Optional runtime variables: `NODE_ENV`, `PORT`, and `TEACHER_KEY`.
- The default teacher key is `variationlab`; set `TEACHER_KEY` in the new environment to replace it.

## Included

Complete source, `dist/` output, package lockfile, database schema/migrations, database JSON export, PDF-derived images, original PDF/PPTX teaching files, and the full migration Markdown bundle.

## Excluded for safety and portability

`node_modules/`, Git internals, private logs, `.env` files, credentials, and transient platform caches. Dependencies are reproducible from `package.json` and `pnpm-lock.yaml`.
