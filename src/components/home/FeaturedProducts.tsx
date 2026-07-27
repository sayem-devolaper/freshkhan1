import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FeaturedProducts = () => {
  const { data: products, isLoading } = useProducts();

  const { data: featuredItems } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("featured_items")
        .select("item_id")
        .eq("item_type", "product")
        .eq("is_active", true)
        .order("sort_order");
      return data?.map(i => i.item_id) || [];
    },
  });

  // If featured items exist, show them first; otherwise show all products
  const displayProducts = (() => {
    if (!products) return [];
    if (featuredItems && featuredItems.length > 0) {
      const featured = featuredItems
        .map(id => products.find(p => p.id === id))
        .filter(Boolean);
      const rest = products.filter(p => !featuredItems.includes(p.id));
      return [...featured, ...rest];
    }
    return products;
  })();

  return (
    <section className="bg-background py-10 sm:py-14">
      <div className="container px-3 sm:px-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
              আজকের সেরা পণ্য
            </h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              তাজা ও সুলভ মূল্যে অর্গানিক পণ্য
            </p>
          </div>
          <Link to="/products">
            <Button variant="ghost" size="sm" className="gap-1 text-primary text-xs sm:text-sm">
              সব দেখুন <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
              ))
            : displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
