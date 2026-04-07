import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const defaultBanners = [
  {
    title: "তাজা শাকসবজি",
    description: "প্রতিদিন খামার থেকে আসা তাজা সবজি",
    button_text: "কিনুন",
    button_link: "/products?category=জৈব সবজি",
    bg_color: "primary",
    badge: "২০% ছাড়",
    emoji: "🥬",
  },
  {
    title: "মৌসুমী ফলমূল",
    description: "সুমিষ্ট আম, মাল্টা ও আরও অনেক",
    button_text: "কিনুন",
    button_link: "/products?category=ফলমূল",
    bg_color: "accent",
    badge: "🔥 সীমিত অফার",
    emoji: "🍎",
  },
];

const PromoBanner = () => {
  const { data: dbBanners } = useQuery({
    queryKey: ["promo-banners"],
    queryFn: async () => {
      const { data } = await supabase
        .from("promo_banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      return data;
    },
  });

  const banners = dbBanners && dbBanners.length > 0
    ? dbBanners.map((b, i) => ({
        title: b.title,
        description: b.description || "",
        button_text: b.button_text || "কিনুন",
        button_link: b.button_link || "/products",
        bg_color: i === 0 ? "primary" : "accent",
        badge: i === 0 ? "২০% ছাড়" : "🔥 সীমিত অফার",
        emoji: i === 0 ? "🥬" : "🍎",
      }))
    : defaultBanners;

  return (
    <section className="bg-background py-6 sm:py-10">
      <div className="container px-3 sm:px-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {banners.slice(0, 2).map((banner, idx) => (
            <motion.div
              key={idx}
              className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 ${
                idx === 0
                  ? "bg-gradient-to-br from-primary to-organic-green-light"
                  : "bg-gradient-to-br from-accent to-organic-gold"
              }`}
              initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative z-10 max-w-[200px]">
                <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold w-fit backdrop-blur-sm ${
                  idx === 0
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-accent-foreground/20 text-accent-foreground"
                }`}>
                  {idx === 0 && <Percent className="h-3 w-3" />} {banner.badge}
                </div>
                <h3 className={`mt-3 font-display text-lg font-bold sm:text-xl ${
                  idx === 0 ? "text-primary-foreground" : "text-accent-foreground"
                }`}>
                  {banner.title}
                </h3>
                <p className={`mt-1 text-xs ${
                  idx === 0 ? "text-primary-foreground/70" : "text-accent-foreground/70"
                }`}>
                  {banner.description}
                </p>
                <Link to={banner.button_link}>
                  <Button
                    size="sm"
                    className={`mt-4 rounded-full gap-1 text-xs ${
                      idx === 0
                        ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                        : "bg-accent-foreground text-accent hover:bg-accent-foreground/90"
                    }`}
                  >
                    {banner.button_text} <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
              <div className="absolute -bottom-4 -right-4 text-[80px] opacity-20">{banner.emoji}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
