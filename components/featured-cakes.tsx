"use client"

import Link from "next/link"
import CakeCard from "./cake-card"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Sample data - in production this would come from Supabase
const featuredCakes = [
  {
    id: "1",
    title: "Pink Rose Dream",
    description: "A delicate three-tier cake adorned with handcrafted sugar roses and pearl accents. Perfect for elegant celebrations.",
    price: 85,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop",
  },
  {
    id: "2",
    title: "Chocolate Truffle Bliss",
    description: "Rich Belgian chocolate layers with velvety ganache frosting. A chocolate lover's paradise.",
    price: 75,
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&h=600&fit=crop",
  },
  {
    id: "3",
    title: "Strawberry Delight",
    description: "Fresh strawberries layered between vanilla sponge with cream cheese frosting. Light and refreshing.",
    price: 65,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop",
  },
  {
    id: "4",
    title: "Golden Anniversary",
    description: "Elegant gold-brushed fondant with intricate lace patterns. Perfect for milestone celebrations.",
    price: 120,
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&h=600&fit=crop",
  },
  {
    id: "5",
    title: "Rainbow Surprise",
    description: "Colorful layers of vanilla sponge with buttercream frosting. A party favorite for kids!",
    price: 55,
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&h=600&fit=crop",
  },
  {
    id: "6",
    title: "Classic Red Velvet",
    description: "Traditional red velvet with cream cheese frosting and white chocolate shavings.",
    price: 70,
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&h=600&fit=crop",
  },
]

export default function FeaturedCakes() {
  const { t, dir } = useLanguage()

  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {t("featuredCakes")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            {t("ourSignature")} <span className="text-gradient">{t("creations")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Discover our most loved creations, each one crafted with passion by OUALI SANA.
          </p>
        </div>

        {/* Cakes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCakes.map((cake, index) => (
            <CakeCard
              key={cake.id}
              {...cake}
              index={index}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            href="/gallery"
            className={`group inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-primary text-primary font-semibold text-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            {t("viewAll")}
            <ArrowRight className={`w-5 h-5 group-hover:translate-x-2 transition-transform ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-2' : ''}`} />
          </Link>
        </div>
      </div>
    </section>
  )
}
