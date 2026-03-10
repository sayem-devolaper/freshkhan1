import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

interface Order {
  id: string;
  order_number: string;
  total: number;
  vendor_earnings: number;
  status: OrderStatus;
  created_at: string;
  payment_status: string | null;
}

const statusLabels: Record<OrderStatus, string> = {
  pending: "অপেক্ষমান",
  processing: "প্রক্রিয়াধীন",
  shipped: "শিপড",
  delivered: "ডেলিভারড",
  cancelled: "বাতিল",
  refunded: "ফেরত",
};

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

const VendorOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: vendor } = await supabase.from("vendors").select("id").eq("user_id", session.user.id).maybeSingle();
    if (!vendor) return;

    const { data } = await supabase
      .from("orders")
      .select("id, order_number, total, vendor_earnings, status, created_at, payment_status")
      .eq("vendor_id", vendor.id)
      .order("created_at", { ascending: false });

    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "অর্ডার স্ট্যাটাস আপডেট হয়েছে" });
      fetchOrders();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-display font-bold text-foreground">আমার অর্ডার</h2>
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">লোড হচ্ছে...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">কোনো অর্ডার নেই।</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>অর্ডার নম্বর</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>মোট</TableHead>
                  <TableHead>আয়</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead>আপডেট</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.order_number}</TableCell>
                    <TableCell>{new Date(o.created_at).toLocaleDateString("bn-BD")}</TableCell>
                    <TableCell>৳{o.total}</TableCell>
                    <TableCell>৳{o.vendor_earnings}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[o.status]}`}>
                        {statusLabels[o.status]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as OrderStatus)}>
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(statusLabels) as OrderStatus[]).map((s) => (
                            <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

export default VendorOrdersPage;
