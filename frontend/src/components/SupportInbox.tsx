import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MailPlus, MessageSquare, RefreshCcw } from "lucide-react";
import { createSupportThread, fetchSupportInbox, fetchSupportThreads, replySupportThread } from "../api/services";
import { useAuth } from "../context/AuthContext";

type FormValues = {
  subject: string;
  message: string;
};

export const SupportInbox = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "admin";
  const threadsQuery = useQuery({
    queryKey: ["support-threads", user?.role],
    queryFn: isAdmin ? fetchSupportInbox : fetchSupportThreads,
    enabled: Boolean(user)
  });
  const threads = threadsQuery.data ?? [];
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedThreadId && threads.length > 0) {
      setSelectedThreadId(threads[0].thread.id);
    }
  }, [selectedThreadId, threads]);

  const selectedThread = useMemo(
    () => threads.find((item) => item.thread.id === selectedThreadId) ?? null,
    [selectedThreadId, threads]
  );

  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: { subject: "", message: "" }
  });

  const createThreadMutation = useMutation({
    mutationFn: createSupportThread,
    onSuccess: async (thread) => {
      await queryClient.invalidateQueries({ queryKey: ["support-threads", user?.role] });
      setSelectedThreadId(thread.thread.id);
      reset({ subject: "", message: "" });
    }
  });

  const replyMutation = useMutation({
    mutationFn: ({ threadId, message }: { threadId: string; message: string }) => replySupportThread(threadId, { message }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["support-threads", user?.role] });
      reset({ subject: "", message: "" });
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!selectedThreadId && !isAdmin) {
      await createThreadMutation.mutateAsync(values);
      return;
    }

    if (!selectedThreadId) {
      return;
    }

    await replyMutation.mutateAsync({ threadId: selectedThreadId, message: values.message });
  });

  return (
    <section className="mt-10 overflow-hidden rounded-lg border border-rosewood/15 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rosewood/10 px-5 py-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rosewood">{isAdmin ? "Admin inbox" : "Messages"}</p>
          <h2 className="font-display text-3xl font-semibold">In-app messaging</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isAdmin ? (
            <button
              className="inline-flex items-center gap-2 rounded-full border border-rosewood/20 px-4 py-2 text-sm font-semibold text-rosewood"
              type="button"
              onClick={() => {
                setSelectedThreadId(null);
                reset({ subject: "", message: "" });
              }}
            >
              <MailPlus size={16} /> New conversation
            </button>
          ) : null}
          <button
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold"
            type="button"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["support-threads", user?.role] })}
          >
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="border-b border-rosewood/10 lg:border-b-0 lg:border-r">
          <div className="max-h-[24rem] overflow-auto p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-rosewood">
              <MessageSquare size={16} />
              {threads.length} conversation{threads.length === 1 ? "" : "s"}
            </div>
            <div className="grid gap-3">
              {threads.map((item) => {
                const latest = item.messages[item.messages.length - 1];
                const active = item.thread.id === selectedThreadId;
                return (
                  <button
                    key={item.thread.id}
                    type="button"
                    onClick={() => setSelectedThreadId(item.thread.id)}
                    className={`rounded-lg border p-4 text-left transition ${active ? "border-rosewood bg-pink-50" : "border-ink/10 hover:border-rosewood/40"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.thread.subject}</p>
                        <p className="text-xs text-ink/55">{item.thread.customerName} · {item.thread.customerEmail}</p>
                      </div>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-rosewood">
                        {item.thread.status}
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-ink/65">{latest?.message ?? "No messages yet."}</p>
                  </button>
                );
              })}
              {threads.length === 0 ? <p className="text-sm text-ink/60">No conversations yet.</p> : null}
            </div>
          </div>
        </aside>

        <div className="flex flex-col">
          <div className="border-b border-rosewood/10 p-5">
            {selectedThread ? (
              <>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rosewood">{selectedThread.thread.source.replace("_", " ")}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold">{selectedThread.thread.subject}</h3>
                <p className="mt-1 text-sm text-ink/60">
                  {selectedThread.thread.customerName} · {selectedThread.thread.customerPhone}
                </p>
              </>
            ) : (
              <h3 className="font-display text-2xl font-semibold">{isAdmin ? "Select a conversation" : "Start a new message"}</h3>
            )}
          </div>

          <div className="max-h-[22rem] flex-1 overflow-auto p-5">
            {selectedThread ? (
              <div className="space-y-3">
                {selectedThread.messages.map((message) => (
                  <article
                    key={message.id}
                    className={`max-w-[90%] rounded-lg px-4 py-3 text-sm leading-7 ${message.senderRole === "admin" ? "ml-auto bg-ink text-white" : "bg-pearl text-ink"}`}
                  >
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] opacity-70">
                      {message.senderRole} · {message.senderName}
                    </p>
                    <p>{message.message}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink/60">Your conversations with the salon team will appear here.</p>
            )}
          </div>

          <form className="border-t border-rosewood/10 p-5" onSubmit={onSubmit}>
            {!selectedThreadId && !isAdmin ? (
              <input className="field-input" placeholder="Subject" {...register("subject", { required: true })} />
            ) : null}
            <textarea
              className="field-input mt-3 min-h-28"
              placeholder={isAdmin ? "Write a reply..." : "Tell us what you need"}
              {...register("message", { required: true })}
            />
            {!selectedThreadId && isAdmin ? (
              <p className="mt-2 text-sm text-ink/55">Select a conversation above before replying.</p>
            ) : null}
            <button
              className="mt-4 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
              type="submit"
              disabled={formState.isSubmitting || (!selectedThreadId && isAdmin)}
            >
              {formState.isSubmitting ? "Sending..." : selectedThreadId ? "Send message" : "Start conversation"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
