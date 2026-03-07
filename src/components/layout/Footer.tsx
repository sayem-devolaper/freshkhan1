import { Link } from "react-router-dom";
import { Leaf, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
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
              <span className="font-display text-xl font-bold">Fresh Khan</span>
            </div>
            <p className="text-sm leading-relaxed opacity-70">
              Your trusted marketplace for organic products directly from farmers and certified vendors.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              {["Products", "Vendors", "About Us", "Contact"].map((item) => (
                <Link key={item} to="#" className="text-sm opacity-70 transition-opacity hover:opacity-100">
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* For Vendors */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">For Vendors</h4>
            <nav className="flex flex-col gap-2">
              {["Become a Vendor", "Vendor Dashboard", "Seller Guidelines", "Commission Policy"].map((item) => (
                <Link key={item} to="#" className="text-sm opacity-70 transition-opacity hover:opacity-100">
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">Stay Updated</h4>
            <p className="text-sm opacity-70">Get weekly organic deals and farming stories.</p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="border-border/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50" />
              <Button variant="accent" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-6 text-center text-sm opacity-50">
          © 2026 Fresh Khan. All rights reserved. Farm to table, naturally.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
