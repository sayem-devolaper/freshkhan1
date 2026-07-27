import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import { useVendor } from "@/hooks/use-vendors";
import { useProducts } from "@/hooks/use-products";
import { Star, MapPin, BadgeCheck, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const VendorStorePage = () => {
  const { id } = useParams();
  const { data: vendor, isLoading: vendorLoading } = useVendor(id);
  const { data: allProducts } = useProducts();

  const vendorProducts = (allProducts || []).filter((p) => p.vendorId === id);

  if (vendorLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-background">
          <Skeleton className="h-48 w-full sm:h-64" />
          <div className="container px-4 py-6 sm:py-10">
            <Skeleton className="h-6 w-2/3 mb-4" />
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4">
          <p className="text-xl text-muted-foreground">বিক্রেতা খুঁজে পাওয়া যায়নি</p>
        </main>
        <Footer />
      </div>
    );
  }

  const canonical = `https://freshkhan1.lovable.app/vendors/${vendor.id}`;
  const storeLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: vendor.name,
    description: vendor.description || vendor.name,
    image: vendor.image,
    url: canonical,
    address: { "@type": "PostalAddress", addressLocality: vendor.location, addressCountry: "BD" },
    aggregateRating: vendor.reviewCount
      ? { "@type": "AggregateRating", ratingValue: vendor.rating, reviewCount: vendor.reviewCount }
      : undefined,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "হোম", item: "https://freshkhan1.lovable.app/" },
      { "@type": "ListItem", position: 2, name: "বিক্রেতা", item: "https://freshkhan1.lovable.app/vendors" },
      { "@type": "ListItem", position: 3, name: vendor.name, item: canonical },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>{`${vendor.name} | ফ্রেশ খান`}</title>
        <meta name="description" content={`${vendor.name} — ${vendor.location}। ${vendor.description || ""}`.slice(0, 160)} />
        <link rel="canonical" href={canonical} />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={`${vendor.name} | ফ্রেশ খান`} />
        <meta property="og:description" content={(vendor.description || vendor.name).slice(0, 160)} />
        <meta property="og:image" content={vendor.image} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(storeLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>
      <Header />
      <main className="flex-1 bg-background">
        <div className="relative h-48 overflow-hidden sm:h-64">
          <img src={vendor.image} alt={vendor.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
            <div className="container">
              <Link to="/vendors" className="mb-2 inline-flex items-center gap-1 text-xs text-primary-foreground/70 hover:text-primary-foreground sm:mb-3 sm:text-sm">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" /> সকল বিক্রেতা
              </Link>
              <h1 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl lg:text-4xl">{vendor.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-primary-foreground/80 sm:mt-2 sm:gap-4 sm:text-sm">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {vendor.location}</span>
                <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-organic-gold text-organic-gold sm:h-3.5 sm:w-3.5" /> {vendor.rating} ({vendor.reviewCount} রিভিউ)</span>
                {vendor.certified && (
                  <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground sm:text-xs">
                    <BadgeCheck className="h-3 w-3" /> সার্টিফাইড
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 py-6 sm:py-10">
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{vendor.description}</p>

          <h2 className="mt-8 font-display text-xl font-bold text-foreground sm:mt-10 sm:text-2xl">
            পণ্যসমূহ ({vendorProducts.length})
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-6 lg:grid-cols-4">
            {vendorProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {vendorProducts.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">এখনো কোনো পণ্য তালিকাভুক্ত হয়নি।</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VendorStorePage;
