import { z } from "zod";

export const supportSourceSchema = z.enum(["customer_message", "chatbot", "contact_form", "booking"]);

export const createSupportThreadSchema = z.object({
  subject: z.string().min(2).max(120),
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email().transform((value) => value.toLowerCase()),
  customerPhone: z.string().min(7).max(24),
  message: z.string().min(5).max(2000),
  source: supportSourceSchema.default("customer_message")
});

export const createUserSupportThreadSchema = z.object({
  subject: z.string().min(2).max(120),
  message: z.string().min(5).max(2000)
});

export const replySupportMessageSchema = z.object({
  message: z.string().min(1).max(2000)
});
