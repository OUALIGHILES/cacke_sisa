"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Cake, Inbox, Clock } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useLanguage } from "@/contexts/language-context"

interface Conversation {
  cake_id: number | null
  cake_title: string | null
  cake_image: string | null
  cake_price: number | null
  last_message: string
  last_message_time: string
  message_count: number
  user_name: string
  user_phone: string
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const { t, dir } = useLanguage()

  useEffect(() => {
    loadUserData()
    loadConversations()
  }, [])

  const loadUserData = () => {
    const stored = localStorage.getItem("user_contact_info")
    if (stored) {
      const data = JSON.parse(stored)
      setUserName(data.name || "")
    }
  }

  const loadConversations = async () => {
    try {
      const stored = localStorage.getItem("user_contact_info")
      if (!stored) {
        setIsLoading(false)
        return
      }

      const userData = JSON.parse(stored)
      const userPhone = userData.phone

      // Get all messages for this user
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("user_phone", userPhone)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading messages:", error)
        setIsLoading(false)
        return
      }

      // Group by cake_id
      const grouped = new Map<number | string, Conversation>()
      messages?.forEach((msg: any) => {
        // Use cake_id if available, otherwise use 'other' as fallback
        const key = msg.cake_id || `other_${msg.id}`

        if (!grouped.has(key)) {
          grouped.set(key, {
            cake_id: msg.cake_id,
            cake_title: msg.cake_title || t("unknownCake"),
            cake_image: msg.cake_image,
            cake_price: msg.cake_price || 0,
            last_message: msg.message,
            last_message_time: msg.created_at,
            message_count: 1,
            user_name: msg.user_name,
            user_phone: msg.user_phone,
          })
        } else {
          const conv = grouped.get(key)!
          conv.message_count += 1
        }
      })

      setConversations(Array.from(grouped.values()))
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen" dir={dir}>
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("backToHome")}
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Inbox className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{t("myMessages")}</h1>
                <p className="text-muted-foreground">
                  {t("viewAllDiscussions")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-muted-foreground">{t("loadingMessages")}</p>
          </div>
        ) : conversations.length === 0 ? (
          <Card className="border-dashed max-w-4xl mx-auto px-4">
            <CardContent className="text-center py-12">
              <Inbox className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-bold mb-2">{t("noMessagesYet")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("startDiscussion")}
              </p>
              <Link href="/gallery">
                <Badge className="bg-primary text-primary-foreground cursor-pointer">
                  <Cake className="w-3 h-3 mr-1" />
                  {t("browseCakes")}
                </Badge>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            {conversations.map((conv) => {
              const hasCakeId = conv.cake_id !== null && conv.cake_id !== undefined
              const cardContent = (
                <Card className="hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4 flex gap-4">
                    {conv.cake_image ? (
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={conv.cake_image}
                          alt={conv.cake_title || t("unknownCake")}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Cake className="w-8 h-8 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold truncate">{conv.cake_title || t("unknownCake")}</h3>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(conv.last_message_time).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-primary font-semibold mb-2">
                        {conv.cake_price || 0} {t("da")}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.last_message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {conv.message_count} {conv.message_count > 1 ? t("messages") : t("message")}
                        </Badge>
                        {conv.user_name && (
                          <Avatar className="w-5 h-5">
                            <AvatarFallback className="text-xs bg-secondary">
                              {conv.user_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )

              if (hasCakeId) {
                return (
                  <Link
                    key={`${conv.cake_id}-${conv.last_message_time}`}
                    href={`/messages/${conv.cake_id}?title=${encodeURIComponent(conv.cake_title || "")}&image=${encodeURIComponent(conv.cake_image || "")}&price=${conv.cake_price || 0}`}
                  >
                    {cardContent}
                  </Link>
                )
              }

              return <div key={conv.last_message_time}>{cardContent}</div>
            })}
          </div>
        )}
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
