"use client"

import { useState } from "react"
import { 
  Search, 
  Trash2, 
  MessageCircle,
  Phone,
  Clock,
  CheckCircle,
  Circle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

// Sample messages data
const initialMessages = [
  { 
    id: 1, 
    name: "Sarah Johnson", 
    phone: "+1 234 567 8901", 
    message: "I would like to order a birthday cake for next Saturday. It's for my daughter's 10th birthday party. We need a medium chocolate cake with pink decorations. Can you do custom writing on top?", 
    createdAt: "2024-01-15T10:30:00",
    read: false
  },
  { 
    id: 2, 
    name: "Michael Brown", 
    phone: "+1 234 567 8902", 
    message: "Do you make custom wedding cakes? I need a 3-tier cake for about 100 guests. The wedding is in March. Please let me know your availability and pricing.", 
    createdAt: "2024-01-15T08:15:00",
    read: false
  },
  { 
    id: 3, 
    name: "Emily Davis", 
    phone: "+1 234 567 8903", 
    message: "What is the price for a medium chocolate cake? And do you offer delivery?", 
    createdAt: "2024-01-14T16:45:00",
    read: true
  },
  { 
    id: 4, 
    name: "David Wilson", 
    phone: "+1 234 567 8904", 
    message: "Hi, I am interested in ordering a custom unicorn cake for my niece. She loves rainbow colors. What options do you have?", 
    createdAt: "2024-01-14T14:20:00",
    read: true
  },
  { 
    id: 5, 
    name: "Lisa Anderson", 
    phone: "+1 234 567 8905", 
    message: "Can I get a cake with sugar-free options? My father is diabetic but we still want to celebrate his birthday properly.", 
    createdAt: "2024-01-13T11:00:00",
    read: true
  },
]

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<typeof initialMessages[0] | null>(null)

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unreadCount = messages.filter((msg) => !msg.read).length

  const handleMarkAsRead = (id: number) => {
    setMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    )
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this message?")) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Customer Messages</h1>
        <p className="text-muted-foreground">
          {unreadCount > 0 ? `${unreadCount} unread messages` : "All messages read"}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Messages List & Detail */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-3">
          {filteredMessages.map((message) => (
            <Card
              key={message.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedMessage?.id === message.id ? "ring-2 ring-primary" : ""
              } ${!message.read ? "border-l-4 border-l-primary" : ""}`}
              onClick={() => {
                setSelectedMessage(message)
                handleMarkAsRead(message.id)
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!message.read ? (
                        <Circle className="w-2 h-2 fill-primary text-primary flex-shrink-0" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <h3 className={`font-semibold truncate ${!message.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {message.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {message.message}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {message.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No messages found</p>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <Card className="h-fit sticky top-6">
          {selectedMessage ? (
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedMessage.name}</h2>
                  <p className="text-muted-foreground">{selectedMessage.phone}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Received: {formatDate(selectedMessage.createdAt)}
                </p>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-foreground whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleReplyWhatsApp(selectedMessage.phone, selectedMessage.name)}
                  className="flex-1 rounded-full bg-green-500 hover:bg-green-600"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Reply via WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = `tel:${selectedMessage.phone}`}
                  className="rounded-full"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              </div>
            </CardContent>
          ) : (
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a message to view details</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
