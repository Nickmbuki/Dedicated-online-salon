import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import { and, eq, gt, isNull } from "drizzle-orm";
import { env } from "../../config/env.js";
import { db } from "../../db/client.js";
import { passwordResetTokens, users, type User } from "../../db/schema.js";
import { HttpError } from "../../middleware/error-handler.js";
import type { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "./auth.schemas.js";
import type { z } from "zod";

export const sanitizeUser = (user: User) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role
});

export const issueToken = (user: User) => {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.JWT_SECRET, options);
};

export const createAuthSession = (user: User) => ({
  user: sanitizeUser(user),
  token: issueToken(user)
});

const hashResetToken = (token: string) => createHash("sha256").update(token).digest("hex");

export const register = async (input: z.infer<typeof registerSchema>) => {
  const [existing] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
  if (existing) {
    throw new HttpError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const [user] = await db
    .insert(users)
    .values({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      passwordHash
    })
    .returning();

  return createAuthSession(user);
};

export const login = async (input: z.infer<typeof loginSchema>) => {
  const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const validPassword = await bcrypt.compare(input.password, user.passwordHash);
  if (!validPassword) {
    throw new HttpError(401, "Invalid email or password");
  }

  return createAuthSession(user);
};

export const forgotPassword = async (input: z.infer<typeof forgotPasswordSchema>) => {
  const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
  const response = {
    message: "If an account exists, password reset instructions will be available shortly.",
    resetToken: undefined as string | undefined
  };

  if (!user) {
    return response;
  }

  const resetToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    tokenHash: hashResetToken(resetToken),
    expiresAt
  });

  if (env.NODE_ENV !== "production") {
    response.resetToken = resetToken;
  }

  return response;
};

export const resetPassword = async (input: z.infer<typeof resetPasswordSchema>) => {
  const tokenHash = hashResetToken(input.token);
  const [resetRecord] = await db
    .select()
    .from(passwordResetTokens)
    .where(and(eq(passwordResetTokens.tokenHash, tokenHash), isNull(passwordResetTokens.usedAt), gt(passwordResetTokens.expiresAt, new Date())))
    .limit(1);

  if (!resetRecord) {
    throw new HttpError(400, "Reset token is invalid or expired");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const [user] = await db.transaction(async (tx) => {
    const [updatedUser] = await tx
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, resetRecord.userId))
      .returning();

    await tx
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, resetRecord.id));

    return [updatedUser];
  });

  if (!user) {
    throw new HttpError(400, "Reset token is invalid or expired");
  }

  return createAuthSession(user);
};
