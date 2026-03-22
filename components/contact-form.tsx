"use client"

import { useState } from "react"
import { Send, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"

export default function ContactForm() {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call - in production this would save to Supabase
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: "", phone: "", email: "", message: "" })

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  if (isSubmitted) {
    return (
      <div className="bg-card rounded-3xl p-8 shadow-xl border border-border text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold mb-3">{t("messageSent")}</h3>
        <p className="text-muted-foreground mb-6">
          {t("thankYouReachOut")}
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
          className="rounded-full"
        >
          {t("sendAnother")}
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
      <h2 className="text-2xl font-bold mb-2">{t("sendUsMessage")}</h2>
      <p className="text-muted-foreground mb-6">
        {t("fillOutForm")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">{t("yourName")} *</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="rounded-xl h-12"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">{t("phone")} *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 234 567 890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="rounded-xl h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("yourEmail")}</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="rounded-xl h-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">{t("yourMessage")} *</Label>
          <Textarea
            id="message"
            placeholder={t("yourMessage")}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            className="rounded-xl min-h-[150px] resize-none"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full rounded-full py-6 text-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t("sending")}
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              {t("sendMessage")}
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
