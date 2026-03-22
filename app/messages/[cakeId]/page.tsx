"use client"

import { useEffect, useState, useRef } from "react"
import { Send, ArrowLeft, Cake } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

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

export default function MessagePage({ params }: { params: Promise<{ cakeId: string }> }) {
  const searchParams = useSearchParams()
  const cakeTitle = searchParams.get("title") || "Cake"
  const cakeImage = searchParams.get("image") || ""
  const cakePrice = searchParams.get("price") || "0"

  const [cakeId, setCakeId] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [userName, setUserName] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [showForm, setShowForm] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    params.then((p) => setCakeId(p.cakeId))
  }, [params])

  useEffect(() => {
    if (cakeId) {
      loadMessages()
      loadUserData()
    }
  }, [cakeId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    if (!cakeId) return

    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("cake_id", parseInt(cakeId))
        .order("created_at", { ascending: true })

      if (error) throw error
      if (data) setMessages(data)
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserData = () => {
    const stored = localStorage.getItem("user_contact_info")
    if (stored) {
      const data = JSON.parse(stored)
      setUserName(data.name || "")
      setUserPhone(data.phone || "")
      setUserEmail(data.email || "")
      if (data.name && data.phone) {
        setShowForm(false)
      } else {
        setShowForm(true)
      }
    } else {
      setShowForm(true)
    }
  }

  const saveUserData = () => {
    localStorage.setItem(
      "user_contact_info",
      JSON.stringify({ name: userName, phone: userPhone, email: userEmail })
    )
    setShowForm(false)
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    if (!cakeId) return

    // Validate user info before sending
    if (!userName || !userPhone) {
      setShowForm(true)
      alert("Please provide your name and phone number before sending a message.")
      return
    }

    setIsSending(true)

    try {
      const payload = {
        cake_id: parseInt(cakeId),
        cake_title: decodeURIComponent(cakeTitle),
        cake_image: cakeImage || null,
        cake_price: parseInt(cakePrice),
        user_name: userName.trim(),
        user_phone: userPhone.trim(),
        user_email: userEmail?.trim() || null,
        message: newMessage.trim(),
        is_admin_reply: false,
      }

      console.log("Sending message with payload:", payload)

      const { data, error } = await supabase.from("messages").insert(payload).select()

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        throw new Error(`Supabase: ${error.message || 'Unknown error'}`)
      }

      console.log("Message sent successfully:", data)

      setNewMessage("")
      loadMessages()
    } catch (error: any) {
      console.error("Error sending message:", error)
      alert("Failed to send message: " + (error?.message || "Unknown error"))
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header with Back Button */}
          <div className="mb-6">
            <Link
              href={`/gallery/${cakeId}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cake Details
            </Link>

            {/* Cake Info Card */}
            <div className="bg-card rounded-2xl p-4 shadow-lg border border-border flex items-center gap-4">
              {cakeImage && (
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={cakeImage}
                    alt={cakeTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold truncate">{cakeTitle}</h2>
              <p className="text-primary font-semibold">{cakePrice} DA</p>
            </div>
            <Badge className="bg-primary text-primary-foreground">
              <Cake className="w-3 h-3 mr-1" />
              Cake Discussion
            </Badge>
          </div>
        </div>

        {/* User Info Form (if not provided) */}
        {showForm && (
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border mb-6 animate-fade-in-up">
            <h3 className="text-xl font-bold mb-4">Your Information</h3>
            <p className="text-muted-foreground mb-4">
              Please provide your contact details so the admin can reach you.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone *</label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+1 234 567 890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email (optional)</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>
              <Button
                onClick={saveUserData}
                disabled={!userName || !userPhone}
                className="w-full rounded-full"
              >
                Save & Continue
              </Button>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden mb-6">
          {/* Messages Header */}
          <div className="bg-primary/10 p-4 border-b border-border">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Discussion with Admin
            </h3>
            <p className="text-sm text-muted-foreground">
              Send messages about this cake. The admin will respond soon.
            </p>
          </div>

          {/* Messages List */}
          <ScrollArea className="h-[500px] p-4" ref={scrollRef}>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-muted-foreground">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <Cake className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">No messages yet</p>
                <p className="text-sm text-muted-foreground">
                  Be the first to send a message about this cake!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className="flex gap-3 flex-row-reverse"
                  >
                    {/* Avatar */}
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className="bg-secondary">
                        {msg.user_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Message Bubble */}
                    <div className="max-w-[70%] rounded-2xl p-4 bg-secondary">
                      {/* Sender Name */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm">
                          {msg.user_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.created_at).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Message Content */}
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>

                      {/* Contact Info (only for first message from user) */}
                      {index ===
                        messages.findIndex(
                          (m) => m.user_phone === msg.user_phone
                        ) && (
                        <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                          <p>📞 {msg.user_phone}</p>
                          {msg.user_email && <p>✉️ {msg.user_email}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border bg-background/50">
            <div className="flex gap-3">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 rounded-xl min-h-[50px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isSending || !newMessage.trim()}
                size="lg"
                className="rounded-full px-6"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-muted/50 rounded-2xl p-4 text-center">
          <p className="text-sm text-muted-foreground">
            💡 Tip: Include your phone number so the admin can contact you via WhatsApp for faster responses.
          </p>
        </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
