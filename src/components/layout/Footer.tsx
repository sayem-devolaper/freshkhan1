import { Link, useNavigate } from "react-router-dom";
import { Leaf, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="border-t border-border bg-foreground text-primary-foreground">
      <div className="container py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">ফ্রেশ খান</span>
            </div>
            <p className="text-sm leading-relaxed opacity-70">
              কৃষক ও সার্টিফাইড বিক্রেতাদের কাছ থেকে সরাসরি অর্গানিক পণ্যের জন্য আপনার বিশ্বস্ত মার্কেটপ্লেস।
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">দ্রুত লিঙ্ক</h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: "পণ্যসমূহ", to: "/products" },
                { label: "বিক্রেতা", to: "/vendors" },
                { label: "আমাদের সম্পর্কে", to: "/about" },
                { label: "যোগাযোগ", to: "#" },
              ].map((item) => (
                <Link key={item.label} to={item.to} className="text-sm opacity-70 transition-opacity hover:opacity-100">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* For Vendors */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">বিক্রেতাদের জন্য</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/vendor/register">
                <Button variant="outline" size="sm" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  বিক্রেতা হন
                </Button>
              </Link>
              {[
                { label: "বিক্রেতা লগইন", to: "/vendor/login" },
                { label: "বিক্রয় নীতিমালা", to: "#" },
                { label: "কমিশন নীতি", to: "#" },
              ].map((item) => (
                <Link key={item.label} to={item.to} className="text-sm opacity-70 transition-opacity hover:opacity-100">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">আপডেট থাকুন</h4>
            <p className="text-sm opacity-70">সাপ্তাহিক অর্গানিক অফার ও কৃষি গল্প পান।</p>
            <div className="flex gap-2">
              <Input placeholder="আপনার ইমেইল" className="border-border/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50" />
              <Button variant="accent" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-6 text-center text-sm opacity-50">
          © ২০২৬ ফ্রেশ খান। সর্বস্বত্ব সংরক্ষিত। খামার থেকে টেবিলে, প্রাকৃতিকভাবে।
        </div>
      </div>
    </footer>
  );
};

export default Footer;