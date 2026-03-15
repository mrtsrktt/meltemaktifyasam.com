import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ProductsPreview from "@/components/home/ProductsPreview";
import ProductSetsPreview from "@/components/home/ProductSetsPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import InstagramFeed from "@/components/home/InstagramFeed";
import BlogPreview from "@/components/home/BlogPreview";
import ConsultationSection from "@/components/home/ConsultationSection";
import VkiSection from "@/components/home/VkiSection";

export default function HomePage() {
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
    </>
  );
}
