import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/use-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const gradients = [
  "from-emerald-400 via-green-500 to-teal-600",
  "from-orange-400 via-amber-500 to-yellow-500",
  "from-pink-400 via-rose-500 to-red-500",
  "from-sky-400 via-blue-500 to-indigo-600",
  "from-purple-400 via-fuchsia-500 to-pink-600",
  "from-lime-400 via-green-500 to-emerald-600",
  "from-cyan-400 via-teal-500 to-emerald-600",
  "from-red-400 via-orange-500 to-amber-500",
];

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
                    className={`group relative flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-br ${gradients[i % gradients.length]} p-4 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1 overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative text-3xl sm:text-4xl drop-shadow-md">{cat.icon}</span>
                    <span className="relative text-xs font-bold text-white text-center sm:text-sm drop-shadow">
                      {cat.name.replace("অর্গানিক ", "")}
                    </span>
                    <span className="relative text-[10px] font-medium text-white/90">
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
