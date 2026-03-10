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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
}

interface Product {
  id: string;
  name: string;
}

const VendorCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [vendorId, setVendorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setName(""); setDescription(""); setDiscountType("percentage"); setDiscountValue("");
    setStartDate(""); setEndDate(""); setIsActive(true); setEditing(null); setSelectedProducts([]);
  };

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: vendor } = await supabase.from("vendors").select("id").eq("user_id", session.user.id).maybeSingle();
    if (!vendor) return;
    setVendorId(vendor.id);

    const [campaignsRes, productsRes] = await Promise.all([
      supabase.from("campaigns").select("*").eq("vendor_id", vendor.id).order("created_at", { ascending: false }),
      supabase.from("products").select("id, name").eq("vendor_id", vendor.id),
    ]);

    setCampaigns(campaignsRes.data || []);
    setProducts(productsRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = async (c: Campaign) => {
    setEditing(c);
    setName(c.name);
    setDescription(c.description || "");
    setDiscountType(c.discount_type);
    setDiscountValue(String(c.discount_value));
    setStartDate(c.start_date ? c.start_date.slice(0, 16) : "");
    setEndDate(c.end_date ? c.end_date.slice(0, 16) : "");
    setIsActive(c.is_active);

    const { data } = await supabase.from("campaign_products").select("product_id").eq("campaign_id", c.id);
    setSelectedProducts(data?.map(d => d.product_id) || []);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      start_date: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
      end_date: endDate ? new Date(endDate).toISOString() : null,
      is_active: isActive,
      vendor_id: vendorId,
    };

    let campaignId = editing?.id;
    let error;

    if (editing) {
      ({ error } = await supabase.from("campaigns").update(payload).eq("id", editing.id));
    } else {
      const res = await supabase.from("campaigns").insert(payload).select("id").single();
      error = res.error;
      campaignId = res.data?.id;
    }

    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
      return;
    }

    // Update campaign products
    if (campaignId) {
      await supabase.from("campaign_products").delete().eq("campaign_id", campaignId);
      if (selectedProducts.length > 0) {
        await supabase.from("campaign_products").insert(
          selectedProducts.map(pid => ({ campaign_id: campaignId!, product_id: pid }))
        );
      }
    }

    toast({ title: editing ? "ক্যাম্পেইন আপডেট হয়েছে" : "ক্যাম্পেইন তৈরি হয়েছে" });
    setDialogOpen(false);
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("campaigns").delete().eq("id", id);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "ক্যাম্পেইন মুছে ফেলা হয়েছে" });
      fetchData();
    }
  };

  const toggleProduct = (pid: string) => {
    setSelectedProducts(prev => prev.includes(pid) ? prev.filter(p => p !== pid) : [...prev, pid]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-foreground">ক্যাম্পেইন ও ডিসকাউন্ট</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="hero" size="sm"><Plus className="h-4 w-4 mr-1" /> নতুন ক্যাম্পেইন</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "ক্যাম্পেইন সম্পাদনা" : "নতুন ক্যাম্পেইন তৈরি করুন"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>ক্যাম্পেইনের নাম *</Label>
                <Input value={name} onChange={e => setName(e.target.value)} required placeholder="যেমন: ঈদ স্পেশাল অফার" />
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
                  <Input type="number" step="0.01" value={discountValue} onChange={e => setDiscountValue(e.target.value)} required placeholder={discountType === "percentage" ? "যেমন: 15" : "যেমন: 50"} />
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
              {products.length > 0 && (
                <div className="space-y-2">
                  <Label>প্রযোজ্য পণ্য নির্বাচন করুন</Label>
                  <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                    {products.map(p => (
                      <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox checked={selectedProducts.includes(p.id)} onCheckedChange={() => toggleProduct(p.id)} />
                        {p.name}
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">কোনো পণ্য নির্বাচন না করলে সব পণ্যে প্রযোজ্য হবে</p>
                </div>
              )}
              <Button type="submit" variant="hero" className="w-full">
                {editing ? "আপডেট করুন" : "ক্যাম্পেইন তৈরি করুন"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">লোড হচ্ছে...</div>
          ) : campaigns.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">কোনো ক্যাম্পেইন নেই। নতুন ক্যাম্পেইন তৈরি করুন।</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>নাম</TableHead>
                  <TableHead>ডিসকাউন্ট</TableHead>
                  <TableHead>সময়কাল</TableHead>
                  <TableHead>স্থিতি</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>
                      {c.discount_type === "percentage" ? `${c.discount_value}%` : `৳${c.discount_value}`}
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(c.start_date).toLocaleDateString("bn-BD")}
                      {c.end_date && ` - ${new Date(c.end_date).toLocaleDateString("bn-BD")}`}
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${c.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {c.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4" /></Button>
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

export default VendorCampaignsPage;
