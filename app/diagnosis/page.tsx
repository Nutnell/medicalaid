"use client"

import { useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/lib/api"
import {
  Brain, Search, BookOpen, Users, Clock, TrendingUp, FileText, AlertCircle, Plus, ArrowRight, Activity, Calendar, Star, type LucideProps,
} from "lucide-react"

// --- NEW: Helper to map icon names from API to actual components ---
const iconMap: { [key: string]: React.ComponentType<LucideProps> } = {
  Users,
  Brain,
  TrendingUp,
  BookOpen,
  Clock,
  FileText,
  Search,
  Activity,
  Calendar,
}

// --- NEW: Interfaces for our live data ---
interface Stat {
  label: string
  value: string
  icon: string // The API will send the name of the icon as a string
}

interface RecentActivityItem {
  id: string
  name?: string // For patients
  title?: string // For research
  age?: number
  condition?: string
  status?: string
  lastVisit?: string
  journal?: string
  date?: string
}

interface ResearchItem {
    title: string
    journal: string
    date: string
    relevance: "high" | "medium" | "low"
}

export default function DashboardPage() {
  const { user } = useAuth()

  // --- NEW: State for live data from the backend ---
  const [stats, setStats] = useState<Stat[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([])
  const [latestResearch, setLatestResearch] = useState<ResearchItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // --- NEW: Data fetching logic ---
  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        try {
          setIsLoading(true)
          setError(null)
          const [statsData, activityData, researchData] = await Promise.all([
            api.get<Stat[]>('/dashboard/stats'),
            api.get<RecentActivityItem[]>('/dashboard/recent-activity'),
            api.get<ResearchItem[]>('/dashboard/latest-research'),
          ])
          setStats(statsData)
          setRecentActivity(activityData)
          setLatestResearch(researchData)
        } catch (err: any) {
          setError(err.message || "Failed to load dashboard data.")
        } finally {
          setIsLoading(false)
        }
      }
      fetchDashboardData()
    }
  }, [user])

  // Access Denied logic remains the same
  if (!user) {
    // ... Access Denied Card ...
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>Please sign in to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // This function can be simplified or removed, as titles can come from the API
  const getRoleSpecificContent = () => {
    // ... logic to get title, subtitle, primary action based on user.role ...
    // This part is kept for now to maintain the header structure.
    // In a future step, this could also be driven by API data.
    switch (user.role) {
        case "doctor": return { title: "Clinical Dashboard", subtitle: "Manage your patients and access AI-powered diagnostic assistance", primaryAction: "New Patient Consultation", primaryHref: "/diagnosis" };
        case "student": return { title: "Learning Dashboard", subtitle: "Continue your medical education with AI-powered case studies", primaryAction: "Start Learning Module", primaryHref: "/learning" };
        case "researcher": return { title: "Research Dashboard", subtitle: "Access latest medical literature and research insights", primaryAction: "Explore Research", primaryHref: "/research" };
        case "patient": return { title: "My Health Dashboard", subtitle: "Access your medical records, appointments, and health information", primaryAction: "View My Records", primaryHref: "/patient/records" };
        default: return { title: "Dashboard", subtitle: "Welcome to MedAI", primaryAction: "Get Started", primaryHref: "/diagnosis" };
    }
  }

  const roleContent = getRoleSpecificContent()

  // --- FIXED: Main error state display ---
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-destructive">An Error Occurred</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - No changes needed here */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading font-bold text-3xl mb-2">{roleContent.title}</h1>
              <p className="text-muted-foreground text-lg">{roleContent.subtitle}</p>
              <div className="flex items-center mt-2 space-x-2">
                <Badge variant="secondary" className="capitalize">
                  {user.role}
                </Badge>
                {!user.verified && (
                  <Badge variant="outline" className="text-amber-600 border-amber-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Verification Pending
                  </Badge>
                )}
              </div>
            </div>
            <Button size="lg" asChild>
              <Link href={roleContent.primaryHref}>
                <Plus className="h-4 w-4 mr-2" />
                {roleContent.primaryAction}
              </Link>
            </Button>
          </div>
        </div>
        
        {/* --- MODIFIED: Stats Grid with Skeleton Loading --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-5 w-2/3 mb-2" />
                  <Skeleton className="h-8 w-1/3" />
                </CardContent>
              </Card>
            ))
          ) : (
            stats.map((stat, index) => {
              const IconComponent = iconMap[stat.icon] || Activity
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions Card - No changes needed */}
            <Card>{/* ... */}</Card>

            {/* --- MODIFIED: Recent Activity Card --- */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Recent Activity</CardTitle>
                <CardDescription>Your latest updates and tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))
                  ) : (
                    recentActivity.map((item, index) => (
                      <div key={item.id || index}>
                        {/* Here you could have different components based on role */}
                        {/* For simplicity, a generic display: */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{item.name || item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.condition || item.journal}</p>
                          </div>
                          {item.status && <Badge>{item.status}</Badge>}
                        </div>
                        {index < recentActivity.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* --- MODIFIED: Latest Research Card --- */}
            <Card>
              <CardHeader>
                 <CardTitle className="font-heading">Latest Research</CardTitle>
                 <CardDescription>Relevant medical literature</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    ))
                  ) : (
                    latestResearch.map((paper, index) => (
                        <div key={index}>
                           <div className="space-y-2">
                                <h4 className="text-sm font-medium leading-tight">{paper.title}</h4>
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                    <span>{paper.journal}</span>
                                    <span>•</span>
                                    <span>{paper.date}</span>
                                </div>
                           </div>
                           {index < latestResearch.length - 1 && <Separator className="mt-4" />}
                        </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events card can also be integrated similarly */}
            <Card>{/* ... */}</Card>
          </div>
        </div>
      </div>
    </div>
  )
}

