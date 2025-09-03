"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import {
  ArrowLeft,
  Edit,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Pill,
  FileText,
  Activity,
  Heart,
  Thermometer,
  Weight,
  Ruler,
} from "lucide-react"

// Mock FHIR-compliant patient data
const mockPatientData = {
  id: "patient-001",
  resourceType: "Patient",
  identifier: [
    {
      use: "usual",
      type: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v2-0203",
            code: "MR",
            display: "Medical Record Number",
          },
        ],
      },
      value: "MRN001234",
    },
  ],
  active: true,
  name: [
    {
      use: "official",
      family: "Johnson",
      given: ["Sarah", "Marie"],
    },
  ],
  telecom: [
    {
      system: "phone",
      value: "+1-555-0123",
      use: "home",
    },
    {
      system: "email",
      value: "sarah.johnson@email.com",
      use: "home",
    },
  ],
  gender: "female",
  birthDate: "1978-03-15",
  address: [
    {
      use: "home",
      line: ["123 Main Street", "Apt 4B"],
      city: "Boston",
      state: "MA",
      postalCode: "02101",
      country: "US",
    },
  ],
  contact: [
    {
      relationship: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0131",
              code: "C",
              display: "Emergency Contact",
            },
          ],
        },
      ],
      name: {
        family: "Johnson",
        given: ["Michael"],
      },
      telecom: [
        {
          system: "phone",
          value: "+1-555-0124",
        },
      ],
    },
  ],
}

const mockAllergies = [
  {
    id: "allergy-001",
    resourceType: "AllergyIntolerance",
    clinicalStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
          code: "active",
        },
      ],
    },
    code: {
      coding: [
        {
          system: "http://www.nlm.nih.gov/research/umls/rxnorm",
          code: "7980",
          display: "Penicillin",
        },
      ],
    },
    reaction: [
      {
        manifestation: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "247472004",
                display: "Hives",
              },
            ],
          },
        ],
        severity: "moderate",
      },
    ],
  },
  {
    id: "allergy-002",
    resourceType: "AllergyIntolerance",
    clinicalStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
          code: "active",
        },
      ],
    },
    code: {
      coding: [
        {
          system: "http://snomed.info/sct",
          code: "227493005",
          display: "Cashew nuts",
        },
      ],
    },
    reaction: [
      {
        manifestation: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "39579001",
                display: "Anaphylaxis",
              },
            ],
          },
        ],
        severity: "severe",
      },
    ],
  },
]

const mockMedications = [
  {
    id: "medication-001",
    resourceType: "MedicationStatement",
    status: "active",
    medicationCodeableConcept: {
      coding: [
        {
          system: "http://www.nlm.nih.gov/research/umls/rxnorm",
          code: "316764",
          display: "Lisinopril 10mg",
        },
      ],
    },
    dosage: [
      {
        text: "10mg once daily",
        timing: {
          repeat: {
            frequency: 1,
            period: 1,
            periodUnit: "d",
          },
        },
      },
    ],
  },
  {
    id: "medication-002",
    resourceType: "MedicationStatement",
    status: "active",
    medicationCodeableConcept: {
      coding: [
        {
          system: "http://www.nlm.nih.gov/research/umls/rxnorm",
          code: "860975",
          display: "Metformin 500mg",
        },
      ],
    },
    dosage: [
      {
        text: "500mg twice daily with meals",
        timing: {
          repeat: {
            frequency: 2,
            period: 1,
            periodUnit: "d",
          },
        },
      },
    ],
  },
]

const mockVitalSigns = [
  {
    date: "2024-01-15",
    bloodPressure: "128/82",
    heartRate: "72",
    temperature: "98.6°F",
    weight: "165 lbs",
    height: "5'6\"",
    bmi: "26.6",
  },
  {
    date: "2024-01-01",
    bloodPressure: "132/85",
    heartRate: "75",
    temperature: "98.4°F",
    weight: "167 lbs",
    height: "5'6\"",
    bmi: "26.9",
  },
]

const mockConsultations = [
  {
    id: "encounter-001",
    date: "2024-01-15",
    type: "Follow-up",
    provider: "Dr. Smith",
    chiefComplaint: "Routine hypertension follow-up",
    assessment: "Hypertension well controlled on current medication",
    plan: "Continue current medications, follow up in 3 months",
  },
  {
    id: "encounter-002",
    date: "2024-01-01",
    type: "Annual Physical",
    provider: "Dr. Smith",
    chiefComplaint: "Annual wellness visit",
    assessment: "Overall good health, mild hypertension",
    plan: "Continue lifestyle modifications, monitor BP",
  },
]

export default function PatientProfilePage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

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

  const patient = mockPatientData
  const patientName = `${patient.name[0].given.join(" ")} ${patient.name[0].family}`
  const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
                {age} years old • {patient.gender} • MRN: {patient.identifier[0].value}
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
                      <p className="text-lg">
                        {patient.birthDate} ({age} years old)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gender</p>
                      <p className="text-lg capitalize">{patient.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Medical Record Number</p>
                      <p className="text-lg font-mono">{patient.identifier[0].value}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{patient.telecom[0].value}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{patient.telecom[1].value}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {patient.address[0].line.join(", ")}, {patient.address[0].city}, {patient.address[0].state}{" "}
                          {patient.address[0].postalCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Emergency Contact</h4>
                    <div className="space-y-2">
                      <p>
                        {patient.contact[0].name.given.join(" ")} {patient.contact[0].name.family}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{patient.contact[0].telecom[0].value}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Alerts */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Critical Alerts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Severe Allergy:</strong> Cashew nuts - Anaphylaxis risk
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Drug Allergy:</strong> Penicillin - Causes hives
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Latest Vitals</CardTitle>
                    <CardDescription>{mockVitalSigns[0].date}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Blood Pressure</span>
                      </div>
                      <span className="font-medium">{mockVitalSigns[0].bloodPressure}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Heart Rate</span>
                      </div>
                      <span className="font-medium">{mockVitalSigns[0].heartRate} bpm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Weight className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Weight</span>
                      </div>
                      <span className="font-medium">{mockVitalSigns[0].weight}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="allergies" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-heading">Allergies & Intolerances</CardTitle>
                    <CardDescription>Known allergic reactions and intolerances</CardDescription>
                  </div>
                  <Button>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Add Allergy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAllergies.map((allergy) => (
                    <Card key={allergy.id} className="border-l-4 border-l-red-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-lg">{allergy.code.coding[0].display}</h4>
                            <p className="text-sm text-muted-foreground">
                              Reaction: {allergy.reaction[0].manifestation[0].coding[0].display}
                            </p>
                          </div>
                          <Badge variant={allergy.reaction[0].severity === "severe" ? "destructive" : "secondary"}>
                            {allergy.reaction[0].severity}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-heading">Current Medications</CardTitle>
                    <CardDescription>Active prescriptions and dosages</CardDescription>
                  </div>
                  <Button>
                    <Pill className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMedications.map((medication) => (
                    <Card key={medication.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Pill className="h-8 w-8 text-primary" />
                            <div>
                              <h4 className="font-medium">{medication.medicationCodeableConcept.coding[0].display}</h4>
                              <p className="text-sm text-muted-foreground">{medication.dosage[0].text}</p>
                            </div>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-heading">Vital Signs History</CardTitle>
                    <CardDescription>Recorded vital signs and measurements</CardDescription>
                  </div>
                  <Button>
                    <Thermometer className="h-4 w-4 mr-2" />
                    Record Vitals
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockVitalSigns.map((vitals, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{vitals.date}</h4>
                          <Badge variant="outline">Recorded</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <div>
                              <p className="text-sm text-muted-foreground">Blood Pressure</p>
                              <p className="font-medium">{vitals.bloodPressure}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="text-sm text-muted-foreground">Heart Rate</p>
                              <p className="font-medium">{vitals.heartRate} bpm</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Thermometer className="h-4 w-4 text-orange-500" />
                            <div>
                              <p className="text-sm text-muted-foreground">Temperature</p>
                              <p className="font-medium">{vitals.temperature}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Weight className="h-4 w-4 text-green-500" />
                            <div>
                              <p className="text-sm text-muted-foreground">Weight</p>
                              <p className="font-medium">{vitals.weight}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Ruler className="h-4 w-4 text-purple-500" />
                            <div>
                              <p className="text-sm text-muted-foreground">Height</p>
                              <p className="font-medium">{vitals.height}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">BMI</p>
                            <p className="font-medium">{vitals.bmi}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-6">
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
                  {mockConsultations.map((consultation) => (
                    <Card key={consultation.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                              <h4 className="font-medium">{consultation.type}</h4>
                              <p className="text-sm text-muted-foreground">
                                {consultation.date} • {consultation.provider}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium">Chief Complaint:</p>
                            <p className="text-sm text-muted-foreground">{consultation.chiefComplaint}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Assessment:</p>
                            <p className="text-sm text-muted-foreground">{consultation.assessment}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Plan:</p>
                            <p className="text-sm text-muted-foreground">{consultation.plan}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
