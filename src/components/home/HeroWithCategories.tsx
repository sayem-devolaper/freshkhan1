import { Link } from "react-router-dom";
import { ArrowRight, Leaf, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { Skeleton } from "@/components/ui/skeleton";
import heroBg from "@/assets/hero-bg.jpg";
import GlobalSearch from "./GlobalSearch";
import { motion } from "framer-motion";

const HeroWithCategories = () => {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="bg-background py-4 sm:py-6 lg:py-8">
      <div className="container px-3 sm:px-4">
        {/* Mobile search */}
        <div className="mb-4 lg:hidden">
          <GlobalSearch />
        </div>

        <div className="flex gap-5">
          {/* Categories Sidebar - desktop only */}
          <motion.div
            className="hidden w-64 shrink-0 lg:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
              <div className="bg-primary px-4 py-3">
                <h3 className="font-semibold text-primary-foreground text-sm">ক্যাটাগরি সমূহ</h3>
              </div>
              <nav className="py-1">
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
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary group"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-lg">{cat.icon}</span>
                          <span>{cat.name.replace("অর্গানিক ", "")}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">({cat.productCount})</span>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
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
            <div className="relative overflow-hidden rounded-xl h-[280px] sm:h-[360px] lg:h-[420px]">
              <img src={heroBg} alt="অর্গানিক খামার" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />

              <div className="absolute inset-0 flex items-center p-6 sm:p-10 lg:p-12">
                <div className="max-w-lg space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs backdrop-blur-sm text-primary-foreground">
                    <Leaf className="h-3 w-3" />
                    <span>১০০% অর্গানিক • সরাসরি কৃষকদের কাছ থেকে</span>
                  </div>

                  <h1 className="font-display text-2xl font-bold leading-tight text-primary-foreground sm:text-4xl lg:text-5xl">
                    প্রকৃতির সেরা,
                    <br />
                    <span className="text-organic-leaf">তাজা ডেলিভারি</span>
                  </h1>

                  <p className="max-w-md text-xs leading-relaxed text-primary-foreground/80 sm:text-sm lg:text-base">
                    সার্টিফাইড কৃষকদের কাছ থেকে অর্গানিক শাকসবজি, দুগ্ধ, মশলা সরাসরি আপনার দোরগোড়ায়।
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link to="/products">
                      <Button variant="hero" size="default" className="gap-2 rounded-full px-5 text-sm sm:px-6">
                        এখনই কিনুন
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/vendors">
                      <Button variant="hero-outline" size="default" className="rounded-full border-primary-foreground/30 px-5 text-sm text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:px-6">
                        ভেন্ডর দেখুন
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row below hero */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { value: "৫০+", label: "অর্গানিক পণ্য", icon: "🌿" },
                { value: "৩০+", label: "বিশ্বস্ত বিক্রেতা", icon: "👨‍🌾" },
                { value: "৫ হাজার+", label: "সন্তুষ্ট ক্রেতা", icon: "⭐" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 sm:p-4 shadow-card"
                >
                  <span className="text-xl sm:text-2xl">{stat.icon}</span>
                  <div>
                    <p className="font-display text-base font-bold text-foreground sm:text-lg">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground sm:text-xs">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
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
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-secondary"
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
