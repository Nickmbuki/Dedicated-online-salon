import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export const InstallPrompt = () => {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem("install_prompt_dismissed") === "true");

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (dismissed || !installEvent) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-lg border border-champagne/40 bg-ink px-4 py-3 text-porcelain shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Install Elegant Beauty Style Suite</p>
          <p className="text-xs text-porcelain/75">Book salon care faster from your home screen.</p>
        </div>
        <div className="flex gap-2">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-champagne text-ink"
            type="button"
            aria-label="Install app"
            onClick={async () => {
              await installEvent.prompt();
              setInstallEvent(null);
            }}
          >
            <Download size={18} />
          </button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-porcelain/20"
            type="button"
            aria-label="Dismiss install prompt"
            onClick={() => {
              localStorage.setItem("install_prompt_dismissed", "true");
              setDismissed(true);
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
