"use client"

import Image from "next/image"
import { Award, Heart, Leaf, Clock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function AboutSection() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Heart,
      title: t("madeWithLove"),
      description: t("madeWithLoveDesc"),
    },
    {
      icon: Leaf,
      title: t("freshIngredientsTitle"),
      description: t("freshIngredientsDesc"),
    },
    {
      icon: Award,
      title: t("awardWinning"),
      description: t("awardWinningDesc"),
    },
    {
      icon: Clock,
      title: t("onTimeDelivery"),
      description: t("onTimeDeliveryDesc"),
    },
  ]

  return (
    <section className="py-24 gradient-luxury">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl cake-card-hover">
                  <Image
                    src="https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=400&h=500&fit=crop"
                    alt="Baker decorating cake"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl cake-card-hover">
                  <Image
                    src="https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&h=400&fit=crop"
                    alt="Cake decoration closeup"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl cake-card-hover">
                  <Image
                    src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop"
                    alt="Beautiful wedding cake"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl cake-card-hover">
                  <Image
                    src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400&h=500&fit=crop"
                    alt="Cake slices"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 lg:bottom-8 lg:-right-8 glass rounded-2xl p-6 shadow-xl animate-float">
              <div className="text-4xl font-bold text-gradient">10+</div>
              <div className="text-muted-foreground text-sm">{t("yearsExperience")}</div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {t("ourStory")}
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                {t("craftingSweet")} <span className="text-gradient">{t("memories")}</span>
              </h2>
              
              {/* Owner Highlight */}
              <div className="glass rounded-2xl p-4 inline-block">
                <p className="text-primary font-semibold text-lg">
                  OUALI SANA
                </p>
                <p className="text-muted-foreground text-sm">Founder & Master Baker</p>
              </div>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t("aboutDescription1")}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t("aboutDescription2")}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature) => (
                <div 
                  key={feature.title}
                  className="glass rounded-2xl p-5 cake-card-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
