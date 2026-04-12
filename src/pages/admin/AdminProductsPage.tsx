import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Trash2, Search, Pencil, ImagePlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MAX_FILE_SIZE = 500 * 1024;

const AdminProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("kg");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      supabase.from("products").select("*, vendors(store_name)").order("created_at", { ascending: false }),
      supabase.from("categories").select("id, name"),
    ]);
    setProducts(prodRes.data || []);
    setCategories(catRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const updateProduct = async (id: string, updates: Record<string, any>, msg: string) => {
    const { error } = await supabase.from("products").update(updates as any).eq("id", id);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "সফল", description: msg });
      fetchProducts();
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "সফল", description: "প্রোডাক্ট মুছে ফেলা হয়েছে" });
      fetchProducts();
    }
  };

  const openEdit = (p: any) => {
    setEditProduct(p);
    setName(p.name);
    setPrice(String(p.price));
    setOriginalPrice(p.original_price ? String(p.original_price) : "");
    setStock(String(p.stock));
    setUnit(p.unit || "each");
    setDescription(p.description || "");
    setCategoryId(p.category_id || "");
    setExistingImages(p.images || []);
    setImageFiles([]);
    setImagePreviews([]);
    setEditOpen(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const previews: string[] = [];
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast({ title: "ফাইল সাইজ বড়", description: `"${file.name}" ৫০০ KB এর বেশি।`, variant: "destructive" });
        continue;
      }
      if (!file.type.startsWith("image/")) continue;
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }
    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...previews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeNewImage = (i: number) => {
    URL.revokeObjectURL(imagePreviews[i]);
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const removeExistingImage = (i: number) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    setUploading(true);

    let allImages = [...existingImages];
    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        const ext = file.name.split(".").pop();
        const path = `products/${editProduct.vendor_id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("images").upload(path, file);
        if (error) {
          toast({ title: "আপলোড ত্রুটি", description: error.message, variant: "destructive" });
          continue;
        }
        const { data: urlData } = supabase.storage.from("images").getPublicUrl(path);
        allImages.push(urlData.publicUrl);
      }
    }

    const payload: Record<string, any> = {
      name: name.trim(),
      price: parseFloat(price),
      original_price: originalPrice ? parseFloat(originalPrice) : null,
      stock: parseInt(stock),
      unit,
      description: description.trim() || null,
      category_id: categoryId || null,
      images: allImages.length > 0 ? allImages : null,
    };

    const { error } = await supabase.from("products").update(payload).eq("id", editProduct.id);
    setUploading(false);

    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "সফল", description: "প্রোডাক্ট আপডেট হয়েছে" });
      setEditOpen(false);
      fetchProducts();
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-xl font-display font-bold">প্রোডাক্ট ম্যানেজমেন্ট ({products.length})</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="প্রোডাক্ট খুঁজুন..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ছবি</TableHead>
                  <TableHead>পণ্যের নাম</TableHead>
                  <TableHead>বিক্রেতা</TableHead>
                  <TableHead>দাম</TableHead>
                  <TableHead>স্টক</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
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
                    <TableCell>{p.vendors?.store_name || "—"}</TableCell>
                    <TableCell>৳{Number(p.price).toLocaleString("bn-BD")}</TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell>
                      {p.is_approved ? (
                        <Badge className="bg-primary text-primary-foreground">অনুমোদিত</Badge>
                      ) : (
                        <Badge variant="secondary">অপেক্ষমান</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(p)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        {!p.is_approved ? (
                          <Button size="sm" variant="ghost" className="text-primary" onClick={() => updateProduct(p.id, { is_approved: true }, "প্রোডাক্ট অনুমোদন করা হয়েছে")}>
                            <Check className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost" className="text-accent" onClick={() => updateProduct(p.id, { is_approved: false }, "অনুমোদন প্রত্যাহার করা হয়েছে")}>
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>প্রোডাক্ট মুছে ফেলবেন?</AlertDialogTitle>
                              <AlertDialogDescription>
                                "{p.name}" স্থায়ীভাবে মুছে যাবে।
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>বাতিল</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteProduct(p.id)} className="bg-destructive text-destructive-foreground">মুছে ফেলুন</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {loading ? "লোড হচ্ছে..." : "কোনো প্রোডাক্ট পাওয়া যায়নি"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) setEditProduct(null); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>প্রোডাক্ট সম্পাদনা</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
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
                    <SelectItem value="kg">কেজি</SelectItem>
                    <SelectItem value="piece">পিস</SelectItem>
                    <SelectItem value="liter">লিটার</SelectItem>
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

            {/* Image Section */}
            <div className="space-y-2">
              <Label>পণ্যের ছবি (সর্বোচ্চ ৫০০ KB প্রতিটি)</Label>
              <div
                className="border-2 border-dashed border-primary/40 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="h-8 w-8 mx-auto text-primary/60 mb-2" />
                <p className="text-sm text-muted-foreground">ছবি আপলোড করতে ক্লিক করুন</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />

              {existingImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {existingImages.map((url, i) => (
                    <div key={url} className="relative group rounded-md overflow-hidden border border-border">
                      <img src={url} alt="" className="w-full h-20 object-cover" />
                      <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {imagePreviews.map((src, i) => (
                    <div key={src} className="relative group rounded-md overflow-hidden border border-primary/30">
                      <img src={src} alt="" className="w-full h-20 object-cover" />
                      <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" variant="hero" className="w-full" disabled={uploading}>
              {uploading ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductsPage;
