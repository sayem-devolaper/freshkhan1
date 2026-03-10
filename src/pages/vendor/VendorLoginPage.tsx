import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, LogIn, Eye, EyeOff, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VendorLoginPage = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent, method: "email" | "phone") => {
    e.preventDefault();
    setLoading(true);

    try {
      const credentials = method === "email"
        ? { email: email.trim(), password }
        : { phone: phone.trim().startsWith("+") ? phone.trim() : `+88${phone.trim()}`, password };

      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;

      // Verify vendor role
      const { data: vendor } = await supabase
        .from("vendors")
        .select("id, is_approved, is_suspended")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (!vendor) {
        await supabase.auth.signOut();
        throw new Error("আপনার ভেন্ডর অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে ভেন্ডর হিসেবে রেজিস্টার করুন।");
      }

      if (vendor.is_suspended) {
        await supabase.auth.signOut();
        throw new Error("আপনার ভেন্ডর অ্যাকাউন্ট স্থগিত করা হয়েছে।");
      }

      if (!vendor.is_approved) {
        await supabase.auth.signOut();
        throw new Error("আপনার ভেন্ডর অ্যাকাউন্ট এখনো অনুমোদিত হয়নি। অ্যাডমিন অনুমোদনের অপেক্ষায়।");
      }

      toast({ title: "সফল!", description: "ভেন্ডর ড্যাশবোর্ডে স্বাগতম" });
      navigate("/vendor/dashboard");
    } catch (error: any) {
      toast({
        title: "লগইন ব্যর্থ",
        description: error.message === "Invalid login credentials" ? "ইমেইল/ফোন বা পাসওয়ার্ড ভুল" : error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const PasswordField = () => (
    <div className="space-y-2">
      <Label htmlFor="password">পাসওয়ার্ড</Label>
      <div className="relative">
        <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <Link to="/" className="mx-auto flex items-center gap-2">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
          </Link>
          <div>
            <CardTitle className="text-2xl font-display">ভেন্ডর লগইন</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">আপনার দোকান পরিচালনা করুন</p>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="email" className="flex items-center gap-2"><Mail className="h-4 w-4" /> ইমেইল</TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" /> ফোন নম্বর</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={(e) => handleLogin(e, "email")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">ইমেইল</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
                </div>
                <PasswordField />
                <Button type="submit" variant="hero" className="w-full rounded-lg" disabled={loading}>
                  <LogIn className="w-4 h-4" /> {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="phone">
              <form onSubmit={(e) => handleLogin(e, "phone")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">ফোন নম্বর</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 border border-input rounded-md bg-muted text-sm text-muted-foreground">+88</div>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))} placeholder="01XXXXXXXXX" required maxLength={11} />
                  </div>
                </div>
                <PasswordField />
                <Button type="submit" variant="hero" className="w-full rounded-lg" disabled={loading}>
                  <LogIn className="w-4 h-4" /> {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ভেন্ডর অ্যাকাউন্ট নেই?{" "}
            <Link to="/vendor/register" className="text-primary font-medium hover:underline">রেজিস্টার করুন</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorLoginPage;
