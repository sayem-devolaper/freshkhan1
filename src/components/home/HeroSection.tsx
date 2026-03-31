import { Link } from "react-router-dom";
import { ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import GlobalSearch from "./GlobalSearch";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="অর্গানিক খামার" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
      </div>

      <div className="container relative z-10 flex min-h-[60vh] items-center px-4 py-12 sm:min-h-[75vh] sm:py-16 lg:min-h-[85vh] lg:py-20">
        <motion.div
          className="max-w-2xl space-y-4 sm:space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs backdrop-blur-sm text-primary-foreground sm:px-4 sm:py-1.5 sm:text-sm">
            <Leaf className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="line-clamp-1">তাজা খাবার • ১০০% অর্গানিক • সরাসরি কৃষকদের কাছ থেকে</span>
          </div>

          <h1 className="font-display text-3xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-7xl">
            প্রকৃতির সেরা,
            <br />
            <span className="text-organic-leaf">তাজা ডেলিভারি</span>
          </h1>

          <p className="max-w-lg text-sm leading-relaxed text-primary-foreground/80 sm:text-lg">
            সার্টিফাইড কৃষক ও বিক্রেতাদের কাছ থেকে সরাসরি অর্গানিক শাকসবজি, দুগ্ধ, মশলা এবং আরও অনেক কিছু কিনুন।
            বিশুদ্ধ, টেকসই এবং আপনার দোরগোড়ায় ডেলিভারি।
          </p>

          {/* Search Bar */}
          <div className="pt-1 sm:pt-2">
            <GlobalSearch />
          </div>

          <div className="flex flex-wrap gap-2 pt-1 sm:gap-3 sm:pt-2">
            <Link to="/products">
              <Button variant="hero" size="default" className="gap-2 rounded-full px-5 text-sm sm:px-8 sm:text-base">
                এখনই কিনুন
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/vendors">
              <Button variant="hero-outline" size="default" className="rounded-full border-primary-foreground/30 px-5 text-sm text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:px-8 sm:text-base">
                আমাদের ভেন্ডরদের সাথে পরিচিত হন
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-4 pt-4 sm:gap-8 sm:pt-6">
            {[
              { value: "৫০+", label: "অর্গানিক পণ্য" },
              { value: "৩০+", label: "বিশ্বস্ত বিক্রেতা" },
              { value: "৫ হাজার+", label: "সন্তুষ্ট ক্রেতা" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-lg font-bold text-primary-foreground sm:text-2xl">{stat.value}</p>
                <p className="text-[10px] text-primary-foreground/60 sm:text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
