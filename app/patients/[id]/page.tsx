"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import api from "@/lib/api"
import {
  ArrowLeft, Edit, Calendar, Phone, Mail, MapPin, AlertTriangle, Pill, FileText, Activity, Heart, Thermometer, Weight, Ruler,
} from "lucide-react"

// Interfaces to define the shape of our live data
interface PatientData {
  patient: any // FHIR Patient Resource
  allergies: any[] // Array of FHIR AllergyIntolerance Resources
  medications: any[] // Array of FHIR MedicationStatement Resources
  vitals: any[] // Simplified vital signs for now
  consultations: any[] // Simplified consultation history
}

export default function PatientProfilePage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // --- State for live data ---
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // --- Data fetching logic ---
  useEffect(() => {
    if (params.id) {
      const fetchPatientData = async () => {
        try {
          setIsLoading(true)
          setError(null)
          const data = await api.get<PatientData>(`/fhir/Patient/${params.id}`)
          setPatientData(data)
        } catch (err: any) {
          setError(err.message || "Failed to load patient profile.")
        } finally {
          setIsLoading(false)
        }
      }
      fetchPatientData()
    }
  }, [params.id])

  if (!user) {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="flex items-center justify-center min-h-[80vh]">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>Please sign in to access patient records</CardDescription>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-12 w-1/2 mb-8" />
            <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
            </div>
        </div>
      </div>
    )
  }
  
  if (error) {
     return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="flex items-center justify-center min-h-[80vh]">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Error Loading Profile</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
     )
  }

  if (!patientData) {
    return null;
  }

  const { patient, allergies, medications, vitals, consultations } = patientData;
  const patientName = `${patient.name[0].given.join(" ")} ${patient.name[0].family}`
  const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - now uses live data */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/patients">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patients
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-heading font-bold text-3xl">{patientName}</h1>
              <p className="text-muted-foreground">
                {age} years old • {patient.gender} • MRN: {patient.identifier?.[0]?.value}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/patients/${params.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/diagnosis?patient=${params.id}`}>
                <Activity className="h-4 w-4 mr-2" />
                New Consultation
              </Link>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="allergies">Allergies</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient Demographics */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-heading">Patient Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p className="text-lg">{patientName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                      <p className="text-lg">{patient.birthDate} ({age} years old)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gender</p>
                      <p className="text-lg capitalize">{patient.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Medical Record Number</p>
                      <p className="text-lg font-mono">{patient.identifier?.[0]?.value}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-medium">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{patient.telecom?.find((t: any) => t.system === 'phone')?.value}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{patient.telecom?.find((t: any) => t.system === 'email')?.value}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {patient.address?.[0]?.line.join(", ")}, {patient.address?.[0]?.city}, {patient.address?.[0]?.state}{" "}
                          {patient.address?.[0]?.postalCode}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-medium">Emergency Contact</h4>
                    <div className="space-y-2">
                      <p>
                        {patient.contact?.[0]?.name.given.join(" ")} {patient.contact?.[0]?.name.family}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{patient.contact?.[0]?.telecom[0].value}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Alerts & Vitals */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Critical Alerts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {allergies.filter((a: any) => a.reaction?.[0]?.severity === 'severe').map((allergy: any) => (
                         <Alert key={allergy.id} variant="destructive">
                           <AlertTriangle className="h-4 w-4" />
                           <AlertDescription>
                             <strong>Severe Allergy:</strong> {allergy.code.coding[0].display}
                           </AlertDescription>
                         </Alert>
                    ))}
                    {allergies.filter((a: any) => a.reaction?.[0]?.severity === 'severe').length === 0 && (
                        <p className="text-sm text-muted-foreground">No severe allergies noted.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Latest Vitals</CardTitle>
                    <CardDescription>{vitals?.[0]?.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {vitals.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                <Heart className="h-4 w-4 text-red-500" />
                                <span className="text-sm">Blood Pressure</span>
                                </div>
                                <span className="font-medium">{vitals[0].bloodPressure}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                <Activity className="h-4 w-4 text-blue-500" />
                                <span className="text-sm">Heart Rate</span>
                                </div>
                                <span className="font-medium">{vitals[0].heartRate} bpm</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                <Weight className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Weight</span>
                                </div>
                                <span className="font-medium">{vitals[0].weight}</span>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground">No recent vitals recorded.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="allergies">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-heading">Allergies & Intolerances</CardTitle>
                    <CardDescription>Known allergic reactions and intolerances</CardDescription>
                  </div>
                  <Button><AlertTriangle className="h-4 w-4 mr-2" />Add Allergy</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allergies.map((allergy: any) => (
                    <Card key={allergy.id} className={`border-l-4 ${allergy.reaction?.[0]?.severity === 'severe' ? 'border-l-red-500' : 'border-l-amber-500'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-lg">{allergy.code.coding[0].display}</h4>
                            <p className="text-sm text-muted-foreground">
                              Reaction: {allergy.reaction?.[0]?.manifestation[0].coding[0].display}
                            </p>
                          </div>
                          <Badge variant={allergy.reaction?.[0]?.severity === "severe" ? "destructive" : "secondary"}>
                            {allergy.reaction?.[0]?.severity}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {allergies.length === 0 && <p className="text-muted-foreground text-center py-4">No allergies recorded.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications">
             <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-heading">Current Medications</CardTitle>
                    <CardDescription>Active prescriptions and dosages</CardDescription>
                  </div>
                  <Button><Pill className="h-4 w-4 mr-2" />Add Medication</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medications.map((med: any) => (
                    <Card key={med.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Pill className="h-8 w-8 text-primary" />
                            <div>
                              <h4 className="font-medium">{med.medicationCodeableConcept.coding[0].display}</h4>
                              <p className="text-sm text-muted-foreground">{med.dosage[0].text}</p>
                            </div>
                          </div>
                          <Badge variant="default">{med.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {medications.length === 0 && <p className="text-muted-foreground text-center py-4">No medications recorded.</p>}
                </div>
              </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="vitals">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-heading">Vital Signs History</CardTitle>
                    <CardDescription>Recorded vital signs and measurements</CardDescription>
                  </div>
                  <Button><Thermometer className="h-4 w-4 mr-2" />Record Vitals</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vitals.map((vital: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{vital.date}</h4>
                          <Badge variant="outline">Recorded</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                           <div className="flex items-center space-x-2">
                            <Ruler className="h-4 w-4 text-purple-500" />
                            <div>
                              <p className="text-sm text-muted-foreground">Height</p>
                              <p className="font-medium">{vital.height}</p>
                            </div>
                          </div>
                           <div>
                            <p className="text-sm text-muted-foreground">BMI</p>
                            <p className="font-medium">{vital.bmi}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {vitals.length === 0 && <p className="text-muted-foreground text-center py-4">No vitals recorded.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="consultations">
             <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-heading">Consultation History</CardTitle>
                    <CardDescription>Previous visits and medical encounters</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href={`/diagnosis?patient=${params.id}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      New Consultation
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultations.map((consult: any) => (
                    <Card key={consult.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                              <h4 className="font-medium">{consult.type}</h4>
                              <p className="text-sm text-muted-foreground">{consult.date} • {consult.provider}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm"><FileText className="h-4 w-4" /></Button>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium">Chief Complaint:</p>
                            <p className="text-sm text-muted-foreground">{consult.chiefComplaint}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Assessment:</p>
                            <p className="text-sm text-muted-foreground">{consult.assessment}</p>
                          </div>
                           <div>
                            <p className="text-sm font-medium">Plan:</p>
                            <p className="text-sm text-muted-foreground">{consult.plan}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {consultations.length === 0 && <p className="text-muted-foreground text-center py-4">No consultations recorded.</p>}
                </div>
              </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

