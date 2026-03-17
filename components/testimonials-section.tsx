"use client"

import Image from "next/image"
import { Star, Quote } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const testimonials = [
  {
    id: 1,
    name: "Amina Benali",
    role: "Birthday Celebration",
    content: "The cake was absolutely stunning and tasted even better than it looked! OUALI SANA made my daughter's birthday extra special.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
  },
  {
    id: 2,
    name: "Karim Mansouri",
    role: "Wedding Anniversary",
    content: "We've ordered multiple cakes from SISA_Cake and they never disappoint. The attention to detail and flavor combinations are exceptional.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
  },
  {
    id: 3,
    name: "Fatima Zeroual",
    role: "Corporate Event",
    content: "Professional service, beautiful design, and delicious taste. OUALI SANA's creations are truly works of art!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const { t } = useLanguage()

  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {t("testimonials")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            {t("whatOurCustomers")} <span className="text-gradient">{t("say")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Don&apos;t just take our word for it - hear from our happy customers!
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="glass rounded-3xl p-8 relative cake-card-hover animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg rtl:-right-4 rtl:left-auto">
                <Quote className="w-5 h-5 text-primary-foreground" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground/80 leading-relaxed mb-6">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/20">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
