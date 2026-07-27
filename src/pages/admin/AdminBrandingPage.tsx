import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Facebook, Instagram, Youtube, Mail, MapPin, Megaphone } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

const KEYS = [
  "site_name",
  "logo_url",
  "footer_tagline",
  "social_facebook",
  "social_instagram",
  "social_youtube",
  "contact_email",
  "contact_address",
  "popup_enabled",
  "popup_image_url",
  "popup_link",
];

const AdminBrandingPage = () => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchAll = async () => {
    setLoading(true);
    const { data } = await supabase.from("site_settings").select("*").in("key", KEYS);
    const map: Record<string, string> = {};
    (data || []).forEach((r: any) => { map[r.key] = r.value || ""; });
    setValues(map);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const set = (k: string, v: string) => setValues((prev) => ({ ...prev, [k]: v }));

  const save = async () => {
    setSaving(true);
    const rows = KEYS.map((key) => ({ key, value: values[key] || "" }));
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); return; }
    toast({ title: "সফল", description: "ব্র্যান্ডিং সেটিংস সংরক্ষিত হয়েছে" });
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">লোড হচ্ছে...</div>;

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h2 className="text-xl font-display font-bold">ব্র্যান্ডিং ও ফুটার</h2>
        <p className="text-sm text-muted-foreground">সাইটের নাম, লোগো, সোশ্যাল লিঙ্ক ও ফুটার ম্যানেজ করুন</p>
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">সাইট পরিচয়</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>সাইটের নাম</Label>
            <Input value={values.site_name || ""} onChange={(e) => set("site_name", e.target.value)} placeholder="ফ্রেশ খান" />
          </div>
          <div className="space-y-1.5">
            <Label>লোগো</Label>
            <ImageUpload value={values.logo_url || ""} onChange={(u) => set("logo_url", u)} folder="branding" />
          </div>
          <div className="space-y-1.5">
            <Label>ফুটার ট্যাগলাইন</Label>
            <Textarea
              value={values.footer_tagline || ""}
              onChange={(e) => set("footer_tagline", e.target.value)}
              placeholder="কৃষক ও সার্টিফাইড বিক্রেতাদের কাছ থেকে সরাসরি অর্গানিক পণ্যের জন্য আপনার বিশ্বস্ত মার্কেটপ্লেস।"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">সোশ্যাল মিডিয়া লিঙ্ক</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2"><Facebook className="h-4 w-4" /> Facebook</Label>
            <Input value={values.social_facebook || ""} onChange={(e) => set("social_facebook", e.target.value)} placeholder="https://facebook.com/freshkhan" />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2"><Instagram className="h-4 w-4" /> Instagram</Label>
            <Input value={values.social_instagram || ""} onChange={(e) => set("social_instagram", e.target.value)} placeholder="https://instagram.com/freshkhan" />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2"><Youtube className="h-4 w-4" /> YouTube</Label>
            <Input value={values.social_youtube || ""} onChange={(e) => set("social_youtube", e.target.value)} placeholder="https://youtube.com/@freshkhan" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">যোগাযোগ তথ্য</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2"><Mail className="h-4 w-4" /> ইমেইল</Label>
            <Input value={values.contact_email || ""} onChange={(e) => set("contact_email", e.target.value)} placeholder="support@freshkhan.com" />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2"><MapPin className="h-4 w-4" /> ঠিকানা</Label>
            <Textarea value={values.contact_address || ""} onChange={(e) => set("contact_address", e.target.value)} placeholder="ঢাকা, বাংলাদেশ" rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Megaphone className="h-4 w-4" /> হোম পেজ পপআপ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch
              checked={values.popup_enabled === "true"}
              onCheckedChange={(v) => set("popup_enabled", v ? "true" : "false")}
            />
            <Label>পপআপ চালু করুন</Label>
          </div>
          <div className="space-y-1.5">
            <Label>পপআপ ছবি আপলোড</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 1024 * 1024) {
                  toast({ title: "ত্রুটি", description: "ছবির সাইজ ১MB এর কম হতে হবে", variant: "destructive" });
                  return;
                }
                const { data: { user } } = await supabase.auth.getUser();
                const path = `${user?.id}/popup/${Date.now()}-${file.name}`;
                const { error } = await supabase.storage.from("images").upload(path, file);
                if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); return; }
                const { data } = supabase.storage.from("images").getPublicUrl(path);
                set("popup_image_url", data.publicUrl);
                toast({ title: "সফল", description: "ছবি আপলোড হয়েছে" });
              }}
            />
            <Input
              value={values.popup_image_url || ""}
              onChange={(e) => set("popup_image_url", e.target.value)}
              placeholder="বা URL দিন"
              className="mt-2"
            />
            {values.popup_image_url && (
              <img src={values.popup_image_url} alt="popup preview" className="mt-2 max-h-48 rounded border border-border" />
            )}
          </div>
          <div className="space-y-1.5">
            <Label>ক্লিক লিঙ্ক (ঐচ্ছিক)</Label>
            <Input
              value={values.popup_link || ""}
              onChange={(e) => set("popup_link", e.target.value)}
              placeholder="/products বা https://..."
            />
            <p className="text-xs text-muted-foreground">ইউজার ছবিতে ক্লিক করলে এই লিঙ্কে যাবে</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end sticky bottom-4">
        <Button onClick={save} disabled={saving} size="lg" className="shadow-lg">
          <Save className="h-4 w-4 mr-1" /> {saving ? "সংরক্ষণ হচ্ছে..." : "সব পরিবর্তন সংরক্ষণ করুন"}
        </Button>
      </div>
    </div>
  );
};

export default AdminBrandingPage;
