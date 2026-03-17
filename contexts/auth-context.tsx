"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { supabase } from "@/lib/supabase"

interface User {
  id: string
  phone: string
  name: string | null
  email: string | null
  role: "admin" | "customer"
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
  signIn: (phone: string, password: string) => Promise<{ error: Error | null }>
  signUp: (phone: string, password: string, name: string, email?: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUserFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("sisacake_user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      }
    } catch (error) {
      console.error("Error loading user from storage:", error)
    }
  }, [])

  useEffect(() => {
    loadUserFromStorage()
    setLoading(false)

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = () => {
      loadUserFromStorage()
    }
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [loadUserFromStorage])

  const signIn = async (phone: string, password: string) => {
    try {
      // Call the authenticate_user function
      const { data, error } = await supabase.rpc("authenticate_user", {
        p_phone: phone,
        p_password: password,
      })

      if (error) {
        return { error: new Error(error.message || "Failed to sign in") }
      }

      if (data && data.length > 0) {
        const userData = data[0]
        localStorage.setItem("sisacake_user", JSON.stringify(userData))
        setUser(userData)
        window.dispatchEvent(new Event("storage"))
        return { error: null }
      }

      return { error: new Error("Invalid phone number or password") }
    } catch (err) {
      console.error("Sign in error:", err)
      return { error: err as Error }
    }
  }

  const signUp = async (phone: string, password: string, name: string, email?: string) => {
    try {
      // First check if user already exists by trying to authenticate
      const { data: existingUser } = await supabase.rpc("authenticate_user", {
        p_phone: phone,
        p_password: password,
      })

      if (existingUser && existingUser.length > 0) {
        return { error: new Error("Phone number already registered") }
      }

      // Try to insert directly into users table
      const { data, error } = await supabase
        .from("users")
        .insert({
          phone: phone,
          password: password,
          name: name,
          email: email || null,
          role: "customer",
        })
        .select("id, phone, name, email, role")
        .single()

      if (error) {
        if (error.code === "23505") { // Unique violation
          return { error: new Error("Phone number already registered") }
        }
        return { error: new Error(error.message || "Failed to create account") }
      }

      if (data) {
        const userData = data
        localStorage.setItem("sisacake_user", JSON.stringify(userData))
        setUser(userData)
        window.dispatchEvent(new Event("storage"))
        return { error: null }
      }

      return { error: new Error("Failed to create account") }
    } catch (err) {
      console.error("Sign up error:", err)
      return { error: err as Error }
    }
  }

  const signOut = async () => {
    localStorage.removeItem("sisacake_user")
    setUser(null)
    window.dispatchEvent(new Event("storage"))
  }

  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signIn, signUp, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
