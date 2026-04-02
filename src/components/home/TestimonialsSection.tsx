import { Star } from "lucide-react";
import { testimonials } from "@/types/database";
import { motion } from "framer-motion";

const TestimonialsSection = () => {
  return (
    <section className="bg-background py-12 sm:py-16">
      <div className="container px-3 sm:px-4">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            আমাদের সম্প্রদায় কী বলে
          </h2>
          <p className="mt-3 text-muted-foreground">
            প্রকৃত ক্রেতা ও বিক্রেতাদের প্রকৃত অভিজ্ঞতা
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              className="rounded-xl border border-border bg-card p-6 shadow-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-4 w-4 ${j < t.rating ? "fill-organic-gold text-organic-gold" : "text-border"}`}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {t.avatar}
                </div>
                <p className="font-semibold text-foreground">{t.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
