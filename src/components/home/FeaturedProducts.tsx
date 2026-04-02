import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedProducts = () => {
  const { data: products, isLoading } = useProducts();

  return (
    <section className="bg-background py-12 sm:py-16">
      <div className="container px-3 sm:px-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              বিশেষ পণ্যসমূহ
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              আমাদের সেরা বিক্রেতাদের হাতে বাছাই করা অর্গানিক পণ্য
            </p>
          </div>
          <Link to="/products" className="hidden sm:block">
            <Button variant="ghost" className="gap-1 text-primary">
              সব দেখুন <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
              ))
            : (products || []).slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link to="/products">
            <Button variant="outline" className="gap-1">
              সকল পণ্য দেখুন <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
