import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import CakeDetails from "@/components/cake-details"

// Sample cake data - in production this would come from Supabase
const cakes = [
  {
    id: 1,
    title: "Classic Birthday Cake",
    description: "A timeless vanilla sponge with buttercream frosting, perfect for any birthday celebration. This cake features three layers of moist vanilla sponge, filled with silky vanilla buttercream and topped with beautiful rosettes. Perfect for family gatherings and birthday parties of all ages.",
    price: 45,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop",
    category: "birthday",
    rating: 5,
    ingredients: ["Vanilla", "Butter", "Eggs", "Sugar", "Flour", "Cream"],
    servings: "8-10",
    prepTime: "24 hours advance order",
  },
  {
    id: 2,
    title: "Chocolate Dream",
    description: "Rich chocolate layers with ganache, topped with chocolate curls and berries. This indulgent creation features Belgian dark chocolate throughout, with a luscious chocolate ganache filling and a mirror glaze finish.",
    price: 55,
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=800&fit=crop",
    category: "birthday",
    rating: 5,
    ingredients: ["Dark Chocolate", "Butter", "Eggs", "Sugar", "Flour", "Cream", "Berries"],
    servings: "10-12",
    prepTime: "24 hours advance order",
  },
  {
    id: 3,
    title: "Strawberry Delight",
    description: "Fresh strawberry sponge with cream cheese frosting and fresh strawberries. A light and refreshing option perfect for spring and summer celebrations.",
    price: 50,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=800&fit=crop",
    category: "birthday",
    rating: 4,
    ingredients: ["Strawberries", "Cream Cheese", "Vanilla", "Sugar", "Flour", "Eggs"],
    servings: "8-10",
    prepTime: "24 hours advance order",
  },
  {
    id: 4,
    title: "Elegant White Wedding",
    description: "A stunning multi-tier white cake with delicate sugar flowers and gold accents. This masterpiece is perfect for your special day, featuring vanilla sponge with champagne buttercream.",
    price: 250,
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&h=800&fit=crop",
    category: "wedding",
    rating: 5,
    ingredients: ["Vanilla", "Champagne", "Butter", "Eggs", "Sugar", "Fondant"],
    servings: "50-75",
    prepTime: "1 week advance order",
  },
  {
    id: 5,
    title: "Red Velvet Romance",
    description: "Classic red velvet with smooth cream cheese frosting and delicate rose decorations. A southern classic with its signature red color and tangy cream cheese topping.",
    price: 60,
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&h=800&fit=crop",
    category: "birthday",
    rating: 5,
    ingredients: ["Cocoa", "Buttermilk", "Cream Cheese", "Vanilla", "Red Velvet"],
    servings: "10-12",
    prepTime: "24 hours advance order",
  },
  {
    id: 6,
    title: "Unicorn Fantasy",
    description: "A magical cake with rainbow layers, colorful buttercream, and unicorn decorations. Perfect for children's parties and anyone who loves a touch of magic.",
    price: 75,
    image: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=800&h=800&fit=crop",
    category: "kids",
    rating: 5,
    ingredients: ["Vanilla", "Food Coloring", "Butter", "Sugar", "Fondant", "Sprinkles"],
    servings: "12-15",
    prepTime: "48 hours advance order",
  },
  {
    id: 7,
    title: "Carrot Cake Classic",
    description: "Moist carrot cake with walnuts, cinnamon, and cream cheese frosting. A wholesome and delicious option with perfectly balanced spices.",
    price: 45,
    image: "https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=800&h=800&fit=crop",
    category: "birthday",
    rating: 4,
    ingredients: ["Carrots", "Walnuts", "Cinnamon", "Cream Cheese", "Brown Sugar"],
    servings: "8-10",
    prepTime: "24 hours advance order",
  },
  {
    id: 8,
    title: "Lemon Sunshine",
    description: "Zesty lemon sponge with lemon curd filling and meringue topping. A bright and refreshing cake perfect for summer celebrations.",
    price: 50,
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&h=800&fit=crop",
    category: "birthday",
    rating: 4,
    ingredients: ["Lemons", "Eggs", "Sugar", "Butter", "Meringue"],
    servings: "8-10",
    prepTime: "24 hours advance order",
  },
]

export async function generateStaticParams() {
  return cakes.map((cake) => ({
    id: cake.id.toString(),
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cake = cakes.find((c) => c.id === parseInt(id))
  return {
    title: `${cake?.title || "Cake"} | SISA_Cake`,
    description: cake?.description || "View cake details",
  }
}

export default async function CakeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cake = cakes.find((c) => c.id === parseInt(id))

  if (!cake) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-2xl">Cake not found</h1>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <CakeDetails cake={cake} />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
