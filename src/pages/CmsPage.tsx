import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { usePage } from "@/hooks/use-page";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const CmsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading } = usePage(slug);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-10">
        {isLoading ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : !page ? (
          <div className="text-center py-16">
            <h1 className="font-display text-2xl font-bold mb-2">পেজ পাওয়া যায়নি</h1>
            <p className="text-muted-foreground mb-4">এই পেজটি বিদ্যমান নেই বা অপ্রকাশিত।</p>
            <Button asChild><Link to="/">হোমে ফিরে যান</Link></Button>
          </div>
        ) : (
          <article className="max-w-3xl mx-auto">
            <Helmet>
              <title>{page.meta_title || page.title}</title>
              {page.meta_description && <meta name="description" content={page.meta_description} />}
              <link rel="canonical" href={`https://freshkhan.com/page/${page.slug}`} />
              <meta property="og:title" content={page.meta_title || page.title} />
              {page.meta_description && <meta property="og:description" content={page.meta_description} />}
              <meta property="og:url" content={`https://freshkhan.com/page/${page.slug}`} />
            </Helmet>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              {page.title}
            </h1>
            <div
              className="prose prose-sm md:prose-base max-w-none prose-headings:font-display prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CmsPage;
