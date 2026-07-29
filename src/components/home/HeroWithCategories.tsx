import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Truck, ShieldCheck, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { Skeleton } from "@/components/ui/skeleton";
import heroBg from "@/assets/hero-bg.jpg";
import GlobalSearch from "./GlobalSearch";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const HeroWithCategories = () => {
  const { data: categories, isLoading } = useCategories();

  const { data: heroBanners } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: async () => {
      const { data } = await supabase
        .from("hero_banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order")
        .limit(1);
      return data;
    },
  });

  const { data: sidePromo } = useQuery({
    queryKey: ["side-promo-banner"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["side_promo_image", "side_promo_link"]);
      const map = Object.fromEntries((data || []).map((r: any) => [r.key, r.value || ""]));
      return { image: map.side_promo_image || "", link: map.side_promo_link || "/products" };
    },
  });

  const banner: any = heroBanners?.[0];
  const heroTitle = banner?.title || "তাজা অর্গানিক খাবার,";
  const heroSubtitle = banner?.subtitle || "প্রতিদিন ডেলিভারি";
  const heroDescription = banner?.description || "সার্টিফাইড কৃষকদের কাছ থেকে সরাসরি আপনার দোরগোড়ায়।";
  const heroImage = banner?.image_url || heroBg;
  const heroButtonText = banner?.button_text || "এখনই কিনুন";
  const heroButtonLink = banner?.button_link || "/products";


  return (
    <section className="bg-background py-4 sm:py-6">
      <div className="container px-3 sm:px-4">
        {/* Mobile search */}
        <div className="mb-4 lg:hidden">
          <GlobalSearch />
        </div>

        <div className="flex gap-5">
          {/* Side Promo Banner - desktop only */}
          <motion.div
            className="hidden w-56 shrink-0 lg:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {sidePromo?.image ? (
              <Link
                to={sidePromo.link || "/products"}
                className="block h-[380px] overflow-hidden rounded-2xl shadow-card transition-transform hover:-translate-y-0.5"
              >
                <img
                  src={sidePromo.image}
                  alt="প্রোমোশনাল অফার"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </Link>
            ) : (
              <div className="flex h-[380px] items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-4 text-center text-xs text-muted-foreground">
                অ্যাডমিন প্যানেল → সাইট সেটিংস থেকে সাইড প্রোমো ব্যানার আপলোড করুন
              </div>
            )}
          </motion.div>



          {/* Hero Banner */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative overflow-hidden rounded-2xl h-[280px] sm:h-[320px] lg:h-[380px]">
              <img src={heroImage} alt={`${heroTitle} ${heroSubtitle} — ফ্রেশ খান অর্গানিক মার্কেটপ্লেস`} className="h-full w-full object-cover object-center" width="1200" height="380" fetchPriority="high" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/60 to-foreground/20 sm:bg-gradient-to-r sm:from-foreground/75 sm:via-foreground/40 sm:to-transparent" />

              <div className="absolute inset-0 flex items-end sm:items-center p-4 sm:p-8 lg:p-10">
                <div className="w-full sm:max-w-md space-y-2 sm:space-y-4">
                  <span className="inline-block rounded-full bg-accent px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-accent-foreground">
                    🔥 বিশেষ অফার
                  </span>

                  <h1
                    className="font-display text-lg font-bold leading-tight text-primary-foreground sm:text-3xl lg:text-4xl"
                    style={{
                      color: banner?.title_color || undefined,
                      fontSize: banner?.title_size ? `${banner.title_size}px` : undefined,
                    }}
                  >
                    {heroTitle}
                    <br />
                    <span
                      className="text-organic-leaf"
                      style={{
                        color: banner?.subtitle_color || undefined,
                        fontSize: banner?.subtitle_size ? `${banner.subtitle_size}px` : undefined,
                      }}
                    >
                      {heroSubtitle}
                    </span>
                  </h1>

                  <p
                    className="max-w-sm text-[11px] leading-snug text-primary-foreground/85 sm:text-sm sm:leading-relaxed line-clamp-2 sm:line-clamp-none"
                    style={{
                      color: banner?.description_color || undefined,
                      fontSize: banner?.description_size ? `${banner.description_size}px` : undefined,
                    }}
                  >
                    {heroDescription}
                  </p>

                  <Link to={heroButtonLink} className="inline-block">
                    <Button variant="hero" size="sm" className="gap-1.5 rounded-full px-4 text-xs sm:px-6 sm:text-sm sm:h-10 mt-0.5">
                      {heroButtonText}
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Service features strip */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: Truck, title: "ফ্রি ডেলিভারি", desc: "৫০০৳+ অর্ডারে", color: "text-primary" },
            { icon: ShieldCheck, title: "১০০% অর্গানিক", desc: "গুণগত মান নিশ্চিত", color: "text-primary" },
            { icon: Headphones, title: "২৪/৭ সাপোর্ট", desc: "যেকোনো সময় সাহায্য", color: "text-primary" },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-card"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Categories - horizontal scroll */}
        <div className="mt-4 lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-28 shrink-0 rounded-full" />
                ))
              : (categories || []).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-primary/5"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name.replace("অর্গানিক ", "")}</span>
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroWithCategories;
