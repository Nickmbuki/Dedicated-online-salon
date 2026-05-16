import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
  WORKING_HOURS_START: z.string().regex(/^\d{2}:\d{2}$/).default("09:00"),
  WORKING_HOURS_END: z.string().regex(/^\d{2}:\d{2}$/).default("18:00"),
  SLOT_DURATION_MINUTES: z.coerce.number().int().positive().default(60)
});

export const env = envSchema.parse(process.env);
