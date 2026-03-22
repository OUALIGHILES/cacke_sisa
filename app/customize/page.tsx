"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import CakeConfigurator from "@/components/cake-configurator"
import { useLanguage } from "@/contexts/language-context"

export default function CustomizePage() {
  const { t, dir } = useLanguage()

  return (
    <main className="min-h-screen" dir={dir}>
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-12 gradient-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient">{t("customizeYourCake")}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("designDreamCake")}
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
