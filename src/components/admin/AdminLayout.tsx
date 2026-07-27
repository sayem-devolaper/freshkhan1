import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  Package,
  Percent,
  LogOut,
  Menu,
  X,
  Leaf,
  Users,
  Bell,
  Home,
  FileText,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "ড্যাশবোর্ড", color: "from-emerald-500 to-green-600" },
  { to: "/admin/homepage", icon: Home, label: "হোম পেজ কন্টেন্ট", color: "from-sky-500 to-blue-600" },
  { to: "/admin/pages", icon: FileText, label: "পেজ ম্যানেজমেন্ট", color: "from-indigo-500 to-violet-600" },
  { to: "/admin/branding", icon: Palette, label: "ব্র্যান্ডিং ও ফুটার", color: "from-fuchsia-500 to-pink-600" },
  { to: "/admin/vendors", icon: Store, label: "বিক্রেতা ম্যানেজমেন্ট", color: "from-amber-500 to-orange-600" },
  { to: "/admin/orders", icon: ShoppingCart, label: "অর্ডার ম্যানেজমেন্ট", color: "from-rose-500 to-red-600" },
  { to: "/admin/products", icon: Package, label: "প্রোডাক্ট ম্যানেজমেন্ট", color: "from-teal-500 to-cyan-600" },
  { to: "/admin/commission", icon: Percent, label: "কমিশন সেটিংস", color: "from-purple-500 to-fuchsia-600" },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display font-bold text-foreground">ফ্রেশ খান</span>
                <span className="block text-xs text-muted-foreground">অ্যাডমিন প্যানেল</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 w-full transition-colors"
            >
              <LogOut className="w-5 h-5" />
              লগআউট
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-display font-semibold text-foreground hidden lg:block">
            {navItems.find((i) => i.to === location.pathname)?.label || "অ্যাডমিন"}
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
