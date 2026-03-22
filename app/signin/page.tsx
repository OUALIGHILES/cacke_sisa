"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Cake, LogIn, Eye, EyeOff, Mail, Phone } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function SignInPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const { t } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { phone?: string; password?: string } = {}

    if (!formData.phone.trim()) {
      newErrors.phone = t("phoneRequired")
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = t("validPhone")
    }

    if (!formData.password) {
      newErrors.password = t("passwordRequired")
    } else if (formData.password.length < 6) {
      newErrors.password = t("passwordMinLength")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const { error } = await signIn(formData.phone.trim(), formData.password)

      if (error) {
        toast.error(error.message || t("invalidCredentials"))
        setErrors({ password: t("invalidCredentials") })
      } else {
        toast.success(t("successfullySignedIn"))
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
            <span className="text-gradient">{t("welcomeBack")}</span>
          </h1>
          <p className="text-muted-foreground">{t("signInToAccount")}</p>
        </div>

        {/* Sign In Form */}
        <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/80">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <LogIn className="w-6 h-6 text-primary" />
              {t("signIn")}
            </CardTitle>
            <CardDescription>
              {t("enterCredentials")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder="0123456789"
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
                    placeholder={t("password")}
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
                {errors.password && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-destructive" />
                    {errors.password}
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
                    {t("signingIn")}
                  </span>
                ) : (
                  t("signIn")
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              {t("dontHaveAccount")}{" "}
              <Link
                href="/signup"
                className="text-primary font-semibold hover:underline"
              >
                {t("signUp")}
              </Link>
            </div>
            <div className="text-xs text-center text-muted-foreground">
              {t("bySigningIn")}{" "}
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

        {/* Demo Credentials */}
        <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border/50 text-center">
          <p className="text-sm font-medium mb-2">{t("demoCredentials")}</p>
          <p className="text-xs text-muted-foreground">
            {t("phone")}: <code className="bg-secondary px-2 py-0.5 rounded">213540000739</code>
          </p>
          <p className="text-xs text-muted-foreground">
            {t("password")}: <code className="bg-secondary px-2 py-0.5 rounded">admin123</code>
          </p>
        </div>
      </div>
    </div>
  )
}
