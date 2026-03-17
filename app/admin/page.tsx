"use client"

import { 
  Cake, 
  MessageSquare, 
  DollarSign, 
  TrendingUp,
  ShoppingBag,
  Users,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    title: "Total Cakes",
    value: "24",
    change: "+3",
    trend: "up",
    icon: Cake,
  },
  {
    title: "New Messages",
    value: "12",
    change: "+5",
    trend: "up",
    icon: MessageSquare,
  },
  {
    title: "Monthly Revenue",
    value: "$2,450",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Total Orders",
    value: "48",
    change: "-2",
    trend: "down",
    icon: ShoppingBag,
  },
]

const recentMessages = [
  { id: 1, name: "Sarah Johnson", phone: "+1 234 567 8901", message: "I would like to order a birthday cake for next Saturday...", time: "2 hours ago" },
  { id: 2, name: "Michael Brown", phone: "+1 234 567 8902", message: "Do you make custom wedding cakes? I need a 3-tier cake...", time: "4 hours ago" },
  { id: 3, name: "Emily Davis", phone: "+1 234 567 8903", message: "What is the price for a medium chocolate cake?", time: "5 hours ago" },
]

const recentOrders = [
  { id: 1, cake: "Classic Birthday Cake", customer: "Sarah J.", price: 45, status: "Pending" },
  { id: 2, cake: "Chocolate Dream", customer: "Michael B.", price: 55, status: "Confirmed" },
  { id: 3, cake: "Red Velvet Romance", customer: "Emily D.", price: 60, status: "Completed" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here is your bakery overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className={`flex items-center text-sm mt-1 ${
                stat.trend === "up" ? "text-green-600" : "text-red-500"
              }`}>
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                )}
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{message.name}</p>
                      <p className="text-sm text-muted-foreground">{message.phone}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                >
                  <div>
                    <p className="font-semibold">{order.cake}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">${order.price}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "Completed" 
                        ? "bg-green-100 text-green-700"
                        : order.status === "Confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/cakes"
              className="p-4 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors text-center"
            >
              <Cake className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold">Add New Cake</p>
            </a>
            <a
              href="/admin/messages"
              className="p-4 rounded-xl bg-blue-100 hover:bg-blue-200 transition-colors text-center"
            >
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold">View Messages</p>
            </a>
            <a
              href="/admin/pricing"
              className="p-4 rounded-xl bg-green-100 hover:bg-green-200 transition-colors text-center"
            >
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="font-semibold">Edit Pricing</p>
            </a>
            <a
              href="/admin/settings"
              className="p-4 rounded-xl bg-purple-100 hover:bg-purple-200 transition-colors text-center"
            >
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="font-semibold">Settings</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
