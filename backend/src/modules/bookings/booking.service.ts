import { and, desc, eq, gt, inArray, lt } from "drizzle-orm";
import { bookingConfig } from "../../config/booking.js";
import { db } from "../../db/client.js";
import { bookings, services } from "../../db/schema.js";
import { HttpError } from "../../middleware/error-handler.js";
import { addMinutes, fromMinutes, normalizeTime, overlaps, toMinutes } from "./time.js";

const activeBookingStatuses = ["pending", "confirmed"] as const;

export const getServiceOrThrow = async (serviceId: string) => {
  const [service] = await db.select().from(services).where(eq(services.id, serviceId)).limit(1);
  if (!service || !service.isActive) {
    throw new HttpError(404, "Service not found");
  }
  return service;
};

export const getAvailability = async (serviceId: string, appointmentDate: string) => {
  const service = await getServiceOrThrow(serviceId);
  const opening = toMinutes(bookingConfig.workingHoursStart);
  const closing = toMinutes(bookingConfig.workingHoursEnd);
  const slotStep = bookingConfig.slotDurationMinutes;

  const existingBookings = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.appointmentDate, appointmentDate),
        inArray(bookings.status, [...activeBookingStatuses])
      )
    );

  const slots = [];
  for (let cursor = opening; cursor + service.durationMinutes <= closing; cursor += slotStep) {
    const startTime = fromMinutes(cursor);
    const endTime = fromMinutes(cursor + service.durationMinutes);
    const isAvailable = !existingBookings.some((booking) =>
      overlaps(startTime, endTime, booking.startTime, booking.endTime)
    );

    if (isAvailable) {
      slots.push({
        startTime,
        endTime,
        label: `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`
      });
    }
  }

  return {
    service,
    date: appointmentDate,
    workingHours: {
      start: bookingConfig.workingHoursStart,
      end: bookingConfig.workingHoursEnd
    },
    slotDurationMinutes: slotStep,
    slots
  };
};

export const createBooking = async (input: {
  userId: string;
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
  address?: string;
}) => {
  const service = await getServiceOrThrow(input.serviceId);
  const startTime = normalizeTime(input.startTime);
  const endTime = addMinutes(startTime, service.durationMinutes);

  if (toMinutes(startTime) < toMinutes(bookingConfig.workingHoursStart) || toMinutes(endTime) > toMinutes(bookingConfig.workingHoursEnd)) {
    throw new HttpError(400, "Selected time is outside working hours");
  }

  try {
    const booking = await db.transaction(async (tx) => {
      const collisions = await tx
        .select({ id: bookings.id })
        .from(bookings)
        .where(
          and(
            eq(bookings.appointmentDate, input.appointmentDate),
            inArray(bookings.status, [...activeBookingStatuses]),
            lt(bookings.startTime, endTime),
            gt(bookings.endTime, startTime)
          )
        )
        .limit(1);

      if (collisions.length > 0) {
        throw new HttpError(409, "This appointment slot is no longer available");
      }

      const [created] = await tx
        .insert(bookings)
        .values({
          userId: input.userId,
          serviceId: input.serviceId,
          appointmentDate: input.appointmentDate,
          startTime,
          endTime,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerEmail: input.customerEmail,
          notes: input.notes,
          address: input.address
        })
        .returning();

      return created;
    });

    return { booking, service };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(409, "This appointment overlaps with an existing booking");
  }
};

export const listBookingsForUser = async (userId: string, isAdmin: boolean) => {
  const filters = isAdmin ? undefined : eq(bookings.userId, userId);
  const rows = await db
    .select({
      booking: bookings,
      service: services
    })
    .from(bookings)
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .where(filters)
    .orderBy(desc(bookings.appointmentDate), desc(bookings.startTime));

  return rows;
};

export const updateBookingStatus = async (bookingId: string, status: "pending" | "confirmed" | "cancelled" | "completed") => {
  const [booking] = await db
    .update(bookings)
    .set({ status, updatedAt: new Date() })
    .where(eq(bookings.id, bookingId))
    .returning();

  if (!booking) {
    throw new HttpError(404, "Booking not found");
  }

  return booking;
};
