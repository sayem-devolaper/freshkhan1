import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Trash2, Ban, RotateCcw, Search } from "lucide-react";
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

const AdminVendorsPage = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVendors = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("vendors")
      .select("*")
      .order("created_at", { ascending: false });
    setVendors(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const updateVendor = async (id: string, updates: Record<string, any>, msg: string) => {
    const { error } = await supabase.from("vendors").update(updates).eq("id", id);
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

  const filtered = vendors.filter((v) =>
    v.store_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-xl font-display font-bold">বিক্রেতা ম্যানেজমেন্ট ({vendors.length})</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="বিক্রেতা খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
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
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-primary"
                            onClick={() =>
                              updateVendor(v.id, { is_approved: true, is_suspended: false }, "বিক্রেতা অনুমোদন করা হয়েছে")
                            }
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        {v.is_approved && !v.is_suspended && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-accent"
                            onClick={() =>
                              updateVendor(v.id, { is_suspended: true }, "বিক্রেতা সাসপেন্ড করা হয়েছে")
                            }
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        )}
                        {v.is_suspended && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-primary"
                            onClick={() =>
                              updateVendor(v.id, { is_suspended: false }, "সাসপেনশন প্রত্যাহার করা হয়েছে")
                            }
                          >
                            <RotateCcw className="w-4 h-4" />
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
                              <AlertDialogTitle>বিক্রেতা মুছে ফেলবেন?</AlertDialogTitle>
                              <AlertDialogDescription>
                                "{v.store_name}" এবং তার সব প্রোডাক্ট স্থায়ীভাবে মুছে যাবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>বাতিল</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteVendor(v.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
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
    </div>
  );
};

export default AdminVendorsPage;
