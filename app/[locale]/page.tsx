import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ProductsPreview from "@/components/home/ProductsPreview";
import ProductSetsPreview from "@/components/home/ProductSetsPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import InstagramFeed from "@/components/home/InstagramFeed";
import BlogPreview from "@/components/home/BlogPreview";
import ConsultationSection from "@/components/home/ConsultationSection";
import VkiSection from "@/components/home/VkiSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import ProblemSolutionSection from "@/components/home/ProblemSolutionSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import ShopierStoreSection from "@/components/home/ShopierStoreSection";
import { isShopierMode } from "@/lib/store-mode";

export default function HomePage() {
  if (isShopierMode) {
    return (
      <>
        <HeroSection />
        <ProblemSolutionSection />
        <HowItWorksSection />
        <FeaturesSection />
        <VkiSection />
        <TestimonialsSection />
        <ShopierStoreSection />
        <ConsultationSection />
        <InstagramFeed />
        <BlogPreview />
        <NewsletterSection />
      </>
    );
  }

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <InstagramFeed />
      <ProductsPreview />
      <ProductSetsPreview />
      <VkiSection />
      <ConsultationSection />
      <TestimonialsSection />
      <BlogPreview />
      <NewsletterSection />
    </>
  );
}
