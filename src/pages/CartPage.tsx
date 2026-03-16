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
        <main className="flex flex-1 items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
            <h1 className="font-display text-2xl font-bold text-foreground">আপনার কার্ট খালি</h1>
            <p className="text-muted-foreground">পণ্য যোগ করতে শপিং শুরু করুন</p>
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
        <div className="container py-8">
          <Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> শপিং চালিয়ে যান
          </Link>

          <h1 className="font-display text-3xl font-bold text-foreground">আপনার কার্ট</h1>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-card">
                  <Link to={`/products/${product.id}`}>
                    <img src={product.image} alt={product.name} className="h-24 w-24 rounded-lg object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link to={`/products/${product.id}`} className="font-semibold text-card-foreground hover:text-primary">
                        {product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{product.vendor}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-border">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-bold text-foreground">৳{product.price * quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeFromCart(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={clearCart}>কার্ট খালি করুন</Button>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card h-fit space-y-4">
              <h2 className="font-display text-xl font-bold text-card-foreground">অর্ডার সারাংশ</h2>
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
              <Button variant="hero" size="lg" className="w-full rounded-full">
                চেকআউট — ৳{totalPrice}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
