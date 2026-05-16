# API Overview

Base URL: `/api`

## Auth

- `POST /auth/register` creates a customer and returns `{ user, token }`.
- `POST /auth/login` returns `{ user, token }`.
- `POST /auth/forgot-password` creates a password reset token and returns a generic response.
- `POST /auth/reset-password` applies a valid reset token and returns `{ user, token }`.
- `GET /auth/me` returns the authenticated profile.

Use `Authorization: Bearer <token>` for protected endpoints.

## Services

- `GET /services` lists active services.
- `GET /services/admin` lists all services for admins.
- `POST /services` creates a service for admins.
- `PUT /services/:id` updates a service for admins.
- `DELETE /services/:id` hides a service for admins.

Hair and children hairstyle services may use `priceCents: null`. Customer UI hides hairstyle prices.

## Bookings

- `GET /bookings/availability?serviceId=<uuid>&date=YYYY-MM-DD` returns available slots only.
- `POST /bookings` creates a booking for the selected slot.
- `GET /bookings` lists the customer's bookings, or all bookings for admins.
- `PATCH /bookings/:id/status` updates booking status for admins.

The booking engine checks active bookings using interval overlap logic and the migration adds a PostgreSQL exclusion constraint to prevent active time overlaps. All appointments collect a home-service address because the product is door-to-door.
