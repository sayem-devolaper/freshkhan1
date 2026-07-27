import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, ExternalLink, Save, Upload } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author: string | null;
  is_published: boolean;
  published_at: string | null;
  updated_at: string;
}

const slugify = (v: string) =>
  v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

const AdminBlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts((data || []) as BlogPost[]);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const openNew = () => {
    setEditing({ slug: "", title: "", excerpt: "", content: "", cover_image: "", author: "", is_published: true });
    setDialogOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditing({ ...p });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast({ title: "ত্রুটি", description: "ছবির সাইজ ১MB এর কম হতে হবে", variant: "destructive" });
      return;
    }
    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const path = `${user?.id}/blog/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("images").upload(path, file);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("images").getPublicUrl(path);
    setEditing((prev) => ({ ...prev, cover_image: data.publicUrl }));
    setUploading(false);
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.title || !editing.slug) {
      toast({ title: "ত্রুটি", description: "শিরোনাম ও slug আবশ্যক", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      slug: editing.slug,
      title: editing.title,
      excerpt: editing.excerpt || null,
      content: editing.content || "",
      cover_image: editing.cover_image || null,
      author: editing.author || null,
      is_published: editing.is_published ?? true,
      published_at: editing.is_published ? (editing.published_at || new Date().toISOString()) : null,
    };
    const { error } = editing.id
      ? await supabase.from("blog_posts").update(payload).eq("id", editing.id)
      : await supabase.from("blog_posts").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "সফল", description: "ব্লগ পোস্ট সংরক্ষিত হয়েছে" });
    setDialogOpen(false);
    setEditing(null);
    fetchPosts();
  };

  const togglePublished = async (p: BlogPost, v: boolean) => {
    await supabase.from("blog_posts").update({
      is_published: v,
      published_at: v ? (p.published_at || new Date().toISOString()) : null,
    }).eq("id", p.id);
    fetchPosts();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); return; }
    toast({ title: "মুছে ফেলা হয়েছে" });
    fetchPosts();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold">ব্লগ ম্যানেজমেন্ট ({posts.length})</h2>
          <p className="text-sm text-muted-foreground">ব্লগ পোস্ট তৈরি, এডিট ও প্রকাশ করুন</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> নতুন পোস্ট</Button>
      </div>

      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>কভার</TableHead>
                  <TableHead>শিরোনাম</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>প্রকাশিত</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      {p.cover_image ? (
                        <img src={p.cover_image} alt={p.title} className="h-10 w-16 object-cover rounded" />
                      ) : <div className="h-10 w-16 bg-muted rounded" />}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{p.title}</TableCell>
                    <TableCell className="text-xs"><code className="bg-muted px-1.5 py-0.5 rounded">/blog/{p.slug}</code></TableCell>
                    <TableCell>
                      <Switch checked={p.is_published} onCheckedChange={(v) => togglePublished(p, v)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild size="sm" variant="ghost">
                          <Link to={`/blog/${p.slug}`} target="_blank"><ExternalLink className="h-4 w-4" /></Link>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>পোস্ট মুছে ফেলবেন?</AlertDialogTitle>
                              <AlertDialogDescription>"{p.title}" স্থায়ীভাবে মুছে যাবে।</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>বাতিল</AlertDialogCancel>
                              <AlertDialogAction onClick={() => remove(p.id)} className="bg-destructive text-destructive-foreground">
                                মুছে ফেলুন
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {posts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {loading ? "লোড হচ্ছে..." : "কোনো ব্লগ পোস্ট নেই"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditing(null); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "পোস্ট এডিট করুন" : "নতুন ব্লগ পোস্ট"}</DialogTitle>
            <DialogDescription>ব্লগ পোস্টের বিবরণ ও কন্টেন্ট লিখুন।</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>শিরোনাম *</Label>
                  <Input
                    value={editing.title || ""}
                    onChange={(e) => {
                      const title = e.target.value;
                      setEditing((prev) => ({ ...prev, title, slug: prev?.id ? prev.slug : slugify(title) }));
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>URL Slug *</Label>
                  <Input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} />
                  <p className="text-xs text-muted-foreground">URL: /blog/{editing.slug || "..."}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>কভার ছবি</Label>
                <div className="flex items-center gap-3">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="flex-1" />
                  {uploading && <span className="text-xs text-muted-foreground">আপলোড হচ্ছে...</span>}
                </div>
                {editing.cover_image && (
                  <img src={editing.cover_image} alt="cover" className="mt-2 h-32 rounded border border-border object-cover" />
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>লেখক</Label>
                  <Input value={editing.author || ""} onChange={(e) => setEditing({ ...editing, author: e.target.value })} placeholder="ফ্রেশ খান টিম" />
                </div>
                <div className="space-y-1.5">
                  <Label>প্রকাশের তারিখ</Label>
                  <Input
                    type="datetime-local"
                    value={editing.published_at ? editing.published_at.slice(0, 16) : ""}
                    onChange={(e) => setEditing({ ...editing, published_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>সংক্ষিপ্ত বিবরণ (Excerpt)</Label>
                <Textarea value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={2} maxLength={200} />
              </div>

              <div className="space-y-1.5">
                <Label>কন্টেন্ট</Label>
                <RichTextEditor
                  value={editing.content || ""}
                  onChange={(html) => setEditing((prev) => ({ ...prev, content: html }))}
                  placeholder="ব্লগ পোস্টের কন্টেন্ট লিখুন..."
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={editing.is_published ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} />
                <Label>প্রকাশিত</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>বাতিল</Button>
            <Button onClick={save} disabled={saving}>
              <Save className="h-4 w-4 mr-1" /> {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlogPage;
