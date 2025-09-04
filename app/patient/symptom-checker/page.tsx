"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import api from "@/lib/api" // --- IMPORT OUR API CLIENT ---
import { Stethoscope, AlertTriangle, Info, Send, BookOpen } from "lucide-react"

export default function SymptomCheckerPage() {
  const { user } = useAuth()
  const [symptoms, setSymptoms] = useState("")
  const [duration, setDuration] = useState("")
  const [severity, setSeverity] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null) // --- NEW: Error state ---

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

  // --- MODIFIED: The core function now uses the API client ---
  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setError(null)
    setResults(null)

    try {
      // --- REAL API CALL ---
      // We send the symptom data to our dedicated, safety-focused endpoint.
      const analysisResults = await api.post('/symptom-checker', {
        symptoms,
        duration,
        severity,
      })
      setResults(analysisResults)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header and Disclaimer remain the same */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2 flex items-center">
            <Stethoscope className="h-8 w-8 text-primary mr-3" />
            AI Symptom Checker
          </h1>
          <p className="text-muted-foreground text-lg">
            Get educational information about your symptoms - not a substitute for professional medical advice
          </p>
        </div>
        <Alert className="mb-6" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> This tool provides educational information only and is not a diagnosis.
            Always consult with a healthcare provider for medical advice.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Describe Your Symptoms</CardTitle>
                <CardDescription>Provide detailed information about what you're experiencing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">What symptoms are you experiencing?</label>
                  <Textarea
                    placeholder="Describe your symptoms in detail (e.g., headache, fever, cough, etc.)"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">How long have you had these symptoms?</label>
                    <Input
                      placeholder="e.g., 2 days, 1 week"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Severity (1-10)</label>
                    <Input
                      placeholder="Rate from 1 (mild) to 10 (severe)"
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={handleAnalyze} disabled={!symptoms || isAnalyzing} className="w-full">
                  {isAnalyzing ? "Analyzing symptoms..." : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Analyze Symptoms
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {error && (
                <Alert variant="destructive" className="mt-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {results && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="font-heading">Analysis Results</CardTitle>
                  <CardDescription>Educational information based on your symptoms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Urgency Level */}
                  <div>
                    <h3 className="font-medium mb-2">Urgency Level</h3>
                    <Badge variant={results.urgency === "High" ? "destructive" : "secondary"}>
                      {results.urgency} Priority
                    </Badge>
                  </div>

                  {/* Possible Conditions */}
                  <div>
                    <h3 className="font-medium mb-3">Possible Conditions (Educational)</h3>
                    <div className="space-y-3">
                      {results.possibleConditions.map((condition: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{condition.name}</span>
                            <Badge variant="outline">{condition.probability} Match</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{condition.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className="font-medium mb-3">General Recommendations</h3>
                    <ul className="space-y-2">
                      {results.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      These results are for educational purposes only. Please consult with a healthcare provider.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar remains the same */}
          <div className="space-y-6">
            {/* ... When to Seek Immediate Care card ... */}
            {/* ... Health Resources card ... */}
          </div>
        </div>
      </div>
    </div>
  )
}
