"use client"

import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Activity, Heart, Thermometer, Weight, Download, Eye, AlertCircle } from "lucide-react"

// Mock patient data
const mockPatientData = {
  personalInfo: {
    name: "John Smith",
    dateOfBirth: "1985-03-15",
    gender: "Male",
    bloodType: "O+",
    emergencyContact: "Jane Smith (Wife) - (555) 123-4567",
  },
  vitals: [
    { date: "2024-01-15", bloodPressure: "120/80", heartRate: "72", temperature: "98.6°F", weight: "175 lbs" },
    { date: "2024-01-10", bloodPressure: "118/78", heartRate: "68", temperature: "98.4°F", weight: "174 lbs" },
  ],
  medications: [
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", prescriber: "Dr. Sarah Johnson", active: true },
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily", prescriber: "Dr. Sarah Johnson", active: true },
    { name: "Vitamin D3", dosage: "1000 IU", frequency: "Once daily", prescriber: "Dr. Sarah Johnson", active: true },
  ],
  testResults: [
    {
      date: "2024-01-15",
      test: "Complete Blood Count",
      status: "Normal",
      doctor: "Dr. Sarah Johnson",
      results: "All values within normal range",
    },
    {
      date: "2024-01-10",
      test: "Lipid Panel",
      status: "Attention Required",
      doctor: "Dr. Sarah Johnson",
      results: "Slightly elevated cholesterol - follow up recommended",
    },
  ],
  allergies: [
    { allergen: "Penicillin", reaction: "Rash", severity: "Moderate" },
    { allergen: "Shellfish", reaction: "Swelling", severity: "Severe" },
  ],
}

export default function PatientRecordsPage() {
  const { user } = useAuth()

  if (!user || user.role !== "patient") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>This page is only accessible to patients</CardDescription>
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2">My Medical Records</h1>
          <p className="text-muted-foreground text-lg">Access and manage your health information</p>
        </div>

        {/* Patient Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-heading">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="font-medium">{mockPatientData.personalInfo.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{mockPatientData.personalInfo.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gender</p>
                <p className="font-medium">{mockPatientData.personalInfo.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blood Type</p>
                <p className="font-medium">{mockPatientData.personalInfo.bloodType}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                <p className="font-medium">{mockPatientData.personalInfo.emergencyContact}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="vitals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="tests">Test Results</TabsTrigger>
            <TabsTrigger value="allergies">Allergies</TabsTrigger>
          </TabsList>

          <TabsContent value="vitals">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Recent Vital Signs</CardTitle>
                <CardDescription>Your latest vital sign measurements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPatientData.vitals.map((vital, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{vital.date}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Blood Pressure</p>
                            <p className="font-medium">{vital.bloodPressure}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Heart Rate</p>
                            <p className="font-medium">{vital.heartRate} bpm</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Thermometer className="h-4 w-4 text-orange-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Temperature</p>
                            <p className="font-medium">{vital.temperature}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Weight className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Weight</p>
                            <p className="font-medium">{vital.weight}</p>
                          </div>
                        </div>
                      </div>
                      {index < mockPatientData.vitals.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Current Medications</CardTitle>
                <CardDescription>Your active prescriptions and medications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPatientData.medications.map((medication, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">{medication.name}</h3>
                          <Badge variant={medication.active ? "default" : "secondary"}>
                            {medication.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {medication.dosage} • {medication.frequency}
                        </p>
                        <p className="text-xs text-muted-foreground">Prescribed by {medication.prescriber}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Test Results</CardTitle>
                <CardDescription>Your recent laboratory and diagnostic test results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPatientData.testResults.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">{test.test}</h3>
                          <Badge variant={test.status === "Normal" ? "default" : "destructive"}>{test.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{test.results}</p>
                        <p className="text-xs text-muted-foreground">
                          {test.date} • {test.doctor}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allergies">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Known Allergies</CardTitle>
                <CardDescription>Important allergy information for your safety</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPatientData.allergies.map((allergy, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">{allergy.allergen}</h3>
                          <Badge variant={allergy.severity === "Severe" ? "destructive" : "secondary"}>
                            {allergy.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Reaction: {allergy.reaction}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
