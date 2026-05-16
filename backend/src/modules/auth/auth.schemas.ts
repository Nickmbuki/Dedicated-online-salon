import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().transform((value) => value.toLowerCase()),
  phone: z.string().min(7).max(24).optional(),
  password: z.string().min(8).max(100)
});

export const loginSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(100)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase())
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32),
  password: z.string().min(8).max(100)
});
