import { Leaf, Heart, Shield, Truck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Leaf,
    title: "১০০% অর্গানিক",
    description: "সকল পণ্য সার্টিফাইড অর্গানিক, ক্ষতিকর কীটনাশক ও রাসায়নিকমুক্ত।",
  },
  {
    icon: Heart,
    title: "স্থানীয় কৃষকদের সহায়তা",
    description: "সরাসরি কৃষক ও বিক্রেতাদের কাছ থেকে কিনুন। ন্যায্য মূল্য, ন্যায্য বাণিজ্য।",
  },
  {
    icon: Shield,
    title: "গুণগত মান নিশ্চিত",
    description: "প্রতিটি বিক্রেতা যাচাইকৃত এবং প্রতিটি পণ্য আমাদের কঠোর মান পূরণ করে।",
  },
  {
    icon: Truck,
    title: "খামার থেকে দোরগোড়ায়",
    description: "সর্বোচ্চ তাজা ও পুষ্টি বজায় রাখতে দ্রুত ডেলিভারি।",
  },
];

const WhyOrganicSection = () => {
  return (
    <section className="bg-primary py-12 sm:py-16">
      <div className="container px-3 sm:px-4">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
            কেন ফ্রেশ খান বেছে নেবেন?
          </h2>
          <p className="mt-3 text-primary-foreground/70">
            আমরা শুধু একটি মার্কেটপ্লেস নই — আমরা সুস্থ জীবনযাপনের একটি আন্দোলন
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