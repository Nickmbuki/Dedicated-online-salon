import bcrypt from "bcryptjs";
import { and, desc, eq, gt, inArray, lt, ne } from "drizzle-orm";
import { createAuthSession } from "../auth/auth.service.js";
import { bookingConfig } from "../../config/booking.js";
import { db } from "../../db/client.js";
import { bookings, services, users } from "../../db/schema.js";
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

const assertSlotIsFree = async (
  tx: any,
  input: {
    appointmentDate: string;
    startTime: string;
    endTime: string;
    bookingIdToExclude?: string;
  }
) => {
  const collisionFilters = [
    eq(bookings.appointmentDate, input.appointmentDate),
    inArray(bookings.status, [...activeBookingStatuses]),
    lt(bookings.startTime, input.endTime),
    gt(bookings.endTime, input.startTime)
  ];

  if (input.bookingIdToExclude) {
    collisionFilters.push(ne(bookings.id, input.bookingIdToExclude));
  }

  const collisions = await tx.select({ id: bookings.id }).from(bookings).where(and(...collisionFilters)).limit(1);
  if (collisions.length > 0) {
    throw new HttpError(409, "This appointment slot is no longer available");
  }
};

const createBookingRecord = async (
  tx: any,
  input: {
    userId: string;
    serviceId: string;
    appointmentDate: string;
    startTime: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    notes?: string;
    address?: string;
  }
) => {
  const service = await getServiceOrThrow(input.serviceId);
  const startTime = normalizeTime(input.startTime);
  const endTime = addMinutes(startTime, service.durationMinutes);

  if (
    toMinutes(startTime) < toMinutes(bookingConfig.workingHoursStart) ||
    toMinutes(endTime) > toMinutes(bookingConfig.workingHoursEnd)
  ) {
    throw new HttpError(400, "Selected time is outside working hours");
  }

  await assertSlotIsFree(tx, {
    appointmentDate: input.appointmentDate,
    startTime,
    endTime
  });

  const [booking] = await tx
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

  return { booking, service };
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
  try {
    const result = await db.transaction(async (tx) => {
      return createBookingRecord(tx, input);
    });

    return result;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(409, "This appointment overlaps with an existing booking");
  }
};

export const createGuestBooking = async (input: {
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  password: string;
  notes?: string;
  address?: string;
}) => {
  const email = input.customerEmail.toLowerCase();

  try {
    const result = await db.transaction(async (tx) => {
      const [existingUser] = await tx.select().from(users).where(eq(users.email, email)).limit(1);
      let user = existingUser;

      if (user) {
        const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
        if (!passwordMatches) {
          throw new HttpError(401, "This email already exists. Please log in to complete the booking.");
        }
      } else {
        const passwordHash = await bcrypt.hash(input.password, 12);
        [user] = await tx
          .insert(users)
          .values({
            fullName: input.customerName,
            email,
            phone: input.customerPhone,
            passwordHash
          })
          .returning();
      }

      const booking = await createBookingRecord(tx, {
        userId: user.id,
        serviceId: input.serviceId,
        appointmentDate: input.appointmentDate,
        startTime: input.startTime,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: email,
        notes: input.notes,
        address: input.address
      });

      return {
        ...booking,
        ...createAuthSession(user)
      };
    });

    return result;
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

export const getBookingById = async (bookingId: string) => {
  const [booking] = await db
    .select({
      booking: bookings,
      service: services
    })
    .from(bookings)
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (!booking) {
    throw new HttpError(404, "Booking not found");
  }

  return booking;
};

export const updateBookingForUser = async (
  bookingId: string,
  userId: string,
  isAdmin: boolean,
  input: {
    serviceId?: string;
    appointmentDate?: string;
    startTime?: string;
    notes?: string | null;
    address?: string | null;
  }
) => {
  const existing = await getBookingById(bookingId);
  if (!isAdmin && existing.booking.userId !== userId) {
    throw new HttpError(403, "You can only edit your own booking");
  }

  const serviceId = input.serviceId ?? existing.booking.serviceId;
  const appointmentDate = input.appointmentDate ?? existing.booking.appointmentDate;
  const startTime = normalizeTime(input.startTime ?? existing.booking.startTime);
  const service = await getServiceOrThrow(serviceId);
  const endTime = addMinutes(startTime, service.durationMinutes);

  if (
    toMinutes(startTime) < toMinutes(bookingConfig.workingHoursStart) ||
    toMinutes(endTime) > toMinutes(bookingConfig.workingHoursEnd)
  ) {
    throw new HttpError(400, "Selected time is outside working hours");
  }

  await db.transaction(async (tx) => {
    await assertSlotIsFree(tx, {
      appointmentDate,
      startTime,
      endTime,
      bookingIdToExclude: bookingId
    });

    await tx
      .update(bookings)
      .set({
        serviceId,
        appointmentDate,
        startTime,
        endTime,
        notes: input.notes === undefined ? existing.booking.notes : input.notes,
        address: input.address === undefined ? existing.booking.address : input.address,
        updatedAt: new Date()
      })
      .where(eq(bookings.id, bookingId));
  });

  return getBookingById(bookingId);
};

export const cancelBookingForUser = async (bookingId: string, userId: string, isAdmin: boolean) => {
  const existing = await getBookingById(bookingId);
  if (!isAdmin && existing.booking.userId !== userId) {
    throw new HttpError(403, "You can only cancel your own booking");
  }

  const [booking] = await db
    .update(bookings)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(bookings.id, bookingId))
    .returning();

  if (!booking) {
    throw new HttpError(404, "Booking not found");
  }

  return booking;
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
