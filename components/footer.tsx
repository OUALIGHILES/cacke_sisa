"use client"

import Link from "next/link"
import { Cake, Instagram, Mail, MapPin, Phone } from "lucide-react"
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
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Cake className="w-6 h-6 text-primary" />
              </div>
              <div>
                <span className="text-2xl font-bold block">
                  <span className="text-primary">SISA</span>_Cake
                </span>
                <span className="text-xs text-background/60">by OUALI SANA</span>
              </div>
            </Link>
            <p className="text-background/70 leading-relaxed">
              {t("footerDescription")}
            </p>
            
            {/* Signature */}
            <div className="pt-4 border-t border-background/10">
              <p className="text-sm text-background/50">{t("createdBy")}</p>
              <p className="text-xl font-bold text-primary mt-1">OUALI SANA</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">{t("quickLinks")}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">{t("contactUs")}</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-background/70">
                <Phone className="w-5 h-5 text-primary" />
                <span>+213 555 123 456</span>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Mail className="w-5 h-5 text-primary" />
                <span>contact@sisacake.com</span>
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Algiers, Algeria</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">{t("followUs")}</h4>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/sisacake" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/213555123456" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center hover:bg-[#25D366] transition-all duration-300"
                aria-label="WhatsApp"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contact@sisacake.com"
                className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-6 text-background/50 text-sm">
              {t("openDaily")}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/50 text-sm">
              © 2024 SISA_Cake by <span className="text-primary font-semibold">OUALI SANA</span>. {t("allRightsReserved")}
            </p>
            <div className="flex gap-6 text-sm text-background/50">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                {t("privacyPolicy")}
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                {t("termsOfService")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
