"use client"

import { useState } from "react"
import {
  Bell,
  Send,
  Mail,
  MessageSquare,
  Users,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Gift,
  Tag,
  Trash2,
  Eye,
  Loader2,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "sonner"

interface Notification {
  id: string
  title: string
  message: string
  type: "promotional" | "order_update" | "general"
  recipients: "all" | "vip" | "specific"
  sent_date: string
  status: "sent" | "scheduled" | "draft"
  opened_count: number
  clicked_count: number
}

const notificationTemplates = [
  {
    id: 1,
    name: "New Product Launch",
    title: "🎉 New Cake Alert!",
    message: "Discover our latest creation - the Ultimate Chocolate Delight! Order now and get 10% off your first purchase.",
    type: "promotional" as const,
  },
  {
    id: 2,
    name: "Special Offer",
    title: "🎁 Special Offer Just for You!",
    message: "Enjoy 15% off on all wedding cakes this month. Book your consultation today!",
    type: "promotional" as const,
  },
  {
    id: 3,
    name: "Order Update",
    title: "📦 Your Order is Ready!",
    message: "Great news! Your cake order is ready for pickup/delivery. Thank you for choosing SISA_Cake!",
    type: "order_update" as const,
  },
  {
    id: 4,
    name: "Holiday Hours",
    title: "📅 Holiday Hours Update",
    message: "Please note our special holiday hours: We will be open from 10 AM to 4 PM on public holidays.",
    type: "general" as const,
  },
]

const demoNotifications: Notification[] = [
  {
    id: "1",
    title: "🎉 New Cake Alert!",
    message: "Discover our latest creation - the Ultimate Chocolate Delight!",
    type: "promotional",
    recipients: "all",
    sent_date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: "sent",
    opened_count: 245,
    clicked_count: 89,
  },
  {
    id: "2",
    title: "📦 Your Order is Ready!",
    message: "Your cake order #12345 is ready for pickup.",
    type: "order_update",
    recipients: "specific",
    sent_date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: "sent",
    opened_count: 1,
    clicked_count: 1,
  },
  {
    id: "3",
    title: "🎁 Special Offer Just for You!",
    message: "Enjoy 15% off on all wedding cakes this month.",
    type: "promotional",
    recipients: "vip",
    sent_date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: "sent",
    opened_count: 56,
    clicked_count: 23,
  },
]

export default function AdminNotificationsPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("create")
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications)
  const [isSending, setIsSending] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [previewNotification, setPreviewNotification] = useState<Notification | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "general" as "promotional" | "order_update" | "general",
    recipients: "all" as "all" | "vip" | "specific",
  })

  const handleSendNotification = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSending(true)
    
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newNotification: Notification = {
      id: Date.now().toString(),
      title: formData.title,
      message: formData.message,
      type: formData.type,
      recipients: formData.recipients,
      sent_date: new Date().toISOString(),
      status: "sent",
      opened_count: 0,
      clicked_count: 0,
    }

    setNotifications([newNotification, ...notifications])
    
    toast.success(t("notificationSent"))
    
    // Reset form
    setFormData({
      title: "",
      message: "",
      type: "general",
      recipients: "all",
    })
    setSelectedTemplate(null)
    
    setIsSending(false)
  }

  const handleApplyTemplate = (template: typeof notificationTemplates[0]) => {
    setFormData({
      title: template.title,
      message: template.message,
      type: template.type,
      recipients: "all",
    })
    setSelectedTemplate(template.id)
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
    toast.success("Notification deleted")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "promotional":
        return <Gift className="w-4 h-4" />
      case "order_update":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "promotional":
        return "bg-pink-100 text-pink-700"
      case "order_update":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === "sent").length,
    avgOpenRate: notifications.length > 0
      ? Math.round(notifications.reduce((sum, n) => sum + (n.opened_count / 10), 0) / notifications.length)
      : 0,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("manageNotifications")}</h1>
        <p className="text-muted-foreground">{t("sendNotifications")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("totalNotifications")}</p>
                <p className="text-2xl font-bold">{stats.total}</p>
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
                <p className="text-sm text-muted-foreground">{t("sent")}</p>
                <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("avgOpenRate")}</p>
                <p className="text-2xl font-bold text-blue-600">{stats.avgOpenRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="create">{t("createNotification")}</TabsTrigger>
          <TabsTrigger value="history">{t("notificationHistory")}</TabsTrigger>
        </TabsList>

        {/* Create Notification Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Quick Templates
                </CardTitle>
                <CardDescription>
                  Start with a pre-made template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {notificationTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleApplyTemplate(template)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(template.type)}
                        <span className="font-semibold">{template.name}</span>
                      </div>
                      <Badge className={getTypeColor(template.type)}>
                        {template.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.message}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Create Form */}
            <Card>
              <CardHeader>
                <CardTitle>{t("createNotification")}</CardTitle>
                <CardDescription>
                  Compose and send your notification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("notificationTitle")}</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter notification title..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t("notificationMessage")}</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter your message..."
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("notificationType")}</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value as typeof formData.type })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promotional">
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4" />
                          {t("promotional")}
                        </div>
                      </SelectItem>
                      <SelectItem value="order_update">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {t("orderUpdate")}
                        </div>
                      </SelectItem>
                      <SelectItem value="general">
                        <div className="flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          {t("general")}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("sendTo")}</Label>
                  <Select
                    value={formData.recipients}
                    onValueChange={(value) =>
                      setFormData({ ...formData, recipients: value as typeof formData.recipients })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {t("allCustomers")}
                        </div>
                      </SelectItem>
                      <SelectItem value="vip">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {t("vipCustomers")}
                        </div>
                      </SelectItem>
                      <SelectItem value="specific">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {t("specificCustomers")}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSendNotification}
                  disabled={isSending}
                  className="w-full"
                  size="lg"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("sending")}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t("sendNotification")}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("notificationHistory")}</CardTitle>
              <CardDescription>
                View all sent and scheduled notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t("noNotificationsYet")}</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            notification.type === "promotional"
                              ? "bg-pink-100"
                              : notification.type === "order_update"
                              ? "bg-blue-100"
                              : "bg-gray-100"
                          }`}>
                            {getTypeIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{notification.title}</h4>
                              <Badge className={getTypeColor(notification.type)}>
                                {notification.type.replace("_", " ")}
                              </Badge>
                              <Badge variant="outline">
                                {notification.recipients}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(notification.sent_date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {notification.opened_count} {t("opens")}
                              </span>
                              <span className="flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {notification.clicked_count} {t("clicks")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setPreviewNotification(notification)
                              setIsPreviewDialogOpen(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("previewNotification")}</DialogTitle>
          </DialogHeader>
          {previewNotification && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(previewNotification.type)}
                  <Badge className={getTypeColor(previewNotification.type)}>
                    {previewNotification.type.replace("_", " ")}
                  </Badge>
                </div>
                <h3 className="font-bold text-lg mb-2">{previewNotification.title}</h3>
                <p className="text-muted-foreground">{previewNotification.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{t("recipients")}</p>
                  <p className="font-medium capitalize">{previewNotification.recipients}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t("sentDate")}</p>
                  <p className="font-medium">{formatDate(previewNotification.sent_date)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t("opens")}</p>
                  <p className="font-medium">{previewNotification.opened_count}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t("clicks")}</p>
                  <p className="font-medium">{previewNotification.clicked_count}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
