import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturedVendors from "@/components/home/FeaturedVendors";
import WhyOrganicSection from "@/components/home/WhyOrganicSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
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
