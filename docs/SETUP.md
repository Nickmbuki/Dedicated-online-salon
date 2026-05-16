# Setup Guide

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 14+

## Local Setup

```bash
npm install
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Create a PostgreSQL database named `elegant_beauty_suite`, then update `DATABASE_URL`.

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

The frontend runs at `http://localhost:5173`.
The backend runs at `http://localhost:4000`.

## Seed Login

```text
Email: admin@elegantbeauty.local
Password: AdminPass123!
```

Use the admin dashboard to add, hide, and manage services. Hairstyle service pricing can be left empty; customer-facing pages do not display hairstyle prices. Every service is positioned as door-to-door.

Forgot password is available from the login screen. In development, the API returns the reset token so the flow can be tested locally. In production, connect the `POST /auth/forgot-password` result to an email or SMS provider before launch.
