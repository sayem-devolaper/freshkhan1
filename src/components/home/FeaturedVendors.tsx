import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import VendorCard from "@/components/VendorCard";
import { vendors } from "@/data/mockData";

const FeaturedVendors = () => {
  return (
    <section className="bg-background py-20">
      <div className="container">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              আমাদের কৃষকদের সাথে পরিচিত হন
            </h2>
            <p className="mt-3 text-muted-foreground">
              মানের প্রতি নিবেদিত বিশ্বস্ত অর্গানিক বিক্রেতারা
            </p>
          </div>
          <Link to="/vendors" className="hidden sm:block">
            <Button variant="ghost" className="gap-1 text-primary">
              সব দেখুন <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVendors;