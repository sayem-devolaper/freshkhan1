import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Truck, Smartphone, Banknote, CheckCircle2, Loader2 } from "lucide-react";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [trxId, setTrxId] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate("/login?redirect=/checkout");
    });
  }, [navigate]);

  // Group items by vendor
  const itemsByVendor: Record<string, typeof items> = {};
  items.forEach((item) => {
    const vid = item.product.vendorId;
    if (!itemsByVendor[vid]) itemsByVendor[vid] = [];
    itemsByVendor[vid].push(item);
  });

  const handlePlaceOrder = async () => {
    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      toast({ title: "সব তথ্য পূরণ করুন", description: "নাম, ফোন, ঠিকানা এবং শহর আবশ্যক", variant: "destructive" });
      return;
    }
    if ((paymentMethod === "bkash" || paymentMethod === "nagad") && !trxId.trim()) {
      toast({ title: "ট্রানজেকশন আইডি দিন", description: `${paymentMethod === "bkash" ? "বিকাশ" : "নগদ"} ট্রানজেকশন আইডি আবশ্যক`, variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const vendorIds = Object.keys(itemsByVendor);
      let lastOrderId = "";

      for (const vendorId of vendorIds) {
        const vendorItems = itemsByVendor[vendorId];
        const itemsPayload = vendorItems.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        }));

        const orderNotes = [
          notes,
          `নাম: ${fullName}, ফোন: ${phone}, ঠিকানা: ${address}, ${city}`,
          paymentMethod !== "cash_on_delivery" ? `TrxID: ${trxId}` : "",
        ].filter(Boolean).join(" | ");

        const { data, error } = await supabase.rpc("place_order", {
          p_vendor_id: vendorId,
          p_items: itemsPayload,
          p_payment_method: paymentMethod,
          p_notes: orderNotes,
        });

        if (error) throw error;
        lastOrderId = data;
      }

      setOrderId(lastOrderId);
      setOrderPlaced(true);
      clearCart();
    } catch (err: any) {
      toast({ title: "অর্ডার ব্যর্থ", description: err.message || "কিছু ভুল হয়েছে", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-background px-4">
          <div className="text-center space-y-4 max-w-md">
            <h1 className="font-display text-2xl font-bold text-foreground">আপনার কার্ট খালি</h1>
            <p className="text-muted-foreground">চেকআউট করতে প্রথমে কার্টে পণ্য যোগ করুন।</p>
            <Link to="/products">
              <Button variant="hero" className="rounded-full">পণ্য দেখুন</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-background px-4">
          <div className="text-center space-y-4 max-w-md">
            <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground">অর্ডার সফল হয়েছে! 🎉</h1>
            <p className="text-muted-foreground">
              আপনার অর্ডার গ্রহণ করা হয়েছে।
              {paymentMethod === "cash_on_delivery" && " ডেলিভারির সময় পেমেন্ট করুন।"}
              {paymentMethod === "bkash" && " বিকাশ পেমেন্ট যাচাই করা হবে।"}
              {paymentMethod === "nagad" && " নগদ পেমেন্ট যাচাই করা হবে।"}
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Link to="/products">
                <Button variant="outline" className="rounded-full">আরও শপিং করুন</Button>
              </Link>
              <Link to="/">
                <Button variant="hero" className="rounded-full">হোম পেজে যান</Button>
              </Link>
            </div>
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
        <div className="container px-4 py-6 sm:py-8 max-w-4xl">
          <Link to="/cart" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> কার্টে ফিরে যান
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl mb-6">চেকআউট</h1>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Left: Form */}
            <div className="lg:col-span-3 space-y-5">
              {/* Shipping Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" /> ডেলিভারি তথ্য
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">পুরো নাম *</Label>
                      <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="আপনার নাম" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">ফোন নম্বর *</Label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">সম্পূর্ণ ঠিকানা *</Label>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="বাড়ি, রোড, এলাকা" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">শহর / জেলা *</Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="ঢাকা" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">অতিরিক্ত নোট</Label>
                    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="বিশেষ নির্দেশনা (ঐচ্ছিক)" />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-primary" /> পেমেন্ট পদ্ধতি
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <label className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${paymentMethod === "cash_on_delivery" ? "border-primary bg-primary/5" : "border-border"}`}>
                      <RadioGroupItem value="cash_on_delivery" />
                      <Truck className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">ক্যাশ অন ডেলিভারি</p>
                        <p className="text-xs text-muted-foreground">পণ্য হাতে পেয়ে পেমেন্ট করুন</p>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${paymentMethod === "bkash" ? "border-primary bg-primary/5" : "border-border"}`}>
                      <RadioGroupItem value="bkash" />
                      <Smartphone className="h-5 w-5 text-pink-500" />
                      <div>
                        <p className="font-medium text-sm">বিকাশ</p>
                        <p className="text-xs text-muted-foreground">বিকাশে সেন্ড মানি করুন</p>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${paymentMethod === "nagad" ? "border-primary bg-primary/5" : "border-border"}`}>
                      <RadioGroupItem value="nagad" />
                      <Smartphone className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium text-sm">নগদ</p>
                        <p className="text-xs text-muted-foreground">নগদে সেন্ড মানি করুন</p>
                      </div>
                    </label>
                  </RadioGroup>

                  {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
                    <div className="mt-4 p-3 rounded-lg bg-muted/50 space-y-3">
                      <div className="text-sm space-y-1">
                        <p className="font-medium">
                          {paymentMethod === "bkash" ? "বিকাশ" : "নগদ"} নম্বর: <span className="text-primary font-bold">01XXXXXXXXX</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          উপরের নম্বরে ৳{totalPrice} সেন্ড মানি করুন এবং ট্রানজেকশন আইডি দিন
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">ট্রানজেকশন আইডি (TrxID) *</Label>
                        <Input value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="যেমন: ABC123XYZ" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">অর্ডার সারাংশ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-2 text-sm">
                      <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{quantity} × ৳{product.price}</p>
                      </div>
                      <span className="font-medium text-foreground whitespace-nowrap">৳{product.price * quantity}</span>
                    </div>
                  ))}

                  <div className="border-t border-border pt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">সাবটোটাল</span>
                      <span>৳{totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ডেলিভারি</span>
                      <span className="text-primary">ফ্রি</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
                      <span>মোট</span>
                      <span>৳{totalPrice}</span>
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full rounded-full mt-2"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> অর্ডার হচ্ছে...</>
                    ) : (
                      `অর্ডার দিন — ৳${totalPrice}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
