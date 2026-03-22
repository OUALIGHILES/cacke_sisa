"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Cake, UserPlus, Eye, EyeOff, Mail, Phone, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function SignUpPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const { t } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<{
    name?: string
    phone?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!formData.name.trim()) {
      newErrors.name = t("nameRequired")
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("nameMinLength")
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("phoneRequired")
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = t("validPhone")
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("validEmail")
    }

    if (!formData.password) {
      newErrors.password = t("passwordRequired")
    } else if (formData.password.length < 6) {
      newErrors.password = t("passwordMinLength")
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("confirmPasswordRequired")
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("passwordsDoNotMatch")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const { error } = await signUp(
        formData.phone.trim(),
        formData.password,
        formData.name.trim(),
        formData.email.trim() || undefined
      )

      if (error) {
        console.error("Signup error:", error)
        if (error.message.includes("already registered") || error.message.includes("duplicate") || error.message.includes("23505")) {
          toast.error("An account with this phone number already exists")
          setErrors({ phone: "This phone number is already registered" })
        } else if (error.message.includes("relation") || error.message.includes("does not exist")) {
          toast.error("Database setup required. Please contact administrator.")
          setErrors({ phone: "Database not configured" })
        } else {
          toast.error(error.message || "Failed to create account")
        }
      } else {
        toast.success("Account created successfully!")
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const passwordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 10) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    return strength
  }

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 2) return "bg-destructive"
    if (strength <= 4) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthLabel = (strength: number) => {
    if (strength <= 2) return t("weak")
    if (strength <= 4) return t("medium")
    return t("strong")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-amber-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-4 py-12">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-14 h-14 rounded-full gradient-pink flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Cake className="w-7 h-7 text-primary" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-gradient">{t("createAccount")}</span>
          </h1>
          <p className="text-muted-foreground">{t("joinForSweeter")}</p>
        </div>

        {/* Sign Up Form */}
        <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/80">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <UserPlus className="w-6 h-6 text-primary" />
              {t("signUp")}
            </CardTitle>
            <CardDescription>
              {t("createAccountToGetStarted")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {t("fullName")}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className={`pl-11 h-12 ${errors.name ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-destructive" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  {t("phone")}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+213 54 00 00 739"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`pl-11 h-12 ${errors.phone ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-destructive" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email Input (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("email")} <span className="text-muted-foreground font-normal">({t("optional")})</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-11 h-12 ${errors.email ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-destructive" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t("password")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("createStrongPassword")}
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-11 pr-11 h-12 ${errors.password ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength(formData.password))}`}
                        style={{ width: `${(passwordStrength(formData.password) / 6) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {getPasswordStrengthLabel(passwordStrength(formData.password))}
                    </span>
                  </div>
                )}
                {errors.password && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-destructive" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  {t("confirmPassword")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("confirmYourPassword")}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-11 pr-11 h-12 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-destructive" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold gradient-pink hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {t("creatingAccount")}
                  </span>
                ) : (
                  t("createAccount")
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              {t("alreadyHaveAccount")}{" "}
              <Link
                href="/signin"
                className="text-primary font-semibold hover:underline"
              >
                {t("signIn")}
              </Link>
            </div>
            <div className="text-xs text-center text-muted-foreground">
              {t("bySigningUp")}{" "}
              <Link href="#" className="underline hover:text-primary">
                {t("termsOfService")}
              </Link>{" "}
              {t("and")}{" "}
              <Link href="#" className="underline hover:text-primary">
                {t("privacyPolicy")}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
