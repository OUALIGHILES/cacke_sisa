"use client"

import { useState, useMemo } from "react"
import {
  Check,
  Cake,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/contexts/language-context"

export default function CakeConfigurator() {
  const { t, dir } = useLanguage()
  
  const cakeSizes = [
    { id: 1, name: t("smallCake"), description: `6 ${t("inchServes")} 6-8`, price: 35 },
    { id: 2, name: t("mediumCake"), description: `8 ${t("inchServes")} 10-12`, price: 50 },
    { id: 3, name: t("largeCake"), description: `10 ${t("inchServes")} 15-20`, price: 70 },
    { id: 4, name: t("extraLarge"), description: `12 ${t("inchServes")} 25-30`, price: 95 },
  ]

  const cakeAddons = [
    { id: 1, name: t("addAlmonds"), description: t("premiumRoastedAlmonds"), price: 5 },
    { id: 2, name: t("extraChocolate"), description: t("belgianChocolate"), price: 6 },
    { id: 3, name: t("customNameWriting"), description: t("personalizedMessage"), price: 4 },
    { id: 4, name: t("extraDecoration"), description: t("additionalFondant"), price: 8 },
    { id: 5, name: t("premiumFruits"), description: t("freshSeasonalFruits"), price: 10 },
    { id: 6, name: t("goldLeafAccent"), description: t("edibleGold"), price: 15 },
    { id: 7, name: t("macaronsTopping"), description: t("frenchMacarons"), price: 12 },
    { id: 8, name: t("freshFlowers"), description: t("edibleFlower"), price: 10 },
  ]

  const cakeImages = [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&h=600&fit=crop",
  ]

  const [selectedSize, setSelectedSize] = useState(cakeSizes[1])
  const [selectedAddons, setSelectedAddons] = useState<number[]>([])
  const [quantity, setQuantity] = useState(1)

  const toggleAddon = (addonId: number) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    )
  }

  const addonsTotal = useMemo(() => {
    return selectedAddons.reduce((total, addonId) => {
      const addon = cakeAddons.find((a) => a.id === addonId)
      return total + (addon?.price || 0)
    }, 0)
  }, [selectedAddons])

  const subtotal = useMemo(() => {
    return (selectedSize.price + addonsTotal) * quantity
  }, [selectedSize, addonsTotal, quantity])

  const handleWhatsAppOrder = () => {
    const addonNames = selectedAddons
      .map((id) => cakeAddons.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(", ")

    const message = encodeURIComponent(
      `${t("helloOrder")}\n\n` +
      `${t("cakeSize")}: ${selectedSize.name} (${selectedSize.price} ${t("da")})\n` +
      `${t("quantity")}: ${quantity}\n` +
      (addonNames ? `${t("extras")}: ${addonNames}\n` : "") +
      `\n${t("totalPrice")}: ${subtotal} ${t("da")}\n\n` +
      `${t("pleaseLetKnow")}`
    )
    window.open(`https://wa.me/213540000739?text=${message}`, "_blank")
  }

  return (
    <section className="py-16 bg-background" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Cake Preview */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-pink-50 to-white">
              <img
                src={cakeImages[selectedSize.id - 1] || cakeImages[0]}
                alt="Cake Preview"
                className="w-full h-full object-cover transition-all duration-500"
              />

              {/* Size indicator */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{selectedSize.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedSize.description}</p>
                    </div>
                    <div className="text-2xl font-bold text-gradient">{selectedSize.price} {t("da")}</div>
                  </div>
                </div>
              </div>

              {/* Addon badges */}
              {selectedAddons.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[200px]">
                  {selectedAddons.slice(0, 3).map((addonId) => {
                    const addon = cakeAddons.find((a) => a.id === addonId)
                    return (
                      <span
                        key={addonId}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground"
                      >
                        + {addon?.name}
                      </span>
                    )
                  })}
                  {selectedAddons.length > 3 && (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent text-accent-foreground">
                      +{selectedAddons.length - 3} {t("more")}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            <div className="flex gap-3 justify-center">
              {cakeImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(cakeSizes[index] || cakeSizes[0])}
                  className={`w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                    selectedSize.id === index + 1
                      ? "ring-4 ring-primary shadow-lg scale-105"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Cake ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Configuration */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Size Selection */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Cake className="w-6 h-6 text-primary" />
                {t("chooseCakeSize")}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {cakeSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                      selectedSize.id === size.id
                        ? "border-primary bg-primary/5 shadow-lg"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{size.name}</p>
                        <p className="text-sm text-muted-foreground">{size.description}</p>
                      </div>
                      {selectedSize.id === size.id && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="text-xl font-bold text-gradient mt-2">{size.price} {t("da")}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Add-ons Selection */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                {t("chooseExtras")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cakeAddons.map((addon) => (
                  <label
                    key={addon.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedAddons.includes(addon.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={selectedAddons.includes(addon.id)}
                      onCheckedChange={() => toggleAddon(addon.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{addon.name}</p>
                      <p className="text-xs text-muted-foreground">{addon.description}</p>
                    </div>
                    <span className="font-semibold text-primary">+{addon.price} {t("da")}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h2 className="text-2xl font-bold mb-4">{t("quantity")}</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:border-primary transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-3xl font-bold w-16 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:border-primary transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-card rounded-3xl p-6 shadow-xl border border-border">
              <h3 className="text-lg font-semibold mb-4">{t("priceSummary")}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {selectedSize.name} x {quantity}
                  </span>
                  <span className="font-medium">{selectedSize.price * quantity} {t("da")}</span>
                </div>

                {selectedAddons.length > 0 && (
                  <>
                    <div className="border-t border-border pt-3">
                      <p className="text-sm text-muted-foreground mb-2">{t("extras")}:</p>
                      {selectedAddons.map((addonId) => {
                        const addon = cakeAddons.find((a) => a.id === addonId)
                        return (
                          <div key={addonId} className="flex justify-between text-sm py-1">
                            <span className="text-muted-foreground">+ {addon?.name}</span>
                            <span className="font-medium">{(addon?.price || 0) * quantity} {t("da")}</span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}

                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="text-xl font-semibold">{t("totalPrice")}</span>
                  <span className="text-3xl font-bold text-gradient">{subtotal} {t("da")}</span>
                </div>
              </div>

              <Button
                onClick={handleWhatsAppOrder}
                size="lg"
                className="w-full rounded-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg animate-pulse-glow"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {t("orderViaWhatsApp")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
