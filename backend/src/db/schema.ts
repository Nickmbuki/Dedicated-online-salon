import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["customer", "admin"]);
export const serviceCategoryEnum = pgEnum("service_category", [
  "hair",
  "nails",
  "skincare",
  "children",
  "event",
  "home"
]);
export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed"
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("customer"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_unique").on(table.email)
  })
);

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: serviceCategoryEnum("category").notNull(),
  description: text("description").notNull(),
  priceCents: integer("price_cents"),
  durationMinutes: integer("duration_minutes").notNull(),
  imageUrl: text("image_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  isDoorToDoor: boolean("is_door_to_door").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "restrict" }),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email").notNull(),
  appointmentDate: date("appointment_date").notNull(),
  startTime: time("start_time", { withTimezone: false }).notNull(),
  endTime: time("end_time", { withTimezone: false }).notNull(),
  status: bookingStatusEnum("status").notNull().default("pending"),
  notes: text("notes"),
  address: text("address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    tokenHashIdx: uniqueIndex("password_reset_tokens_token_hash_unique").on(table.tokenHash)
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
