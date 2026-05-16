# Railway Deployment

This repo includes `railway.yml` with separate `backend` and `frontend` service definitions.

## Recommended Railway Layout

1. Create a Railway project.
2. Add a PostgreSQL database plugin.
3. Add a backend service from the GitHub repo with root directory `backend`.
4. Add a frontend service from the same repo with root directory `frontend`.
5. Configure the environment variables below.

## Backend Variables

```text
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://your-frontend.up.railway.app
WORKING_HOURS_START=09:00
WORKING_HOURS_END=18:00
SLOT_DURATION_MINUTES=60
```

## Frontend Variables

```text
VITE_API_URL=https://your-backend.up.railway.app/api
```

## Commands

Backend:

```bash
npm install
npm run build
npm run start
```

Frontend:

```bash
npm install
npm run build
npm run preview -- --host 0.0.0.0 --port $PORT
```

Run migrations and seed once from the backend service shell:

```bash
npm run db:migrate
npm run db:seed
```

## Password Reset

The backend stores hashed reset tokens and exposes `/api/auth/forgot-password` and `/api/auth/reset-password`. Before production launch, connect the forgot-password route to a transactional email or SMS service so clients receive reset links securely.
