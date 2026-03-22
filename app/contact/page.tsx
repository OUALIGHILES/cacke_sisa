"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import ContactForm from "@/components/contact-form"
import LocationMap from "@/components/location-map"
import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const contactInfo = [
  {
    icon: Phone,
    titleKey: "phone",
    value: "+213 54 00 00 739",
    link: "https://wa.me/213540000739",
  },
  {
    icon: Mail,
    titleKey: "email",
    value: "contact@sisacake.com",
    link: "mailto:contact@sisacake.com",
  },
  {
    icon: Instagram,
    titleKey: "instagram",
    value: "@sisa_cake",
    link: "https://instagram.com/sisa_cake",
  },
  {
    icon: Clock,
    titleKey: "workingHours",
    value: "Mon-Sat: 9AM - 6PM",
    link: null,
  },
]

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-16 gradient-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient">{t("getInTouch")}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("haveQuestions")}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info & Social */}
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h2 className="text-3xl font-bold mb-6">{t("contactInfo")}</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {t("reachOut")}
                </p>
              </div>

              {/* Contact Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-card border border-border shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{t(info.titleKey)}</h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">{info.value}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Contact Buttons */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{t("quickContact")}</h3>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://wa.me/213540000739"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {t("whatsapp")}
                  </a>
                  <a
                    href="mailto:contact@sisacake.com"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Mail className="w-5 h-5" />
                    {t("emailUs")}
                  </a>
                  <a
                    href="https://instagram.com/sisa_cake"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Instagram className="w-5 h-5" />
                    {t("instagram")}
                  </a>
                </div>
              </div>

              {/* Location Card */}
              <div className="p-6 rounded-3xl bg-card border border-border shadow-lg">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{t("ourLocation")}</h3>
                    <p className="text-muted-foreground">
                      Ait Anane, Darguina<br />
                      Bejaia, Algeria
                    </p>
                  </div>
                </div>
                <LocationMap />
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
