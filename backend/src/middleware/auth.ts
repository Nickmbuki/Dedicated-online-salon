import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { env } from "../config/env.js";
import { db } from "../db/client.js";
import { users, type User } from "../db/schema.js";
import { HttpError } from "./error-handler.js";

export type AuthUser = Pick<User, "id" | "email" | "fullName" | "role" | "phone">;

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

type TokenPayload = {
  sub: string;
  email: string;
  role: "customer" | "admin";
};

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new HttpError(401, "Authentication required");
    }

    const token = header.replace("Bearer ", "");
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    const [user] = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1);

    if (!user) {
      throw new HttpError(401, "User no longer exists");
    }

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone
    };
    next();
  } catch (error) {
    next(error instanceof HttpError ? error : new HttpError(401, "Invalid or expired token"));
  }
};

export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    next(new HttpError(403, "Admin access required"));
    return;
  }
  next();
};
