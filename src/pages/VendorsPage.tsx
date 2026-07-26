import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import VendorCard from "@/components/VendorCard";
import { useVendors } from "@/hooks/use-vendors";
import { Skeleton } from "@/components/ui/skeleton";

const VendorsPage = () => {
  const { data: vendors, isLoading } = useVendors();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="bg-primary py-12">
          <div className="container">
            <h1 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">আমাদের বিক্রেতারা</h1>
            <p className="mt-2 text-primary-foreground/70">আমাদের অর্গানিক পণ্যের পেছনের কৃষক ও বিক্রেতাদের সাথে পরিচিত হন</p>
          </div>
        </div>
        <div className="container py-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-52 rounded-xl" />
                ))
              : (vendors || []).map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
          </div>
          {!isLoading && (vendors || []).length === 0 && (
            <p className="py-12 text-center text-muted-foreground">কোনো বিক্রেতা পাওয়া যায়নি</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VendorsPage;
