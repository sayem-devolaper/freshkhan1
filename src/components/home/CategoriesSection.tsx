import { Link } from "react-router-dom";
import { categories } from "@/data/mockData";
import { motion } from "framer-motion";

const CategoriesSection = () => {
  return (
    <section className="bg-background py-20">
      <div className="container">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            ক্যাটাগরি অনুযায়ী কিনুন
          </h2>
          <p className="mt-3 text-muted-foreground">
            সার্টিফাইড অর্গানিক পণ্যের বিশাল সংগ্রহ ব্রাউজ করুন
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
              >
                <span className="text-4xl">{cat.icon}</span>
                <div>
                  <p className="font-semibold text-card-foreground">{cat.name.replace("অর্গানিক ", "")}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{cat.productCount} পণ্য</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;