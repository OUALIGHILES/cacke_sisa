"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Star, 
  ShoppingBag, 
  MessageCircle, 
  Clock, 
  Users, 
  ChefHat,
  ArrowLeft,
  Heart,
  Share2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CakeDetailsProps {
  cake: {
    id: number
    title: string
    description: string
    price: number
    image: string
    category: string
    rating: number
    ingredients: string[]
    servings: string
    prepTime: string
  }
}

export default function CakeDetails({ cake }: CakeDetailsProps) {
  const [isLiked, setIsLiked] = useState(false)

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Hello! I would like to order the ${cake.title} ($${cake.price}). Please let me know about availability.`
    )
    window.open(`https://wa.me/1234567890?text=${message}`, "_blank")
  }

  const handleMessage = () => {
    window.location.href = "/contact"
  }

  return (
    <section className="pt-24 pb-20 gradient-luxury min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          href="/gallery"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image Section */}
          <div className="relative animate-fade-in-up">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={cake.image}
                alt={cake.title}
                className="w-full h-full object-cover"
              />
              
              {/* Action buttons on image */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-3 rounded-full glass transition-all duration-300 ${
                    isLiked ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                </button>
                <button className="p-3 rounded-full glass transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl -z-10" />
          </div>

          {/* Details Section */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Category Badge */}
            <Badge className="bg-secondary text-secondary-foreground capitalize px-4 py-1.5 text-sm">
              {cake.category}
            </Badge>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              {cake.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < cake.rating 
                        ? "fill-accent text-accent" 
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">({cake.rating}.0 rating)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-gradient">${cake.price}</span>
              <span className="text-muted-foreground">starting price</span>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              {cake.description}
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-card shadow-md text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Servings</p>
                <p className="font-semibold">{cake.servings}</p>
              </div>
              <div className="p-4 rounded-2xl bg-card shadow-md text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Order Time</p>
                <p className="font-semibold text-sm">{cake.prepTime}</p>
              </div>
              <div className="p-4 rounded-2xl bg-card shadow-md text-center">
                <ChefHat className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Made With</p>
                <p className="font-semibold">Love</p>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {cake.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={handleWhatsAppOrder}
                size="lg"
                className="flex-1 rounded-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Order via WhatsApp
              </Button>
              <Button
                onClick={handleMessage}
                size="lg"
                variant="outline"
                className="flex-1 rounded-full py-6 text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </div>

            {/* Customize Link */}
            <Link 
              href={`/customize?cake=${cake.id}`}
              className="block text-center text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Want to customize this cake? Click here
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
