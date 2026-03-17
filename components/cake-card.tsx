"use client"

import Image from "next/image"
import Link from "next/link"
import { Eye, ShoppingBag } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface CakeCardProps {
  id: string
  title: string
  description: string
  price: number
  image: string
  index?: number
}

export default function CakeCard({ 
  id, 
  title, 
  description, 
  price, 
  image,
  index = 0 
}: CakeCardProps) {
  const { t, dir } = useLanguage()

  return (
    <div 
      className="group cake-card-hover bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Action buttons */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <Link
            href={`/gallery/${id}`}
            className="w-12 h-12 rounded-full bg-card flex items-center justify-center shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label={t("viewDetails")}
          >
            <Eye className="w-5 h-5" />
          </Link>
          <button 
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            aria-label={t("orderNow")}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>

        {/* Price tag */}
        <div className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} px-4 py-2 rounded-full glass text-foreground font-bold shadow-lg`}>
          ${price}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {description}
        </p>
        
        <Link
          href={`/gallery/${id}`}
          className={`inline-flex items-center gap-2 text-primary font-semibold hover:gap-4 transition-all duration-300 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
        >
          {t("viewDetails")}
          <span className={`text-lg ${dir === 'rtl' ? 'rotate-180' : ''}`}>→</span>
        </Link>
      </div>
    </div>
  )
}
