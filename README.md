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

## Run the frontend locally

```bash
cd frontend
npm install
npm run dev
```

## Deploy to Render (free tier)

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. Go to https://dashboard.render.com → **New** → **Blueprint**.
3. Connect this repository. Render reads `render.yaml` at the repo root and
   creates two services: `molido-accounting-backend` (API) and
   `molido-accounting-frontend` (static site).
4. Click **Apply**. First deploy takes a few minutes.
5. Once the backend is deployed, copy its public URL (e.g.
   `https://molido-accounting-backend.onrender.com`) and set it as the
   `VITE_API_URL` env var on the **frontend** service in the Render
   dashboard, then trigger a redeploy of the frontend so the build picks it
   up.

The blueprint also provisions a free Render Postgres database
(`molido-accounting-db`) and wires the backend to it automatically via
`DB_TYPE=postgres` + `fromDatabase` env vars, so data persists across
restarts and redeploys (unlike the local SQLite default). Render's free
Postgres plan expires after 30 days unless upgraded — see Render's docs
before relying on it long-term.
