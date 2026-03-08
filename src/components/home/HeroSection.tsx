import { Link } from "react-router-dom";
import { ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="অর্গানিক খামার" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
      </div>

      <div className="container relative z-10 flex min-h-[85vh] items-center py-20">
        <motion.div
          className="max-w-2xl space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground backdrop-blur-sm">
            <Leaf className="h-4 w-4" />
            তাজা খাবার • ১০০% অর্গানিক • সরাসরি কৃষকদের কাছ থেকে
          </div>

          <h1 className="font-display text-5xl font-bold leading-tight text-primary-foreground sm:text-6xl lg:text-7xl">
            প্রকৃতির সেরা,
            <br />
            <span className="text-organic-leaf">তাজা ডেলিভারি</span>
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-primary-foreground/80">
            সার্টিফাইড কৃষক ও বিক্রেতাদের কাছ থেকে সরাসরি অর্গানিক শাকসবজি, দুগ্ধ, মশলা এবং আরও অনেক কিছু কিনুন।
            বিশুদ্ধ, টেকসই এবং আপনার দোরগোড়ায় ডেলিভারি।
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/products">
              <Button variant="hero" size="lg" className="gap-2 rounded-full px-8">
                এখনই কিনুন
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/vendors">
              <Button variant="hero-outline" size="lg" className="rounded-full border-primary-foreground/30 px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                আমাদের কৃষকদের সাথে পরিচিত হন
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-6">
            {[
              { value: "৫০০+", label: "অর্গানিক পণ্য" },
              { value: "১২০+", label: "বিশ্বস্ত বিক্রেতা" },
              { value: "৫০ হাজার+", label: "সন্তুষ্ট ক্রেতা" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-xs text-primary-foreground/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;