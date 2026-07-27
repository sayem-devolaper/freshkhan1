import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search, Loader2, ChevronDown, Grid2X2, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import freshkhanLogo from "@/assets/freshkhan-logo.png";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useCategories } from "@/hooks/use-categories";
import { getSearchPatterns } from "@/lib/banglish";
import { useSiteSetting } from "@/hooks/use-site-setting";

const HeaderSearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; title: string; link: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) { setResults([]); return; }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const patterns = getSearchPatterns(trimmed);
        const combined: { id: string; title: string; link: string }[] = [];
        const seenIds = new Set<string>();
        
        for (const pat of patterns) {
          const sp = `%${pat}%`;
          const [p, v, c] = await Promise.all([
            supabase.from("products").select("id, name").ilike("name", sp).eq("is_approved", true).limit(4),
            supabase.from("vendors_public").select("id, store_name").ilike("store_name", sp).eq("is_approved", true).limit(3),
            supabase.from("categories").select("id, name, slug").ilike("name", sp).limit(3),
          ]);
          c.data?.forEach((x) => { if (!seenIds.has(x.id)) { seenIds.add(x.id); combined.push({ id: x.id, title: x.name, link: `/products?category=${x.slug}` }); }});
          v.data?.forEach((x) => { if (!seenIds.has(x.id)) { seenIds.add(x.id); combined.push({ id: x.id, title: x.store_name, link: `/vendors/${x.id}` }); }});
          p.data?.forEach((x) => { if (!seenIds.has(x.id)) { seenIds.add(x.id); combined.push({ id: x.id, title: x.name, link: `/products/${x.id}` }); }});
        }
        
        setResults(combined);
        setOpen(true);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative flex-1 max-w-xl mx-4 hidden md:block">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder="পণ্য খুঁজুন..."
          className="h-10 w-full rounded-full border border-border bg-secondary/40 pl-4 pr-10 text-sm focus:bg-background"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </div>
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
          {results.map((r) => (
            <button
              key={r.id}
              onMouseDown={() => { navigate(r.link); setOpen(false); setQuery(""); }}
              className="flex w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-secondary transition-colors"
            >
              <Search className="h-3.5 w-3.5 mr-2 mt-0.5 text-muted-foreground shrink-0" />
              {r.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SupportInfo = () => {
  const phone = useSiteSetting("support_phone", "০১৭XX-XXXXXX");
  return (
    <div className="ml-auto flex items-center gap-2 text-sm">
      <Headphones className="h-4 w-4 text-primary" />
      <div className="text-left">
        <p className="text-[10px] text-muted-foreground leading-none">২৪/৭ সাপোর্ট</p>
        <p className="text-xs font-semibold text-foreground">{phone}</p>
      </div>
    </div>
  );
};

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const { totalItems } = useCart();
  const { data: categories } = useCategories();
  const [mobileQuery, setMobileQuery] = useState("");
  const [mobileResults, setMobileResults] = useState<{ id: string; title: string; link: string }[]>([]);
  const [mobileLoading, setMobileLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const trimmed = mobileQuery.trim();
    if (trimmed.length < 2) { setMobileResults([]); return; }
    const timeout = setTimeout(async () => {
      setMobileLoading(true);
      try {
        const patterns = getSearchPatterns(trimmed);
        const combined: { id: string; title: string; link: string }[] = [];
        const seenIds = new Set<string>();
        
        for (const pat of patterns) {
          const sp = `%${pat}%`;
          const [p, v, c] = await Promise.all([
            supabase.from("products").select("id, name").ilike("name", sp).eq("is_approved", true).limit(4),
            supabase.from("vendors_public").select("id, store_name").ilike("store_name", sp).eq("is_approved", true).limit(3),
            supabase.from("categories").select("id, name, slug").ilike("name", sp).limit(3),
          ]);
          c.data?.forEach((x) => { if (!seenIds.has(x.id)) { seenIds.add(x.id); combined.push({ id: x.id, title: x.name, link: `/products?category=${x.slug}` }); }});
          v.data?.forEach((x) => { if (!seenIds.has(x.id)) { seenIds.add(x.id); combined.push({ id: x.id, title: x.store_name, link: `/vendors/${x.id}` }); }});
          p.data?.forEach((x) => { if (!seenIds.has(x.id)) { seenIds.add(x.id); combined.push({ id: x.id, title: x.name, link: `/products/${x.id}` }); }});
        }
        
        setMobileResults(combined);
      } catch { setMobileResults([]); }
      finally { setMobileLoading(false); }
    }, 300);
    return () => clearTimeout(timeout);
  }, [mobileQuery]);

  const navLinks = [
    { label: "হোম", to: "/" },
    { label: "পণ্যসমূহ", to: "/products" },
    { label: "বিক্রেতা", to: "/vendors" },
    { label: "ব্লগ", to: "/blog" },
    { label: "আমাদের সম্পর্কে", to: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      {/* Row 1: Logo | Search | Account & Cart */}
      <div className="border-b border-border/50">
        <div className="container flex h-14 items-center justify-between gap-3 px-3 sm:h-16 sm:px-4">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img src={freshkhanLogo} alt="FreshKhan" className="h-8 w-auto sm:h-10" />
          </Link>

          {/* Center search - desktop */}
          <HeaderSearchBar />

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Account */}
            <Link to="/login" className="hidden sm:flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <User className="h-4 w-4" />
            </Link>

            {/* Cart */}
            <Link to="/cart" aria-label={`কার্ট দেখুন (${totalItems} পণ্য)`} className="relative flex items-center justify-center h-9 w-9 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
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
      </div>

      {/* Row 2: Categories dropdown + Nav links - desktop */}
      <div className="hidden md:block">
        <div className="container flex h-11 items-center gap-6 px-3 sm:px-4">
          {/* Categories dropdown */}
          <div className="relative">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Grid2X2 className="h-4 w-4" />
              ক্যাটাগরি
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 mt-1 z-50 w-56 rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
                {(categories || []).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    onClick={() => setCatOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name.replace("অর্গানিক ", "")}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Nav links */}
          <nav className="flex-1 flex items-center justify-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Support info - far right */}
          <SupportInfo />
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 md:hidden">
          {/* Mobile search */}
          <div className="py-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={mobileQuery}
                onChange={(e) => setMobileQuery(e.target.value)}
                placeholder="পণ্য খুঁজুন..."
                className="h-10 pl-9 pr-8 rounded-lg"
                autoFocus
              />
              {mobileLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            {mobileResults.length > 0 && (
              <div className="max-h-48 overflow-auto rounded-lg border border-border bg-card">
                {mobileResults.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { navigate(r.link); setMobileOpen(false); }}
                    className="flex w-full px-3 py-2.5 text-left text-sm text-foreground hover:bg-secondary"
                  >
                    {r.title}
                  </button>
                ))}
              </div>
            )}
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
