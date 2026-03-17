"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface HeroSectionProps {
  children: ReactNode
}

export default function HeroSection({ children }: HeroSectionProps) {
  const { t, dir } = useLanguage()

  return (
    <section className="relative min-h-screen overflow-hidden gradient-luxury">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Text Content */}
          <div className={`text-center lg:text-${dir === 'rtl' ? 'right' : 'left'} space-y-8 animate-fade-in-up`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-primary">
              <Sparkles className="w-4 h-4" />
              <span>{t("premiumCakes")}</span>
            </div>

            {/* Main Title */}
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gradient">SISA</span>
                <span className="text-foreground">_Cake</span>
              </h1>
              <p className="mt-2 text-lg text-primary font-medium tracking-wider">
                by <span className="font-bold">OUALI SANA</span>
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t("heroSubtitle")} <span className="text-primary font-semibold">{t("specialMoments")}</span>
            </p>

            {/* Description */}
            <p className="text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {t("heroDescription")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/gallery"
                className={`group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                {t("viewCakes")}
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </Link>
              <Link
                href="/customize"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full glass text-foreground font-semibold text-lg hover:bg-secondary/80 transition-all duration-300"
              >
                {t("customizeYourCake")}
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8">
              {[
                { value: "500+", label: t("cakesMade") },
                { value: "5", label: t("customerRating") },
                { value: "100%", label: t("freshIngredients") },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Cake Container */}
          <div className="relative animate-scale-in order-first lg:order-last" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              {/* Glow effect behind cake */}
              <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-2xl scale-90" />
              
              {children}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-muted-foreground">{t("scrollDown")}</span>
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
