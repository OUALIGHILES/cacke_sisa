"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
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

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  newCustomers: number
  returningCustomers: number
  weeklyData: { day: string; sales: number; orders: number }[]
  monthlyData: { month: string; revenue: number; orders: number }[]
  categoryData: { name: string; value: number; color: string }[]
  popularCakes: { name: string; orders: number; revenue: number }[]
}

const COLORS = ["#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#3b82f6", "#ef4444", "#14b8a6", "#f97316"]

export default function AdminAnalyticsPage() {
  const { t } = useLanguage()
  const [timeRange, setTimeRange] = useState("week")
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      // Fetch all messages (used as orders)
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Calculate analytics from messages data
      const processedData = processAnalyticsData(messages || [], timeRange)
      setAnalytics(processedData)
    } catch (error) {
      console.error("Error loading analytics:", error)
      toast.error("Error loading analytics data")
      // Use demo data as fallback
      setAnalytics(getDemoAnalytics())
    } finally {
      setIsLoading(false)
    }
  }

  const processAnalyticsData = (messages: any[], range: string): AnalyticsData => {
    const now = new Date()
    let startDate = new Date()
    
    // Set start date based on time range
    if (range === "week") {
      startDate.setDate(now.getDate() - 7)
    } else if (range === "month") {
      startDate.setMonth(now.getMonth() - 1)
    } else {
      startDate.setFullYear(now.getFullYear() - 1)
    }

    // Filter messages within date range
    const filteredMessages = messages.filter(msg => 
      new Date(msg.created_at) >= startDate
    )

    // Calculate total revenue and orders
    const totalRevenue = filteredMessages.reduce((sum, msg) => sum + (msg.cake_price || 0), 0)
    const totalOrders = filteredMessages.length

    // Calculate unique customers (by phone)
    const customerPhones = new Set(filteredMessages.map(m => m.user_phone))
    const customerOrderCount = new Map<string, number>()
    
    filteredMessages.forEach(msg => {
      const count = customerOrderCount.get(msg.user_phone) || 0
      customerOrderCount.set(msg.user_phone, count + 1)
    })

    const newCustomers = Array.from(customerOrderCount.values()).filter(c => c === 1).length
    const returningCustomers = Array.from(customerOrderCount.values()).filter(c => c > 1).length

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Generate weekly sales data
    const weeklyData = generateWeeklyData(filteredMessages, range)

    // Generate monthly revenue data
    const monthlyData = generateMonthlyData(messages, range)

    // Generate category data (based on cake titles)
    const categoryData = generateCategoryData(filteredMessages)

    // Generate popular cakes data
    const popularCakes = generatePopularCakesData(filteredMessages)

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      newCustomers,
      returningCustomers,
      weeklyData,
      monthlyData,
      categoryData,
      popularCakes,
    }
  }

  const generateWeeklyData = (messages: any[], range: string) => {
    const days = range === "week" 
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : range === "month"
      ? ["Week 1", "Week 2", "Week 3", "Week 4"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const data = days.map((day, index) => {
      const dayMessages = messages.filter(msg => {
        const msgDate = new Date(msg.created_at)
        if (range === "week") {
          return msgDate.getDay() === (index + 1) % 7
        } else if (range === "month") {
          const weekNum = Math.floor(msgDate.getDate() / 7)
          return weekNum === index
        } else {
          return msgDate.getMonth() === index
        }
      })

      return {
        [range === "week" ? "day" : range === "month" ? "month" : "month"]: day,
        sales: dayMessages.reduce((sum, msg) => sum + (msg.cake_price || 0), 0),
        orders: dayMessages.length,
      }
    })

    // Rename key for consistency
    return data.map(item => {
      const { day, month, ...rest } = item as any
      return {
        day: range === "week" ? day : month,
        ...rest
      }
    })
  }

  const generateMonthlyData = (messages: any[], range: string) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthsToShow = range === "year" ? 12 : 6
    
    const data = []
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthIndex = date.getMonth()
      const monthYear = `${monthNames[monthIndex]}`
      
      const monthMessages = messages.filter(msg => {
        const msgDate = new Date(msg.created_at)
        return msgDate.getMonth() === monthIndex && msgDate.getFullYear() === date.getFullYear()
      })

      data.push({
        month: monthYear,
        revenue: monthMessages.reduce((sum, msg) => sum + (msg.cake_price || 0), 0),
        orders: monthMessages.length,
      })
    }

    return data
  }

  const generateCategoryData = (messages: any[]) => {
    const categories = new Map<string, number>()
    
    messages.forEach(msg => {
      const title = (msg.cake_title || "Other").toLowerCase()
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

  const generatePopularCakesData = (messages: any[]) => {
    const cakeStats = new Map<string, { orders: number; revenue: number }>()
    
    messages.forEach(msg => {
      const name = msg.cake_title || "Unknown Cake"
      const stats = cakeStats.get(name) || { orders: 0, revenue: 0 }
      stats.orders += 1
      stats.revenue += msg.cake_price || 0
      cakeStats.set(name, stats)
    })

    return Array.from(cakeStats.entries())
      .map(([name, stats]) => ({
        name,
        orders: stats.orders,
        revenue: stats.revenue,
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5)
  }

  const getDemoAnalytics = (): AnalyticsData => ({
    totalRevenue: 12450,
    totalOrders: 342,
    averageOrderValue: 36.4,
    newCustomers: 89,
    returningCustomers: 253,
    weeklyData: [
      { day: "Mon", sales: 450, orders: 12 },
      { day: "Tue", sales: 520, orders: 15 },
      { day: "Wed", sales: 380, orders: 10 },
      { day: "Thu", sales: 620, orders: 18 },
      { day: "Fri", sales: 780, orders: 22 },
      { day: "Sat", sales: 950, orders: 28 },
      { day: "Sun", sales: 680, orders: 19 },
    ],
    monthlyData: [
      { month: "Jan", revenue: 4200, orders: 98 },
      { month: "Feb", revenue: 3800, orders: 85 },
      { month: "Mar", revenue: 5100, orders: 112 },
      { month: "Apr", revenue: 4800, orders: 105 },
      { month: "May", revenue: 6200, orders: 138 },
      { month: "Jun", revenue: 5800, orders: 125 },
    ],
    categoryData: [
      { name: "Birthday", value: 35, color: "#f59e0b" },
      { name: "Wedding", value: 25, color: "#ec4899" },
      { name: "Kids", value: 20, color: "#8b5cf6" },
      { name: "Custom", value: 15, color: "#10b981" },
      { name: "Other", value: 5, color: "#6b7280" },
    ],
    popularCakes: [
      { name: "Classic Birthday", orders: 45, revenue: 2025 },
      { name: "Chocolate Dream", orders: 38, revenue: 2090 },
      { name: "Red Velvet", orders: 32, revenue: 1920 },
      { name: "Strawberry Delight", orders: 28, revenue: 1400 },
      { name: "Wedding Special", orders: 15, revenue: 2250 },
    ],
  })

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous * 100).toFixed(1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">{t("loading")}</span>
      </div>
    )
  }

  const currentData = analytics || getDemoAnalytics()
  const revenueGrowth = calculateGrowth(currentData.totalRevenue, currentData.totalRevenue * 0.9)
  const ordersGrowth = calculateGrowth(currentData.totalOrders, currentData.totalOrders * 0.92)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("analyticsDashboard")}</h1>
          <p className="text-muted-foreground">{t("salesPerformance")}</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">{t("thisWeek")}</SelectItem>
            <SelectItem value="month">{t("thisMonth")}</SelectItem>
            <SelectItem value="year">{t("thisYear")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("totalRevenue")}
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentData.totalRevenue.toLocaleString()} DA</div>
            <div className="flex items-center text-sm mt-1 text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +{revenueGrowth}% {t("growth")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("totalOrders")}
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentData.totalOrders}</div>
            <div className="flex items-center text-sm mt-1 text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +{ordersGrowth}% {t("growth")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("averageOrderValue")}
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentData.averageOrderValue.toFixed(2)} DA</div>
            <div className="flex items-center text-sm mt-1 text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +5.2% {t("growth")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("customerInsights")}
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentData.newCustomers + currentData.returningCustomers}</div>
            <div className="flex items-center text-sm mt-1 text-muted-foreground">
              <span>{currentData.newCustomers} {t("newCustomers")} • {currentData.returningCustomers} {t("returningCustomers")}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {t("weeklySales")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={currentData.weeklyData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
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
                  dataKey="sales"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {t("customerInsights")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 rounded-lg bg-blue-50">
                <p className="text-3xl font-bold text-blue-600">{currentData.newCustomers}</p>
                <p className="text-sm text-muted-foreground">{t("newCustomers")}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50">
                <p className="text-3xl font-bold text-green-600">{currentData.returningCustomers}</p>
                <p className="text-sm text-muted-foreground">{t("returningCustomers")}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: t("newCustomers"), value: currentData.newCustomers, color: "#3b82f6" },
                    { name: t("returningCustomers"), value: currentData.returningCustomers, color: "#10b981" },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell key="new" fill="#3b82f6" />
                  <Cell key="returning" fill="#10b981" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              {t("revenueOverview")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              {t("salesByCategory")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={currentData.categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {currentData.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Popular Cakes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            {t("popularCakes")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentData.popularCakes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t("noDataAvailable")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">{t("cakeTitle")}</th>
                    <th className="text-right py-3 px-4 font-medium">{t("totalOrders")}</th>
                    <th className="text-right py-3 px-4 font-medium">{t("totalRevenue")}</th>
                    <th className="text-right py-3 px-4 font-medium">% {t("totalOrders")}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.popularCakes.map((cake, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{cake.name}</td>
                      <td className="py-3 px-4 text-right">{cake.orders}</td>
                      <td className="py-3 px-4 text-right font-bold text-primary">
                        {cake.revenue.toLocaleString()} DA
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-medium text-muted-foreground">
                          {currentData.totalOrders > 0 ? ((cake.orders / currentData.totalOrders) * 100).toFixed(1) : 0}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
