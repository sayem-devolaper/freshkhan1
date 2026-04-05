import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-background px-4">
          <div className="text-center space-y-4">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground sm:h-16 sm:w-16" />
            <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">আপনার কার্ট খালি</h1>
            <p className="text-sm text-muted-foreground">পণ্য যোগ করতে শপিং শুরু করুন</p>
            <Link to="/products">
              <Button variant="hero" className="rounded-full">পণ্য দেখুন</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container px-4 py-6 sm:py-8">
          <Link to="/products" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground sm:mb-6">
            <ArrowLeft className="h-4 w-4" /> শপিং চালিয়ে যান
          </Link>

          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">আপনার কার্ট</h1>

          <div className="mt-6 grid gap-6 lg:grid-cols-3 sm:mt-8 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-card sm:gap-4 sm:p-4">
                  <Link to={`/products/${product.id}`}>
                    <img src={product.image} alt={product.name} className="h-20 w-20 rounded-lg object-cover sm:h-24 sm:w-24" />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <Link to={`/products/${product.id}`} className="font-semibold text-card-foreground hover:text-primary text-sm sm:text-base line-clamp-2">
                        {product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{product.vendor}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2 sm:justify-between">
                      <div className="flex items-center rounded-lg border border-border">
                        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => updateQuantity(product.id, quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-xs font-medium sm:w-8 sm:text-sm">{quantity}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => updateQuantity(product.id, quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-bold text-foreground text-sm sm:text-base">৳{product.price * quantity}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive sm:h-8 sm:w-8" onClick={() => removeFromCart(product.id)}>
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={clearCart}>কার্ট খালি করুন</Button>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-card h-fit space-y-4 sm:p-6">
              <h2 className="font-display text-lg font-bold text-card-foreground sm:text-xl">অর্ডার সারাংশ</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">সাবটোটাল</span>
                  <span className="font-medium text-foreground">৳{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ডেলিভারি</span>
                  <span className="font-medium text-primary">ফ্রি</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between text-base">
                  <span className="font-bold text-foreground">মোট</span>
                  <span className="font-bold text-foreground">৳{totalPrice}</span>
                </div>
              </div>
              <Link to="/checkout">
                <Button variant="hero" size="lg" className="w-full rounded-full">
                  চেকআউট — ৳{totalPrice}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
