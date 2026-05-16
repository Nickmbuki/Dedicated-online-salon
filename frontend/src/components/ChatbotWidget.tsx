import { useState } from "react";
import { useForm } from "react-hook-form";
import { Bot, MessageCircle, X } from "lucide-react";
import { submitGuestInquiry } from "../api/services";

type ChatForm = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
};

export const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState } = useForm<ChatForm>();

  const onSubmit = handleSubmit(async (values) => {
    setStatus(null);
    await submitGuestInquiry({
      subject: "Website chatbot question",
      customerName: values.customerName,
      customerEmail: values.customerEmail,
      customerPhone: values.customerPhone,
      message: values.message,
      source: "chatbot"
    });
    reset();
    setStatus("Thank you. An admin will contact you shortly.");
  });

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="mb-3 w-[min(92vw,24rem)] overflow-hidden rounded-lg border border-rosewood/15 bg-white shadow-[0_24px_60px_rgba(24,15,32,0.18)]">
          <div className="flex items-center justify-between bg-gradient-to-r from-rosewood to-purple-700 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <span className="text-sm font-semibold">Quick contact assistant</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>
          <form className="grid gap-3 p-4" onSubmit={onSubmit}>
            <p className="text-sm leading-6 text-ink/70">Leave your name, email, phone, and question. We will answer shortly.</p>
            <input className="field-input" placeholder="Your name" {...register("customerName", { required: true })} />
            <input className="field-input" type="email" placeholder="Email" {...register("customerEmail", { required: true })} />
            <input className="field-input" placeholder="Phone" {...register("customerPhone", { required: true })} />
            <textarea className="field-input min-h-28" placeholder="Ask your question" {...register("message", { required: true })} />
            {status ? <p className="rounded-lg bg-pink-100 px-3 py-2 text-sm font-semibold text-rosewood">{status}</p> : null}
            <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white disabled:opacity-50" type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Sending..." : "Send to admin"}
            </button>
          </form>
        </div>
      ) : null}

      <button
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rosewood to-purple-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rosewood/30"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open chat assistant"
      >
        <MessageCircle size={18} />
        Chat with us
      </button>
    </div>
  );
};
