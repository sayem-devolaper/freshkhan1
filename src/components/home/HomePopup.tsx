import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

const STORAGE_KEY = "fk_popup_dismissed_v";

const HomePopup = () => {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key,value")
        .in("key", ["popup_enabled", "popup_image_url", "popup_link"]);
      const map: Record<string, string> = {};
      (data || []).forEach((r: any) => { map[r.key] = r.value || ""; });

      if (map.popup_enabled !== "true" || !map.popup_image_url) return;

      const dismissKey = STORAGE_KEY + btoa(map.popup_image_url).slice(0, 12);
      if (sessionStorage.getItem(dismissKey)) return;

      setImageUrl(map.popup_image_url);
      setLink(map.popup_link || "");
      setTimeout(() => setOpen(true), 800);
    })();
  }, []);

  const dismiss = () => {
    if (imageUrl) {
      sessionStorage.setItem(STORAGE_KEY + btoa(imageUrl).slice(0, 12), "1");
    }
    setOpen(false);
  };

  if (!open || !imageUrl) return null;

  const ImageEl = (
    <img
      src={imageUrl}
      alt="ঘোষণা"
      className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
    />
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={dismiss}
          aria-label="বন্ধ করুন"
          className="absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-white text-foreground shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {link ? (
          <a href={link} target={link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
            {ImageEl}
          </a>
        ) : ImageEl}
      </div>
    </div>
  );
};

export default HomePopup;
