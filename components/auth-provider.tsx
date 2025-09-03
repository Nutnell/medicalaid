"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "doctor" | "student" | "researcher" | "patient" // Added patient role
  verified: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, name: string, role: User["role"]) => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("medai-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Mock API call - replace with actual authentication
      const mockUser: User = {
        id: "1",
        email,
        name: "Dr. Sarah Johnson",
        role: "doctor",
        verified: true,
      }
      setUser(mockUser)
      localStorage.setItem("medai-user", JSON.stringify(mockUser))
    } catch (error) {
      throw new Error("Login failed")
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, role: User["role"]) => {
    setLoading(true)
    try {
      // Mock API call - replace with actual registration
      const mockUser: User = {
        id: "1",
        email,
        name,
        role,
        verified: false,
      }
      setUser(mockUser)
      localStorage.setItem("medai-user", JSON.stringify(mockUser))
    } catch (error) {
      throw new Error("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("medai-user")
  }

  return <AuthContext.Provider value={{ user, login, logout, register, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
