import { Share2 } from "lucide-react";
import { useState } from "react";

export const ShareButton = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "Elegant Beauty Style Suite",
      text: "Experience expert door-to-door salon styling, African plaiting, nails, skincare, and event preparation.",
      url: window.location.origin
    };

    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/18 sm:w-auto"
      type="button"
      onClick={handleShare}
    >
      <Share2 size={17} />
      {copied ? "Link copied" : "Share with friends"}
    </button>
  );
};
