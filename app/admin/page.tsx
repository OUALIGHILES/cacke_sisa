"use client"

import { useState, useEffect } from "react"
import {
  Cake,
  MessageSquare,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Clock,
  CheckCircle,
  Package,
  Bell,
  Calendar,
  Crown,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface Message {
  id: string
  cake_id: number
  cake_title: string
  cake_image: string | null
  cake_price: number | null
  user_name: string
  user_phone: string
  user_email: string | null
  message: string
  is_admin_reply: boolean
  created_at: string
}

interface Cake {
  id: number
  title: string
  description: string
  price: number
  image: string
}

export default function AdminDashboard() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [stats, setStats] = useState({
    totalCakes: 0,
    newMessages: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedToday: 0,
    averageRating: 4.8,
    vipCustomers: 0,
  })
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [topCustomers, setTopCustomers] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100)

      if (messagesError) throw messagesError

      const messages = messagesData || []
      setMessages(messages)

      // Calculate stats
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)

      const totalOrders = messages.length
      const newMessages = messages.filter(m => !m.is_admin_reply).length
      const monthlyRevenue = messages
        .filter(m => new Date(m.created_at) >= monthAgo)
        .reduce((sum, m) => sum + (m.cake_price || 0), 0)
      const pendingOrders = messages.filter(m => !m.is_admin_reply).length
      const completedToday = messages.filter(m => 
        m.is_admin_reply && new Date(m.created_at) >= today
      ).length

      // Get unique customers and calculate VIP
      const customerOrders = new Map<string, { count: number; spent: number }>()
      messages.forEach(m => {
        const existing = customerOrders.get(m.user_phone) || { count: 0, spent: 0 }
        existing.count += 1
        existing.spent += m.cake_price || 0
        customerOrders.set(m.user_phone, existing)
      })
      const vipCustomers = Array.from(customerOrders.values())
        .filter(c => c.spent >= 200 || c.count >= 5).length

      // Get cake count (from unique cake_ids or assume 24 as default)
      const uniqueCakes = new Set(messages.map(m => m.cake_id)).size

      setStats({
        totalCakes: uniqueCakes || 24,
        newMessages,
        monthlyRevenue,
        totalOrders,
        pendingOrders,
        completedToday,
        averageRating: 4.8,
        vipCustomers,
      })

      // Generate weekly data
      const weeklyData = generateWeeklyData(messages, weekAgo)
      setWeeklyData(weeklyData)

      // Generate category data
      const categoryData = generateCategoryData(messages)
      setCategoryData(categoryData)

      // Get top customers
      const topCustomers = Array.from(customerOrders.entries())
        .map(([phone, data]) => {
          const customer = messages.find(m => m.user_phone === phone)
          return {
            name: customer?.user_name || "Unknown",
            orders: data.count,
            spent: data.spent,
            avatar: customer?.user_name?.charAt(0) || "C",
          }
        })
        .sort((a, b) => b.spent - a.spent)
        .slice(0, 3)
      setTopCustomers(topCustomers)

    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateWeeklyData = (messages: Message[], startDate: Date) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    
    return days.map((day, index) => {
      const dayMessages = messages.filter(m => {
        const msgDate = new Date(m.created_at)
        return msgDate >= startDate && msgDate.getDay() === (index + 1) % 7
      })

      return {
        day,
        orders: dayMessages.length,
        revenue: dayMessages.reduce((sum, m) => sum + (m.cake_price || 0), 0),
      }
    })
  }

  const generateCategoryData = (messages: Message[]) => {
    const categories = new Map<string, number>()
    const COLORS = ["#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#6b7280"]
    
    messages.forEach(m => {
      const title = (m.cake_title || "Other").toLowerCase()
      let category = "Other"
      
      if (title.includes("birthday")) category = "Birthday"
      else if (title.includes("wedding")) category = "Wedding"
      else if (title.includes("kids") || title.includes("children")) category = "Kids"
      else if (title.includes("custom")) category = "Custom"
      else if (title.includes("chocolate")) category = "Chocolate"
      else if (title.includes("strawberry")) category = "Strawberry"
      else if (title.includes("red velvet")) category = "Red Velvet"
      
      const count = categories.get(category) || 0
      categories.set(category, count + 1)
    })

    const total = messages.length || 1
    
    return Array.from(categories.entries())
      .map(([name, value], index) => ({
        name,
        value: Math.round((value / total) * 100),
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700"
      case "confirmed": return "bg-blue-100 text-blue-700"
      case "preparing": return "bg-purple-100 text-purple-700"
      case "ready": return "bg-green-100 text-green-700"
      case "delivered": return "bg-emerald-100 text-emerald-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: t("pending"),
      confirmed: t("confirmed"),
      preparing: t("preparing"),
      ready: t("ready"),
      delivered: t("delivered"),
    }
    return labels[status] || status
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">{t("loading")}</span>
      </div>
    )
  }

  const recentOrders = messages.slice(0, 5).map(msg => ({
    id: msg.id,
    cake: msg.cake_title,
    customer: msg.user_name?.split(" ")[0] || "Customer",
    price: msg.cake_price || 0,
    status: msg.is_admin_reply ? "delivered" : "pending",
    time: formatDate(msg.created_at),
  }))

  const recentMessages = messages
    .filter(m => !m.is_admin_reply)
    .slice(0, 4)
    .map(msg => ({
      id: msg.id,
      name: msg.user_name || "Unknown",
      phone: msg.user_phone,
      message: msg.message,
      time: formatDate(msg.created_at),
      cake: msg.cake_title,
    }))

  const pendingTasks = [
    { id: 1, task: `Review ${stats.newMessages} new messages`, icon: MessageSquare, priority: "high", completed: stats.newMessages === 0 },
    { id: 2, task: `Confirm ${stats.pendingOrders} pending orders`, icon: CheckCircle, priority: "high", completed: stats.pendingOrders === 0 },
    { id: 3, task: "Update cake inventory", icon: Package, priority: "low", completed: false },
    { id: 4, task: "Check customer reviews", icon: Star, priority: "medium", completed: false },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
          <p className="text-muted-foreground">{t("welcomeBackOverview")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("totalCakes")}
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Cake className="w-5 h-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCakes}</div>
            <div className="flex items-center text-sm mt-1 text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +3 {t("fromLastMonth")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("newMessages")}
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.newMessages}</div>
            <div className="flex items-center text-sm mt-1 text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +5 {t("fromLastMonth")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("monthlyRevenue")}
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.monthlyRevenue.toLocaleString()} DA</div>
            <div className="flex items-center text-sm mt-1 text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +18% {t("fromLastMonth")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("totalOrders")}
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalOrders}</div>
            <div className="flex items-center text-sm mt-1 text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +24 {t("fromLastMonth")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("pendingOrders")}</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
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
                <p className="text-sm text-muted-foreground">{t("completedToday")}</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("averageRating")}</p>
                <p className="text-2xl font-bold text-pink-600">{stats.averageRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Crown className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("vipCustomers")}</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.vipCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {t("weeklySales")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cake className="w-5 h-5 text-primary" />
              {t("salesByCategory")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                No category data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                {t("recentOrders")}
              </CardTitle>
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm">
                  {t("viewAll")}
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t("noOrdersFound")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Cake className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{order.cake}</p>
                          <p className="text-sm text-muted-foreground">{order.customer} • {order.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{order.price} DA</p>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              {t("pendingTasks")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    task.completed ? "bg-green-50" : "bg-muted/50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    task.priority === "high" ? "bg-red-100" :
                    task.priority === "medium" ? "bg-yellow-100" : "bg-gray-100"
                  }`}>
                    <task.icon className={`w-4 h-4 ${
                      task.priority === "high" ? "text-red-600" :
                      task.priority === "medium" ? "text-yellow-600" : "text-gray-600"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.task}
                    </p>
                  </div>
                  {task.completed && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              {t("recentMessages")}
            </CardTitle>
            <Link href="/admin/messages">
              <Button variant="ghost" size="sm">
                {t("viewAll")}
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t("noMessagesFound")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{message.name}</p>
                        <p className="text-xs text-muted-foreground">{message.cake}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              {t("topCustomers")}
            </CardTitle>
            <Link href="/admin/customers">
              <Button variant="ghost" size="sm">
                {t("viewAll")}
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {topCustomers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t("noCustomersFound")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topCustomers.map((customer, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                      {customer.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{customer.spent} DA</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("quickActions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/admin/cakes"
                className="p-4 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors text-center"
              >
                <Cake className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-semibold">{t("addNewCake")}</p>
              </Link>
              <Link
                href="/admin/orders"
                className="p-4 rounded-xl bg-blue-100 hover:bg-blue-200 transition-colors text-center"
              >
                <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-semibold">{t("manageOrders")}</p>
              </Link>
              <Link
                href="/admin/reviews"
                className="p-4 rounded-xl bg-pink-100 hover:bg-pink-200 transition-colors text-center"
              >
                <Star className="w-6 h-6 mx-auto mb-2 text-pink-600" />
                <p className="text-sm font-semibold">{t("manageReviews")}</p>
              </Link>
              <Link
                href="/admin/notifications"
                className="p-4 rounded-xl bg-purple-100 hover:bg-purple-200 transition-colors text-center"
              >
                <Bell className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-semibold">{t("notifications")}</p>
              </Link>
              <Link
                href="/admin/pricing"
                className="p-4 rounded-xl bg-green-100 hover:bg-green-200 transition-colors text-center"
              >
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-semibold">{t("editPricing")}</p>
              </Link>
              <Link
                href="/admin/analytics"
                className="p-4 rounded-xl bg-indigo-100 hover:bg-indigo-200 transition-colors text-center"
              >
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                <p className="text-sm font-semibold">{t("analytics")}</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
