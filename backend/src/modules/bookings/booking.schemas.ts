import { z } from "zod";

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/);

export const availabilityQuerySchema = z.object({
  serviceId: z.string().uuid(),
  date: isoDateSchema
});

export const createBookingSchema = z.object({
  serviceId: z.string().uuid(),
  appointmentDate: isoDateSchema,
  startTime: timeSchema,
  customerName: z.string().min(2).max(120),
  customerPhone: z.string().min(7).max(24),
  customerEmail: z.string().email(),
  notes: z.string().max(1000).optional(),
  address: z.string().max(300).optional()
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"])
});
