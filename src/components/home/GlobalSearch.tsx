import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ShoppingBag, Store, Tag, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { getSearchPatterns } from "@/lib/banglish";

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: "product" | "vendor" | "category";
  link: string;
}

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const patterns = getSearchPatterns(trimmed);
        
        // Run searches for all patterns in parallel
        const allProducts: typeof combined = [];
        const allVendors: typeof combined = [];
        const allCategories: typeof combined = [];
        
        const searches = patterns.map(async (pat) => {
          const searchPattern = `%${pat}%`;
          const [productsRes, vendorsRes, categoriesRes] = await Promise.all([
            supabase.from("products").select("id, name, price, unit").ilike("name", searchPattern).eq("is_approved", true).limit(5),
            supabase.from("vendors").select("id, store_name, address").ilike("store_name", searchPattern).eq("is_approved", true).eq("is_suspended", false).limit(5),
            supabase.from("categories").select("id, name, slug").ilike("name", searchPattern).limit(5),
          ]);
          return { productsRes, vendorsRes, categoriesRes };
        });
        
        const results_all = await Promise.all(searches);

        const combined: SearchResult[] = [];
        const seenIds = new Set<string>();
        
        for (const { categoriesRes, vendorsRes, productsRes } of results_all) {
          categoriesRes.data?.forEach((c) => { if (!seenIds.has(c.id)) { seenIds.add(c.id); combined.push({ id: c.id, title: c.name, type: "category", link: `/products?category=${c.slug}` }); }});
          vendorsRes.data?.forEach((v) => { if (!seenIds.has(v.id)) { seenIds.add(v.id); combined.push({ id: v.id, title: v.store_name, subtitle: v.address || undefined, type: "vendor", link: `/vendors/${v.id}` }); }});
          productsRes.data?.forEach((p) => { if (!seenIds.has(p.id)) { seenIds.add(p.id); combined.push({ id: p.id, title: p.name, subtitle: `৳${p.price}/${p.unit}`, type: "product", link: `/products/${p.id}` }); }});
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const typeIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "product": return <ShoppingBag className="h-4 w-4 text-primary" />;
      case "vendor": return <Store className="h-4 w-4 text-accent" />;
      case "category": return <Tag className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const typeLabel = (type: SearchResult["type"]) => {
    switch (type) {
      case "product": return "পণ্য";
      case "vendor": return "বিক্রেতা";
      case "category": return "ক্যাটাগরি";
    }
  };

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    navigate(result.link);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground sm:left-4 sm:h-5 sm:w-5" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="পণ্য, বিক্রেতা বা ক্যাটাগরি খুঁজুন..."
          className="h-10 rounded-full border-primary-foreground/20 bg-primary-foreground/10 pl-10 pr-10 text-sm text-primary-foreground placeholder:text-primary-foreground/50 backdrop-blur-md focus:bg-primary-foreground/20 focus:ring-primary sm:h-12 sm:pl-12 sm:pr-12 sm:text-base"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/60 hover:text-primary-foreground sm:right-4"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {loading && (
          <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary-foreground/60 sm:right-10" />
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 max-h-64 overflow-auto rounded-xl border border-border bg-card shadow-elevated sm:max-h-80"
          >
            {results.map((r) => (
              <button
                key={`${r.type}-${r.id}`}
                onClick={() => handleSelect(r)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-secondary first:rounded-t-xl last:rounded-b-xl sm:px-4 sm:py-3"
              >
                {typeIcon(r.type)}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{r.title}</p>
                  {r.subtitle && <p className="truncate text-xs text-muted-foreground">{r.subtitle}</p>}
                </div>
                <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {typeLabel(r.type)}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {query.trim().length >= 2 && !loading && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border border-border bg-card p-4 text-center shadow-elevated sm:p-6"
        >
          <p className="text-sm text-muted-foreground">কোনো ফলাফল পাওয়া যায়নি</p>
        </motion.div>
      )}
    </div>
  );
};

export default GlobalSearch;
