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
              Meet Our Farmers
            </h2>
            <p className="mt-3 text-muted-foreground">
              Trusted organic vendors committed to quality
            </p>
          </div>
          <Link to="/vendors" className="hidden sm:block">
            <Button variant="ghost" className="gap-1 text-primary">
              View All <ArrowRight className="h-4 w-4" />
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
