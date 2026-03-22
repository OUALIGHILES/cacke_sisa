"use client"

import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
}

export default function WhatsAppButton({
  phoneNumber = "213540000739",
  message = "Hello! I would like to order a cake."
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(url, "_blank")
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse-glow group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
      
      {/* Tooltip */}
      <span className="absolute right-20 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
        Chat with us!
      </span>
      
      {/* Ripple effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
    </button>
  )
}
