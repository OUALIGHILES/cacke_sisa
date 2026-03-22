"use client"

import { useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Upload,
  X,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

// Sample cake data
const initialCakes = [
  { id: 1, title: "Classic Birthday Cake", description: "Vanilla sponge with buttercream", price: 45, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop" },
  { id: 2, title: "Chocolate Dream", description: "Rich chocolate layers with ganache", price: 55, image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=200&h=200&fit=crop" },
  { id: 3, title: "Strawberry Delight", description: "Fresh strawberry with cream cheese", price: 50, image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200&h=200&fit=crop" },
  { id: 4, title: "Red Velvet Romance", description: "Classic red velvet with cream cheese", price: 60, image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=200&h=200&fit=crop" },
]

export default function AdminCakesPage() {
  const { t } = useLanguage()
  const [cakes, setCakes] = useState(initialCakes)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingCake, setEditingCake] = useState<typeof initialCakes[0] | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  })

  const filteredCakes = cakes.filter((cake) =>
    cake.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenDialog = (cake?: typeof initialCakes[0]) => {
    if (cake) {
      setEditingCake(cake)
      setFormData({
        title: cake.title,
        description: cake.description,
        price: cake.price.toString(),
        image: cake.image,
      })
    } else {
      setEditingCake(null)
      setFormData({ title: "", description: "", price: "", image: "" })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (editingCake) {
      setCakes(cakes.map((cake) =>
        cake.id === editingCake.id
          ? { ...cake, ...formData, price: parseFloat(formData.price) }
          : cake
      ))
    } else {
      const newCake = {
        id: Date.now(),
        ...formData,
        price: parseFloat(formData.price),
      }
      setCakes([...cakes, newCake])
    }

    setIsLoading(false)
    setIsDialogOpen(false)
  }

  const handleDelete = async (id: number) => {
    if (confirm(t("deleteCakeConfirm"))) {
      setCakes(cakes.filter((cake) => cake.id !== id))
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("manageCakes")}</h1>
          <p className="text-muted-foreground">{t("addEditDeleteCake")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="rounded-full">
              <Plus className="w-5 h-5 mr-2" />
              {t("addNewCake")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingCake ? t("editCake") : t("addNewCake")}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("cakeTitle")}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Classic Birthday Cake"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("description")}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t("describeCake")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">{t("price")}</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="45"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">{t("imageUrl")}</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {editingCake ? t("saveChanges") : t("addCake")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder={t("searchCakes")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Cakes Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCakes.map((cake) => (
          <Card key={cake.id} className="overflow-hidden group">
            <div className="aspect-square relative overflow-hidden">
              <img
                src={cake.image}
                alt={cake.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleOpenDialog(cake)}
                  className="rounded-full"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  {t("edit")}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(cake.id)}
                  className="rounded-full"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {t("delete")}
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">{cake.title}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{cake.description}</p>
              <p className="text-xl font-bold text-primary">{cake.price} DA</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCakes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noCakesFound")}</p>
        </div>
      )}
    </div>
  )
}
