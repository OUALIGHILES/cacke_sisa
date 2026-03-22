"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, ShoppingBag, Star, Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"

interface Cake {
  id: number
  title: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  popular: boolean
}

// Sample cake data - same as gallery
const allCakes: Cake[] = [
  {
    id: 1,
    title: "Classic Birthday Cake",
    description: "A timeless vanilla sponge with buttercream frosting, perfect for any birthday celebration.",
    price: 45,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
    category: "birthday",
    rating: 5,
    popular: true,
  },
  {
    id: 2,
    title: "Chocolate Dream",
    description: "Rich chocolate layers with ganache, topped with chocolate curls and berries.",
    price: 55,
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&h=500&fit=crop",
    category: "birthday",
    rating: 5,
    popular: true,
  },
  {
    id: 3,
    title: "Strawberry Delight",
    description: "Fresh strawberry sponge with cream cheese frosting and fresh strawberries.",
    price: 50,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=500&fit=crop",
    category: "birthday",
    rating: 4,
    popular: false,
  },
  {
    id: 4,
    title: "Elegant White Wedding",
    description: "A stunning multi-tier white cake with delicate sugar flowers and gold accents.",
    price: 250,
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&h=500&fit=crop",
    category: "wedding",
    rating: 5,
    popular: true,
  },
  {
    id: 5,
    title: "Red Velvet Romance",
    description: "Classic red velvet with smooth cream cheese frosting and delicate rose decorations.",
    price: 60,
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&h=500&fit=crop",
    category: "birthday",
    rating: 5,
    popular: true,
  },
  {
    id: 6,
    title: "Unicorn Fantasy",
    description: "A magical cake with rainbow layers, colorful buttercream, and unicorn decorations.",
    price: 75,
    image: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=500&h=500&fit=crop",
    category: "kids",
    rating: 5,
    popular: true,
  },
  {
    id: 7,
    title: "Carrot Cake Classic",
    description: "Moist carrot cake with walnuts, cinnamon, and cream cheese frosting.",
    price: 45,
    image: "https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=500&h=500&fit=crop",
    category: "birthday",
    rating: 4,
    popular: false,
  },
  {
    id: 8,
    title: "Lemon Sunshine",
    description: "Zesty lemon sponge with lemon curd filling and meringue topping.",
    price: 50,
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=500&h=500&fit=crop",
    category: "birthday",
    rating: 4,
    popular: false,
  },
]

export default function LikedCakes() {
  const [likedCakes, setLikedCakes] = useState<Cake[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t, dir } = useLanguage()

  useEffect(() => {
    // Load liked cakes from localStorage
    const stored = localStorage.getItem("liked_cakes")
    if (stored) {
      try {
        const likedIds = JSON.parse(stored)
        const liked = allCakes.filter(cake => likedIds.includes(cake.id))
        setLikedCakes(liked)
      } catch (error) {
        console.error("Error loading liked cakes:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const removeLike = (cakeId: number) => {
    const stored = localStorage.getItem("liked_cakes")
    if (stored) {
      const likedIds = JSON.parse(stored)
      const newLikedIds = likedIds.filter((id: number) => id !== cakeId)
      localStorage.setItem("liked_cakes", JSON.stringify(newLikedIds))
      setLikedCakes(likedCakes.filter(cake => cake.id !== cakeId))

      // Dispatch storage event to sync across tabs/components
      window.dispatchEvent(new Event("storage"))
    }
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-background" dir={dir}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t("loading")}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (likedCakes.length === 0) {
    return (
      <section className="py-20 bg-background" dir={dir}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("noLikedCakesYet")}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {t("youHaventLiked")}
            </p>
            <Link href="/gallery">
              <Button className="rounded-full px-8 py-6 text-lg">
                {t("browseGallery")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-background" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Count Badge */}
        <div className="mb-8 flex items-center justify-between">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Heart className="w-4 h-4 mr-2 fill-primary text-primary" />
            {likedCakes.length} {likedCakes.length === 1 ? t("cakeLiked") : t("cakesLiked")}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              localStorage.removeItem("liked_cakes")
              setLikedCakes([])
              window.dispatchEvent(new Event("storage"))
            }}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t("clearAll")}
          </Button>
        </div>

        {/* Cakes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {likedCakes.map((cake, index) => (
            <div
              key={cake.id}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-lg cake-card-hover animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={cake.image}
                  alt={cake.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {cake.popular && (
                    <Badge className="bg-accent text-accent-foreground font-semibold">
                      {t("popular")}
                    </Badge>
                  )}
                </div>

                {/* Remove Like Button */}
                <button
                  onClick={() => removeLike(cake.id)}
                  className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
                  aria-label={t("removeFromLiked")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <div className="flex gap-3">
                    <Link href={`/gallery/${cake.id}`}>
                      <Button
                        size="sm"
                        className="rounded-full bg-primary-foreground text-foreground hover:bg-primary-foreground/90"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {t("view")}
                      </Button>
                    </Link>
                    <Link href={`/customize?cake=${cake.id}`}>
                      <Button
                        size="sm"
                        className="rounded-full"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        {t("order")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < cake.rating
                          ? "fill-accent text-accent"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>

                <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-1">
                  {cake.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {cake.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gradient">
                    {cake.price} {t("da")}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize px-3 py-1 bg-secondary rounded-full">
                    {t(cake.category)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
