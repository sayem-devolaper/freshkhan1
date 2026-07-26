import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroWithCategories from "@/components/home/HeroWithCategories";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoBanner from "@/components/home/PromoBanner";
import FeaturedVendors from "@/components/home/FeaturedVendors";
import WhyOrganicSection from "@/components/home/WhyOrganicSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Helmet>
        <title>ফ্রেশ খান — অর্গানিক মার্কেটপ্লেস | খামার থেকে টেবিলে</title>
        <meta name="description" content="সরাসরি কৃষক ও বিক্রেতাদের কাছ থেকে সার্টিফাইড অর্গানিক পণ্য কিনুন। তাজা শাকসবজি, ফল, দুগ্ধ ও মশলা আপনার দোরগোড়ায়।" />
        <link rel="canonical" href="https://freshkhan1.lovable.app/" />
        <meta property="og:url" content="https://freshkhan1.lovable.app/" />
        <meta property="og:title" content="ফ্রেশ খান — অর্গানিক মার্কেটপ্লেস" />
        <meta property="og:description" content="সরাসরি কৃষক ও বিক্রেতাদের কাছ থেকে সার্টিফাইড অর্গানিক পণ্য কিনুন।" />
      </Helmet>
      <Header />
      <main className="flex-1">
        <HeroWithCategories />
        <CategoriesGrid />
        <FeaturedProducts />
        <PromoBanner />
        <FeaturedVendors />
        <WhyOrganicSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
