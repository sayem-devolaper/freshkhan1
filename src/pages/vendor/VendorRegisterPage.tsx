import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Store, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VendorRegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "ত্রুটি", description: "পাসওয়ার্ড মিলছে না", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "ত্রুটি", description: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });
      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("User creation failed");

      // 2. Add vendor role via security definer function
      await supabase.rpc("register_as_vendor", { _user_id: userId });

      // 3. Create vendor store
      const { error: vendorError } = await supabase.from("vendors").insert({
        user_id: userId,
        store_name: storeName.trim(),
        description: storeDescription.trim() || null,
        address: address.trim() || null,
        phone: phone.trim() ? `+88${phone.trim()}` : null,
      });
      if (vendorError) throw vendorError;

      toast({
        title: "রেজিস্ট্রেশন সফল!",
        description: "আপনার ভেন্ডর অ্যাকাউন্ট তৈরি হয়েছে। অ্যাডমিন অনুমোদনের অপেক্ষায়।",
      });
      navigate("/vendor/login");
    } catch (error: any) {
      toast({
        title: "রেজিস্ট্রেশন ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <Link to="/" className="mx-auto flex items-center gap-2">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
          </Link>
          <div>
            <CardTitle className="text-2xl font-display">ভেন্ডর রেজিস্ট্রেশন</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              আপনার দোকান তৈরি করুন এবং পণ্য বিক্রি শুরু করুন
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">পূর্ণ নাম *</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="আপনার নাম" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">ফোন নম্বর</Label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 border border-input rounded-md bg-muted text-sm text-muted-foreground">+88</div>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))} placeholder="01XXXXXXXXX" maxLength={11} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল *</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeName">দোকানের নাম *</Label>
              <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="আপনার দোকানের নাম" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeDescription">দোকানের বিবরণ</Label>
              <Textarea id="storeDescription" value={storeDescription} onChange={(e) => setStoreDescription(e.target.value)} placeholder="আপনার দোকান সম্পর্কে কিছু লিখুন..." rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">ঠিকানা</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="আপনার ঠিকানা" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">পাসওয়ার্ড *</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="কমপক্ষে ৬ অক্ষর" required minLength={6} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন *</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="পাসওয়ার্ড আবার লিখুন" required />
              </div>
            </div>

            <Button type="submit" variant="hero" className="w-full rounded-lg" disabled={loading}>
              <Store className="w-4 h-4" />
              {loading ? "রেজিস্টার হচ্ছে..." : "ভেন্ডর রেজিস্টার করুন"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ইতোমধ্যে ভেন্ডর অ্যাকাউন্ট আছে?{" "}
            <Link to="/vendor/login" className="text-primary font-medium hover:underline">লগইন করুন</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorRegisterPage;
