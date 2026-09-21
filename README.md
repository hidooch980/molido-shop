# Molido Shop — Accounting Module

Backend API for the accounting module (chart of accounts + double-entry
journal entries), built with NestJS + TypeORM. SQLite by default; switch to
PostgreSQL by setting `DB_TYPE=postgres` and the `DB_HOST`/`DB_PORT`/
`DB_USERNAME`/`DB_PASSWORD`/`DB_DATABASE` env vars.

## Run locally

```bash
cd backend
npm install
npm run start:dev
```

## Deploy to Render (free tier)

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. Go to https://dashboard.render.com → **New** → **Blueprint**.
3. Connect this repository. Render reads `render.yaml` at the repo root and
   creates the `molido-accounting-backend` web service automatically.
4. Click **Apply**. First deploy takes a few minutes.

Note: the free plan has no persistent disk, so the SQLite file under `/tmp`
resets on every redeploy/restart. For real data, switch to a managed
Postgres database (Render also offers a free Postgres instance) via the
`DB_TYPE=postgres` env vars above.
