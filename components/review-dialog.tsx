"use client"

import { useState } from "react"
import { Star, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"

interface ReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cakeId: number
  cakeTitle: string
  onSuccess: () => void
}

export default function ReviewDialog({
  open,
  onOpenChange,
  cakeId,
  cakeTitle,
  onSuccess,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [userName, setUserName] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    if (!userName.trim()) {
      setError("Please enter your name")
      return
    }

    setIsSubmitting(true)

    try {
      const { error: submitError } = await supabase.from("cake_reviews").insert({
        cake_id: cakeId,
        user_name: userName.trim(),
        user_phone: userPhone.trim() || null,
        rating,
        comment: comment.trim() || null,
      })

      if (submitError) throw submitError

      // Reset form
      setRating(0)
      setUserName("")
      setUserPhone("")
      setComment("")
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setRating(0)
    setUserName("")
    setUserPhone("")
    setComment("")
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm()
      onOpenChange(newOpen)
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Rate this Cake</DialogTitle>
          <DialogDescription>
            Share your experience with {cakeTitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Rating Stars */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoverRating || rating)
                          ? "fill-accent text-accent"
                          : "text-muted"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-muted-foreground">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="userName" className="text-sm font-medium">
                Your Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                disabled={isSubmitting}
              />
            </div>

            {/* Phone (optional) */}
            <div className="space-y-2">
              <label htmlFor="userPhone" className="text-sm font-medium">
                Phone Number <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                id="userPhone"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="Enter your phone number"
                disabled={isSubmitting}
              />
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Your Review <span className="text-muted-foreground">(optional)</span>
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you liked about this cake..."
                className="min-h-[100px]"
                disabled={isSubmitting}
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Review
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
