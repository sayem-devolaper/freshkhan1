import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import VendorCard from "@/components/VendorCard";
import { useVendors } from "@/hooks/use-vendors";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedVendors = () => {
  const { data: vendors, isLoading } = useVendors();

  return (
    <section className="bg-secondary/30 py-10 sm:py-14">
      <div className="container px-3 sm:px-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
              বিশ্বস্ত বিক্রেতা
            </h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              যাচাইকৃত অর্গানিক কৃষক ও বিক্রেতা
            </p>
          </div>
          <Link to="/vendors">
            <Button variant="ghost" size="sm" className="gap-1 text-primary text-xs sm:text-sm">
              সব দেখুন <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
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
