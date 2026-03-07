import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import { vendors, products } from "@/data/mockData";
import { Star, MapPin, BadgeCheck, ArrowLeft } from "lucide-react";

const VendorStorePage = () => {
  const { id } = useParams();
  const vendor = vendors.find((v) => v.id === id);
  const vendorProducts = products.filter((p) => p.vendorId === id);

  if (!vendor) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-xl text-muted-foreground">Vendor not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Banner */}
        <div className="relative h-64 overflow-hidden">
          <img src={vendor.image} alt={vendor.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container">
              <Link to="/vendors" className="mb-3 inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground">
                <ArrowLeft className="h-4 w-4" /> All Vendors
              </Link>
              <h1 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">{vendor.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-primary-foreground/80">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {vendor.location}</span>
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-organic-gold text-organic-gold" /> {vendor.rating} ({vendor.reviewCount} reviews)</span>
                {vendor.certified && (
                  <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                    <BadgeCheck className="h-3 w-3" /> Certified Organic
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container py-10">
          <p className="max-w-2xl text-muted-foreground">{vendor.description}</p>

          <h2 className="mt-10 font-display text-2xl font-bold text-foreground">
            Products ({vendorProducts.length})
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {vendorProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {vendorProducts.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">No products listed yet.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VendorStorePage;
