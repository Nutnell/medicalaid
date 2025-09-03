"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Database, Search, BarChart3, Download, Shield, TrendingUp, Users } from "lucide-react"

// Mock anonymized data
const mockDatasets = [
  {
    id: "1",
    name: "Cardiovascular Outcomes Dataset",
    description: "Anonymized patient outcomes for cardiovascular interventions (2020-2024)",
    recordCount: 15420,
    lastUpdated: "2024-01-15",
    categories: ["Cardiology", "Outcomes"],
    accessLevel: "Approved",
    dataPoints: ["Age Group", "Gender", "Intervention Type", "Outcome", "Comorbidities"],
  },
  {
    id: "2",
    name: "Diabetes Management Cohort",
    description: "Long-term diabetes management and HbA1c trends",
    recordCount: 8934,
    lastUpdated: "2024-01-12",
    categories: ["Endocrinology", "Longitudinal"],
    accessLevel: "Approved",
    dataPoints: ["Age Group", "Treatment Type", "HbA1c Levels", "Complications", "Duration"],
  },
  {
    id: "3",
    name: "Emergency Department Utilization",
    description: "ED visit patterns and triage outcomes",
    recordCount: 45678,
    lastUpdated: "2024-01-10",
    categories: ["Emergency Medicine", "Utilization"],
    accessLevel: "Pending",
    dataPoints: ["Chief Complaint", "Triage Level", "Length of Stay", "Disposition", "Time Patterns"],
  },
]

const mockAnalytics = {
  totalRecords: 70032,
  activeDatasets: 12,
  approvedQueries: 156,
  collaborators: 8,
}

export default function ResearcherDataPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  if (!user || user.role !== "researcher") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>This page is only accessible to researchers</CardDescription>
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

  const filteredDatasets = mockDatasets.filter((dataset) => {
    const matchesSearch =
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" ||
      dataset.categories.some((cat) => cat.toLowerCase().includes(selectedCategory.toLowerCase()))

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2 flex items-center">
            <Database className="h-8 w-8 text-primary mr-3" />
            Anonymized Data Explorer
          </h1>
          <p className="text-muted-foreground text-lg">
            Access anonymized, aggregated patient data for research purposes
          </p>
        </div>

        {/* Privacy Notice */}
        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Privacy Protected:</strong> All data has been anonymized and aggregated in compliance with HIPAA and
            research ethics guidelines. Individual patient identification is not possible.
          </AlertDescription>
        </Alert>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                  <p className="text-2xl font-bold">{mockAnalytics.totalRecords.toLocaleString()}</p>
                </div>
                <Database className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Datasets</p>
                  <p className="text-2xl font-bold">{mockAnalytics.activeDatasets}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved Queries</p>
                  <p className="text-2xl font-bold">{mockAnalytics.approvedQueries}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Collaborators</p>
                  <p className="text-2xl font-bold">{mockAnalytics.collaborators}</p>
                </div>
                <Users className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="datasets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="datasets">Available Datasets</TabsTrigger>
            <TabsTrigger value="queries">Query Builder</TabsTrigger>
            <TabsTrigger value="exports">Data Exports</TabsTrigger>
          </TabsList>

          <TabsContent value="datasets" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search datasets by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="all">All Categories</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="endocrinology">Endocrinology</option>
                    <option value="emergency">Emergency Medicine</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Datasets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDatasets.map((dataset) => (
                <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="font-heading text-lg mb-2">{dataset.name}</CardTitle>
                        <CardDescription>{dataset.description}</CardDescription>
                      </div>
                      <Badge variant={dataset.accessLevel === "Approved" ? "default" : "secondary"}>
                        {dataset.accessLevel}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Records:</span>
                        <span className="font-medium ml-2">{dataset.recordCount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Updated:</span>
                        <span className="font-medium ml-2">{dataset.lastUpdated}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Categories:</p>
                      <div className="flex gap-1 flex-wrap">
                        {dataset.categories.map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Available Data Points:</p>
                      <div className="flex gap-1 flex-wrap">
                        {dataset.dataPoints.slice(0, 3).map((point) => (
                          <Badge key={point} variant="secondary" className="text-xs">
                            {point}
                          </Badge>
                        ))}
                        {dataset.dataPoints.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{dataset.dataPoints.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1"
                        disabled={dataset.accessLevel !== "Approved"}
                        asChild={dataset.accessLevel === "Approved"}
                      >
                        {dataset.accessLevel === "Approved" ? (
                          <Link href={`/researcher/data/${dataset.id}/explore`}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Explore Data
                          </Link>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-2" />
                            Access Pending
                          </>
                        )}
                      </Button>
                      {dataset.accessLevel === "Approved" && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="queries">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Query Builder</CardTitle>
                <CardDescription>Build custom queries to analyze anonymized patient data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">Query Builder Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">Advanced query interface for custom data analysis</p>
                  <Button variant="outline">Request Early Access</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exports">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Data Exports</CardTitle>
                <CardDescription>Download anonymized datasets for external analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Exports Available</h3>
                  <p className="text-muted-foreground mb-4">Export datasets after running approved queries</p>
                  <Button variant="outline">View Export Guidelines</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
