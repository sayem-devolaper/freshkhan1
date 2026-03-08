import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

const statusOptions = [
  { value: "pending", label: "অপেক্ষমান" },
  { value: "processing", label: "প্রক্রিয়াধীন" },
  { value: "shipped", label: "শিপ করা হয়েছে" },
  { value: "delivered", label: "ডেলিভারি সম্পন্ন" },
  { value: "cancelled", label: "বাতিল" },
  { value: "refunded", label: "রিফান্ড" },
];

const statusColors: Record<string, string> = {
  pending: "bg-secondary text-secondary-foreground",
  processing: "bg-accent text-accent-foreground",
  shipped: "bg-primary/80 text-primary-foreground",
  delivered: "bg-primary text-primary-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
  refunded: "bg-muted text-muted-foreground",
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*, vendors(store_name)")
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "সফল", description: "অর্ডার স্ট্যাটাস আপডেট হয়েছে" });
      fetchOrders();
    }
  };

  const statusLabel = (s: string) => statusOptions.find((o) => o.value === s)?.label || s;

  const filtered = orders
    .filter((o) => filterStatus === "all" || o.status === filterStatus)
    .filter((o) => o.order_number.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-xl font-display font-bold">অর্ডার ম্যানেজমেন্ট ({orders.length})</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="অর্ডার নম্বর..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="সব স্ট্যাটাস" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
              {statusOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>অর্ডার নম্বর</TableHead>
                  <TableHead>বিক্রেতা</TableHead>
                  <TableHead>মোট</TableHead>
                  <TableHead>কমিশন</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.order_number}</TableCell>
                    <TableCell>{o.vendors?.store_name || "—"}</TableCell>
                    <TableCell>৳{Number(o.total).toLocaleString("bn-BD")}</TableCell>
                    <TableCell>৳{Number(o.commission_amount).toLocaleString("bn-BD")}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[o.status]}>{statusLabel(o.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(o.created_at).toLocaleDateString("bn-BD")}
                    </TableCell>
                    <TableCell>
                      <Select value={o.status} onValueChange={(val) => updateStatus(o.id, val as OrderStatus)}>
                        <SelectTrigger className="w-36 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {loading ? "লোড হচ্ছে..." : "কোনো অর্ডার পাওয়া যায়নি"}
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

export default AdminOrdersPage;
