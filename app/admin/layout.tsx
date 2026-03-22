"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import AdminSidebar from "@/components/admin-sidebar"
import { LogOut, Cake } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/signin")
      } else if (user.role !== "admin") {
        router.push("/")
      }
    }
  }, [user, loading, router])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  // Don't render admin layout if user is not authorized
  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="lg:pl-64">
        {/* Admin Header */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                <Cake className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">{t("adminPanel")}</h2>
                <p className="text-sm text-muted-foreground">{t("welcomeBack")}, {user.name || t("admin")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-all text-sm"
              >
                {t("backToHome")}
              </Link>
              <button
                onClick={() => {
                  signOut()
                  router.push("/")
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium transition-all text-sm"
              >
                <LogOut className="w-4 h-4" />
                {t("signOut")}
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
