"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, ShoppingBag, Star, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Sample cake data - in production this would come from Supabase
const cakes = [
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

const categories = [
  { id: "all", label: "All Cakes" },
  { id: "birthday", label: "Birthday" },
  { id: "wedding", label: "Wedding" },
  { id: "kids", label: "Kids" },
]

export default function CakeGallery() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredCakes = selectedCategory === "all" 
    ? cakes 
    : cakes.filter(cake => cake.category === selectedCategory)

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Filter className="w-5 h-5 text-muted-foreground" />
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Cake Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCakes.map((cake, index) => (
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
                      Popular
                    </Badge>
                  )}
                </div>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <div className="flex gap-3">
                    <Link href={`/gallery/${cake.id}`}>
                      <Button
                        size="sm"
                        className="rounded-full bg-primary-foreground text-foreground hover:bg-primary-foreground/90"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/customize?cake=${cake.id}`}>
                      <Button
                        size="sm"
                        className="rounded-full"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Order
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
                    ${cake.price}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize px-3 py-1 bg-secondary rounded-full">
                    {cake.category}
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
