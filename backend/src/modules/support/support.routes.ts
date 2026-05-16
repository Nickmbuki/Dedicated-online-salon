import { Router } from "express";
import { asyncHandler } from "../../middleware/async-handler.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";
import { createSupportThreadSchema, createUserSupportThreadSchema, replySupportMessageSchema } from "./support.schemas.js";
import * as supportService from "./support.service.js";

export const supportRouter = Router();

supportRouter.post(
  "/guest",
  asyncHandler(async (req, res) => {
    const payload = createSupportThreadSchema.parse(req.body);
    const thread = await supportService.createGuestInquiry(payload);
    res.status(201).json(thread);
  })
);

supportRouter.get(
  "/threads",
  requireAuth,
  asyncHandler(async (req, res) => {
    const threads = await supportService.listThreadsForUser(req.user!);
    res.json({ threads });
  })
);

supportRouter.get(
  "/threads/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const thread = await supportService.getThreadWithMessages(String(req.params.id), req.user!);
    res.json(thread);
  })
);

supportRouter.post(
  "/threads",
  requireAuth,
  asyncHandler(async (req, res) => {
    const payload = createUserSupportThreadSchema.parse(req.body);
    const thread = await supportService.createThreadForUser(req.user!, {
      subject: payload.subject,
      message: payload.message
    });
    res.status(201).json(thread);
  })
);

supportRouter.post(
  "/threads/:id/messages",
  requireAuth,
  asyncHandler(async (req, res) => {
    const payload = replySupportMessageSchema.parse(req.body);
    const message = await supportService.sendReply(String(req.params.id), req.user!, payload.message);
    res.status(201).json({ message });
  })
);

supportRouter.get(
  "/inbox",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const threads = await supportService.listThreadsForUser(req.user!);
    res.json({ threads });
  })
);
