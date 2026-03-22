"use client"

import { useState, useEffect } from "react"
import { Star, User, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

interface Review {
  id: string
  cake_id: number
  user_name: string
  user_phone: string
  rating: number
  comment: string | null
  created_at: string
}

interface ReviewsListProps {
  cakeId: number
}

export default function ReviewsList({ cakeId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)

  useEffect(() => {
    fetchReviews()
  }, [cakeId])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("cake_reviews")
        .select("*")
        .eq("cake_id", cakeId)
        .order("created_at", { ascending: false })

      if (error) throw error

      setReviews(data || [])
      setTotalReviews(data?.length || 0)

      // Calculate average rating
      if (data && data.length > 0) {
        const sum = data.reduce((acc, review) => acc + review.rating, 0)
        setAverageRating(sum / data.length)
      } else {
        setAverageRating(0)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading reviews...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
        <div className="text-center">
          <div className="text-4xl font-bold text-gradient">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 justify-center mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(averageRating)
                    ? "fill-accent text-accent"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="h-12 w-px bg-border" />
        <div>
          <div className="text-2xl font-bold">{totalReviews}</div>
          <div className="text-sm text-muted-foreground">
            {totalReviews === 1 ? "review" : "reviews"}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Star className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-lg font-medium">No reviews yet</p>
          <p className="text-sm">Be the first to review this cake!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 rounded-xl bg-card border border-border shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{review.user_name}</div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.rating
                              ? "fill-accent text-accent"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {formatDate(review.created_at)}
                </div>
              </div>

              {review.comment && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
