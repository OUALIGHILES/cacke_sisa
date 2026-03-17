"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Cake, Moon, Sun, Globe, ChevronDown } from "lucide-react"
import { useLanguage, Language } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "EN" },
  { code: "ar", label: "العربية", flag: "AR" },
  { code: "fr", label: "Français", flag: "FR" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/gallery", label: t("gallery") },
    { href: "/customize", label: t("customize") },
    { href: "/contact", label: t("contact") },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isLangMenuOpen && !(e.target as Element).closest('.lang-menu')) {
        setIsLangMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isLangMenuOpen])

  const currentLang = languages.find(l => l.code === language)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? "glass py-3 shadow-lg"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full gradient-pink flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Cake className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-gradient">SISA</span>
                <span className="text-foreground">_Cake</span>
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">by OUALI SANA</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-foreground/80 hover:text-primary font-medium transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative lang-menu">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary/80 hover:bg-secondary border border-border/50 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                aria-label="Select language"
              >
                <Globe className="w-4 h-4 text-primary" />
                <span className="font-semibold">{currentLang?.flag}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute top-full mt-2 right-0 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden min-w-[160px] animate-scale-in z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code)
                        setIsLangMenuOpen(false)
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-primary/10 transition-all duration-200 flex items-center gap-3 ${
                        language === lang.code ? 'bg-primary/15 text-primary font-semibold' : 'text-foreground'
                      }`}
                    >
                      <span className="font-bold text-sm w-8 h-8 rounded-full bg-secondary flex items-center justify-center">{lang.flag}</span>
                      <span className="text-sm">{lang.label}</span>
                      {language === lang.code && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-primary"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-3 rounded-full bg-secondary/80 hover:bg-secondary border border-border/50 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md group"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-500 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-primary group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Admin Button - Desktop */}
            <Link
              href="/admin"
              className="hidden lg:inline-flex px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm"
            >
              {t("admin")}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-96 mt-4" : "max-h-0"
          }`}
        >
          <div className="glass rounded-2xl p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-foreground hover:bg-primary/10 hover:text-primary font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl bg-primary text-primary-foreground text-center font-semibold"
            >
              {t("admin")}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
