import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/mockData";

const FeaturedProducts = () => {
  return (
    <section className="bg-secondary/50 py-20">
      <div className="container">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              বিশেষ পণ্যসমূহ
            </h2>
            <p className="mt-3 text-muted-foreground">
              আমাদের সেরা বিক্রেতাদের হাতে বাছাই করা অর্গানিক পণ্য
            </p>
          </div>
          <Link to="/products" className="hidden sm:block">
            <Button variant="ghost" className="gap-1 text-primary">
              সব দেখুন <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
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