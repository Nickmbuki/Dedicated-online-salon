import { Router } from "express";
import { asyncHandler } from "../../middleware/async-handler.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";
import { availabilityQuerySchema, createBookingSchema, updateBookingStatusSchema } from "./booking.schemas.js";
import * as bookingService from "./booking.service.js";

export const bookingsRouter = Router();

bookingsRouter.get(
  "/availability",
  asyncHandler(async (req, res) => {
    const query = availabilityQuerySchema.parse(req.query);
    const availability = await bookingService.getAvailability(query.serviceId, query.date);
    res.json(availability);
  })
);

bookingsRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rows = await bookingService.listBookingsForUser(req.user!.id, req.user!.role === "admin");
    res.json({ bookings: rows });
  })
);

bookingsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const payload = createBookingSchema.parse(req.body);
    const result = await bookingService.createBooking({ ...payload, userId: req.user!.id });
    res.status(201).json(result);
  })
);

bookingsRouter.patch(
  "/:id/status",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const payload = updateBookingStatusSchema.parse(req.body);
    const booking = await bookingService.updateBookingStatus(String(req.params.id), payload.status);
    res.json({ booking });
  })
);
