import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { services } from "../../db/schema.js";
import { asyncHandler } from "../../middleware/async-handler.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/error-handler.js";
import { createServiceSchema, updateServiceSchema } from "./service.schemas.js";

export const servicesRouter = Router();

servicesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const rows = await db.select().from(services).where(eq(services.isActive, true));
    res.json({ services: rows });
  })
);

servicesRouter.get(
  "/admin",
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const rows = await db.select().from(services);
    res.json({ services: rows });
  })
);

servicesRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const payload = createServiceSchema.parse(req.body);
    const [service] = await db.insert(services).values(payload).returning();
    res.status(201).json({ service });
  })
);

servicesRouter.put(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const payload = updateServiceSchema.parse(req.body);
    const serviceId = String(req.params.id);
    const [service] = await db
      .update(services)
      .set({ ...payload, updatedAt: new Date() })
      .where(eq(services.id, serviceId))
      .returning();

    if (!service) {
      throw new HttpError(404, "Service not found");
    }

    res.json({ service });
  })
);

servicesRouter.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const serviceId = String(req.params.id);
    const [service] = await db
      .update(services)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(services.id, serviceId))
      .returning();

    if (!service) {
      throw new HttpError(404, "Service not found");
    }

    res.json({ service });
  })
);
