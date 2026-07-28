import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, ExternalLink, Save, X } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author: string | null;
  category: string | null;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  status: string; // 'draft' | 'published'
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
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const { toast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts((data || []) as BlogPost[]);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean))) as string[];

  const filtered = posts.filter((p) => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterCategory !== "all" && p.category !== filterCategory) return false;
    return true;
  });

  const openNew = () => {
    setEditing({
      slug: "", title: "", excerpt: "", content: "", cover_image: "", author: "",
      category: "", tags: [], meta_title: "", meta_description: "",
      status: "draft", is_published: false,
    });
    setTagInput("");
    setDialogOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditing({ ...p, tags: p.tags || [] });
    setTagInput("");
    setDialogOpen(true);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    const list = editing?.tags || [];
    if (!list.includes(t)) setEditing({ ...editing, tags: [...list, t] });
    setTagInput("");
  };

  const removeTag = (t: string) => {
    setEditing({ ...editing, tags: (editing?.tags || []).filter((x) => x !== t) });
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.title || !editing.slug) {
      toast({ title: "ত্রুটি", description: "শিরোনাম ও slug আবশ্যক", variant: "destructive" });
      return;
    }
    setSaving(true);
    const isPublished = editing.status === "published";
    const payload = {
      slug: editing.slug,
      title: editing.title,
      excerpt: editing.excerpt || null,
      content: editing.content || "",
      cover_image: editing.cover_image || null,
      author: editing.author || null,
      category: editing.category || null,
      tags: editing.tags || [],
      meta_title: editing.meta_title || null,
      meta_description: editing.meta_description || null,
      status: editing.status || "draft",
      is_published: isPublished,
      published_at: isPublished ? (editing.published_at || new Date().toISOString()) : null,
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

  const toggleStatus = async (p: BlogPost, publish: boolean) => {
    await supabase.from("blog_posts").update({
      status: publish ? "published" : "draft",
      is_published: publish,
      published_at: publish ? (p.published_at || new Date().toISOString()) : null,
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
          <p className="text-sm text-muted-foreground">Category, Tags, SEO, ও Draft/Publish সহ সম্পূর্ণ CMS</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> নতুন পোস্ট</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><SelectValue placeholder="স্ট্যাটাস" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48"><SelectValue placeholder="ক্যাটাগরি" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব ক্যাটাগরি</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>কভার</TableHead>
                  <TableHead>শিরোনাম</TableHead>
                  <TableHead>ক্যাটাগরি</TableHead>
                  <TableHead>ট্যাগ</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      {p.cover_image ? (
                        <img src={p.cover_image} alt={p.title} className="h-10 w-16 object-cover rounded" />
                      ) : <div className="h-10 w-16 bg-muted rounded" />}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{p.title}</div>
                      <code className="text-xs text-muted-foreground">/blog/{p.slug}</code>
                    </TableCell>
                    <TableCell>{p.category ? <Badge variant="secondary">{p.category}</Badge> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {(p.tags || []).slice(0, 3).map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                        {(p.tags?.length || 0) > 3 && <span className="text-xs text-muted-foreground">+{(p.tags?.length || 0) - 3}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={p.status === "published"} onCheckedChange={(v) => toggleStatus(p, v)} />
                        <Badge variant={p.status === "published" ? "default" : "secondary"}>
                          {p.status === "published" ? "Published" : "Draft"}
                        </Badge>
                      </div>
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
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "পোস্ট এডিট করুন" : "নতুন ব্লগ পোস্ট"}</DialogTitle>
            <DialogDescription>Category, Tags, Featured Image, SEO ও Publish/Draft সহ পূর্ণ কন্ট্রোল।</DialogDescription>
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
                  <p className="text-xs text-muted-foreground">/blog/{editing.slug || "..."}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>ক্যাটাগরি</Label>
                  <Input
                    value={editing.category || ""}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    placeholder="যেমন: অর্গানিক, কৃষি, স্বাস্থ্য"
                    list="blog-categories-list"
                  />
                  <datalist id="blog-categories-list">
                    {categories.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </div>
                <div className="space-y-1.5">
                  <Label>লেখক</Label>
                  <Input value={editing.author || ""} onChange={(e) => setEditing({ ...editing, author: e.target.value })} placeholder="ফ্রেশ খান টিম" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>ট্যাগ (Enter চাপুন যোগ করতে)</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="ট্যাগ লিখে Enter"
                  />
                  <Button type="button" variant="outline" onClick={addTag}>যোগ করুন</Button>
                </div>
                {(editing.tags?.length || 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(editing.tags || []).map((t) => (
                      <Badge key={t} variant="secondary" className="pl-2 pr-1 gap-1">
                        {t}
                        <button type="button" onClick={() => removeTag(t)} className="hover:bg-muted rounded p-0.5">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>ফিচার্ড ছবি (Cover Image)</Label>
                <ImageUpload
                  value={editing.cover_image || ""}
                  onChange={(url) => setEditing((prev) => ({ ...prev, cover_image: url }))}
                  folder="blog"
                  maxSizeKB={1024}
                />
              </div>

              <div className="space-y-1.5">
                <Label>সংক্ষিপ্ত বিবরণ (Excerpt)</Label>
                <Textarea value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={2} maxLength={220} />
              </div>

              <div className="space-y-1.5">
                <Label>কন্টেন্ট</Label>
                <RichTextEditor
                  value={editing.content || ""}
                  onChange={(html) => setEditing((prev) => ({ ...prev, content: html }))}
                  placeholder="ব্লগ পোস্টের কন্টেন্ট লিখুন..."
                />
              </div>

              <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 space-y-3 bg-primary/5">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 bg-primary rounded" />
                  <h4 className="font-semibold">SEO সেটিংস</h4>
                </div>
                <div className="space-y-1.5">
                  <Label>SEO শিরোনাম (Meta Title)</Label>
                  <Input
                    value={editing.meta_title || ""}
                    onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })}
                    maxLength={70}
                    placeholder="সার্চ ইঞ্জিনে দেখানো শিরোনাম (৬০ অক্ষরের কম রাখুন)"
                  />
                  <p className="text-xs text-muted-foreground">{(editing.meta_title || "").length}/60 (recommended)</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Meta Description</Label>
                  <Textarea
                    value={editing.meta_description || ""}
                    onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })}
                    rows={2}
                    maxLength={180}
                    placeholder="সার্চ রেজাল্টে দেখানো বিবরণ (১৬০ অক্ষরের কম)"
                  />
                  <p className="text-xs text-muted-foreground">{(editing.meta_description || "").length}/160 (recommended)</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 items-end">
                <div className="space-y-1.5">
                  <Label>স্ট্যাটাস</Label>
                  <Select
                    value={editing.status || "draft"}
                    onValueChange={(v) => setEditing({ ...editing, status: v, is_published: v === "published" })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">📝 Draft (সংরক্ষণ করুন, প্রকাশ নয়)</SelectItem>
                      <SelectItem value="published">✅ Published (প্রকাশ করুন)</SelectItem>
                    </SelectContent>
                  </Select>
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
