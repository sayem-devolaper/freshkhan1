import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Leaf, Heart, Truck, ShieldCheck, Users, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  {
    icon: Leaf,
    title: "১০০% অর্গানিক",
    description: "আমরা শুধুমাত্র প্রত্যয়িত জৈব পণ্য সরবরাহ করি যা রাসায়নিক মুক্ত।",
  },
  {
    icon: Heart,
    title: "স্বাস্থ্যকর জীবন",
    description: "আপনার পরিবারের জন্য নিরাপদ ও পুষ্টিকর খাবার নিশ্চিত করা আমাদের লক্ষ্য।",
  },
  {
    icon: Truck,
    title: "দ্রুত ডেলিভারি",
    description: "আপনার দোরগোড়ায় তাজা পণ্য পৌঁছে দেওয়া আমাদের প্রতিশ্রুতি।",
  },
  {
    icon: ShieldCheck,
    title: "গুণগত মান নিশ্চয়তা",
    description: "প্রতিটি পণ্য কঠোর মান পরীক্ষার মধ্য দিয়ে যায়।",
  },
  {
    icon: Users,
    title: "কৃষক-বান্ধব",
    description: "আমরা স্থানীয় কৃষকদের ন্যায্য মূল্য প্রদান করি এবং তাদের ক্ষমতায়ন করি।",
  },
  {
    icon: MapPin,
    title: "স্থানীয় উৎস",
    description: "বাংলাদেশের বিভিন্ন অঞ্চল থেকে সেরা জৈব পণ্য সংগ্রহ করা হয়।",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const AboutPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--organic-leaf)/0.3),transparent_70%)]" />
        </div>
        <div className="container relative text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold md:text-5xl"
          >
            আমাদের সম্পর্কে
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80"
          >
            Fresh Khan — বাংলাদেশের সবচেয়ে বিশ্বস্ত অর্গানিক মার্কেটপ্লেস। আমরা
            কৃষক ও ভোক্তার মধ্যে সেতুবন্ধন তৈরি করি।
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="container py-16">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">
            আমাদের গল্প
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Fresh Khan প্রতিষ্ঠিত হয়েছে একটি সহজ লক্ষ্য নিয়ে — প্রতিটি বাংলাদেশি
            পরিবারের কাছে বিশুদ্ধ, রাসায়নিক-মুক্ত খাবার পৌঁছে দেওয়া। আমরা
            বিশ্বাস করি, ভালো খাবার শুধু শরীরের জন্য নয়, মনের জন্যও। আমাদের
            প্ল্যাটফর্মে দেশের বিভিন্ন অঞ্চলের কৃষকরা সরাসরি তাদের জৈব পণ্য
            বিক্রি করতে পারেন, যা ভোক্তা ও কৃষক উভয়ের জন্যই লাভজনক।
          </p>
          <p className="text-muted-foreground leading-relaxed">
            আমাদের দলটি কৃষি বিশেষজ্ঞ, প্রযুক্তিবিদ এবং স্বাস্থ্য সচেতন মানুষদের
            সমন্বয়ে গঠিত। আমরা প্রতিনিয়ত কাজ করে যাচ্ছি একটি স্বাস্থ্যকর ও
            টেকসই খাদ্য ব্যবস্থা গড়ে তুলতে।
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary/50 py-16">
        <div className="container">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground">
            আমাদের মূল্যবোধ
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container py-16">
        <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "৫০০+", label: "সক্রিয় কৃষক" },
            { value: "১০,০০০+", label: "সন্তুষ্ট গ্রাহক" },
            { value: "২,০০০+", label: "অর্গানিক পণ্য" },
            { value: "৬৪", label: "জেলায় ডেলিভারি" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="mt-1 text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
