import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import HeroSection from "@/components/hero-section"
import FeaturedCakes from "@/components/featured-cakes"
import AboutSection from "@/components/about-section"
import TestimonialsSection from "@/components/testimonials-section"
import Cake3DWrapper from "@/components/cake-3d-wrapper"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with 3D Cake */}
      <HeroSection>
        <Cake3DWrapper />
      </HeroSection>

      {/* Featured Cakes */}
      <FeaturedCakes />

      {/* About Section */}
      <AboutSection />

      {/* Testimonials */}
      <TestimonialsSection />

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
