import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, ShoppingCart, Package, Users, TrendingUp, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface DashboardStats {
  totalVendors: number;
  pendingVendors: number;
  totalProducts: number;
  pendingProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
}

const COLORS = ["hsl(140,40%,28%)", "hsl(28,60%,52%)", "hsl(38,70%,55%)", "hsl(100,35%,50%)", "hsl(0,84%,60%)"];

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalVendors: 0,
    pendingVendors: 0,
    totalProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCommission: 0,
  });
  const [ordersByStatus, setOrdersByStatus] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [vendors, products, orders] = await Promise.all([
        supabase.from("vendors").select("id, is_approved"),
        supabase.from("products").select("id, is_approved"),
        supabase.from("orders").select("id, status, total, commission_amount, created_at, order_number"),
      ]);

      const vendorData = vendors.data || [];
      const productData = products.data || [];
      const orderData = orders.data || [];

      setStats({
        totalVendors: vendorData.length,
        pendingVendors: vendorData.filter((v) => !v.is_approved).length,
        totalProducts: productData.length,
        pendingProducts: productData.filter((p) => !p.is_approved).length,
        totalOrders: orderData.length,
        totalRevenue: orderData.reduce((s, o) => s + Number(o.total), 0),
        totalCommission: orderData.reduce((s, o) => s + Number(o.commission_amount), 0),
      });

      // Orders by status for pie chart
      const statusCounts: Record<string, number> = {};
      orderData.forEach((o) => {
        statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
      });
      setOrdersByStatus(
        Object.entries(statusCounts).map(([name, value]) => ({ name: statusLabel(name), value }))
      );

      setRecentOrders(orderData.slice(0, 5));
    };

    fetchStats();
  }, []);

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      pending: "অপেক্ষমান",
      processing: "প্রক্রিয়াধীন",
      shipped: "শিপ করা হয়েছে",
      delivered: "ডেলিভারি সম্পন্ন",
      cancelled: "বাতিল",
      refunded: "রিফান্ড",
    };
    return map[s] || s;
  };

  const statCards = [
    { label: "মোট বিক্রেতা", value: stats.totalVendors, sub: `${stats.pendingVendors} অপেক্ষমান`, icon: Store, color: "text-primary" },
    { label: "মোট প্রোডাক্ট", value: stats.totalProducts, sub: `${stats.pendingProducts} অনুমোদনের অপেক্ষায়`, icon: Package, color: "text-accent" },
    { label: "মোট অর্ডার", value: stats.totalOrders, sub: "সর্বমোট", icon: ShoppingCart, color: "text-organic-leaf" },
    { label: "মোট বিক্রি", value: `৳${stats.totalRevenue.toLocaleString("bn-BD")}`, sub: "রাজস্ব", icon: TrendingUp, color: "text-organic-gold" },
    { label: "মোট কমিশন", value: `৳${stats.totalCommission.toLocaleString("bn-BD")}`, sub: "প্ল্যাটফর্ম আয়", icon: DollarSign, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((s, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className={cn("w-5 h-5", s.color)} />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">অর্ডার স্ট্যাটাস</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={ordersByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {ordersByStatus.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">কোনো অর্ডার নেই</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">সাম্প্রতিক অর্ডার</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{o.order_number}</p>
                      <p className="text-xs text-muted-foreground">{statusLabel(o.status)}</p>
                    </div>
                    <span className="font-semibold text-sm">৳{Number(o.total).toLocaleString("bn-BD")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12">কোনো অর্ডার নেই</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper
const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default AdminDashboard;
