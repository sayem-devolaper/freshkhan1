import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
}

const VendorPromoCodesPage = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [vendorId, setVendorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PromoCode | null>(null);
  const { toast } = useToast();

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setCode(""); setDescription(""); setDiscountType("percentage"); setDiscountValue("");
    setMinOrderAmount(""); setMaxUses(""); setStartDate(""); setEndDate(""); setIsActive(true); setEditing(null);
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "FK-";
    for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setCode(result);
  };

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: vendor } = await supabase.from("vendors").select("id").eq("user_id", session.user.id).maybeSingle();
    if (!vendor) return;
    setVendorId(vendor.id);

    const { data } = await supabase.from("promo_codes").select("*").eq("vendor_id", vendor.id).order("created_at", { ascending: false });
    setPromoCodes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = (p: PromoCode) => {
    setEditing(p);
    setCode(p.code);
    setDescription(p.description || "");
    setDiscountType(p.discount_type);
    setDiscountValue(String(p.discount_value));
    setMinOrderAmount(p.min_order_amount ? String(p.min_order_amount) : "");
    setMaxUses(p.max_uses ? String(p.max_uses) : "");
    setStartDate(p.start_date ? p.start_date.slice(0, 16) : "");
    setEndDate(p.end_date ? p.end_date.slice(0, 16) : "");
    setIsActive(p.is_active);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code: code.trim().toUpperCase(),
      description: description.trim() || null,
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      min_order_amount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
      max_uses: maxUses ? parseInt(maxUses) : null,
      start_date: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
      end_date: endDate ? new Date(endDate).toISOString() : null,
      is_active: isActive,
      vendor_id: vendorId,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from("promo_codes").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("promo_codes").insert(payload));
    }

    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editing ? "প্রোমো কোড আপডেট হয়েছে" : "প্রোমো কোড তৈরি হয়েছে" });
      setDialogOpen(false);
      resetForm();
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("promo_codes").delete().eq("id", id);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "প্রোমো কোড মুছে ফেলা হয়েছে" });
      fetchData();
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "কোড কপি হয়েছে" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-foreground">প্রোমো কোড</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="hero" size="sm"><Plus className="h-4 w-4 mr-1" /> নতুন প্রোমো কোড</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "প্রোমো কোড সম্পাদনা" : "নতুন প্রোমো কোড তৈরি করুন"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>প্রোমো কোড *</Label>
                <div className="flex gap-2">
                  <Input value={code} onChange={e => setCode(e.target.value.toUpperCase())} required placeholder="যেমন: EID2026" className="flex-1" />
                  <Button type="button" variant="outline" size="sm" onClick={generateCode}>অটো তৈরি</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>বিবরণ</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ডিসকাউন্ট ধরন *</Label>
                  <Select value={discountType} onValueChange={setDiscountType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">শতাংশ (%)</SelectItem>
                      <SelectItem value="fixed">নির্দিষ্ট পরিমাণ (৳)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ডিসকাউন্ট মান *</Label>
                  <Input type="number" step="0.01" value={discountValue} onChange={e => setDiscountValue(e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>সর্বনিম্ন অর্ডার (৳)</Label>
                  <Input type="number" step="0.01" value={minOrderAmount} onChange={e => setMinOrderAmount(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>সর্বোচ্চ ব্যবহার</Label>
                  <Input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)} placeholder="সীমাহীন" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>শুরুর তারিখ</Label>
                  <Input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>শেষ তারিখ</Label>
                  <Input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <Label>সক্রিয়</Label>
              </div>
              <Button type="submit" variant="hero" className="w-full">
                {editing ? "আপডেট করুন" : "প্রোমো কোড তৈরি করুন"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">লোড হচ্ছে...</div>
          ) : promoCodes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">কোনো প্রোমো কোড নেই। নতুন প্রোমো কোড তৈরি করুন।</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>কোড</TableHead>
                  <TableHead>ডিসকাউন্ট</TableHead>
                  <TableHead>ব্যবহার</TableHead>
                  <TableHead>স্থিতি</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promoCodes.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <code className="bg-muted px-2 py-0.5 rounded text-sm font-mono">{p.code}</code>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCode(p.code)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {p.discount_type === "percentage" ? `${p.discount_value}%` : `৳${p.discount_value}`}
                    </TableCell>
                    <TableCell>{p.used_count}{p.max_uses ? `/${p.max_uses}` : ""}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${p.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {p.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorPromoCodesPage;
