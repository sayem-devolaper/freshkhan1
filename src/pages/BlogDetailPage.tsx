import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, User, Tag as TagIcon } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published_at: string | null;
  author: string | null;
  category: string | null;
  tags: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
}

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      setPost((data as BlogPost) || null);
      setLoading(false);
    })();
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-10">
        {loading ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : !post ? (
          <div className="text-center py-16">
            <h1 className="font-display text-2xl font-bold mb-2">পোস্ট পাওয়া যায়নি</h1>
            <Button asChild><Link to="/blog">ব্লগে ফিরে যান</Link></Button>
          </div>
        ) : (
          <article className="max-w-3xl mx-auto">
            <Helmet>
              <title>{post.meta_title || `${post.title} — ফ্রেশ খান ব্লগ`}</title>
              <meta name="description" content={post.meta_description || post.excerpt || post.title} />
              <link rel="canonical" href={`https://freshkhan.com/blog/${post.slug}`} />
              <meta property="og:title" content={post.meta_title || post.title} />
              <meta property="og:description" content={post.meta_description || post.excerpt || ""} />
              {post.cover_image && <meta property="og:image" content={post.cover_image} />}
              <meta property="og:url" content={`https://freshkhan.com/blog/${post.slug}`} />
              <meta property="og:type" content="article" />
              <meta name="twitter:card" content="summary_large_image" />
              {post.tags && post.tags.length > 0 && (
                <meta name="keywords" content={post.tags.join(", ")} />
              )}
            </Helmet>

            <Link to="/blog" className="text-sm text-primary hover:underline">← সব পোস্ট</Link>
            {post.category && (
              <div className="mt-3">
                <Link to={`/blog?category=${encodeURIComponent(post.category)}`}>
                  <Badge variant="secondary">{post.category}</Badge>
                </Link>
              </div>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              {post.author && (
                <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {post.author}</span>
              )}
              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(post.published_at).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
            </div>
            {post.cover_image && (
              <img src={post.cover_image} alt={post.title} className="w-full rounded-lg mb-6 object-cover max-h-96" />
            )}
            {post.excerpt && (
              <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4 mb-6">{post.excerpt}</p>
            )}
            <div
              className="prose prose-sm md:prose-base max-w-none prose-headings:font-display prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {(post.tags?.length || 0) > 0 && (
              <div className="mt-10 pt-6 border-t">
                <div className="flex flex-wrap items-center gap-2">
                  <TagIcon className="h-4 w-4 text-muted-foreground" />
                  {(post.tags || []).map((t) => (
                    <Link key={t} to={`/blog?tag=${encodeURIComponent(t)}`}>
                      <Badge variant="outline" className="hover:bg-primary/10">#{t}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetailPage;
