import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Save, Percent } from "lucide-react";

const AdminCommissionPage = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [commissionTotals, setCommissionTotals] = useState<Record<string, number>>({});
  const [editingRates, setEditingRates] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVendors = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("vendors")
      .select("id, store_name, commission_rate, is_approved, rating")
      .order("store_name");
    setVendors(data || []);
    const rates: Record<string, string> = {};
    (data || []).forEach((v: any) => {
      rates[v.id] = String(v.commission_rate ?? 10);
    });
    setEditingRates(rates);

    // Fetch commission totals per vendor from orders
    const { data: orders } = await supabase
      .from("orders")
      .select("vendor_id, commission_amount");
    const totals: Record<string, number> = {};
    (orders || []).forEach((o: any) => {
      totals[o.vendor_id] = (totals[o.vendor_id] || 0) + Number(o.commission_amount || 0);
    });
    setCommissionTotals(totals);

    setLoading(false);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const saveRate = async (id: string) => {
    const rate = parseFloat(editingRates[id]);
    if (isNaN(rate) || rate < 5 || rate > 15) {
      toast({ title: "ত্রুটি", description: "কমিশন ৫-১৫% এর মধ্যে হতে হবে", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("vendors").update({ commission_rate: rate }).eq("id", id);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "সফল", description: "কমিশন রেট আপডেট হয়েছে" });
      fetchVendors();
    }
  };

  const saveAll = async () => {
    let hasError = false;
    for (const v of vendors) {
      const rate = parseFloat(editingRates[v.id]);
      if (isNaN(rate) || rate < 5 || rate > 15) continue;
      if (rate !== v.commission_rate) {
        const { error } = await supabase.from("vendors").update({ commission_rate: rate }).eq("id", v.id);
        if (error) hasError = true;
      }
    }
    if (hasError) {
      toast({ title: "ত্রুটি", description: "কিছু আপডেটে সমস্যা হয়েছে", variant: "destructive" });
    } else {
      toast({ title: "সফল", description: "সব কমিশন রেট আপডেট হয়েছে" });
    }
    fetchVendors();
  };

  const grandTotal = Object.values(commissionTotals).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-xl font-display font-bold">কমিশন সেটিংস</h2>
        <Button onClick={saveAll}>
          <Save className="w-4 h-4 mr-2" />
          সব সেভ করুন
        </Button>
      </div>

      {/* Info card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Percent className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-sm text-foreground">কমিশন সিস্টেম</p>
            <p className="text-xs text-muted-foreground mt-1">
              প্রতিটি অর্ডার থেকে প্ল্যাটফর্ম স্বয়ংক্রিয়ভাবে নির্ধারিত শতাংশ কমিশন কেটে নেয়। ডিফল্ট কমিশন ১০%। প্রতিটি বিক্রেতার জন্য আলাদা কমিশন নির্ধারণ করতে পারেন।
            </p>
            {grandTotal > 0 && (
              <p className="text-sm font-semibold text-primary mt-2">
                মোট কমিশন আয়: ৳{grandTotal.toFixed(2)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>বিক্রেতা</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead>রেটিং</TableHead>
                  <TableHead>কমিশন রেট (%)</TableHead>
                  <TableHead>মোট কমিশন (৳)</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.store_name}</TableCell>
                    <TableCell>
                      {v.is_approved ? (
                        <span className="text-primary text-sm">অনুমোদিত</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">অপেক্ষমান</span>
                      )}
                    </TableCell>
                    <TableCell>⭐ {v.rating || 0}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={5}
                        max={15}
                        step={0.5}
                        className="w-24 h-8"
                        value={editingRates[v.id] || "10"}
                        onChange={(e) =>
                          setEditingRates((prev) => ({ ...prev, [v.id]: e.target.value }))
                        }
                      />
                    </TableCell>
                    <TableCell className="font-semibold">
                      ৳{(commissionTotals[v.id] || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => saveRate(v.id)}>
                        <Save className="w-3 h-3 mr-1" />
                        সেভ
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {vendors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {loading ? "লোড হচ্ছে..." : "কোনো বিক্রেতা নেই"}
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

export default AdminCommissionPage;
