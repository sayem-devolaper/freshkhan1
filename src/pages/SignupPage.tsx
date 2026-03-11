import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, UserPlus, Eye, EyeOff, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SignupPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validate = () => {
    if (password !== confirmPassword) {
      toast({ title: "ত্রুটি", description: "পাসওয়ার্ড মিলছে না", variant: "destructive" });
      return false;
    }
    if (password.length < 6) {
      toast({ title: "ত্রুটি", description: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent, method: "email" | "phone") => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const credentials = method === "email"
        ? {
            email: email.trim(),
            password,
            options: {
              data: { full_name: fullName.trim() },
              emailRedirectTo: window.location.origin,
            },
          }
        : {
            phone: phone.trim().startsWith("+") ? phone.trim() : `+88${phone.trim()}`,
            password,
            options: {
              data: { full_name: fullName.trim() },
            },
          };

      const { error } = await supabase.auth.signUp(credentials);
      if (error) throw error;

      toast({
        title: "রেজিস্ট্রেশন সফল!",
        description: "আপনার অ্যাকাউন্ট তৈরি হয়েছে। স্বাগতম!",
      });
      navigate("/");
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

  const passwordFields = (
    <>
      <div className="space-y-2">
        <Label htmlFor="password">পাসওয়ার্ড</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="কমপক্ষে ৬ অক্ষর"
            required
            minLength={6}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="পাসওয়ার্ড আবার লিখুন"
          required
        />
      </div>
    </>
  );

  const nameField = (
    <div className="space-y-2">
      <Label htmlFor="fullName">পূর্ণ নাম</Label>
      <Input
        id="fullName"
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="আপনার নাম"
        required
        maxLength={100}
      />
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
            <CardTitle className="text-2xl font-display">অ্যাকাউন্ট তৈরি করুন</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              ফ্রেশ খান-এ আপনাকে স্বাগতম
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> ইমেইল
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> ফোন নম্বর
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={(e) => handleSignup(e, "email")} className="space-y-4">
                {nameField}
                <div className="space-y-2">
                  <Label htmlFor="email">ইমেইল</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    maxLength={255}
                  />
                </div>
                {passwordFields}
                <Button type="submit" variant="hero" className="w-full rounded-lg" disabled={loading}>
                  <UserPlus className="w-4 h-4" />
                  {loading ? "রেজিস্টার হচ্ছে..." : "রেজিস্টার করুন"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="phone">
              <form onSubmit={(e) => handleSignup(e, "phone")} className="space-y-4">
                {nameField}
                <div className="space-y-2">
                  <Label htmlFor="phone">ফোন নম্বর</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 border border-input rounded-md bg-muted text-sm text-muted-foreground">
                      +88
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="01XXXXXXXXX"
                      required
                      maxLength={11}
                    />
                  </div>
                </div>
                <PasswordFields />
                <Button type="submit" variant="hero" className="w-full rounded-lg" disabled={loading}>
                  <UserPlus className="w-4 h-4" />
                  {loading ? "রেজিস্টার হচ্ছে..." : "রেজিস্টার করুন"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ইতোমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              লগইন করুন
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
