import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { products } from "@/data/mockData";
import { Star, ShoppingCart, BadgeCheck, Minus, Plus, ArrowLeft, Store } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
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

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container py-8">
          <Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> পণ্যে ফিরে যান
          </Link>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Image */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                {product.organic && (
                  <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    <BadgeCheck className="h-3 w-3" /> সার্টিফাইড অর্গানিক
                  </span>
                )}
                <h1 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
                  {product.name}
                </h1>
                <Link to={`/vendors/${product.vendorId}`} className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                  <Store className="h-3.5 w-3.5" /> {product.vendor}
                </Link>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-organic-gold text-organic-gold" : "text-border"}`} />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount} রিভিউ)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-foreground">৳{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">৳{product.originalPrice}</span>
                )}
                <span className="text-muted-foreground">/ {product.unit}</span>
              </div>

              <p className="leading-relaxed text-muted-foreground">{product.description}</p>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-border">
                  <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQty(Math.max(1, qty - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{qty}</span>
                  <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQty(qty + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="hero" size="lg" className="flex-1 gap-2 rounded-full" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5" />
                  কার্টে যোগ করুন — ৳{product.price * qty}
                </Button>
              </div>

              {/* Stock */}
              <p className={`text-sm font-medium ${product.inStock ? "text-primary" : "text-destructive"}`}>
                {product.inStock ? "✓ স্টকে আছে" : "✕ স্টক নেই"}
              </p>
            </div>
          </div>

          {/* Related */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-bold text-foreground">আপনার পছন্দ হতে পারে</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((p) => (
                  <Link key={p.id} to={`/products/${p.id}`} className="group block overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-elevated">
                    <div className="aspect-square overflow-hidden">
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-card-foreground">{p.name}</h3>
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
