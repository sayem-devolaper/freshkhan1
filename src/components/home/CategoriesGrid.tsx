import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/use-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const CategoriesGrid = () => {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="bg-background py-10 sm:py-14">
      <div className="container px-3 sm:px-4">
        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            ক্যাটাগরি অনুসারে কিনুন
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            আপনার পছন্দের পণ্য সহজেই খুঁজুন
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))
            : (categories || []).map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1"
                  >
                    <span className="text-3xl sm:text-4xl">{cat.icon}</span>
                    <span className="text-xs font-semibold text-foreground text-center sm:text-sm">
                      {cat.name.replace("অর্গানিক ", "")}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {cat.productCount} পণ্য
                    </span>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;
