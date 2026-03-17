"use client"

import { useState, useEffect } from "react"
import {
  Save,
  Instagram,
  Phone,
  Mail,
  MapPin,
  Loader2,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

interface Settings {
  instagram: string
  whatsapp: string
  email: string
  locationLat: string
  locationLng: string
  address: string
  businessHours: string
}

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    instagram: "@sisa_cake",
    whatsapp: "+1 234 567 890",
    email: "hello@sisacake.com",
    locationLat: "40.7128",
    locationLng: "-74.006",
    address: "123 Bakery Street, Sweet Town, New York, NY 10001",
    businessHours: "Mon-Sat: 9AM - 6PM",
  })

  // Load settings from Supabase on mount
  useEffect(() => {
    const loadSettings = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single()

      if (error) {
        console.error("Error loading settings:", error)
        // If table doesn't exist, show a message
        if (error.message.includes("relation") || error.message.includes("does not exist")) {
          alert("Settings table not found. Please run the SQL query in Supabase dashboard to create the table.")
        }
      } else if (data) {
        setSettings({
          instagram: data.instagram || "@sisa_cake",
          whatsapp: data.whatsapp || "+1 234 567 890",
          email: data.email || "hello@sisacake.com",
          locationLat: data.location_lat || "40.7128",
          locationLng: data.location_lng || "-74.006",
          address: data.address || "123 Bakery Street, Sweet Town, New York, NY 10001",
          businessHours: data.business_hours || "Mon-Sat: 9AM - 6PM",
        })
      }
      setIsLoaded(true)
    }

    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setIsSaved(false)

    const { data, error } = await supabase
      .from("settings")
      .upsert({
        id: 1,
        instagram: settings.instagram,
        whatsapp: settings.whatsapp,
        email: settings.email,
        location_lat: settings.locationLat,
        location_lng: settings.locationLng,
        address: settings.address,
        business_hours: settings.businessHours,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "id"
      })
      .select()

    if (error) {
      console.error("Error saving settings:", error)
      alert(`Error: ${error.message}`)
    } else {
      setIsSaved(true)
      // Reset saved message after 3 seconds
      setTimeout(() => setIsSaved(false), 3000)
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Business Settings</h1>
        <p className="text-muted-foreground">Update your contact information and location</p>
      </div>

      {!isLoaded ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading settings...</span>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Update your social media and contact details displayed on the website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-500" />
                  WhatsApp Number
                </Label>
                <Input
                  id="whatsapp"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  placeholder="+1 234 567 890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="hello@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  Instagram Handle
                </Label>
                <Input
                  id="instagram"
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  placeholder="@your_bakery"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours">Business Hours</Label>
                <Input
                  id="hours"
                  value={settings.businessHours}
                  onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                  placeholder="Mon-Sat: 9AM - 6PM"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Location Settings
            </CardTitle>
            <CardDescription>
              Set your business address and map coordinates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="123 Bakery Street, City, State, ZIP"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  value={settings.locationLat}
                  onChange={(e) => setSettings({ ...settings, locationLat: e.target.value })}
                  placeholder="40.7128"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  value={settings.locationLng}
                  onChange={(e) => setSettings({ ...settings, locationLng: e.target.value })}
                  placeholder="-74.006"
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Tip: You can find coordinates by searching your address on Google Maps and copying the lat/lng from the URL.
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isLoading} className="rounded-full px-8">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>

          {isSaved && (
            <div className="flex items-center gap-2 text-green-600 animate-fade-in-up">
              <CheckCircle className="w-5 h-5" />
              <span>Settings saved successfully!</span>
            </div>
          )}
        </div>
      </form>
      )}
    </div>
  )
}
