import { desc, eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { supportMessages, supportThreads } from "../../db/schema.js";
import type { AuthUser } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/error-handler.js";

type ThreadMessage = typeof supportMessages.$inferSelect;
type ThreadRow = typeof supportThreads.$inferSelect;

const buildThread = (thread: ThreadRow, messages: ThreadMessage[]) => ({
  thread,
  messages
});

const loadMessagesForThreads = async (threadIds: string[]) => {
  if (threadIds.length === 0) {
    return new Map<string, ThreadMessage[]>();
  }

  const map = new Map<string, ThreadMessage[]>();
  for (const threadId of threadIds) {
    const threadMessages = await db
      .select()
      .from(supportMessages)
      .where(eq(supportMessages.threadId, threadId))
      .orderBy(supportMessages.createdAt);
    map.set(threadId, threadMessages);
  }

  return map;
};

const getThreadOrThrow = async (threadId: string) => {
  const [thread] = await db.select().from(supportThreads).where(eq(supportThreads.id, threadId)).limit(1);
  if (!thread) {
    throw new HttpError(404, "Conversation not found");
  }
  return thread;
};

const canAccessThread = (thread: ThreadRow, user: AuthUser) => user.role === "admin" || thread.userId === user.id;

export const createGuestInquiry = async (input: {
  subject: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  source: "customer_message" | "chatbot" | "contact_form" | "booking";
}) => {
  const [thread] = await db.transaction(async (tx) => {
    const [createdThread] = await tx
      .insert(supportThreads)
      .values({
        subject: input.subject,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        source: input.source,
        lastMessageAt: new Date()
      })
      .returning();

    await tx.insert(supportMessages).values({
      threadId: createdThread.id,
      senderRole: "customer",
      senderName: input.customerName,
      message: input.message
    });

    return [createdThread];
  });

  const messages = await db
    .select()
    .from(supportMessages)
    .where(eq(supportMessages.threadId, thread.id))
    .orderBy(supportMessages.createdAt);

  return buildThread(thread, messages);
};

export const createThreadForUser = async (
  user: AuthUser,
  input: {
    subject: string;
    message: string;
  }
) => {
  const [thread] = await db.transaction(async (tx) => {
    const [createdThread] = await tx
      .insert(supportThreads)
      .values({
        userId: user.id,
        subject: input.subject,
        customerName: user.fullName,
        customerEmail: user.email,
        customerPhone: user.phone ?? "",
        source: "customer_message",
        lastMessageAt: new Date()
      })
      .returning();

    await tx.insert(supportMessages).values({
      threadId: createdThread.id,
      senderRole: "customer",
      senderName: user.fullName,
      message: input.message
    });

    return [createdThread];
  });

  const messages = await db
    .select()
    .from(supportMessages)
    .where(eq(supportMessages.threadId, thread.id))
    .orderBy(supportMessages.createdAt);

  return buildThread(thread, messages);
};

export const listThreadsForUser = async (user: AuthUser) => {
  const threads =
    user.role === "admin"
      ? await db.select().from(supportThreads).orderBy(desc(supportThreads.lastMessageAt))
      : await db.select().from(supportThreads).where(eq(supportThreads.userId, user.id)).orderBy(desc(supportThreads.lastMessageAt));

  const messagesByThread = await loadMessagesForThreads(threads.map((thread) => thread.id));
  return threads.map((thread) => buildThread(thread, messagesByThread.get(thread.id) ?? []));
};

export const sendReply = async (threadId: string, user: AuthUser, message: string) => {
  const thread = await getThreadOrThrow(threadId);
  if (!canAccessThread(thread, user)) {
    throw new HttpError(403, "You do not have access to this conversation");
  }

  const senderRole = user.role === "admin" ? "admin" : "customer";
  const [created] = await db.transaction(async (tx) => {
    const [messageRow] = await tx
      .insert(supportMessages)
      .values({
        threadId,
        senderRole,
        senderName: user.fullName,
        message
      })
      .returning();

    await tx
      .update(supportThreads)
      .set({
        lastMessageAt: new Date(),
        updatedAt: new Date(),
        status: "open"
      })
      .where(eq(supportThreads.id, threadId));

    return [messageRow];
  });

  return created;
};

export const getThreadWithMessages = async (threadId: string, user: AuthUser) => {
  const thread = await getThreadOrThrow(threadId);
  if (!canAccessThread(thread, user)) {
    throw new HttpError(403, "You do not have access to this conversation");
  }

  const messages = await db
    .select()
    .from(supportMessages)
    .where(eq(supportMessages.threadId, threadId))
    .orderBy(supportMessages.createdAt);

  return buildThread(thread, messages);
};
