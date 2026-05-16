import { env } from "./env.js";

export const bookingConfig = {
  workingHoursStart: env.WORKING_HOURS_START,
  workingHoursEnd: env.WORKING_HOURS_END,
  slotDurationMinutes: env.SLOT_DURATION_MINUTES
};
