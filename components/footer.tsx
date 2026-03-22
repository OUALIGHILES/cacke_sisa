"use client"

import Link from "next/link"
import { Cake, Instagram, Mail, MapPin, Phone, Heart, Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Footer() {
  const { t } = useLanguage()

  const quickLinks = [
    { label: t("home"), href: "/" },
    { label: t("gallery"), href: "/gallery" },
    { label: t("customize"), href: "/customize" },
    { label: t("contact"), href: "/contact" },
  ]

  return (
    <footer className="relative bg-gradient-to-b from-muted to-background border-t border-border overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-md group-hover:blur-lg transition-all duration-300" />
                <Cake className="relative w-7 h-7 text-primary" />
              </div>
              <div>
                <span className="text-2xl font-bold block font-playfair">
                  <span className="text-primary bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">SISA</span>_Cake
                </span>
                <span className="text-xs text-muted-foreground/80 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  by OUALI SANA
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {t("footerDescription")}
            </p>

            {/* Signature */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground/70 flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary fill-primary" />
                {t("createdBy")}
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mt-2 font-playfair">OUALI SANA</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="relative group">
            {/* Decorative element */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            <div className="relative">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2 font-playfair text-foreground">
                <span className="w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                {t("quickLinks")}
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href} className="group/link">
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-all duration-300 flex items-center gap-2 group-hover/link:translate-x-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover/link:bg-primary transition-colors duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="relative group">
            {/* Decorative element */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            <div className="relative">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2 font-playfair text-foreground">
                <span className="w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                {t("contactUs")}
              </h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-muted-foreground group/item hover:text-primary transition-colors duration-300">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors duration-300">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <span>+213 555 123 456</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground group/item hover:text-primary transition-colors duration-300">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors duration-300">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <span>contact@sisacake.com</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground group/item hover:text-primary transition-colors duration-300">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors duration-300 mt-0.5">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span>Algiers, Algeria</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="relative group">
            {/* Decorative element */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            <div className="relative">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2 font-playfair text-foreground">
                <span className="w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                {t("followUs")}
              </h4>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/sisacake"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/social w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center hover:from-primary hover:to-primary/80 hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/213540000739"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/social w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center hover:from-[#25D366] hover:to-[#20bd5a] hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-1"
                  aria-label="WhatsApp"
                >
                  <Phone className="w-5 h-5" />
                </a>
                <a
                  href="mailto:contact@sisacake.com"
                  className="group/social w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center hover:from-primary hover:to-primary/80 hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
              <p className="mt-6 text-muted-foreground/70 text-sm flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-primary" />
                {t("openDaily")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-border/50 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground/70 text-sm flex items-center gap-2">
              © 2024 SISA_Cake
              <Heart className="w-3.5 h-3.5 text-primary fill-primary animate-pulse" />
              <span className="text-primary font-semibold">OUALI SANA</span>. {t("allRightsReserved")}
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground/70">
              <Link href="/privacy" className="hover:text-primary transition-colors duration-300 relative group">
                <span className="relative z-10">{t("privacyPolicy")}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors duration-300 relative group">
                <span className="relative z-10">{t("termsOfService")}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
