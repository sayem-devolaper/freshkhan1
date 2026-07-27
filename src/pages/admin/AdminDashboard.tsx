import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Store,
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  Percent,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalVendors: number;
  pendingVendors: number;
  totalProducts: number;
  pendingProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalCommission: number;
}

const PIE_COLORS = [
  "hsl(140,45%,40%)",
  "hsl(28,75%,55%)",
  "hsl(38,80%,55%)",
  "hsl(200,70%,50%)",
  "hsl(340,70%,55%)",
  "hsl(0,75%,60%)",
];

const statusLabel = (s: string) => {
  const map: Record<string, string> = {
    pending: "অপেক্ষমান",
    processing: "প্রক্রিয়াধীন",
    shipped: "শিপ করা",
    delivered: "ডেলিভারি সম্পন্ন",
    cancelled: "বাতিল",
    refunded: "রিফান্ড",
  };
  return map[s] || s;
};

const bnDate = (d: Date) =>
  d.toLocaleDateString("bn-BD", { day: "numeric", month: "short" });

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalVendors: 0,
    pendingVendors: 0,
    totalProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalCommission: 0,
  });
  const [ordersByStatus, setOrdersByStatus] = useState<any[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [topVendors, setTopVendors] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [vendors, products, orders] = await Promise.all([
        supabase.from("vendors").select("id, store_name, is_approved"),
        supabase.from("products").select("id, is_approved, vendor_id"),
        supabase
          .from("orders")
          .select("id, status, total, commission_amount, created_at, order_number, vendor_id")
          .order("created_at", { ascending: false }),
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
        pendingOrders: orderData.filter((o) => o.status === "pending").length,
        totalRevenue: orderData.reduce((s, o) => s + Number(o.total), 0),
        totalCommission: orderData.reduce((s, o) => s + Number(o.commission_amount), 0),
      });

      // Order status pie
      const statusCounts: Record<string, number> = {};
      orderData.forEach((o) => {
        statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
      });
      setOrdersByStatus(
        Object.entries(statusCounts).map(([name, value]) => ({ name: statusLabel(name), value }))
      );

      // Revenue trend (last 14 days)
      const days: { key: string; label: string; revenue: number; orders: number }[] = [];
      const today = new Date();
      for (let i = 13; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        days.push({ key, label: bnDate(d), revenue: 0, orders: 0 });
      }
      const dayMap = Object.fromEntries(days.map((d) => [d.key, d]));
      orderData.forEach((o) => {
        const key = new Date(o.created_at).toISOString().slice(0, 10);
        if (dayMap[key]) {
          dayMap[key].revenue += Number(o.total);
          dayMap[key].orders += 1;
        }
      });
      setRevenueTrend(days);

      // Top vendors by orders
      const vendorNameMap = Object.fromEntries(
        vendorData.map((v: any) => [v.id, v.store_name])
      );
      const vendorTotals: Record<string, number> = {};
      orderData.forEach((o) => {
        if (o.vendor_id) {
          vendorTotals[o.vendor_id] = (vendorTotals[o.vendor_id] || 0) + Number(o.total);
        }
      });
      const top = Object.entries(vendorTotals)
        .map(([id, total]) => ({ name: vendorNameMap[id] || "—", total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
      setTopVendors(top);

      setRecentOrders(orderData.slice(0, 6));
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "মোট বিক্রেতা",
      value: stats.totalVendors,
      sub: `${stats.pendingVendors} অপেক্ষমান`,
      icon: Store,
      gradient: "from-emerald-500 to-green-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "মোট প্রোডাক্ট",
      value: stats.totalProducts,
      sub: `${stats.pendingProducts} অনুমোদনের অপেক্ষায়`,
      icon: Package,
      gradient: "from-amber-500 to-orange-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "মোট অর্ডার",
      value: stats.totalOrders,
      sub: `${stats.pendingOrders} নতুন`,
      icon: ShoppingCart,
      gradient: "from-sky-500 to-blue-600",
      bg: "bg-sky-50 dark:bg-sky-950/30",
    },
    {
      label: "মোট বিক্রি",
      value: `৳${stats.totalRevenue.toLocaleString("bn-BD")}`,
      sub: "সর্বমোট রাজস্ব",
      icon: TrendingUp,
      gradient: "from-fuchsia-500 to-pink-600",
      bg: "bg-fuchsia-50 dark:bg-fuchsia-950/30",
    },
    {
      label: "মোট কমিশন",
      value: `৳${stats.totalCommission.toLocaleString("bn-BD")}`,
      sub: "প্ল্যাটফর্ম আয়",
      icon: DollarSign,
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
    {
      label: "কমিশন হার",
      value: stats.totalRevenue > 0
        ? `${((stats.totalCommission / stats.totalRevenue) * 100).toFixed(1)}%`
        : "0%",
      sub: "গড়",
      icon: Percent,
      gradient: "from-teal-500 to-cyan-600",
      bg: "bg-teal-50 dark:bg-teal-950/30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-emerald-600 to-teal-600 p-6 text-primary-foreground shadow-lg">
        <div className="relative z-10">
          <h2 className="text-2xl font-display font-bold">স্বাগতম, অ্যাডমিন 👋</h2>
          <p className="mt-1 text-sm opacity-90">
            আজকের একনজরে পুরো মার্কেটপ্লেসের পরিসংখ্যান দেখুন
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              {stats.pendingOrders} নতুন অর্ডার
            </span>
            <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {stats.pendingVendors} বিক্রেতা অনুমোদন বাকি
            </span>
            <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Package className="w-3.5 h-3.5" />
              {stats.pendingProducts} প্রোডাক্ট অনুমোদন বাকি
            </span>
          </div>
        </div>
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -right-16 bottom-0 w-40 h-40 bg-yellow-300/20 rounded-full blur-3xl" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((s, i) => (
          <Card
            key={i}
            className={cn(
              "relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow",
              s.bg
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-sm",
                    s.gradient
                  )}
                >
                  <s.icon className="w-4.5 h-4.5 text-white" />
                </div>
              </div>
              <p className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                {s.value}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue trend */}
      <Card className="shadow-md border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">রাজস্ব ও অর্ডার ট্রেন্ড</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">গত ১৪ দিন</p>
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(140,45%,40%)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(140,45%,40%)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="ord" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(28,75%,55%)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(28,75%,55%)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="রাজস্ব (৳)"
                stroke="hsl(140,45%,40%)"
                strokeWidth={2}
                fill="url(#rev)"
              />
              <Area
                type="monotone"
                dataKey="orders"
                name="অর্ডার"
                stroke="hsl(28,75%,55%)"
                strokeWidth={2}
                fill="url(#ord)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two-column charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-base">অর্ডার স্ট্যাটাস</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    label={{ fontSize: 11 }}
                  >
                    {ordersByStatus.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12 text-sm">
                কোনো অর্ডার নেই
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-base">টপ ৫ বিক্রেতা</CardTitle>
          </CardHeader>
          <CardContent>
            {topVendors.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topVendors} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11 }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="total"
                    name="বিক্রি (৳)"
                    radius={[0, 6, 6, 0]}
                    fill="hsl(140,45%,40%)"
                  >
                    {topVendors.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12 text-sm">
                কোনো ডেটা নেই
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent orders */}
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="text-base">সাম্প্রতিক অর্ডার</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-2">
              {recentOrders.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-muted/40 to-transparent hover:from-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{o.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {statusLabel(o.status)} ·{" "}
                        {new Date(o.created_at).toLocaleDateString("bn-BD")}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-sm text-primary">
                    ৳{Number(o.total).toLocaleString("bn-BD")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12 text-sm">কোনো অর্ডার নেই</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
