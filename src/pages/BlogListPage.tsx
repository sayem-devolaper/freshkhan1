import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays } from "lucide-react";

interface BlogItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  author: string | null;
}

const BlogListPage = () => {
  const [posts, setPosts] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id,slug,title,excerpt,cover_image,published_at,author")
        .eq("is_published", true)
        .order("published_at", { ascending: false, nullsFirst: false });
      setPosts((data || []) as BlogItem[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>ব্লগ — ফ্রেশ খান</title>
        <meta name="description" content="অর্গানিক জীবনযাপন, কৃষি ও স্বাস্থ্য বিষয়ক ফ্রেশ খান ব্লগ" />
        <link rel="canonical" href="https://freshkhan.com/blog" />
      </Helmet>
      <Header />
      <main className="flex-1 container py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">ব্লগ</h1>
          <p className="text-muted-foreground mt-2">অর্গানিক জীবনযাপন ও কৃষি বিষয়ক লেখা</p>
        </div>

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
          ) : posts.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-center py-12">কোনো পোস্ট নেই।</p>
          ) : (
            posts.map((p) => (
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
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogListPage;
