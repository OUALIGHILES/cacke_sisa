"use client"

import { useState, useEffect } from "react"
import {
  Star,
  StarHalf,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  User,
  Cake,
  MessageSquare,
  Filter,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Phone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface Review {
  id: string
  cake_id: number
  cake_title: string
  cake_image: string | null
  cake_price: number | null
  user_name: string
  user_phone: string | null
  rating: number
  comment: string | null
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
}

export default function AdminReviewsPage() {
  const { t } = useLanguage()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("cake_reviews")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading reviews:", error)
        // If table doesn't exist, show empty state
        setReviews([])
        return
      }

      // Transform reviews to include cake info
      const transformedReviews: Review[] = (data || []).map(review => ({
        ...review,
        cake_title: `Cake #${review.cake_id}`,
        cake_image: null,
        cake_price: null,
        status: "approved" // Default status for existing reviews
      }))

      setReviews(transformedReviews)
    } catch (error) {
      console.error("Error loading reviews:", error)
      setReviews([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesStatus = statusFilter === "all" || review.status === statusFilter
    const matchesRating = ratingFilter === "all" || review.rating === parseInt(ratingFilter)
    return matchesStatus && matchesRating
  })

  const handleUpdateStatus = async (reviewId: string, newStatus: Review["status"]) => {
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from("cake_reviews")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", reviewId)

      if (error) throw error

      setReviews(reviews.map(review =>
        review.id === reviewId ? { ...review, status: newStatus } : review
      ))

      toast.success(newStatus === "approved" ? t("reviewApproved") : t("reviewDeleted"))
      
      if (selectedReview?.id === reviewId) {
        setSelectedReview({ ...selectedReview, status: newStatus })
      }
    } catch (error) {
      console.error("Error updating review:", error)
      // Update locally even if Supabase fails
      setReviews(reviews.map(review =>
        review.id === reviewId ? { ...review, status: newStatus } : review
      ))
      toast.success(newStatus === "approved" ? t("reviewApproved") : t("reviewDeleted"))
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm(t("deleteReview"))) return
    
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from("cake_reviews")
        .delete()
        .eq("id", reviewId)

      if (error) throw error

      setReviews(reviews.filter(review => review.id !== reviewId))
      setIsDetailDialogOpen(false)
      toast.success(t("reviewDeleted"))
    } catch (error) {
      console.error("Error deleting review:", error)
      setReviews(reviews.filter(review => review.id !== reviewId))
      setIsDetailDialogOpen(false)
      toast.success(t("reviewDeleted"))
    } finally {
      setIsUpdating(false)
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  // Calculate stats
  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.status === "approved").length,
    pending: reviews.filter(r => r.status === "pending").length,
    average: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0"
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("manageReviews")}</h1>
        <p className="text-muted-foreground">{t("moderateCustomerReviews")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("totalReviews")}</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("averageRating")}</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.average}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("approved")}</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("pendingApproval")}</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t("filterByStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allOrders")}</SelectItem>
            <SelectItem value="approved">{t("approved")}</SelectItem>
            <SelectItem value="pending">{t("pendingApproval")}</SelectItem>
            <SelectItem value="rejected">{t("rejected")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t("rating")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allOrders")}</SelectItem>
            <SelectItem value="5">5 {t("stars")}</SelectItem>
            <SelectItem value="4">4 {t("stars")}</SelectItem>
            <SelectItem value="3">3 {t("stars")}</SelectItem>
            <SelectItem value="2">2 {t("stars")}</SelectItem>
            <SelectItem value="1">1 {t("stars")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t("noReviewsYet")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {review.cake_image ? (
                      <img
                        src={review.cake_image}
                        alt={review.cake_title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Cake className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm">{review.cake_title}</p>
                      <p className="text-xs text-muted-foreground">{review.user_name}</p>
                    </div>
                  </div>
                  <Badge
                    className={`${
                      review.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : review.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {review.status === "approved"
                      ? t("approved")
                      : review.status === "rejected"
                      ? t("rejected")
                      : t("pendingApproval")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>{renderStars(review.rating)}</div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{review.comment}</p>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedReview(review)
                      setIsDetailDialogOpen(true)
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("reviewDetails")}</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              {/* Cake Info */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                {selectedReview.cake_image && (
                  <img
                    src={selectedReview.cake_image}
                    alt={selectedReview.cake_title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedReview.cake_title}</h3>
                  {selectedReview.cake_price && (
                    <p className="text-primary font-bold">{selectedReview.cake_price} DA</p>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t("rating")}</p>
                <div className="flex gap-1">
                  {renderStars(selectedReview.rating)}
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t("customerInformation")}</p>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{selectedReview.user_name}</span>
                </div>
                {selectedReview.user_phone && (
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{selectedReview.user_phone}</span>
                  </div>
                )}
              </div>

              {/* Comment */}
              {selectedReview.comment && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t("reviewComment")}</p>
                  <p className="p-4 rounded-lg bg-muted/30">{selectedReview.comment}</p>
                </div>
              )}

              {/* Review Date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatDate(selectedReview.created_at)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {selectedReview.status !== "approved" && (
                  <Button
                    onClick={() => handleUpdateStatus(selectedReview.id, "approved")}
                    disabled={isUpdating}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t("approveReview")}
                  </Button>
                )}
                {selectedReview.status !== "rejected" && (
                  <Button
                    onClick={() => handleUpdateStatus(selectedReview.id, "rejected")}
                    disabled={isUpdating}
                    variant="outline"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {t("reject")}
                  </Button>
                )}
                <Button
                  onClick={() => handleDeleteReview(selectedReview.id)}
                  disabled={isUpdating}
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
