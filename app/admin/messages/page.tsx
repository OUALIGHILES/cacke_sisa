"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Trash2,
  MessageCircle,
  Phone,
  Clock,
  CheckCircle,
  Circle,
  Cake,
  Mail,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

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

export default function AdminMessagesPage() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      console.log("Loaded messages:", data)
      if (data) {
        console.log("First message data:", data[0])
        setMessages(data)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredMessages = messages.filter(
    (msg) =>
      msg.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.cake_title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unreadCount = messages.filter((msg) => !msg.is_admin_reply).length

  const handleDelete = async (id: string) => {
    if (confirm(t("deleteMessageConfirm"))) {
      const { error } = await supabase.from("messages").delete().eq("id", id)
      if (error) {
        alert(t("errorDeletingMessage"))
        return
      }
      setMessages(messages.filter((msg) => msg.id !== id))
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
    }
  }

  const handleReplyWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(`Hello ${name}, thank you for contacting SISA_Cake! `)
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`, "_blank")
  }

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedMessage) return

    setIsSending(true)
    try {
      const { data, error } = await supabase.from("messages").insert({
        cake_id: selectedMessage.cake_id,
        cake_title: selectedMessage.cake_title,
        cake_image: selectedMessage.cake_image,
        cake_price: selectedMessage.cake_price,
        user_name: "Admin",
        user_phone: selectedMessage.user_phone || "0000000000",
        user_email: selectedMessage.user_email || null,
        message: replyMessage.trim(),
        is_admin_reply: true,
      }).select()

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      console.log("Reply sent successfully:", data)
      setReplyMessage("")
      loadMessages()
    } catch (error) {
      console.error("Error sending reply:", error)
      alert(t("errorSendingReply"))
    } finally {
      setIsSending(false)
    }
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

  const groupedMessages = filteredMessages.reduce((acc, msg) => {
    const key = `${msg.cake_id}-${msg.user_phone}`
    if (!acc[key]) acc[key] = []
    acc[key].push(msg)
    return acc
  }, {} as Record<string, Message[]>)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("customerMessages")}</h1>
        <p className="text-muted-foreground">
          {unreadCount > 0 ? `${unreadCount} ${t("unreadMessages")}` : t("allMessagesRead")}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder={t("searchMessages")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Messages List & Detail */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <ScrollArea className="h-[700px]">
          <div className="space-y-3 pr-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-muted-foreground">{t("loadingMessages")}</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t("noMessagesFound")}</p>
              </div>
            ) : (
              Object.entries(groupedMessages).map(([key, group]) => {
                const firstMsg = group[0]
                const isRead = group.every((msg) => msg.is_admin_reply)
                return (
                  <Card
                    key={key}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedMessage?.id === firstMsg.id ? "ring-2 ring-primary" : ""
                    } ${!isRead ? "border-l-4 border-l-primary" : ""}`}
                    onClick={() => setSelectedMessage(firstMsg)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {!isRead ? (
                              <Circle className="w-2 h-2 fill-primary text-primary flex-shrink-0" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <h3 className={`font-semibold truncate ${!isRead ? "text-foreground" : "text-muted-foreground"}`}>
                              {firstMsg.user_name}
                            </h3>
                            <Badge variant="outline" className="ml-auto">
                              <Cake className="w-3 h-3 mr-1" />
                              {group.length}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {firstMsg.message}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                            <span className="font-medium text-primary">
                              {firstMsg.cake_title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {firstMsg.user_phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(firstMsg.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </ScrollArea>

        {/* Message Detail */}
        <Card className="h-fit sticky top-6">
          {selectedMessage ? (
            <CardContent className="p-6">
              {/* Cake Info */}
              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-muted/50">
                {selectedMessage.cake_image && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={selectedMessage.cake_image}
                      alt={selectedMessage.cake_title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedMessage.cake_title}</h3>
                  <p className="text-primary font-bold">{selectedMessage.cake_price} DA</p>
                </div>
                <Link
                  href={`/messages/${selectedMessage.cake_id}?title=${encodeURIComponent(selectedMessage.cake_title)}&image=${selectedMessage.cake_image || ""}&price=${selectedMessage.cake_price || 0}`}
                  target="_blank"
                >
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* User Info */}
              <div className="mb-6 pb-4 border-b">
                <h4 className="font-semibold mb-2">{t("customerInformation")}</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>{t("name")}:</strong> {selectedMessage.user_name}</p>
                  <p><strong>{t("phone")}:</strong> {selectedMessage.user_phone}</p>
                  {selectedMessage.user_email && (
                    <p><strong>{t("email")}:</strong> {selectedMessage.user_email}</p>
                  )}
                </div>
              </div>

              {/* Messages Thread */}
              <ScrollArea className="h-[300px] mb-6 p-4 rounded-xl bg-muted/30">
                {messages
                  .filter(
                    (m) =>
                      m.cake_id === selectedMessage.cake_id &&
                      m.user_phone === selectedMessage.user_phone
                  )
                  .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                  .map((msg, index) => (
                    <div
                      key={msg.id}
                      className={`mb-4 ${msg.is_admin_reply ? "text-right" : "text-left"}`}
                    >
                      <div
                        className={`inline-block max-w-[80%] rounded-lg p-3 ${
                          msg.is_admin_reply ? "bg-primary text-primary-foreground ml-auto" : "bg-background"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${msg.is_admin_reply ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {formatDate(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
              </ScrollArea>

              {/* Reply Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">{t("sendReply")}</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={t("typeReply")}
                  className="w-full px-3 py-2 rounded-lg border bg-background resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-3">
                <Button
                  onClick={handleSendReply}
                  disabled={isSending || !replyMessage.trim()}
                  className="flex-1 rounded-full"
                >
                  {isSending ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MessageCircle className="w-4 h-4 mr-2" />
                  )}
                  {t("sendReply")}
                </Button>
                <Button
                  onClick={() => handleReplyWhatsApp(selectedMessage.user_phone, selectedMessage.user_name)}
                  className="flex-1 rounded-full bg-green-500 hover:bg-green-600"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {t("whatsapp")}
                </Button>
              </div>

              {/* Delete Button */}
              <Button
                variant="outline"
                onClick={() => handleDelete(selectedMessage.id)}
                className="w-full rounded-full text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t("deleteMessage")}
              </Button>
            </CardContent>
          ) : (
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t("selectMessageView")}</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
