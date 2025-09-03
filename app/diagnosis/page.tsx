"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import {
  Brain,
  Send,
  User,
  Bot,
  AlertTriangle,
  FileText,
  Save,
  Users,
  Clock,
  Shield,
  BookOpen,
  Stethoscope,
  Search,
  CheckCircle,
  Info,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai" | "system"
  content: string
  timestamp: Date
  metadata?: {
    patientId?: string
    evidenceLevel?: "high" | "medium" | "low"
    citations?: string[]
    safetyAlerts?: string[]
    confidence?: number
  }
}

interface DiagnosisResult {
  condition: string
  probability: number
  evidence: string[]
  contraindications: string[]
  nextSteps: string[]
  safetyLevel: "safe" | "caution" | "warning"
}

// Mock patient data for selection
const mockPatients = [
  { id: "1", name: "Sarah Johnson", age: 45, mrn: "MRN001234" },
  { id: "2", name: "Michael Chen", age: 32, mrn: "MRN001235" },
  { id: "3", name: "Emily Rodriguez", age: 67, mrn: "MRN001236" },
]

// Mock AI responses with medical content
const mockAIResponses = {
  greeting:
    "Hello! I'm your AI diagnostic assistant. I'll help you analyze symptoms and provide evidence-based differential diagnoses. Please start by describing the patient's chief complaint and presenting symptoms.",

  chestPain: {
    content:
      "Based on the chest pain symptoms described, I'm analyzing several potential diagnoses. Let me gather more information and provide a comprehensive assessment.",
    diagnoses: [
      {
        condition: "Acute Coronary Syndrome",
        probability: 35,
        evidence: [
          "Chest pain with radiation to left arm",
          "Patient age and risk factors",
          "Pain characteristics consistent with cardiac origin",
        ],
        contraindications: ["Avoid NSAIDs if cardiac cause suspected"],
        nextSteps: ["Immediate ECG", "Cardiac enzymes (Troponin)", "Chest X-ray", "Consider cardiology consultation"],
        safetyLevel: "warning" as const,
      },
      {
        condition: "Gastroesophageal Reflux Disease (GERD)",
        probability: 25,
        evidence: ["Pain relation to meals", "Response to antacids", "Burning quality of pain"],
        contraindications: ["Rule out cardiac causes first"],
        nextSteps: ["Trial of PPI therapy", "Dietary modifications", "Follow-up in 2-4 weeks"],
        safetyLevel: "safe" as const,
      },
      {
        condition: "Musculoskeletal Pain",
        probability: 20,
        evidence: ["Pain with movement", "Reproducible with palpation", "Recent physical activity"],
        contraindications: ["None significant"],
        nextSteps: ["NSAIDs if no cardiac contraindications", "Physical therapy evaluation", "Activity modification"],
        safetyLevel: "safe" as const,
      },
    ],
  },
}

export default function DiagnosisPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [selectedPatient, setSelectedPatient] = useState<string>(searchParams.get("patient") || "")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentDiagnoses, setCurrentDiagnoses] = useState<DiagnosisResult[]>([])
  const [showDiagnosisPanel, setShowDiagnosisPanel] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize with greeting message
    if (messages.length === 0) {
      setMessages([
        {
          id: "1",
          type: "ai",
          content: mockAIResponses.greeting,
          timestamp: new Date(),
        },
      ])
    }
  }, [messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
      metadata: { patientId: selectedPatient },
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI processing
    setTimeout(() => {
      let aiResponse: Message

      // Simple keyword matching for demo
      if (inputMessage.toLowerCase().includes("chest pain") || inputMessage.toLowerCase().includes("cardiac")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: mockAIResponses.chestPain.content,
          timestamp: new Date(),
          metadata: {
            evidenceLevel: "high",
            citations: ["NEJM 2023", "AHA Guidelines 2024", "Cochrane Review 2023"],
            confidence: 85,
          },
        }
        setCurrentDiagnoses(mockAIResponses.chestPain.diagnoses)
        setShowDiagnosisPanel(true)
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content:
            "I understand. Could you provide more specific details about the symptoms? For example:\n\n• When did the symptoms start?\n• What makes them better or worse?\n• Any associated symptoms?\n• Patient's medical history and current medications?\n\nThis information will help me provide a more accurate differential diagnosis.",
          timestamp: new Date(),
          metadata: {
            evidenceLevel: "medium",
            confidence: 70,
          },
        }
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const selectedPatientData = mockPatients.find((p) => p.id === selectedPatient)

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>Please sign in to access AI diagnosis</CardDescription>
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl mb-2 flex items-center">
              <Brain className="h-8 w-8 text-primary mr-3" />
              AI Diagnostic Assistant
            </h1>
            <p className="text-muted-foreground text-lg">Evidence-based diagnostic support with safety verification</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save Session
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Chat Interface */}
          <div className="lg:col-span-3 space-y-6">
            {/* Patient Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Patient Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPatients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name} • {patient.age}y • {patient.mrn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPatientData && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{selectedPatientData.name}</Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/patients/${selectedPatient}`}>
                          <FileText className="h-4 w-4 mr-1" />
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Chat Interface */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Diagnostic Consultation</CardTitle>
                <CardDescription>Describe symptoms and patient presentation for AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                          message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={`flex-1 space-y-2 ${message.type === "user" ? "text-right" : ""}`}>
                          <div
                            className={`inline-block p-3 rounded-lg max-w-[80%] ${
                              message.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            {message.metadata?.confidence && (
                              <>
                                <span>•</span>
                                <span>Confidence: {message.metadata.confidence}%</span>
                              </>
                            )}
                            {message.metadata?.evidenceLevel && (
                              <>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {message.metadata.evidenceLevel} evidence
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-sm">AI is analyzing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4">
                  <div className="flex items-end space-x-2">
                    <Textarea
                      placeholder="Describe the patient's symptoms, history, and presentation..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="min-h-[60px] resize-none"
                      disabled={isLoading}
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()} size="lg">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Diagnosis Panel */}
          <div className="space-y-6">
            {/* Safety Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-amber-500" />
                  Safety Checks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Patient allergies verified</AlertDescription>
                  </Alert>
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Drug interactions checked</AlertDescription>
                  </Alert>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>Guidelines compliance verified</AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            {/* Current Diagnoses */}
            {showDiagnosisPanel && currentDiagnoses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2" />
                    Differential Diagnosis
                  </CardTitle>
                  <CardDescription>AI-generated diagnostic possibilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentDiagnoses.map((diagnosis, index) => (
                      <Card
                        key={index}
                        className={`border-l-4 ${
                          diagnosis.safetyLevel === "warning"
                            ? "border-l-red-500"
                            : diagnosis.safetyLevel === "caution"
                              ? "border-l-amber-500"
                              : "border-l-green-500"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{diagnosis.condition}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={
                                    diagnosis.safetyLevel === "warning"
                                      ? "destructive"
                                      : diagnosis.safetyLevel === "caution"
                                        ? "secondary"
                                        : "default"
                                  }
                                >
                                  {diagnosis.probability}%
                                </Badge>
                                {diagnosis.safetyLevel === "warning" && (
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-medium mb-1">Supporting Evidence:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {diagnosis.evidence.map((evidence, i) => (
                                  <li key={i}>• {evidence}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <p className="text-sm font-medium mb-1">Next Steps:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {diagnosis.nextSteps.map((step, i) => (
                                  <li key={i}>• {step}</li>
                                ))}
                              </ul>
                            </div>

                            {diagnosis.contraindications.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-1 text-amber-600">Contraindications:</p>
                                <ul className="text-xs text-amber-600 space-y-1">
                                  {diagnosis.contraindications.map((contra, i) => (
                                    <li key={i}>• {contra}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/research">
                      <Search className="h-4 w-4 mr-2" />
                      Research Literature
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/patients">
                      <Users className="h-4 w-4 mr-2" />
                      Patient Records
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/learning">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Learning Resources
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
