import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroWithCategories from "@/components/home/HeroWithCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturedVendors from "@/components/home/FeaturedVendors";
import WhyOrganicSection from "@/components/home/WhyOrganicSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroWithCategories />
        <FeaturedProducts />
        <FeaturedVendors />
        <WhyOrganicSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
