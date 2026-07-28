import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Tag as TagIcon } from "lucide-react";

interface BlogItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  author: string | null;
  category: string | null;
  tags: string[] | null;
}

const BlogListPage = () => {
  const [posts, setPosts] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();
  const activeCategory = params.get("category") || "";
  const activeTag = params.get("tag") || "";

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id,slug,title,excerpt,cover_image,published_at,author,category,tags")
        .eq("is_published", true)
        .order("published_at", { ascending: false, nullsFirst: false });
      setPosts((data || []) as BlogItem[]);
      setLoading(false);
    })();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category).filter(Boolean))) as string[],
    [posts]
  );
  const tags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags || []))),
    [posts]
  );

  const filtered = posts.filter((p) => {
    if (activeCategory && p.category !== activeCategory) return false;
    if (activeTag && !(p.tags || []).includes(activeTag)) return false;
    return true;
  });

  const setFilter = (key: string, val: string) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val); else next.delete(key);
    setParams(next);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>ব্লগ — ফ্রেশ খান</title>
        <meta name="description" content="অর্গানিক জীবনযাপন, কৃষি ও স্বাস্থ্য বিষয়ক ফ্রেশ খান ব্লগ" />
        <link rel="canonical" href="https://freshkhan.com/blog" />
      </Helmet>
      <Header />
      <main className="flex-1 container py-10">
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">ব্লগ</h1>
          <p className="text-muted-foreground mt-2">অর্গানিক জীবনযাপন ও কৃষি বিষয়ক লেখা</p>
        </div>

        {(categories.length > 0 || tags.length > 0) && (
          <div className="mb-8 space-y-3">
            {categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Category:</span>
                <Button size="sm" variant={!activeCategory ? "default" : "outline"} onClick={() => setFilter("category", "")}>সব</Button>
                {categories.map((c) => (
                  <Button key={c} size="sm" variant={activeCategory === c ? "default" : "outline"} onClick={() => setFilter("category", c)}>
                    {c}
                  </Button>
                ))}
              </div>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Tags:</span>
                {activeTag && (
                  <Badge variant="default" className="cursor-pointer" onClick={() => setFilter("tag", "")}>
                    #{activeTag} ✕
                  </Badge>
                )}
                {!activeTag && tags.slice(0, 15).map((t) => (
                  <Badge key={t} variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => setFilter("tag", t)}>
                    #{t}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-44 w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-center py-12">কোনো পোস্ট নেই।</p>
          ) : (
            filtered.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  {p.cover_image ? (
                    <img src={p.cover_image} alt={p.title} className="h-44 w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-44 w-full bg-gradient-to-br from-primary/20 to-primary/5" />
                  )}
                  <CardContent className="p-4">
                    {p.category && <Badge variant="secondary" className="mb-2">{p.category}</Badge>}
                    <h3 className="font-display font-semibold text-foreground line-clamp-2 mb-2">{p.title}</h3>
                    {p.excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.excerpt}</p>}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {p.published_at ? new Date(p.published_at).toLocaleDateString("bn-BD") : ""}
                      {p.author && <span>· {p.author}</span>}
                    </div>
                    {(p.tags?.length || 0) > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {(p.tags || []).slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <TagIcon className="h-2.5 w-2.5" />{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogListPage;
