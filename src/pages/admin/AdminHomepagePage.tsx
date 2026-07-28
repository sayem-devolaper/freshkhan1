import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit, Save, X, Star, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageUpload from "@/components/admin/ImageUpload";

/* ───── Hero Banners ───── */
function HeroBannersTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { toast } = useToast();

  const fetch_ = async () => {
    setLoading(true);
    const { data } = await supabase.from("hero_banners").select("*").order("sort_order");
    setItems(data || []);
    setLoading(false);
  };
  useEffect(() => { fetch_(); }, []);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const row = {
      title: fd.get("title") as string,
      subtitle: fd.get("subtitle") as string,
      description: fd.get("description") as string,
      image_url: fd.get("image_url") as string,
      button_text: fd.get("button_text") as string,
      button_link: fd.get("button_link") as string,
      title_color: fd.get("title_color") as string,
      subtitle_color: fd.get("subtitle_color") as string,
      description_color: fd.get("description_color") as string,
      title_size: fd.get("title_size") as string,
      subtitle_size: fd.get("subtitle_size") as string,
      description_size: fd.get("description_size") as string,
      sort_order: Number(fd.get("sort_order") || 0),
      is_active: editing?.is_active ?? true,
    };
    const { error } = editing?.id
      ? await supabase.from("hero_banners").update(row as any).eq("id", editing.id)
      : await supabase.from("hero_banners").insert(row as any);
    if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); return; }
    toast({ title: "সফল" });
    setDialogOpen(false);
    setEditing(null);
    fetch_();
  };

  const del = async (id: string) => {
    await supabase.from("hero_banners").delete().eq("id", id);
    toast({ title: "মুছে ফেলা হয়েছে" });
    fetch_();
  };

  const toggle = async (id: string, val: boolean) => {
    await supabase.from("hero_banners").update({ is_active: val } as any).eq("id", id);
    fetch_();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-foreground">হিরো ব্যানার</h3>
        <Button size="sm" onClick={() => { setEditing({}); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-1" /> নতুন</Button>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>শিরোনাম</TableHead><TableHead>সাবটাইটেল</TableHead><TableHead>ক্রম</TableHead><TableHead>সক্রিয়</TableHead><TableHead>অ্যাকশন</TableHead></TableRow></TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{item.subtitle?.slice(0, 40)}</TableCell>
              <TableCell>{item.sort_order}</TableCell>
              <TableCell><Switch checked={item.is_active} onCheckedChange={(v) => toggle(item.id, v)} /></TableCell>
              <TableCell className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditing(item); setDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => del(item.id)}><Trash2 className="h-4 w-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
          {!loading && items.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">কোনো ব্যানার নেই</TableCell></TableRow>}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "ব্যানার এডিট" : "নতুন ব্যানার"}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3">
            <div><Label>শিরোনাম *</Label><Input name="title" defaultValue={editing?.title} required className="border-2 border-primary" /></div>
            <div><Label>সাবটাইটেল</Label><Input name="subtitle" defaultValue={editing?.subtitle} className="border-2 border-primary" /></div>
            <ImageUpload name="image_url" value={editing?.image_url || ""} onChange={() => {}} folder="hero" label="ছবি" />

            <div className="grid grid-cols-2 gap-3">
              <div><Label>বাটন টেক্সট</Label><Input name="button_text" defaultValue={editing?.button_text} className="border-2 border-primary" /></div>
              <div><Label>বাটন লিংক</Label><Input name="button_link" defaultValue={editing?.button_link} className="border-2 border-primary" /></div>
            </div>
            <div><Label>ক্রম</Label><Input name="sort_order" type="number" defaultValue={editing?.sort_order || 0} className="border-2 border-primary" /></div>
            <Button type="submit" className="w-full"><Save className="h-4 w-4 mr-1" /> সংরক্ষণ</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ───── Promo Banners ───── */
function PromoBannersTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { toast } = useToast();

  const fetch_ = async () => {
    setLoading(true);
    const { data } = await supabase.from("promo_banners").select("*").order("sort_order");
    setItems(data || []);
    setLoading(false);
  };
  useEffect(() => { fetch_(); }, []);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const row = {
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      image_url: fd.get("image_url") as string,
      button_text: fd.get("button_text") as string,
      button_link: fd.get("button_link") as string,
      bg_color: fd.get("bg_color") as string || "#16a34a",
      sort_order: Number(fd.get("sort_order") || 0),
      is_active: editing?.is_active ?? true,
    };
    const { error } = editing?.id
      ? await supabase.from("promo_banners").update(row as any).eq("id", editing.id)
      : await supabase.from("promo_banners").insert(row as any);
    if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); return; }
    toast({ title: "সফল" });
    setDialogOpen(false);
    setEditing(null);
    fetch_();
  };

  const del = async (id: string) => {
    await supabase.from("promo_banners").delete().eq("id", id);
    toast({ title: "মুছে ফেলা হয়েছে" });
    fetch_();
  };

  const toggle = async (id: string, val: boolean) => {
    await supabase.from("promo_banners").update({ is_active: val } as any).eq("id", id);
    fetch_();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-foreground">প্রোমো ব্যানার</h3>
        <Button size="sm" onClick={() => { setEditing({}); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-1" /> নতুন</Button>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>শিরোনাম</TableHead><TableHead>বিবরণ</TableHead><TableHead>সক্রিয়</TableHead><TableHead>অ্যাকশন</TableHead></TableRow></TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{item.description?.slice(0, 40)}</TableCell>
              <TableCell><Switch checked={item.is_active} onCheckedChange={(v) => toggle(item.id, v)} /></TableCell>
              <TableCell className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditing(item); setDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => del(item.id)}><Trash2 className="h-4 w-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
          {!loading && items.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">কোনো প্রোমো নেই</TableCell></TableRow>}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "প্রোমো এডিট" : "নতুন প্রোমো"}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3">
            <div><Label>শিরোনাম *</Label><Input name="title" defaultValue={editing?.title} required className="border-2 border-primary" /></div>
            <div><Label>বিবরণ</Label><Textarea name="description" defaultValue={editing?.description} className="border-2 border-primary" /></div>
            <ImageUpload name="image_url" value={editing?.image_url || ""} onChange={() => {}} folder="promo" label="ছবি" />
            <div className="grid grid-cols-2 gap-3">
              <div><Label>বাটন টেক্সট</Label><Input name="button_text" defaultValue={editing?.button_text} className="border-2 border-primary" /></div>
              <div><Label>বাটন লিংক</Label><Input name="button_link" defaultValue={editing?.button_link} className="border-2 border-primary" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>ব্যাকগ্রাউন্ড কালার</Label><Input name="bg_color" defaultValue={editing?.bg_color || "#16a34a"} className="border-2 border-primary" /></div>
              <div><Label>ক্রম</Label><Input name="sort_order" type="number" defaultValue={editing?.sort_order || 0} className="border-2 border-primary" /></div>
            </div>
            <Button type="submit" className="w-full"><Save className="h-4 w-4 mr-1" /> সংরক্ষণ</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ───── Testimonials ───── */
function TestimonialsTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { toast } = useToast();

  const fetch_ = async () => {
    setLoading(true);
    const { data } = await supabase.from("homepage_testimonials").select("*").order("sort_order");
    setItems(data || []);
    setLoading(false);
  };
  useEffect(() => { fetch_(); }, []);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const row = {
      name: fd.get("name") as string,
      text: fd.get("text") as string,
      rating: Number(fd.get("rating") || 5),
      avatar: fd.get("avatar") as string,
      sort_order: Number(fd.get("sort_order") || 0),
      is_active: editing?.is_active ?? true,
    };
    const { error } = editing?.id
      ? await supabase.from("homepage_testimonials").update(row as any).eq("id", editing.id)
      : await supabase.from("homepage_testimonials").insert(row as any);
    if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); return; }
    toast({ title: "সফল" });
    setDialogOpen(false);
    setEditing(null);
    fetch_();
  };

  const del = async (id: string) => {
    await supabase.from("homepage_testimonials").delete().eq("id", id);
    toast({ title: "মুছে ফেলা হয়েছে" });
    fetch_();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-foreground">টেস্টিমোনিয়াল</h3>
        <Button size="sm" onClick={() => { setEditing({}); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-1" /> নতুন</Button>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>নাম</TableHead><TableHead>মন্তব্য</TableHead><TableHead>রেটিং</TableHead><TableHead>সক্রিয়</TableHead><TableHead>অ্যাকশন</TableHead></TableRow></TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{item.text?.slice(0, 40)}...</TableCell>
              <TableCell><span className="flex gap-0.5">{Array.from({ length: item.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-organic-gold text-organic-gold" />)}</span></TableCell>
              <TableCell><Switch checked={item.is_active} onCheckedChange={async (v) => { await supabase.from("homepage_testimonials").update({ is_active: v } as any).eq("id", item.id); fetch_(); }} /></TableCell>
              <TableCell className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditing(item); setDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => del(item.id)}><Trash2 className="h-4 w-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
          {!loading && items.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">কোনো টেস্টিমোনিয়াল নেই</TableCell></TableRow>}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "টেস্টিমোনিয়াল এডিট" : "নতুন টেস্টিমোনিয়াল"}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3">
            <div><Label>নাম *</Label><Input name="name" defaultValue={editing?.name} required className="border-2 border-primary" /></div>
            <div><Label>মন্তব্য *</Label><Textarea name="text" defaultValue={editing?.text} required className="border-2 border-primary" /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>রেটিং (1-5)</Label><Input name="rating" type="number" min={1} max={5} defaultValue={editing?.rating || 5} className="border-2 border-primary" /></div>
              <div><Label>অবতার</Label><Input name="avatar" defaultValue={editing?.avatar} placeholder="ফআ" className="border-2 border-primary" /></div>
              <div><Label>ক্রম</Label><Input name="sort_order" type="number" defaultValue={editing?.sort_order || 0} className="border-2 border-primary" /></div>
            </div>
            <Button type="submit" className="w-full"><Save className="h-4 w-4 mr-1" /> সংরক্ষণ</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ───── Categories ───── */
function CategoriesTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { toast } = useToast();

  const fetch_ = async () => {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("name");
    setItems(data || []);
    setLoading(false);
  };
  useEffect(() => { fetch_(); }, []);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string).trim();
    const slug = (fd.get("slug") as string).trim() || name.toLowerCase().replace(/\s+/g, "-");
    const icon = (fd.get("icon") as string).trim() || "📦";
    const row = { name, slug, icon };
    const { error } = editing?.id
      ? await supabase.from("categories").update(row as any).eq("id", editing.id)
      : await supabase.from("categories").insert(row as any);
    if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); return; }
    toast({ title: "সফল" });
    setDialogOpen(false);
    setEditing(null);
    fetch_();
  };

  const del = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); return; }
    toast({ title: "মুছে ফেলা হয়েছে" });
    fetch_();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-foreground">ক্যাটাগরি</h3>
        <Button size="sm" onClick={() => { setEditing({}); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-1" /> নতুন ক্যাটাগরি</Button>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>আইকন</TableHead><TableHead>নাম</TableHead><TableHead>স্লাগ</TableHead><TableHead>অ্যাকশন</TableHead></TableRow></TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              <TableCell className="text-2xl">{item.icon || "📦"}</TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{item.slug}</TableCell>
              <TableCell className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditing(item); setDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => del(item.id)}><Trash2 className="h-4 w-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
          {!loading && items.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">কোনো ক্যাটাগরি নেই</TableCell></TableRow>}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "ক্যাটাগরি এডিট" : "নতুন ক্যাটাগরি"}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3">
            <div><Label>নাম *</Label><Input name="name" defaultValue={editing?.name} required className="border-2 border-primary" /></div>
            <div><Label>স্লাগ</Label><Input name="slug" defaultValue={editing?.slug} placeholder="auto-generated" className="border-2 border-primary" /></div>
            <div><Label>আইকন (ইমোজি)</Label><Input name="icon" defaultValue={editing?.icon || "📦"} className="border-2 border-primary" /></div>
            <Button type="submit" className="w-full"><Save className="h-4 w-4 mr-1" /> সংরক্ষণ</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ───── Featured Items ───── */
function FeaturedItemsTab() {
  const [items, setItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemType, setItemType] = useState("product");
  const [selectedId, setSelectedId] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const { toast } = useToast();

  const fetch_ = async () => {
    setLoading(true);
    const { data } = await supabase.from("featured_items").select("*").order("sort_order");
    const { data: prods } = await supabase.from("products").select("id, name").eq("is_approved", true);
    const { data: vends } = await supabase.from("vendors").select("id, store_name").eq("is_approved", true);
    setItems(data || []);
    setProducts(prods || []);
    setVendors(vends || []);
    setLoading(false);
  };
  useEffect(() => { fetch_(); }, []);

  const save = async () => {
    if (!selectedId) return;
    const { error } = await supabase.from("featured_items").insert({ item_type: itemType, item_id: selectedId, sort_order: sortOrder } as any);
    if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); return; }
    toast({ title: "সফল" });
    setDialogOpen(false);
    setSelectedId("");
    fetch_();
  };

  const del = async (id: string) => {
    await supabase.from("featured_items").delete().eq("id", id);
    toast({ title: "মুছে ফেলা হয়েছে" });
    fetch_();
  };

  const toggle = async (id: string, val: boolean) => {
    await supabase.from("featured_items").update({ is_active: val } as any).eq("id", id);
    fetch_();
  };

  const getItemName = (item: any) => {
    if (item.item_type === "product") {
      return products.find(p => p.id === item.item_id)?.name || item.item_id;
    }
    return vendors.find(v => v.id === item.item_id)?.store_name || item.item_id;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-foreground">ফিচার্ড আইটেম</h3>
        <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" /> নতুন</Button>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>ধরন</TableHead><TableHead>আইটেম</TableHead><TableHead>ক্রম</TableHead><TableHead>সক্রিয়</TableHead><TableHead>অ্যাকশন</TableHead></TableRow></TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.item_type === "product" ? "পণ্য" : "ভেন্ডর"}</TableCell>
              <TableCell className="font-medium">{getItemName(item)}</TableCell>
              <TableCell>{item.sort_order}</TableCell>
              <TableCell><Switch checked={item.is_active} onCheckedChange={(v) => toggle(item.id, v)} /></TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => del(item.id)}><Trash2 className="h-4 w-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
          {!loading && items.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">কোনো ফিচার্ড আইটেম নেই</TableCell></TableRow>}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>নতুন ফিচার্ড আইটেম</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>ধরন</Label>
              <Select value={itemType} onValueChange={(v) => { setItemType(v); setSelectedId(""); }}>
                <SelectTrigger className="border-2 border-primary"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">পণ্য</SelectItem>
                  <SelectItem value="vendor">ভেন্ডর</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>আইটেম নির্বাচন</Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger className="border-2 border-primary"><SelectValue placeholder="নির্বাচন করুন" /></SelectTrigger>
                <SelectContent>
                  {(itemType === "product" ? products : vendors).map(i => (
                    <SelectItem key={i.id} value={i.id}>{itemType === "product" ? i.name : i.store_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div><Label>ক্রম</Label><Input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className="border-2 border-primary" /></div>
            <Button onClick={save} className="w-full"><Save className="h-4 w-4 mr-1" /> সংরক্ষণ</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ───── Site Settings ───── */
function SiteSettingsTab() {
  const [phone, setPhone] = useState("");
  const [bkash, setBkash] = useState("");
  const [nagad, setNagad] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["support_phone", "bkash_number", "nagad_number", "payment_instructions"]);
      const map = Object.fromEntries((data || []).map((r: any) => [r.key, r.value || ""]));
      setPhone(map.support_phone || "");
      setBkash(map.bkash_number || "");
      setNagad(map.nagad_number || "");
      setInstructions(map.payment_instructions || "");
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const rows = [
      { key: "support_phone", value: phone.trim() },
      { key: "bkash_number", value: bkash.trim() },
      { key: "nagad_number", value: nagad.trim() },
      { key: "payment_instructions", value: instructions.trim() },
    ];
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "সফলভাবে সংরক্ষিত হয়েছে" });
  };

  if (loading) return <p className="text-sm text-muted-foreground">লোড হচ্ছে...</p>;

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <Label htmlFor="support_phone">২৪/৭ সাপোর্ট নম্বর</Label>
        <Input
          id="support_phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="০১৭XX-XXXXXX"
          className="border-2 border-primary mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">হেডারে "২৪/৭ সাপোর্ট" সেকশনে দেখা যাবে।</p>
      </div>

      <div className="border-t border-border pt-4 space-y-4">
        <h4 className="font-semibold text-foreground">পেমেন্ট সেটিংস</h4>

        <div>
          <Label htmlFor="bkash_number">বিকাশ নম্বর (Send Money)</Label>
          <Input
            id="bkash_number"
            value={bkash}
            onChange={(e) => setBkash(e.target.value)}
            placeholder="01XXXXXXXXX"
            className="border-2 border-primary mt-1"
          />
        </div>

        <div>
          <Label htmlFor="nagad_number">নগদ নম্বর (Send Money)</Label>
          <Input
            id="nagad_number"
            value={nagad}
            onChange={(e) => setNagad(e.target.value)}
            placeholder="01XXXXXXXXX"
            className="border-2 border-primary mt-1"
          />
        </div>

        <div>
          <Label htmlFor="payment_instructions">পেমেন্ট নির্দেশনা</Label>
          <Textarea
            id="payment_instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={2}
            className="border-2 border-primary mt-1"
            placeholder="কাস্টমার চেকআউটে কী দেখবেন তা লিখুন"
          />
        </div>
      </div>

      <Button onClick={save} disabled={saving}>
        <Save className="h-4 w-4 mr-1" /> {saving ? "সংরক্ষণ হচ্ছে..." : "সব সংরক্ষণ করুন"}
      </Button>
    </div>
  );
}

/* ───── Main Page ───── */
const AdminHomepagePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-foreground">হোম পেজ কন্টেন্ট</h1>
      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="hero">হিরো ব্যানার</TabsTrigger>
          <TabsTrigger value="promo">প্রোমো ব্যানার</TabsTrigger>
          <TabsTrigger value="categories">ক্যাটাগরি</TabsTrigger>
          <TabsTrigger value="testimonials">টেস্টিমোনিয়াল</TabsTrigger>
          <TabsTrigger value="featured">ফিচার্ড আইটেম</TabsTrigger>
          <TabsTrigger value="settings">সাইট সেটিংস</TabsTrigger>
        </TabsList>
        <TabsContent value="hero"><Card><CardContent className="pt-6"><HeroBannersTab /></CardContent></Card></TabsContent>
        <TabsContent value="promo"><Card><CardContent className="pt-6"><PromoBannersTab /></CardContent></Card></TabsContent>
        <TabsContent value="categories"><Card><CardContent className="pt-6"><CategoriesTab /></CardContent></Card></TabsContent>
        <TabsContent value="testimonials"><Card><CardContent className="pt-6"><TestimonialsTab /></CardContent></Card></TabsContent>
        <TabsContent value="featured"><Card><CardContent className="pt-6"><FeaturedItemsTab /></CardContent></Card></TabsContent>
        <TabsContent value="settings"><Card><CardContent className="pt-6"><SiteSettingsTab /></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHomepagePage;
