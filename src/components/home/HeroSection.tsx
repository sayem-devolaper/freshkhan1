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
        <img src={heroBg} alt="Organic farm" className="h-full w-full object-cover" />
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
            Farm Fresh • 100% Organic • Direct from Farmers
          </div>

          <h1 className="font-display text-5xl font-bold leading-tight text-primary-foreground sm:text-6xl lg:text-7xl">
            Nature's Best,
            <br />
            <span className="text-organic-leaf">Delivered Fresh</span>
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-primary-foreground/80">
            Shop organic produce, dairy, spices and more directly from certified farmers and vendors. 
            Pure, sustainable, and delivered to your doorstep.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/products">
              <Button variant="hero" size="lg" className="gap-2 rounded-full px-8">
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/vendors">
              <Button variant="hero-outline" size="lg" className="rounded-full border-primary-foreground/30 px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                Meet Our Farmers
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-6">
            {[
              { value: "500+", label: "Organic Products" },
              { value: "120+", label: "Trusted Vendors" },
              { value: "50k+", label: "Happy Customers" },
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
