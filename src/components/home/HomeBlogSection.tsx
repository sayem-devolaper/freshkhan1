import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays } from "lucide-react";

interface BlogCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  author: string | null;
}

const HomeBlogSection = () => {
  const [posts, setPosts] = useState<BlogCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id,slug,title,excerpt,cover_image,published_at,author")
        .eq("is_published", true)
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(3);
      setPosts((data || []) as BlogCard[]);
      setLoading(false);
    })();
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">সর্বশেষ ব্লগ</h2>
            <p className="text-sm text-muted-foreground mt-1">অর্গানিক জীবনযাপন ও কৃষি বিষয়ক লেখা</p>
          </div>
          <Link to="/blog" className="text-sm text-primary hover:underline font-medium">সব পোস্ট →</Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-44 w-full" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))
            : posts.map((p) => (
                <Link key={p.id} to={`/blog/${p.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    {p.cover_image ? (
                      <img src={p.cover_image} alt={p.title} className="h-44 w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="h-44 w-full bg-gradient-to-br from-primary/20 to-primary/5" />
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-display font-semibold text-foreground line-clamp-2 mb-2">{p.title}</h3>
                      {p.excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.excerpt}</p>}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {p.published_at ? new Date(p.published_at).toLocaleDateString("bn-BD") : ""}
                        {p.author && <span>· {p.author}</span>}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
};

export default HomeBlogSection;
