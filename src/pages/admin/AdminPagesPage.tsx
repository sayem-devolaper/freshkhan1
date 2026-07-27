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
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, ExternalLink, Save } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import { Link } from "react-router-dom";

interface PageRow {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  sort_order: number;
  updated_at: string;
}

const slugify = (v: string) =>
  v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

const AdminPagesPage = () => {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<PageRow> | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchPages = async () => {
    setLoading(true);
    const { data } = await supabase.from("pages").select("*").order("sort_order");
    setPages((data || []) as PageRow[]);
    setLoading(false);
  };

  useEffect(() => { fetchPages(); }, []);

  const openNew = () => {
    setEditing({ slug: "", title: "", content: "", meta_title: "", meta_description: "", is_published: true, sort_order: pages.length + 1 });
    setDialogOpen(true);
  };

  const openEdit = (p: PageRow) => {
    setEditing({ ...p });
    setDialogOpen(true);
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
      content: editing.content || "",
      meta_title: editing.meta_title || null,
      meta_description: editing.meta_description || null,
      is_published: editing.is_published ?? true,
      sort_order: Number(editing.sort_order) || 0,
    };
    const { error } = editing.id
      ? await supabase.from("pages").update(payload).eq("id", editing.id)
      : await supabase.from("pages").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "সফল", description: "পেজ সংরক্ষিত হয়েছে" });
    setDialogOpen(false);
    setEditing(null);
    fetchPages();
  };

  const togglePublished = async (p: PageRow, v: boolean) => {
    await supabase.from("pages").update({ is_published: v }).eq("id", p.id);
    fetchPages();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); return; }
    toast({ title: "মুছে ফেলা হয়েছে" });
    fetchPages();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold">পেজ ম্যানেজমেন্ট ({pages.length})</h2>
          <p className="text-sm text-muted-foreground">About, Privacy, Terms, FAQ ইত্যাদি পেজ তৈরি ও এডিট করুন</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> নতুন পেজ</Button>
      </div>

      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>শিরোনাম</TableHead>
                  <TableHead>Slug (URL)</TableHead>
                  <TableHead>ক্রম</TableHead>
                  <TableHead>প্রকাশিত</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell className="text-sm">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/page/{p.slug}</code>
                    </TableCell>
                    <TableCell>{p.sort_order}</TableCell>
                    <TableCell>
                      <Switch checked={p.is_published} onCheckedChange={(v) => togglePublished(p, v)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild size="sm" variant="ghost" title="প্রিভিউ">
                          <Link to={`/page/${p.slug}`} target="_blank"><ExternalLink className="h-4 w-4" /></Link>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => openEdit(p)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>পেজ মুছে ফেলবেন?</AlertDialogTitle>
                              <AlertDialogDescription>
                                "{p.title}" স্থায়ীভাবে মুছে যাবে। এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।
                              </AlertDialogDescription>
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
                {pages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {loading ? "লোড হচ্ছে..." : "কোনো পেজ নেই"}
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
            <DialogTitle>{editing?.id ? "পেজ এডিট করুন" : "নতুন পেজ"}</DialogTitle>
            <DialogDescription>শিরোনাম, URL slug এবং কন্টেন্ট লিখুন। মেটা ট্যাগ SEO এর জন্য।</DialogDescription>
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
                      setEditing((prev) => ({
                        ...prev,
                        title,
                        slug: prev?.id ? prev.slug : slugify(title),
                      }));
                    }}
                    placeholder="যেমন: আমাদের সম্পর্কে"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>URL Slug *</Label>
                  <Input
                    value={editing.slug || ""}
                    onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                    placeholder="about"
                  />
                  <p className="text-xs text-muted-foreground">URL: /page/{editing.slug || "..."}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>কন্টেন্ট</Label>
                <RichTextEditor
                  value={editing.content || ""}
                  onChange={(html) => setEditing((prev) => ({ ...prev, content: html }))}
                  placeholder="পেজের কন্টেন্ট লিখুন..."
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Meta Title (SEO)</Label>
                  <Input
                    value={editing.meta_title || ""}
                    onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })}
                    placeholder="Google search এ যা দেখাবে"
                    maxLength={60}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>ক্রম (Sort order)</Label>
                  <Input
                    type="number"
                    value={editing.sort_order ?? 0}
                    onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Meta Description (SEO)</Label>
                <Textarea
                  value={editing.meta_description || ""}
                  onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })}
                  placeholder="Google search এ ছোট বিবরণ (160 অক্ষর)"
                  maxLength={160}
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={editing.is_published ?? true}
                  onCheckedChange={(v) => setEditing({ ...editing, is_published: v })}
                />
                <Label>প্রকাশিত (ভিজিটর দেখতে পারবে)</Label>
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

export default AdminPagesPage;
