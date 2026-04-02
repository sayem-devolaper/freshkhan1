import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import VendorCard from "@/components/VendorCard";
import { useVendors } from "@/hooks/use-vendors";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedVendors = () => {
  const { data: vendors, isLoading } = useVendors();

  return (
    <section className="bg-secondary/30 py-12 sm:py-16">
      <div className="container px-3 sm:px-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              আমাদের কৃষকদের সাথে পরিচিত হন
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              মানের প্রতি নিবেদিত বিশ্বস্ত অর্গানিক বিক্রেতারা
            </p>
          </div>
          <Link to="/vendors" className="hidden sm:block">
            <Button variant="ghost" className="gap-1 text-primary">
              সব দেখুন <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-52 rounded-xl" />
              ))
            : (vendors || []).slice(0, 4).map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVendors;
