import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Percent } from "lucide-react";
import { motion } from "framer-motion";

const PromoBanner = () => {
  return (
    <section className="bg-background py-6 sm:py-10">
      <div className="container px-3 sm:px-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Banner 1 */}
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-organic-green-light p-6 sm:p-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative z-10 max-w-[200px]">
              <div className="flex items-center gap-1.5 rounded-full bg-primary-foreground/20 px-2.5 py-1 text-xs font-bold text-primary-foreground w-fit backdrop-blur-sm">
                <Percent className="h-3 w-3" /> ২০% ছাড়
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-primary-foreground sm:text-xl">
                তাজা শাকসবজি
              </h3>
              <p className="mt-1 text-xs text-primary-foreground/70">
                প্রতিদিন খামার থেকে আসা তাজা সবজি
              </p>
              <Link to="/products?category=জৈব সবজি">
                <Button
                  size="sm"
                  className="mt-4 rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-1 text-xs"
                >
                  কিনুন <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            <div className="absolute -bottom-4 -right-4 text-[80px] opacity-20">🥬</div>
          </motion.div>

          {/* Banner 2 */}
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-organic-gold p-6 sm:p-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative z-10 max-w-[200px]">
              <div className="flex items-center gap-1.5 rounded-full bg-accent-foreground/20 px-2.5 py-1 text-xs font-bold text-accent-foreground w-fit backdrop-blur-sm">
                🔥 সীমিত অফার
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-accent-foreground sm:text-xl">
                মৌসুমী ফলমূল
              </h3>
              <p className="mt-1 text-xs text-accent-foreground/70">
                সুমিষ্ট আম, মাল্টা ও আরও অনেক
              </p>
              <Link to="/products?category=ফলমূল">
                <Button
                  size="sm"
                  className="mt-4 rounded-full bg-accent-foreground text-accent hover:bg-accent-foreground/90 gap-1 text-xs"
                >
                  কিনুন <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            <div className="absolute -bottom-4 -right-4 text-[80px] opacity-20">🍎</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
