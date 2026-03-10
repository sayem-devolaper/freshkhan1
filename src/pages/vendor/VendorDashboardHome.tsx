import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, Star } from "lucide-react";

const VendorDashboardHome = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, earnings: 0, rating: 0 });
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: vendor } = await supabase
        .from("vendors")
        .select("id, store_name, rating")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!vendor) return;
      setStoreName(vendor.store_name);

      const [productsRes, ordersRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("vendor_id", vendor.id),
        supabase.from("orders").select("total, vendor_earnings").eq("vendor_id", vendor.id),
      ]);

      const totalEarnings = ordersRes.data?.reduce((sum, o) => sum + Number(o.vendor_earnings), 0) || 0;

      setStats({
        products: productsRes.count || 0,
        orders: ordersRes.data?.length || 0,
        earnings: totalEarnings,
        rating: Number(vendor.rating) || 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "মোট পণ্য", value: stats.products, icon: Package, color: "text-primary" },
    { label: "মোট অর্ডার", value: stats.orders, icon: ShoppingCart, color: "text-accent" },
    { label: "মোট আয়", value: `৳${stats.earnings.toFixed(0)}`, icon: DollarSign, color: "text-primary" },
    { label: "রেটিং", value: stats.rating.toFixed(1), icon: Star, color: "text-accent" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display font-bold text-foreground">স্বাগতম, {storeName}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VendorDashboardHome;
