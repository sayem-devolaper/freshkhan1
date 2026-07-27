import { Helmet } from "react-helmet-async";
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [priceRange, setPriceRange] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const filtered = useMemo(() => {
    let result = [...(products || [])];
    if (activeCategory) result = result.filter((p) => p.category === activeCategory);
    if (priceRange === "under100") result = result.filter((p) => p.price < 100);
    else if (priceRange === "100to300") result = result.filter((p) => p.price >= 100 && p.price <= 300);
    else if (priceRange === "over300") result = result.filter((p) => p.price > 300);
    return result;
  }, [products, activeCategory, priceRange]);

  const clearFilters = () => {
    setSearchParams({});
    setPriceRange("");
  };

  const hasFilters = activeCategory || priceRange;

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>সকল অর্গানিক পণ্য | ফ্রেশ খান</title>
        <meta name="description" content="ফ্রেশ খানের সব সার্টিফাইড অর্গানিক পণ্য এক জায়গায় — শাকসবজি, ফল, দুগ্ধ, মশলা ও আরও অনেক কিছু।" />
        <link rel="canonical" href="https://freshkhan1.lovable.app/products" />
        <meta property="og:url" content="https://freshkhan1.lovable.app/products" />
        <meta property="og:title" content="সকল অর্গানিক পণ্য | ফ্রেশ খান" />
        <meta property="og:description" content="সার্টিফাইড অর্গানিক পণ্য কিনুন সরাসরি কৃষকের কাছ থেকে।" />
      </Helmet>
      <Header />
      <main className="flex-1 bg-background">
        <div className="bg-primary py-12">
          <div className="container">
            <h1 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
              অর্গানিক পণ্যসমূহ
            </h1>
            <p className="mt-2 text-primary-foreground/70">
              সার্টিফাইড অর্গানিক পণ্যের সংগ্রহ ব্রাউজ করুন
            </p>
          </div>
        </div>

        <div className="container py-8">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" /> ফিল্টার
            </Button>

            <div className={`flex flex-wrap gap-2 ${showFilters ? "flex" : "hidden lg:flex"}`}>
              {!categoriesLoading &&
                (categories || []).map((cat) => (
                  <Button
                    key={cat.id}
                    variant={activeCategory === cat.name ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setSearchParams(activeCategory === cat.name ? {} : { category: cat.name })
                    }
                  >
                    {cat.icon} {cat.name.replace("অর্গানিক ", "")}
                  </Button>
                ))}

              <div className="mx-2 hidden h-8 w-px bg-border lg:block" />
              {[
                { label: "৳১০০ এর নিচে", value: "under100" },
                { label: "৳১০০ - ৳৩০০", value: "100to300" },
                { label: "৳৩০০ এর উপরে", value: "over300" },
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
                <X className="h-3 w-3" /> মুছুন
              </Button>
            )}
          </div>

          <p className="mb-4 text-sm text-muted-foreground">{filtered.length}টি পণ্য পাওয়া গেছে</p>

          {productsLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!productsLoading && filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg font-medium text-muted-foreground">কোনো পণ্য পাওয়া যায়নি</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                ফিল্টার মুছুন
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
