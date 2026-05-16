import { Router } from "express";
import { asyncHandler } from "../../middleware/async-handler.js";
import { requireAuth } from "../../middleware/auth.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "./auth.schemas.js";
import * as authService from "./auth.service.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const payload = registerSchema.parse(req.body);
    const result = await authService.register(payload);
    res.status(201).json(result);
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const payload = loginSchema.parse(req.body);
    const result = await authService.login(payload);
    res.json(result);
  })
);

authRouter.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const payload = forgotPasswordSchema.parse(req.body);
    const result = await authService.forgotPassword(payload);
    res.json(result);
  })
);

authRouter.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const payload = resetPasswordSchema.parse(req.body);
    const result = await authService.resetPassword(payload);
    res.json(result);
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user });
  })
);
