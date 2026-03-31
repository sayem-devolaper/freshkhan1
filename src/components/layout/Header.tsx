import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import freshkhanLogo from "@/assets/freshkhan-logo.png";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import HeaderSearch from "./HeaderSearch";

const MobileSearch = ({ onClose }: { onClose: () => void }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; title: string; link: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) { setResults([]); return; }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const pat = `%${trimmed}%`;
        const [p, v, c] = await Promise.all([
          supabase.from("products").select("id, name").ilike("name", pat).eq("is_approved", true).limit(4),
          supabase.from("vendors").select("id, store_name").ilike("store_name", pat).eq("is_approved", true).limit(3),
          supabase.from("categories").select("id, name, slug").ilike("name", pat).limit(3),
        ]);
        const combined: { id: string; title: string; link: string }[] = [];
        c.data?.forEach((x) => combined.push({ id: x.id, title: x.name, link: `/products?category=${x.slug}` }));
        v.data?.forEach((x) => combined.push({ id: x.id, title: x.store_name, link: `/vendors/${x.id}` }));
        p.data?.forEach((x) => combined.push({ id: x.id, title: x.name, link: `/products/${x.id}` }));
        setResults(combined);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="খুঁজুন..."
          className="h-10 pl-9 pr-8 rounded-lg"
          autoFocus
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      {results.length > 0 && (
        <div className="max-h-48 overflow-auto rounded-lg border border-border bg-card">
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => { navigate(r.link); onClose(); }}
              className="flex w-full px-3 py-2.5 text-left text-sm text-foreground hover:bg-secondary"
            >
              {r.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();

  const navLinks = [
    { label: "হোম", to: "/" },
    { label: "পণ্যসমূহ", to: "/products" },
    { label: "বিক্রেতা", to: "/vendors" },
    { label: "আমাদের সম্পর্কে", to: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between gap-2 bg-primary-foreground px-3 sm:h-16 sm:gap-4 sm:px-4">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src={freshkhanLogo} alt="FreshKhan" className="h-7 w-auto sm:h-9" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-lg px-3 py-2 text-sm font-mono font-extrabold text-secondary-foreground bg-destructive-foreground transition-colors lg:px-4"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <HeaderSearch />
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="hero" size="sm" className="hidden sm:flex">
              <User className="h-4 w-4" />
              সাইন ইন
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 md:hidden">
          <div className="py-3">
            <MobileSearch onClose={() => setMobileOpen(false)} />
          </div>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="hero" className="mt-2 w-full">
                <User className="h-4 w-4" />
                সাইন ইন
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
