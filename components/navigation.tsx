"use client"

import Link from "next/link"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback } from "./ui/avatar"
import {
  Stethoscope,
  Settings,
  LogOut,
  Search,
  BookOpen,
  BarChart3,
  Users,
  Calendar,
  MessageSquare,
  FileText,
  Database,
  Brain,
} from "lucide-react"

export function Navigation() {
  const { user, logout } = useAuth()

  const getRoleSpecificLinks = () => {
    if (!user) return []

    switch (user.role) {
      case "doctor":
        return [
          { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
          { href: "/patients", label: "Patient List", icon: Users },
          { href: "/diagnosis", label: "AI Diagnosis", icon: Brain },
          { href: "/consultations", label: "Consultations", icon: FileText },
          { href: "/research", label: "Research", icon: Search },
        ]
      case "patient":
        return [
          { href: "/dashboard", label: "My Dashboard", icon: BarChart3 },
          { href: "/patient/symptom-checker", label: "Symptom Checker", icon: Stethoscope },
          { href: "/patient/doctors", label: "Find Doctors", icon: Users },
          { href: "/patient/appointments", label: "Appointments", icon: Calendar },
          { href: "/patient/messages", label: "Messages", icon: MessageSquare },
        ]
      case "student":
        return [
          { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
          { href: "/learning", label: "Learning Hub", icon: BookOpen },
          { href: "/student/cases", label: "Case Library", icon: FileText },
          { href: "/student/sandbox", label: "AI Sandbox", icon: Brain },
        ]
      case "researcher":
        return [
          { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
          { href: "/research", label: "Research Portal", icon: Search },
          { href: "/researcher/data", label: "Data Explorer", icon: Database },
          { href: "/researcher/analytics", label: "Analytics", icon: BarChart3 },
        ]
      default:
        return []
    }
  }

  const roleLinks = getRoleSpecificLinks()

  return (
    <nav className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Stethoscope className="h-8 w-8 text-primary" />
            <span className="font-heading font-bold text-xl">MedAI</span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              {roleLinks.slice(0, 4).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </div>
                  {roleLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href} className="flex items-center">
                        <link.icon className="mr-2 h-4 w-4" />
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
