import { Star } from "lucide-react";
import { testimonials } from "@/types/database";
import { motion } from "framer-motion";

const TestimonialsSection = () => {
  return (
    <section className="bg-background py-10 sm:py-14">
      <div className="container px-3 sm:px-4">
        <h2 className="text-center font-display text-xl font-bold text-foreground sm:text-2xl">
          ক্রেতাদের মতামত
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-3.5 w-3.5 ${j < t.rating ? "fill-organic-gold text-organic-gold" : "text-border"}`}
                  />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">{t.text}</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {t.avatar}
                </div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
