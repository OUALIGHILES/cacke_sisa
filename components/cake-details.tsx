"use client"

import { useState, useEffect } from "react"
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
  Share2,
  MessageSquare,
  ThumbsUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import ReviewDialog from "@/components/review-dialog"
import ReviewsList from "@/components/reviews-list"

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
  const [messageCount, setMessageCount] = useState(0)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [reviewsKey, setReviewsKey] = useState(0)

  useEffect(() => {
    // Load liked status from localStorage
    const stored = localStorage.getItem("liked_cakes")
    if (stored) {
      const likedIds = JSON.parse(stored)
      setIsLiked(likedIds.includes(cake.id))
    }
  }, [cake.id])

  useEffect(() => {
    // Load message count for this cake
    loadMessageCount()
    // Load reviews for this cake
    loadReviews()
  }, [cake.id, reviewsKey])

  const loadMessageCount = async () => {
    try {
      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("cake_id", cake.id)

      if (error) {
        // Silently fail - table or column might not exist yet
        return
      }
      if (count !== null) setMessageCount(count)
    } catch (error) {
      // Silently fail if table doesn't exist
    }
  }

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("cake_reviews")
        .select("rating")
        .eq("cake_id", cake.id)

      if (error) throw error

      if (data && data.length > 0) {
        const sum = data.reduce((acc, review) => acc + review.rating, 0)
        setAverageRating(sum / data.length)
        setTotalReviews(data.length)
      } else {
        setAverageRating(0)
        setTotalReviews(0)
      }
    } catch (error) {
      console.error("Error loading reviews:", error)
      // Use fallback rating from cake data
      setAverageRating(cake.rating)
    }
  }

  const handleReviewSuccess = () => {
    setReviewsKey(prev => prev + 1)
  }

  const toggleLike = () => {
    const stored = localStorage.getItem("liked_cakes")
    let likedIds = stored ? JSON.parse(stored) : []

    if (isLiked) {
      likedIds = likedIds.filter((id: number) => id !== cake.id)
    } else {
      likedIds.push(cake.id)
    }

    localStorage.setItem("liked_cakes", JSON.stringify(likedIds))
    setIsLiked(!isLiked)

    // Dispatch storage event to sync across tabs/components
    window.dispatchEvent(new Event("storage"))
  }

  const handleShare = async () => {
    const shareData = {
      title: cake.title,
      text: `Check out this amazing cake: ${cake.title} - ${cake.price} DA`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Hello! I would like to order the ${cake.title} (${cake.price} DA). Please let me know about availability.`
    )
    window.open(`https://wa.me/213540000739?text=${message}`, "_blank")
  }

  const handleMessage = () => {
    const params = new URLSearchParams({
      title: encodeURIComponent(cake.title),
      image: cake.image,
      price: cake.price.toString(),
    })
    window.location.href = `/messages/${cake.id}?${params.toString()}`
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
                  onClick={toggleLike}
                  className={`p-3 rounded-full glass transition-all duration-300 ${
                    isLiked ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-full glass transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                >
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
                      i < Math.round(averageRating)
                        ? "fill-accent text-accent"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {totalReviews > 0 
                  ? `${averageRating.toFixed(1)} rating (${totalReviews} ${totalReviews === 1 ? "review" : "reviews"})`
                  : "No reviews yet"
                }
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-gradient">{cake.price} DA</span>
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

            {/* Discussion Section */}
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Discussion about this Cake</h3>
                    <p className="text-sm text-muted-foreground">
                      Ask questions or discuss details with the admin
                    </p>
                  </div>
                </div>
                {messageCount > 0 && (
                  <Badge className="bg-primary text-primary-foreground">
                    {messageCount} {messageCount === 1 ? "message" : "messages"}
                  </Badge>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleMessage}
                  className="flex-1 rounded-full"
                  size="lg"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  {messageCount > 0 ? "Continue Discussion" : "Start Discussion"}
                </Button>
                {messageCount > 0 && (
                  <Link
                    href={`/messages/${cake.id}?title=${encodeURIComponent(cake.title)}&image=${cake.image}&price=${cake.price}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full rounded-full" size="lg">
                      View Messages
                    </Button>
                  </Link>
                )}
              </div>

              {messageCount > 0 && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  💬 Join the conversation about this cake. The admin typically responds within 2-4 hours.
                </p>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ThumbsUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Customer Reviews</h3>
                    <p className="text-sm text-muted-foreground">
                      See what our customers are saying
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setReviewDialogOpen(true)}
                  className="rounded-full"
                  size="lg"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Write a Review
                </Button>
              </div>

              <ReviewsList cakeId={cake.id} />
            </div>

            {/* Discussion Section */}
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Discussion about this Cake</h3>
                    <p className="text-sm text-muted-foreground">
                      Ask questions or discuss details with the admin
                    </p>
                  </div>
                </div>
                {messageCount > 0 && (
                  <Badge className="bg-primary text-primary-foreground">
                    {messageCount} {messageCount === 1 ? "message" : "messages"}
                  </Badge>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleMessage}
                  className="flex-1 rounded-full"
                  size="lg"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  {messageCount > 0 ? "Continue Discussion" : "Start Discussion"}
                </Button>
                {messageCount > 0 && (
                  <Link
                    href={`/messages/${cake.id}?title=${encodeURIComponent(cake.title)}&image=${cake.image}&price=${cake.price}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full rounded-full" size="lg">
                      View Messages
                    </Button>
                  </Link>
                )}
              </div>

              {messageCount > 0 && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  💬 Join the conversation about this cake. The admin typically responds within 2-4 hours.
                </p>
              )}
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

      {/* Review Dialog */}
      <ReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        cakeId={cake.id}
        cakeTitle={cake.title}
        onSuccess={handleReviewSuccess}
      />
    </section>
  )
}
