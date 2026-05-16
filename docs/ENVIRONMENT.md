# Environment Variables

## Backend

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | Yes | `development`, `test`, or `production` |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | At least 32 characters |
| `JWT_EXPIRES_IN` | Yes | JWT lifetime, for example `7d` |
| `PORT` | Yes | API port |
| `CLIENT_ORIGIN` | Yes | Frontend origin allowed by CORS. Use comma-separated values for multiple frontend domains. |
| `WORKING_HOURS_START` | Yes | Booking day start, `HH:mm` |
| `WORKING_HOURS_END` | Yes | Booking day end, `HH:mm` |
| `SLOT_DURATION_MINUTES` | Yes | Slot step used by availability generation |

## Frontend

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Backend API URL ending in `/api` |

Use `.env.example`, `backend/.env.example`, and `frontend/.env.example` as starting points.
