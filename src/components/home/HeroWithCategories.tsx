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

  const banner = heroBanners?.[0];
  const heroTitle = banner?.title || "তাজা অর্গানিক খাবার,";
  const heroSubtitle = banner?.subtitle || "প্রতিদিন ডেলিভারি";
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
          {/* Categories Sidebar - desktop only */}
          <motion.div
            className="hidden w-56 shrink-0 lg:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card h-[380px] flex flex-col">
              <div className="bg-primary px-4 py-3">
                <h3 className="font-semibold text-primary-foreground text-sm tracking-wide">ক্যাটাগরি সমূহ</h3>
              </div>
              <nav className="py-1 flex-1 overflow-y-auto">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="px-4 py-2.5">
                        <Skeleton className="h-5 w-full" />
                      </div>
                    ))
                  : (categories || []).map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-foreground transition-all hover:bg-primary/5 hover:pl-5 group"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-base">{cat.icon}</span>
                          <span className="font-medium">{cat.name.replace("অর্গানিক ", "")}</span>
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                      </Link>
                    ))}
              </nav>
            </div>
          </motion.div>

          {/* Hero Banner */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative overflow-hidden rounded-2xl h-[240px] sm:h-[320px] lg:h-[380px]">
              <img src={heroImage} alt={`${heroTitle} ${heroSubtitle} — ফ্রেশ খান অর্গানিক মার্কেটপ্লেস`} className="h-full w-full object-cover" width="1200" height="380" fetchPriority="high" />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 via-foreground/40 to-transparent" />

              <div className="absolute inset-0 flex items-center p-5 sm:p-8 lg:p-10">
                <div className="max-w-md space-y-3 sm:space-y-4">
                  <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                    🔥 বিশেষ অফার
                  </span>

                  <h1 className="font-display text-xl font-bold leading-tight text-primary-foreground sm:text-3xl lg:text-4xl">
                    {heroTitle}
                    <br />
                    <span className="text-organic-leaf">{heroSubtitle}</span>
                  </h1>

                  <p className="max-w-sm text-xs leading-relaxed text-primary-foreground/80 sm:text-sm">
                    সার্টিফাইড কৃষকদের কাছ থেকে সরাসরি আপনার দোরগোড়ায়।
                  </p>

                  <Link to={heroButtonLink}>
                    <Button variant="hero" size="default" className="gap-2 rounded-full px-6 text-sm mt-1">
                      {heroButtonText}
                      <ArrowRight className="h-4 w-4" />
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
