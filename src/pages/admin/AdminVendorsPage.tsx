import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, Trash2, Ban, RotateCcw, Search, KeyRound, Eye, EyeOff } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

const AdminVendorsPage = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Password reset state
  const [resetVendor, setResetVendor] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetting, setResetting] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("vendors")
      .select("*")
      .order("created_at", { ascending: false });
    setVendors(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchVendors(); }, []);

  const updateVendor = async (id: string, updates: Record<string, any>, msg: string) => {
    const { error } = await supabase.from("vendors").update(updates as any).eq("id", id);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "সফল", description: msg });
      fetchVendors();
    }
  };

  const deleteVendor = async (id: string) => {
    const { error } = await supabase.from("vendors").delete().eq("id", id);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "সফল", description: "বিক্রেতা মুছে ফেলা হয়েছে" });
      fetchVendors();
    }
  };

  const handleResetPassword = async () => {
    if (!resetVendor || !newPassword) return;
    if (newPassword.length < 6) {
      toast({ title: "ত্রুটি", description: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে", variant: "destructive" });
      return;
    }
    setResetting(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-reset-password", {
        body: { vendor_user_id: resetVendor.user_id, new_password: newPassword },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: "সফল", description: `"${resetVendor.store_name}" এর পাসওয়ার্ড রিসেট করা হয়েছে` });
      setResetVendor(null);
      setNewPassword("");
      setShowPassword(false);
    } catch (err: any) {
      toast({ title: "ত্রুটি", description: err.message, variant: "destructive" });
    } finally {
      setResetting(false);
    }
  };

  const filtered = vendors.filter((v) =>
    v.store_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-xl font-display font-bold">বিক্রেতা ম্যানেজমেন্ট ({vendors.length})</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="বিক্রেতা খুঁজুন..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>দোকানের নাম</TableHead>
                  <TableHead>ফোন</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead>কমিশন</TableHead>
                  <TableHead>রেটিং</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.store_name}</TableCell>
                    <TableCell>{v.phone || "—"}</TableCell>
                    <TableCell>
                      {v.is_suspended ? (
                        <Badge variant="destructive">সাসপেন্ড</Badge>
                      ) : v.is_approved ? (
                        <Badge className="bg-primary text-primary-foreground">অনুমোদিত</Badge>
                      ) : (
                        <Badge variant="secondary">অপেক্ষমান</Badge>
                      )}
                    </TableCell>
                    <TableCell>{v.commission_rate ?? 10}%</TableCell>
                    <TableCell>⭐ {v.rating || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        {!v.is_approved && (
                          <Button size="sm" variant="ghost" className="text-primary"
                            onClick={() => updateVendor(v.id, { is_approved: true, is_suspended: false }, "বিক্রেতা অনুমোদন করা হয়েছে")}>
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        {v.is_approved && !v.is_suspended && (
                          <Button size="sm" variant="ghost" className="text-accent"
                            onClick={() => updateVendor(v.id, { is_suspended: true }, "বিক্রেতা সাসপেন্ড করা হয়েছে")}>
                            <Ban className="w-4 h-4" />
                          </Button>
                        )}
                        {v.is_suspended && (
                          <Button size="sm" variant="ghost" className="text-primary"
                            onClick={() => updateVendor(v.id, { is_suspended: false }, "সাসপেনশন প্রত্যাহার করা হয়েছে")}>
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        )}
                        {/* Password Reset Button */}
                        <Button size="sm" variant="ghost" className="text-muted-foreground"
                          onClick={() => { setResetVendor(v); setNewPassword(""); setShowPassword(false); }}
                          title="পাসওয়ার্ড রিসেট">
                          <KeyRound className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>বিক্রেতা মুছে ফেলবেন?</AlertDialogTitle>
                              <AlertDialogDescription>
                                "{v.store_name}" এবং তার সব প্রোডাক্ট স্থায়ীভাবে মুছে যাবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>বাতিল</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteVendor(v.id)} className="bg-destructive text-destructive-foreground">
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
                      {loading ? "লোড হচ্ছে..." : "কোনো বিক্রেতা পাওয়া যায়নি"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Password Reset Dialog */}
      <Dialog open={!!resetVendor} onOpenChange={(open) => { if (!open) { setResetVendor(null); setNewPassword(""); setShowPassword(false); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>পাসওয়ার্ড রিসেট</DialogTitle>
            <DialogDescription>
              "{resetVendor?.store_name}" ভেন্ডরের জন্য নতুন পাসওয়ার্ড সেট করুন
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">নতুন পাসওয়ার্ড</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  minLength={6}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetVendor(null)}>বাতিল</Button>
            <Button onClick={handleResetPassword} disabled={resetting || newPassword.length < 6}>
              <KeyRound className="w-4 h-4" /> {resetting ? "রিসেট হচ্ছে..." : "পাসওয়ার্ড রিসেট করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVendorsPage;
