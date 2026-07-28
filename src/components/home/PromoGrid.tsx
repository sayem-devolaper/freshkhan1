import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const PromoGrid = () => {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["promo-grid-banners"],
    queryFn: async () => {
      const { data } = await supabase
        .from("promo_banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      return data || [];
    },
  });

  return (
    <section className="bg-background py-10 sm:py-14">
      <div className="container px-3 sm:px-4">
        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            বিশেষ অফার ও ছাড়
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            সেরা প্রোমোশনাল ডিল দেখুন
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
              ))
            : (banners || []).map((b: any, i: number) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link
                    to={b.button_link || "/products"}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-2xl shadow-card transition-all hover:shadow-elevated hover:-translate-y-1"
                  >
                    {b.image_url ? (
                      <img
                        src={b.image_url}
                        alt={b.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                      <h3
                        className="font-display text-sm font-bold text-white drop-shadow sm:text-base"
                        style={{
                          color: b.title_color || undefined,
                          fontSize: b.title_size ? `${b.title_size}px` : undefined,
                        }}
                      >
                        {b.title}
                      </h3>
                      {b.description && (
                        <p
                          className="mt-0.5 line-clamp-2 text-[11px] text-white/85 sm:text-xs"
                          style={{
                            color: b.description_color || undefined,
                            fontSize: b.description_size ? `${b.description_size}px` : undefined,
                          }}
                        >
                          {b.description}
                        </p>
                      )}
                      {b.button_text && (
                        <span className="mt-2 inline-block rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-primary sm:text-xs">
                          {b.button_text}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>

        {!isLoading && (!banners || banners.length === 0) && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            এখনো কোনো প্রোমো ব্যানার যোগ করা হয়নি। অ্যাডমিন প্যানেল থেকে যোগ করুন।
          </p>
        )}
      </div>
    </section>
  );
};

export default PromoGrid;
