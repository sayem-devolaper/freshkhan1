import { Leaf, Heart, Shield, Truck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Leaf,
    title: "১০০% অর্গানিক",
    description: "কীটনাশক ও রাসায়নিকমুক্ত পণ্য।",
  },
  {
    icon: Heart,
    title: "কৃষকদের সহায়তা",
    description: "সরাসরি কৃষকদের কাছ থেকে ন্যায্য মূল্যে।",
  },
  {
    icon: Shield,
    title: "মান নিশ্চিত",
    description: "প্রতিটি পণ্য কঠোরভাবে যাচাই করা।",
  },
  {
    icon: Truck,
    title: "দ্রুত ডেলিভারি",
    description: "খামার থেকে সরাসরি আপনার দোরগোড়ায়।",
  },
];

const WhyOrganicSection = () => {
  return (
    <section className="bg-primary py-10 sm:py-14">
      <div className="container px-3 sm:px-4">
        <h2 className="text-center font-display text-xl font-bold text-primary-foreground sm:text-2xl">
          কেন ফ্রেশ খান?
        </h2>

        <div className="mt-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="rounded-2xl bg-primary-foreground/10 p-5 text-center backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/15">
                <feature.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-primary-foreground">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-primary-foreground/70">
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
