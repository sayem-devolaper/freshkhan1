import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useProduct, useProducts } from "@/hooks/use-products";
import { Star, ShoppingCart, BadgeCheck, Minus, Plus, ArrowLeft, Store } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);
  const { data: allProducts } = useProducts();
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-background">
          <div className="container px-4 py-6 sm:py-8">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
              <Skeleton className="aspect-square rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="text-center">
            <p className="text-xl font-medium text-muted-foreground">পণ্য খুঁজে পাওয়া যায়নি</p>
            <Link to="/products">
              <Button variant="outline" className="mt-4">পণ্যে ফিরে যান</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} কার্টে যোগ হয়েছে`);
  };

  const relatedProducts = (allProducts || []).filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container px-4 py-6 sm:py-8">
          <Link to="/products" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground sm:mb-6">
            <ArrowLeft className="h-4 w-4" /> পণ্যে ফিরে যান
          </Link>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card sm:rounded-2xl">
              <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                {product.organic && (
                  <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary sm:mb-3">
                    <BadgeCheck className="h-3 w-3" /> সার্টিফাইড অর্গানিক
                  </span>
                )}
                <h1 className="mt-1 font-display text-2xl font-bold text-foreground sm:mt-2 sm:text-3xl lg:text-4xl">
                  {product.name}
                </h1>
                <Link to={`/vendors/${product.vendorId}`} className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline sm:mt-2">
                  <Store className="h-3.5 w-3.5" /> {product.vendor}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-organic-gold text-organic-gold" : "text-border"}`} />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount} রিভিউ)</span>
              </div>

              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="font-display text-2xl font-bold text-foreground sm:text-3xl">৳{product.price}</span>
                {product.originalPrice && (
                  <span className="text-base text-muted-foreground line-through sm:text-lg">৳{product.originalPrice}</span>
                )}
                <span className="text-sm text-muted-foreground">/ {product.unit}</span>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{product.description}</p>

              {/* Quantity + Add to Cart - stacks on small screens */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center rounded-lg border border-border self-start">
                  <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" onClick={() => setQty(Math.max(1, qty - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-medium sm:w-12">{qty}</span>
                  <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" onClick={() => setQty(qty + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="hero" size="lg" className="w-full gap-2 rounded-full sm:flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5" />
                  কার্টে যোগ করুন — ৳{product.price * qty}
                </Button>
              </div>

              <p className={`text-sm font-medium ${product.inStock ? "text-primary" : "text-destructive"}`}>
                {product.inStock ? "✓ স্টকে আছে" : "✕ স্টক নেই"}
              </p>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-12 sm:mt-16">
              <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">আপনার পছন্দ হতে পারে</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-6 lg:grid-cols-4">
                {relatedProducts.map((p) => (
                  <Link key={p.id} to={`/products/${p.id}`} className="group block overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-elevated">
                    <div className="aspect-square overflow-hidden">
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="text-sm font-semibold text-card-foreground line-clamp-2">{p.name}</h3>
                      <p className="mt-1 font-bold text-foreground">৳{p.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
