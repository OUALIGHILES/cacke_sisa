"use client"

import { useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  Cake,
  Sparkles,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"

// Sample data
const initialSizes = [
  { id: 1, name: "Small Cake", price: 35 },
  { id: 2, name: "Medium Cake", price: 50 },
  { id: 3, name: "Large Cake", price: 70 },
  { id: 4, name: "Extra Large", price: 95 },
]

const initialAddons = [
  { id: 1, name: "Add Almonds", price: 5 },
  { id: 2, name: "Extra Chocolate", price: 6 },
  { id: 3, name: "Custom Name Writing", price: 4 },
  { id: 4, name: "Extra Decoration", price: 8 },
  { id: 5, name: "Premium Fruits", price: 10 },
  { id: 6, name: "Gold Leaf Accent", price: 15 },
]

export default function AdminPricingPage() {
  const { t } = useLanguage()
  const [sizes, setSizes] = useState(initialSizes)
  const [addons, setAddons] = useState(initialAddons)
  const [isLoading, setIsLoading] = useState(false)

  // Size dialog state
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false)
  const [editingSize, setEditingSize] = useState<typeof initialSizes[0] | null>(null)
  const [sizeForm, setSizeForm] = useState({ name: "", price: "" })

  // Addon dialog state
  const [isAddonDialogOpen, setIsAddonDialogOpen] = useState(false)
  const [editingAddon, setEditingAddon] = useState<typeof initialAddons[0] | null>(null)
  const [addonForm, setAddonForm] = useState({ name: "", price: "" })

  // Size handlers
  const openSizeDialog = (size?: typeof initialSizes[0]) => {
    if (size) {
      setEditingSize(size)
      setSizeForm({ name: size.name, price: size.price.toString() })
    } else {
      setEditingSize(null)
      setSizeForm({ name: "", price: "" })
    }
    setIsSizeDialogOpen(true)
  }

  const handleSizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (editingSize) {
      setSizes(sizes.map((s) =>
        s.id === editingSize.id
          ? { ...s, name: sizeForm.name, price: parseFloat(sizeForm.price) }
          : s
      ))
    } else {
      setSizes([...sizes, { id: Date.now(), name: sizeForm.name, price: parseFloat(sizeForm.price) }])
    }

    setIsLoading(false)
    setIsSizeDialogOpen(false)
  }

  const deleteSize = (id: number) => {
    if (confirm(t("deleteSizeConfirm"))) {
      setSizes(sizes.filter((s) => s.id !== id))
    }
  }

  // Addon handlers
  const openAddonDialog = (addon?: typeof initialAddons[0]) => {
    if (addon) {
      setEditingAddon(addon)
      setAddonForm({ name: addon.name, price: addon.price.toString() })
    } else {
      setEditingAddon(null)
      setAddonForm({ name: "", price: "" })
    }
    setIsAddonDialogOpen(true)
  }

  const handleAddonSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (editingAddon) {
      setAddons(addons.map((a) =>
        a.id === editingAddon.id
          ? { ...a, name: addonForm.name, price: parseFloat(addonForm.price) }
          : a
      ))
    } else {
      setAddons([...addons, { id: Date.now(), name: addonForm.name, price: parseFloat(addonForm.price) }])
    }

    setIsLoading(false)
    setIsAddonDialogOpen(false)
  }

  const deleteAddon = (id: number) => {
    if (confirm(t("deleteAddOnConfirm"))) {
      setAddons(addons.filter((a) => a.id !== id))
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("pricingManager")}</h1>
        <p className="text-muted-foreground">{t("manageSizesAddons")}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Cake Sizes Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Cake className="w-5 h-5 text-primary" />
              {t("cakeSizes")}
            </CardTitle>
            <Dialog open={isSizeDialogOpen} onOpenChange={setIsSizeDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => openSizeDialog()} className="rounded-full">
                  <Plus className="w-4 h-4 mr-1" />
                  {t("addSize")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingSize ? t("editSize") : t("addNewSize")}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSizeSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sizeName">{t("sizeName")}</Label>
                    <Input
                      id="sizeName"
                      value={sizeForm.name}
                      onChange={(e) => setSizeForm({ ...sizeForm, name: e.target.value })}
                      placeholder={`${t("example")} ${t("mediumCake")}`}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sizePrice">{t("price")}</Label>
                    <Input
                      id="sizePrice"
                      type="number"
                      value={sizeForm.price}
                      onChange={(e) => setSizeForm({ ...sizeForm, price: e.target.value })}
                      placeholder="50"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsSizeDialogOpen(false)}>
                      {t("cancel")}
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editingSize ? t("save") : t("add")}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sizes.map((size) => (
                <div
                  key={size.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-semibold">{size.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-primary">{size.price} DA</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openSizeDialog(size)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteSize(size.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add-ons Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t("addOnsExtras")}
            </CardTitle>
            <Dialog open={isAddonDialogOpen} onOpenChange={setIsAddonDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => openAddonDialog()} className="rounded-full">
                  <Plus className="w-4 h-4 mr-1" />
                  {t("addExtra")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingAddon ? t("editAddOn") : t("addNewAddOn")}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddonSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="addonName">{t("addOnName")}</Label>
                    <Input
                      id="addonName"
                      value={addonForm.name}
                      onChange={(e) => setAddonForm({ ...addonForm, name: e.target.value })}
                      placeholder={t("exampleExtra")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addonPrice">{t("price")}</Label>
                    <Input
                      id="addonPrice"
                      type="number"
                      value={addonForm.price}
                      onChange={(e) => setAddonForm({ ...addonForm, price: e.target.value })}
                      placeholder="5"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsAddonDialogOpen(false)}>
                      {t("cancel")}
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editingAddon ? t("save") : t("add")}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-semibold">{addon.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-green-600">+{addon.price} DA</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openAddonDialog(addon)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteAddon(addon.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
