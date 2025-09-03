"use client"

import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  Brain,
  Search,
  BookOpen,
  Users,
  Clock,
  TrendingUp,
  FileText,
  AlertCircle,
  Plus,
  ArrowRight,
  Activity,
  Calendar,
  Star,
} from "lucide-react"

// Mock data - replace with real API calls
const mockRecentPatients = [
  {
    id: "1",
    name: "Patient A",
    age: 45,
    lastVisit: "2024-01-15",
    condition: "Chest pain evaluation",
    status: "pending",
  },
  {
    id: "2",
    name: "Patient B",
    age: 32,
    lastVisit: "2024-01-14",
    condition: "Headache assessment",
    status: "completed",
  },
  {
    id: "3",
    name: "Patient C",
    age: 67,
    lastVisit: "2024-01-13",
    condition: "Diabetes follow-up",
    status: "completed",
  },
]

const mockRecentResearch = [
  {
    title: "New Guidelines for Hypertension Management",
    journal: "NEJM",
    date: "2024-01-10",
    relevance: "high",
  },
  {
    title: "AI in Diagnostic Imaging: Latest Advances",
    journal: "Nature Medicine",
    date: "2024-01-08",
    relevance: "medium",
  },
  {
    title: "COVID-19 Long-term Effects Study",
    journal: "The Lancet",
    date: "2024-01-05",
    relevance: "medium",
  },
]

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
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

  const getRoleSpecificContent = () => {
    switch (user.role) {
      case "doctor":
        return {
          title: "Clinical Dashboard",
          subtitle: "Manage your patients and access AI-powered diagnostic assistance",
          primaryAction: "New Patient Consultation",
          primaryHref: "/diagnosis",
          stats: [
            { label: "Patients This Week", value: "24", icon: Users },
            { label: "AI Consultations", value: "18", icon: Brain },
            { label: "Accuracy Rate", value: "94%", icon: TrendingUp },
          ],
        }
      case "student":
        return {
          title: "Learning Dashboard",
          subtitle: "Continue your medical education with AI-powered case studies",
          primaryAction: "Start Learning Module",
          primaryHref: "/learning",
          stats: [
            { label: "Cases Completed", value: "12", icon: BookOpen },
            { label: "Study Hours", value: "28", icon: Clock },
            { label: "Progress", value: "76%", icon: TrendingUp },
          ],
        }
      case "researcher":
        return {
          title: "Research Dashboard",
          subtitle: "Access latest medical literature and research insights",
          primaryAction: "Explore Research",
          primaryHref: "/research",
          stats: [
            { label: "Papers Reviewed", value: "45", icon: FileText },
            { label: "Citations Found", value: "128", icon: Search },
            { label: "Research Projects", value: "3", icon: Activity },
          ],
        }
      case "patient":
        return {
          title: "My Health Dashboard",
          subtitle: "Access your medical records, appointments, and health information",
          primaryAction: "View My Records",
          primaryHref: "/patient/records",
          stats: [
            { label: "Upcoming Appointments", value: "2", icon: Calendar },
            { label: "Active Medications", value: "3", icon: Activity },
            { label: "Recent Tests", value: "1", icon: FileText },
          ],
        }
      default:
        return {
          title: "Dashboard",
          subtitle: "Welcome to MedAI",
          primaryAction: "Get Started",
          primaryHref: "/diagnosis",
          stats: [],
        }
    }
  }

  const roleContent = getRoleSpecificContent()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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

        {/* Stats Grid */}
        {roleContent.stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {roleContent.stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Quick Actions</CardTitle>
                <CardDescription>Access your most-used features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {user.role !== "patient" && (
                    <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
                      <Link href="/diagnosis">
                        <Brain className="h-6 w-6" />
                        <span className="text-sm">AI Diagnosis</span>
                      </Link>
                    </Button>
                  )}
                  {user.role === "doctor" && (
                    <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
                      <Link href="/patients">
                        <Users className="h-6 w-6" />
                        <span className="text-sm">Patients</span>
                      </Link>
                    </Button>
                  )}
                  {user.role === "patient" && (
                    <>
                      <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
                        <Link href="/patient/records">
                          <FileText className="h-6 w-6" />
                          <span className="text-sm">My Records</span>
                        </Link>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
                        <Link href="/patient/appointments">
                          <Calendar className="h-6 w-6" />
                          <span className="text-sm">Appointments</span>
                        </Link>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
                        <Link href="/patient/medications">
                          <Activity className="h-6 w-6" />
                          <span className="text-sm">Medications</span>
                        </Link>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
                        <Link href="/patient/messages">
                          <Users className="h-6 w-6" />
                          <span className="text-sm">Messages</span>
                        </Link>
                      </Button>
                    </>
                  )}
                  {user.role !== "patient" && (
                    <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
                      <Link href="/research">
                        <Search className="h-6 w-6" />
                        <span className="text-sm">Research</span>
                      </Link>
                    </Button>
                  )}
                  {user.role === "student" && (
                    <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
                      <Link href="/learning">
                        <BookOpen className="h-6 w-6" />
                        <span className="text-sm">Learning</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            {user.role === "doctor" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-heading">Recent Patients</CardTitle>
                      <CardDescription>Your latest patient consultations</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/patients">
                        View All
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentPatients.map((patient, index) => (
                      <div key={patient.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Age {patient.age} • {patient.condition}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={patient.status === "completed" ? "default" : "secondary"}>
                              {patient.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{patient.lastVisit}</p>
                          </div>
                        </div>
                        {index < mockRecentPatients.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Learning Progress for Students */}
            {user.role === "student" && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Learning Progress</CardTitle>
                  <CardDescription>Your current study modules and achievements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Cardiology Fundamentals</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Diagnostic Imaging</span>
                      <span className="text-sm text-muted-foreground">62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Emergency Medicine</span>
                      <span className="text-sm text-muted-foreground">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity for Patients */}
            {user.role === "patient" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-heading">Recent Appointments</CardTitle>
                      <CardDescription>Your latest medical appointments and visits</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/patient/appointments">
                        View All
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Dr. Sarah Johnson</p>
                          <p className="text-sm text-muted-foreground">Cardiology Follow-up</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="default">Upcoming</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Jan 18, 2024</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Dr. Michael Chen</p>
                          <p className="text-sm text-muted-foreground">Annual Physical</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">Completed</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Jan 10, 2024</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Research */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-heading">Latest Research</CardTitle>
                    <CardDescription>Relevant medical literature</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/research">
                      View All
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentResearch.map((paper, index) => (
                    <div key={index}>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium leading-tight">{paper.title}</h4>
                          <Badge
                            variant={paper.relevance === "high" ? "default" : "secondary"}
                            className="ml-2 shrink-0"
                          >
                            {paper.relevance}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{paper.journal}</span>
                          <span>•</span>
                          <span>{paper.date}</span>
                        </div>
                      </div>
                      {index < mockRecentResearch.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Upcoming</CardTitle>
                <CardDescription>Your schedule and reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Medical Conference</p>
                      <p className="text-xs text-muted-foreground">Tomorrow, 9:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Patient Follow-up</p>
                      <p className="text-xs text-muted-foreground">Jan 18, 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Research Review</p>
                      <p className="text-xs text-muted-foreground">Jan 20, 10:00 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
