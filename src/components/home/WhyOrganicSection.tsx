import { Leaf, Heart, Shield, Truck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Leaf,
    title: "100% Organic",
    description: "All products are certified organic, free from harmful pesticides and chemicals.",
  },
  {
    icon: Heart,
    title: "Support Local Farmers",
    description: "Buy directly from farmers and vendors. Fair prices, fair trade.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "Every vendor is verified and every product meets our strict quality standards.",
  },
  {
    icon: Truck,
    title: "Farm to Doorstep",
    description: "Fresh produce delivered quickly to maintain maximum freshness and nutrition.",
  },
];

const WhyOrganicSection = () => {
  return (
    <section className="bg-primary py-20">
      <div className="container">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
            Why Choose Fresh Khan?
          </h2>
          <p className="mt-3 text-primary-foreground/70">
            We're more than a marketplace — we're a movement towards healthier living
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 text-center backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-primary-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyOrganicSection;
