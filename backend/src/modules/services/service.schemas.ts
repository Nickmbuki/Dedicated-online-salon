import { z } from "zod";

export const serviceCategorySchema = z.enum(["hair", "nails", "skincare", "children", "event", "home"]);

export const createServiceSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(140).regex(/^[a-z0-9-]+$/),
  category: serviceCategorySchema,
  description: z.string().min(10),
  priceCents: z.number().int().nonnegative().nullable().optional(),
  durationMinutes: z.number().int().positive().max(480),
  imageUrl: z.string().min(1),
  isActive: z.boolean().default(true),
  isDoorToDoor: z.boolean().default(false)
});

export const updateServiceSchema = createServiceSchema.partial();
