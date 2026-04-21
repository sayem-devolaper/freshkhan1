import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, ImagePlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  stock: number;
  unit: string;
  description: string | null;
  is_approved: boolean;
  category_id: string | null;
  images: string[] | null;
}

interface Category {
  id: string;
  name: string;
}

const MAX_FILE_SIZE = 500 * 1024; // 500 KB

const VendorProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendorId, setVendorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("kg");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const resetForm = () => {
    setName(""); setPrice(""); setOriginalPrice(""); setStock(""); setUnit("kg"); setDescription(""); setCategoryId(""); setEditingProduct(null);
    setImageFiles([]); setImagePreviews([]); setExistingImages([]);
  };

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: vendor } = await supabase.from("vendors").select("id").eq("user_id", session.user.id).maybeSingle();
    if (!vendor) return;
    setVendorId(vendor.id);

    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from("products").select("id, name, price, original_price, stock, unit, description, is_approved, category_id, images").eq("vendor_id", vendor.id).order("created_at", { ascending: false }),
      supabase.from("categories").select("id, name"),
    ]);

    setProducts(productsRes.data || []);
    setCategories(categoriesRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const previews: string[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "ফাইল সাইজ বড়",
          description: `"${file.name}" ৫০০ KB এর বেশি। অনুগ্রহ করে ছোট ফাইল ব্যবহার করুন।`,
          variant: "destructive",
        });
        continue;
      }
      if (!file.type.startsWith("image/")) {
        toast({
          title: "ভুল ফাইল টাইপ",
          description: `"${file.name}" একটি ছবি নয়।`,
          variant: "destructive",
        });
        continue;
      }
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }

    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...previews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of imageFiles) {
      const ext = file.name.split(".").pop();
      const path = `products/${vendorId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("images").upload(path, file);
      if (error) {
        toast({ title: "আপলোড ত্রুটি", description: error.message, variant: "destructive" });
        continue;
      }
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(path);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let allImages = [...existingImages];
    if (imageFiles.length > 0) {
      const uploaded = await uploadImages();
      allImages = [...allImages, ...uploaded];
    }

    const payload = {
      name: name.trim(),
      price: parseFloat(price),
      original_price: originalPrice ? parseFloat(originalPrice) : null,
      stock: parseInt(stock),
      unit,
      description: description.trim() || null,
      category_id: categoryId || null,
      vendor_id: vendorId,
      images: allImages.length > 0 ? allImages : null,
    };

    let error;
    if (editingProduct) {
      ({ error } = await supabase.from("products").update(payload).eq("id", editingProduct.id));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }

    setUploading(false);

    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingProduct ? "পণ্য আপডেট হয়েছে" : "পণ্য যোগ হয়েছে" });
      setDialogOpen(false);
      resetForm();
      fetchData();
    }
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(String(p.price));
    setOriginalPrice(p.original_price ? String(p.original_price) : "");
    setStock(String(p.stock));
    setUnit(p.unit);
    setDescription(p.description || "");
    setCategoryId(p.category_id || "");
    setExistingImages(p.images || []);
    setImageFiles([]);
    setImagePreviews([]);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "পণ্য মুছে ফেলা হয়েছে" });
      fetchData();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-foreground">আমার পণ্য</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="hero" size="sm"><Plus className="h-4 w-4 mr-1" /> নতুন পণ্য</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "পণ্য সম্পাদনা" : "নতুন পণ্য যোগ করুন"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>পণ্যের নাম *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>মূল্য (৳) *</Label>
                  <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>আসল মূল্য (৳)</Label>
                  <Input type="number" step="0.01" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>স্টক *</Label>
                  <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>একক</Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">কেজি (১ কেজি)</SelectItem>
                      <SelectItem value="1000gm">১০০০ গ্রাম</SelectItem>
                      <SelectItem value="500gm">৫০০ গ্রাম</SelectItem>
                      <SelectItem value="250gm">২৫০ গ্রাম</SelectItem>
                      <SelectItem value="100gm">১০০ গ্রাম</SelectItem>
                      <SelectItem value="piece">পিস</SelectItem>
                      <SelectItem value="liter">লিটার</SelectItem>
                      <SelectItem value="500ml">৫০০ মি.লি.</SelectItem>
                      <SelectItem value="250ml">২৫০ মি.লি.</SelectItem>
                      <SelectItem value="dozen">ডজন</SelectItem>
                      <SelectItem value="each">প্রতিটি</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>ক্যাটাগরি</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder="ক্যাটাগরি বেছে নিন" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>বিবরণ</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label>পণ্যের ছবি (সর্বোচ্চ ৫০০ KB প্রতিটি)</Label>
                <div
                  className="border-2 border-dashed border-primary/40 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="h-8 w-8 mx-auto text-primary/60 mb-2" />
                  <p className="text-sm text-muted-foreground">ছবি আপলোড করতে ক্লিক করুন</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP — সর্বোচ্চ ৫০০ KB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />

                {/* Existing images */}
                {existingImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {existingImages.map((url, i) => (
                      <div key={url} className="relative group rounded-md overflow-hidden border border-border">
                        <img src={url} alt="" className="w-full h-20 object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(i)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New image previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {imagePreviews.map((src, i) => (
                      <div key={src} className="relative group rounded-md overflow-hidden border border-primary/30">
                        <img src={src} alt="" className="w-full h-20 object-cover" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(i)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={uploading}>
                {uploading ? "আপলোড হচ্ছে..." : editingProduct ? "আপডেট করুন" : "পণ্য যোগ করুন"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">লোড হচ্ছে...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">কোনো পণ্য নেই। নতুন পণ্য যোগ করুন।</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ছবি</TableHead>
                  <TableHead>পণ্যের নাম</TableHead>
                  <TableHead>মূল্য</TableHead>
                  <TableHead>স্টক</TableHead>
                  <TableHead>স্থিতি</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      {p.images && p.images.length > 0 ? (
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                          <ImagePlus className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>৳{p.price}</TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${p.is_approved ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                        {p.is_approved ? "অনুমোদিত" : "অপেক্ষমান"}
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

export default VendorProductsPage;
