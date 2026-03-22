"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  AlertCircle,
  Loader2,
  ChevronDown,
  Calendar,
  DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface Order {
  id: string
  cake_id: number
  cake_title: string
  cake_image: string | null
  cake_price: number
  cake_size: string
  cake_flavor: string
  add_ons: string[]
  quantity: number
  total_price: number
  customer_name: string
  customer_phone: string
  customer_email: string | null
  delivery_address: string
  delivery_date: string
  special_instructions: string | null
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled"
  payment_method: string
  payment_status: string
  created_at: string
  updated_at: string
}

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  confirmed: { label: "Confirmed", icon: CheckCircle, color: "bg-blue-100 text-blue-700 border-blue-300" },
  preparing: { label: "Preparing", icon: Package, color: "bg-purple-100 text-purple-700 border-purple-300" },
  ready: { label: "Ready", icon: CheckCircle, color: "bg-green-100 text-green-700 border-green-300" },
  out_for_delivery: { label: "Out for Delivery", icon: Truck, color: "bg-orange-100 text-orange-700 border-orange-300" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-700 border-red-300" },
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
]

export default function AdminOrdersPage() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      
      // Transform messages to orders
      const transformedOrders: Order[] = (data || []).map((msg) => ({
        id: msg.id,
        cake_id: msg.cake_id,
        cake_title: msg.cake_title,
        cake_image: msg.cake_image,
        cake_price: msg.cake_price || 0,
        cake_size: "Medium",
        cake_flavor: "Vanilla",
        add_ons: [],
        quantity: 1,
        total_price: msg.cake_price || 0,
        customer_name: msg.user_name,
        customer_phone: msg.user_phone,
        customer_email: msg.user_email,
        delivery_address: "To be confirmed",
        delivery_date: new Date(msg.created_at).toISOString().split('T')[0],
        special_instructions: msg.message,
        status: msg.is_admin_reply ? "delivered" : "pending",
        payment_method: "Cash on Delivery",
        payment_status: msg.is_admin_reply ? "paid" : "pending",
        created_at: msg.created_at,
        updated_at: msg.created_at,
      }))

      setOrders(transformedOrders)
    } catch (error) {
      console.error("Error loading orders:", error)
      toast.error("Error loading orders")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone?.includes(searchQuery) ||
      order.cake_title?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = async (orderId: string, newStatus: Order["status"]) => {
    setIsUpdating(true)
    try {
      // Update in Supabase (messages table for demo)
      const { error } = await supabase
        .from("messages")
        .update({ 
          is_admin_reply: newStatus !== "pending",
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId)

      if (error) throw error

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))

      toast.success(t("statusUpdated"))
      
      // Refresh if order is selected
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Error updating status")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleWhatsAppContact = (phone: string, name: string) => {
    const message = encodeURIComponent(`Hello ${name}, regarding your order from SISA_Cake...`)
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`, "_blank")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    delivered: orders.filter(o => o.status === "delivered" || o.status === "confirmed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("manageOrders")}</h1>
        <p className="text-muted-foreground">{t("trackOrderStatus")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("totalOrders")}</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("pending")}</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("preparing")}</p>
                <p className="text-2xl font-bold text-purple-600">{stats.preparing}</p>
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
                <p className="text-sm text-muted-foreground">{t("delivered")}</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("cancelled")}</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder={t("searchCustomers")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t("filterByStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allOrders")}</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("orderHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t("noOrdersFound")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">{t("orderId")}</th>
                    <th className="text-left py-3 px-4 font-medium">{t("customerName")}</th>
                    <th className="text-left py-3 px-4 font-medium">{t("cakeTitle")}</th>
                    <th className="text-left py-3 px-4 font-medium">{t("orderTotal")}</th>
                    <th className="text-left py-3 px-4 font-medium">{t("orderStatus")}</th>
                    <th className="text-left py-3 px-4 font-medium">{t("orderDate")}</th>
                    <th className="text-right py-3 px-4 font-medium">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status].icon
                    return (
                      <tr key={order.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-sm">#{order.id.slice(0, 8)}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {order.cake_image && (
                              <img 
                                src={order.cake_image} 
                                alt={order.cake_title}
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                            <span className="font-medium">{order.cake_title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-primary">{order.total_price} DA</td>
                        <td className="py-3 px-4">
                          <Badge className={`${statusConfig[order.status].color} border`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {t(statusConfig[order.status].label.toLowerCase().replace(/\s+/g, ""))}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedOrder(order)
                              setIsDetailDialogOpen(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              {t("orderDetails")}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm text-muted-foreground">{t("orderStatus")}</p>
                  <p className="font-semibold text-lg">
                    {t(statusConfig[selectedOrder.status].label.toLowerCase().replace(/\s+/g, ""))}
                  </p>
                </div>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => handleUpdateStatus(selectedOrder.id, value as Order["status"])}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3">{t("customerInformation")}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t("phone")}</p>
                      <p className="font-medium">{selectedOrder.customer_phone}</p>
                    </div>
                  </div>
                  {selectedOrder.customer_email && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("email")}</p>
                        <p className="font-medium">{selectedOrder.customer_email}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t("deliveryAddress")}</p>
                      <p className="font-medium">{selectedOrder.delivery_address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t("deliveryDate")}</p>
                      <p className="font-medium">{selectedOrder.delivery_date}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cake Details */}
              <div>
                <h3 className="font-semibold mb-3">Cake Details</h3>
                <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
                  {selectedOrder.cake_image && (
                    <img
                      src={selectedOrder.cake_image}
                      alt={selectedOrder.cake_title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{selectedOrder.cake_title}</p>
                    <p className="text-muted-foreground">Size: {selectedOrder.cake_size}</p>
                    <p className="text-muted-foreground">Flavor: {selectedOrder.cake_flavor}</p>
                    <p className="text-muted-foreground">Quantity: {selectedOrder.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{selectedOrder.total_price} DA</p>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              {selectedOrder.special_instructions && (
                <div>
                  <h3 className="font-semibold mb-2">{t("orderNotes")}</h3>
                  <p className="text-muted-foreground p-4 rounded-lg bg-muted/30">
                    {selectedOrder.special_instructions}
                  </p>
                </div>
              )}

              {/* Payment Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-semibold">{selectedOrder.payment_method}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <Badge variant={selectedOrder.payment_status === "paid" ? "default" : "secondary"}>
                    {selectedOrder.payment_status}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => handleWhatsAppContact(selectedOrder.customer_phone, selectedOrder.customer_name)}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {t("whatsapp")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
