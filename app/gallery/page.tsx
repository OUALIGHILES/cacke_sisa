import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import CakeGallery from "@/components/cake-gallery"

export const metadata = {
  title: "Cake Gallery | SISA_Cake",
  description: "Browse our beautiful collection of handmade cakes for birthdays, weddings, and special occasions.",
}

export default function GalleryPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 gradient-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient">Our Cake</span>{" "}
            <span className="text-foreground">Gallery</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover our collection of beautiful handmade cakes, each crafted with love 
            and premium ingredients for your special moments.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <CakeGallery />

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
