import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import CakeConfigurator from "@/components/cake-configurator"

export const metadata = {
  title: "Customize Your Cake | SISA_Cake",
  description: "Design your perfect cake with our easy-to-use configurator. Choose sizes, add-ons, and see your price update in real-time.",
}

export default function CustomizePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Page Header */}
      <section className="pt-32 pb-12 gradient-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient">Customize</span>{" "}
            <span className="text-foreground">Your Cake</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Design your dream cake with our interactive configurator. 
            Choose your size, add extras, and watch your price update in real-time.
          </p>
        </div>
      </section>

      {/* Configurator */}
      <CakeConfigurator />

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
