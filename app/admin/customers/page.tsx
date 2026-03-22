"use client"

import { useState, useEffect } from "react"
import {
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  Star,
  Eye,
  MessageSquare,
  Crown,
  Clock,
  MapPin,
  Loader2,
  ExternalLink,
  Gift
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

interface Customer {
  id: string
  name: string
  email: string | null
  phone: string
  total_orders: number
  total_spent: number
  first_order_date: string
  last_order_date: string
  average_rating: number
  is_vip: boolean
  notes: string | null
}

export default function AdminCustomersPage() {
  const { t } = useLanguage()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    setIsLoading(true)
    try {
      // Get customers from messages table
      const { data: messagesData, error } = await supabase
        .from("messages")
        .select("user_name, user_phone, user_email, created_at, cake_price")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Aggregate customer data from messages
      const customerMap = new Map<string, Customer>()
      
      messagesData?.forEach((msg) => {
        const key = msg.user_phone
        const existing = customerMap.get(key)
        
        if (existing) {
          existing.total_orders += 1
          existing.total_spent += msg.cake_price || 0
          existing.last_order_date = msg.created_at
        } else {
          customerMap.set(key, {
            id: key,
            name: msg.user_name || "Unknown",
            email: msg.user_email,
            phone: msg.user_phone,
            total_orders: 1,
            total_spent: msg.cake_price || 0,
            first_order_date: msg.created_at,
            last_order_date: msg.created_at,
            average_rating: 4.5,
            is_vip: (msg.cake_price || 0) >= 100,
            notes: null,
          })
        }
      })

      setCustomers(Array.from(customerMap.values()))
    } catch (error) {
      console.error("Error loading customers:", error)
      toast.error("Error loading customers")
      setCustomers([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery) ||
      (customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    
    const matchesFilter = 
      filterType === "all" ||
      (filterType === "vip" && customer.is_vip) ||
      (filterType === "active" && customer.total_orders >= 3)
    
    return matchesSearch && matchesFilter
  })

  const handleWhatsAppContact = (phone: string, name: string) => {
    const message = encodeURIComponent(`Hello ${name}, this is SISA_Cake. How can we help you today?`)
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`, "_blank")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const stats = {
    total: customers.length,
    vip: customers.filter(c => c.is_vip).length,
    active: customers.filter(c => c.total_orders >= 3).length,
    newThisMonth: customers.filter(c => 
      new Date(c.first_order_date) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
    ).length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("manageCustomers")}</h1>
        <p className="text-muted-foreground">{t("customerDatabase")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
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
                <Crown className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("vipCustomers")}</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.vip}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("activeCustomers")}</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Gift className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("newCustomers")}</p>
                <p className="text-2xl font-bold text-blue-600">{stats.newThisMonth}</p>
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
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t("filterByStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allOrders")}</SelectItem>
            <SelectItem value="vip">{t("vipCustomers")}</SelectItem>
            <SelectItem value="active">{t("activeCustomers")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("customerDatabase")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t("noCustomersFound")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">{t("customerName")}</th>
                    <th className="text-left py-3 px-4 font-medium">{t("contact")}</th>
                    <th className="text-left py-3 px-4 font-medium">{t("totalOrders")}</th>
                    <th className="text-left py-3 px-4 font-medium">{t("totalSpent")}</th>
                    <th className="text-left py-3 px-4 font-medium">{t("customerSince")}</th>
                    <th className="text-right py-3 px-4 font-medium">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                            {customer.name?.charAt(0) || "C"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{customer.name}</p>
                              {customer.is_vip && (
                                <Badge className="bg-yellow-100 text-yellow-700">
                                  <Crown className="w-3 h-3 mr-1" />
                                  VIP
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {customer.total_orders} {t("orders")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span>{customer.phone}</span>
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="w-3 h-3 text-muted-foreground" />
                              <span>{customer.email}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{customer.total_orders}</Badge>
                      </td>
                      <td className="py-3 px-4 font-bold text-primary">
                        {customer.total_spent} DA
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {formatDate(customer.first_order_date)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedCustomer(customer)
                              setIsDetailDialogOpen(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleWhatsAppContact(customer.phone, customer.name)}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {t("viewProfile")}
            </DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Header */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedCustomer.name?.charAt(0) || "C"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xl">{selectedCustomer.name}</h3>
                    {selectedCustomer.is_vip && (
                      <Badge className="bg-yellow-500 text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        VIP
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{t("customerSince")} {formatDate(selectedCustomer.first_order_date)}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-semibold mb-3">{t("contactInformation")}</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t("phone")}</p>
                      <p className="font-medium">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  {selectedCustomer.email && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t("email")}</p>
                        <p className="font-medium">{selectedCustomer.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{t("totalOrders")}</span>
                  </div>
                  <p className="text-2xl font-bold">{selectedCustomer.total_orders}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{t("totalSpent")}</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{selectedCustomer.total_spent} DA</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{t("averageRating")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{selectedCustomer.averageRating}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(selectedCustomer.averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{t("lastOrder")}</span>
                  </div>
                  <p className="font-medium">{formatDate(selectedCustomer.last_order_date)}</p>
                </div>
              </div>

              {/* Notes */}
              {selectedCustomer.notes && (
                <div>
                  <h4 className="font-semibold mb-2">{t("notes")}</h4>
                  <p className="p-4 rounded-lg bg-muted/30">{selectedCustomer.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => handleWhatsAppContact(selectedCustomer.phone, selectedCustomer.name)}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t("whatsapp")}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  {t("sendOffer")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
