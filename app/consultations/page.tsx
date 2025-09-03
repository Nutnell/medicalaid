"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { FileText, Search, CheckCircle, AlertCircle, Calendar, User, Brain, BarChart3 } from "lucide-react"

// Mock consultation data
const mockConsultations = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    patientId: "MRN001234",
    date: "2024-01-15",
    time: "14:30",
    chiefComplaint: "Chest pain evaluation",
    aiAssisted: true,
    status: "completed",
    diagnosis: "Non-cardiac chest pain",
    confidence: 92,
    reviewRequired: false,
  },
  {
    id: "2",
    patientName: "Michael Chen",
    patientId: "MRN001235",
    date: "2024-01-15",
    time: "10:15",
    chiefComplaint: "Headache assessment",
    aiAssisted: true,
    status: "pending_review",
    diagnosis: "Tension headache vs. migraine",
    confidence: 78,
    reviewRequired: true,
  },
  {
    id: "3",
    patientName: "Emily Rodriguez",
    patientId: "MRN001236",
    date: "2024-01-14",
    time: "16:45",
    chiefComplaint: "Diabetes follow-up",
    aiAssisted: false,
    status: "completed",
    diagnosis: "Type 2 DM, well controlled",
    confidence: null,
    reviewRequired: false,
  },
]

export default function ConsultationsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  if (!user || user.role !== "doctor") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>This page is only accessible to doctors</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const filteredConsultations = mockConsultations.filter((consultation) => {
    const matchesSearch =
      consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || consultation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: { variant: "default" as const, label: "Completed" },
      pending_review: { variant: "destructive" as const, label: "Needs Review" },
      in_progress: { variant: "secondary" as const, label: "In Progress" },
    }
    return badges[status as keyof typeof badges] || { variant: "outline" as const, label: status }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2 flex items-center">
            <FileText className="h-8 w-8 text-primary mr-3" />
            Consultation Review
          </h1>
          <p className="text-muted-foreground text-lg">
            Review and manage AI-assisted consultations and patient encounters
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Consultations</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">AI Assisted</p>
                  <p className="text-2xl font-bold">6</p>
                </div>
                <Brain className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <AlertCircle className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
                  <p className="text-2xl font-bold">89%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recent" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recent">Recent Consultations</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by patient name, MRN, or chief complaint..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="in_progress">In Progress</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Consultations List */}
            <div className="space-y-4">
              {filteredConsultations.map((consultation) => (
                <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{consultation.patientName}</h3>
                            <p className="text-sm text-muted-foreground">{consultation.patientId}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Date & Time</p>
                            <p className="font-medium">
                              {consultation.date} at {consultation.time}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Chief Complaint</p>
                            <p className="font-medium">{consultation.chiefComplaint}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Diagnosis</p>
                            <p className="font-medium">{consultation.diagnosis}</p>
                          </div>
                          {consultation.aiAssisted && consultation.confidence && (
                            <div>
                              <p className="text-sm text-muted-foreground">AI Confidence</p>
                              <p className="font-medium">{consultation.confidence}%</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge {...getStatusBadge(consultation.status)}>
                            {getStatusBadge(consultation.status).label}
                          </Badge>
                          {consultation.aiAssisted && (
                            <Badge variant="outline">
                              <Brain className="h-3 w-3 mr-1" />
                              AI Assisted
                            </Badge>
                          )}
                          {consultation.reviewRequired && (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Review Required
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/consultations/${consultation.id}`}>
                            <FileText className="h-4 w-4 mr-1" />
                            View Details
                          </Link>
                        </Button>
                        {consultation.reviewRequired && (
                          <Button size="sm" asChild>
                            <Link href={`/consultations/${consultation.id}/review`}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Review
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Consultations Requiring Review</CardTitle>
                <CardDescription>
                  AI-assisted consultations that need your professional review and sign-off
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredConsultations
                    .filter((c) => c.reviewRequired)
                    .map((consultation) => (
                      <div key={consultation.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{consultation.patientName}</h3>
                            <p className="text-sm text-muted-foreground">{consultation.chiefComplaint}</p>
                            <p className="text-sm">AI Confidence: {consultation.confidence}%</p>
                          </div>
                          <Button asChild>
                            <Link href={`/consultations/${consultation.id}/review`}>Review Now</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Consultation Analytics</CardTitle>
                <CardDescription>Performance metrics and insights from your AI-assisted consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">Analytics Dashboard Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Detailed insights into consultation patterns and AI performance
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
