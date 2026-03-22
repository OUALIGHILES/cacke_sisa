"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Cake,
  MessageSquare,
  Settings,
  DollarSign,
  Menu,
  X,
  LogOut,
  Home,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
  Bell,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

export default function AdminSidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>("main")

  const mainNavigation = [
    { name: t("dashboard"), href: "/admin", icon: LayoutDashboard },
    { name: t("orders"), href: "/admin/orders", icon: ShoppingBag },
    { name: t("cakes"), href: "/admin/cakes", icon: Cake },
    { name: t("messages"), href: "/admin/messages", icon: MessageSquare },
  ]

  const managementNavigation = [
    { name: t("customers"), href: "/admin/customers", icon: Users },
    { name: t("reviews"), href: "/admin/reviews", icon: Star },
    { name: t("pricing"), href: "/admin/pricing", icon: DollarSign },
  ]

  const analyticsNavigation = [
    { name: t("analytics"), href: "/admin/analytics", icon: TrendingUp },
    { name: t("notifications"), href: "/admin/notifications", icon: Bell },
    { name: t("settings"), href: "/admin/settings", icon: Settings },
  ]

  const NavSection = ({ 
    title, 
    items, 
    sectionKey,
    isExpanded 
  }: { 
    title: string
    items: typeof mainNavigation
    sectionKey: string
    isExpanded: boolean
  }) => (
    <div className="space-y-1">
      <button
        onClick={() => setExpandedSection(isExpanded ? null : sectionKey)}
        className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
      >
        {title}
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>
      {isExpanded && (
        <div className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card shadow-lg border border-border"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border shadow-xl z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Cake className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg">SISA_Cake</h1>
                <p className="text-xs text-muted-foreground">{t("adminPanel")}</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
            <NavSection
              title="Main"
              items={mainNavigation}
              sectionKey="main"
              isExpanded={expandedSection === "main"}
            />
            <NavSection
              title="Management"
              items={managementNavigation}
              sectionKey="management"
              isExpanded={expandedSection === "management"}
            />
            <NavSection
              title="Analytics"
              items={analyticsNavigation}
              sectionKey="analytics"
              isExpanded={expandedSection === "analytics"}
            />
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">{t("viewWebsite")}</span>
            </Link>
            <button
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t("logout")}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
