import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [priceRange, setPriceRange] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory) result = result.filter((p) => p.category === activeCategory);
    if (priceRange === "under5") result = result.filter((p) => p.price < 5);
    else if (priceRange === "5to10") result = result.filter((p) => p.price >= 5 && p.price <= 10);
    else if (priceRange === "over10") result = result.filter((p) => p.price > 10);
    return result;
  }, [activeCategory, priceRange]);

  const clearFilters = () => {
    setSearchParams({});
    setPriceRange("");
  };

  const hasFilters = activeCategory || priceRange;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Page Header */}
        <div className="bg-primary py-12">
          <div className="container">
            <h1 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
              Organic Products
            </h1>
            <p className="mt-2 text-primary-foreground/70">
              Browse our collection of certified organic goods
            </p>
          </div>
        </div>

        <div className="container py-8">
          {/* Filter Bar */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>

            <div className={`flex flex-wrap gap-2 ${showFilters ? "flex" : "hidden lg:flex"}`}>
              {/* Category filters */}
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchParams(activeCategory === cat.name ? {} : { category: cat.name })}
                >
                  {cat.icon} {cat.name.replace("Organic ", "")}
                </Button>
              ))}

              {/* Price filters */}
              <div className="mx-2 hidden h-8 w-px bg-border lg:block" />
              {[
                { label: "Under $5", value: "under5" },
                { label: "$5 - $10", value: "5to10" },
                { label: "Over $10", value: "over10" },
              ].map((p) => (
                <Button
                  key={p.value}
                  variant={priceRange === p.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriceRange(priceRange === p.value ? "" : p.value)}
                >
                  {p.label}
                </Button>
              ))}
            </div>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-destructive">
                <X className="h-3 w-3" /> Clear
              </Button>
            )}
          </div>

          {/* Results */}
          <p className="mb-4 text-sm text-muted-foreground">{filtered.length} products found</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg font-medium text-muted-foreground">No products found</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
