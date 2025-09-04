"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import api from "@/lib/api" // --- IMPORT OUR API CLIENT ---
import { ArrowLeft, Save, User, Phone, AlertCircle } from "lucide-react"

export default function NewPatientPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    // Basic Demographics
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    // ... all other form fields from your code
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // --- MODIFIED: The core function now uses the API client ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // --- REAL API CALL ---
      // We send the complete formData object to our NestJS backend.
      // The backend will handle validation and creation of the FHIR Patient resource in MongoDB.
      await api.post('/fhir/Patient', formData)

      // On success, redirect to the main patient list.
      // The list will automatically re-fetch and show the new patient.
      router.push("/patients")
    } catch (err: any) {
      setError(err.message || "Failed to create patient record. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    // ... Access Denied Card (remains the same) ...
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="flex items-center justify-center min-h-[80vh]">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>Please sign in to create patient records</CardDescription>
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

  // The entire form JSX remains the same, as it was already well-structured.
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    <h1 className="font-heading font-bold text-3xl">New Patient</h1>
                    <p className="text-muted-foreground">Create a new patient record</p>
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information Card */}
          <Card>
            <CardHeader>
                <CardTitle className="font-heading flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Basic Information
                </CardTitle>
                <CardDescription>Patient demographics and identification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* All Input fields for basic info... */}
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card>
             <CardHeader>
                <CardTitle className="font-heading flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Contact Information
                </CardTitle>
                <CardDescription>Phone, email, and address details</CardDescription>
            </CardHeader>
             <CardContent className="space-y-4">
                {/* All Input fields for contact info... */}
             </CardContent>
          </Card>

          {/* Emergency Contact Card */}
          <Card>
             <CardHeader>
                <CardTitle className="font-heading">Emergency Contact</CardTitle>
                <CardDescription>Primary emergency contact information</CardDescription>
            </CardHeader>
             <CardContent className="space-y-4">
                {/* All Input fields for emergency contact... */}
             </CardContent>
          </Card>
          
          {/* Medical Information Card */}
          <Card>
             <CardHeader>
                <CardTitle className="font-heading">Medical Information</CardTitle>
                <CardDescription>Initial medical history and current medications</CardDescription>
            </CardHeader>
             <CardContent className="space-y-4">
                {/* All Textarea fields for medical info... */}
             </CardContent>
          </Card>

          {/* Additional Notes Card */}
          <Card>
             <CardHeader>
                <CardTitle className="font-heading">Additional Notes</CardTitle>
                <CardDescription>Any additional information or special considerations</CardDescription>
            </CardHeader>
             <CardContent>
                {/* Notes Textarea... */}
             </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/patients">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating Patient..." : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Patient
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
