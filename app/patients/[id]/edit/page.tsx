"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
// --- NEW: Import Alert Dialog for confirmation ---
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import api from "@/lib/api"
import { ArrowLeft, Save, User, AlertCircle, Trash2 } from "lucide-react"

export default function EditPatientPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const patientId = params.id as string

  const [formData, setFormData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  // --- NEW: State for deactivation ---
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (patientId) {
      const fetchPatient = async () => {
        try {
          setIsLoading(true)
          setError("")
          const patientData = await api.get(`/fhir/Patient/${patientId}`) as {
            name?: { family?: string; given?: string[] }[];
            birthDate?: string;
            gender?: string;
            telecom?: { system?: string; value?: string }[];
          }
          setFormData({
            firstName: patientData.name?.[0]?.given?.[0] || "",
            lastName: patientData.name?.[0]?.family || "",
            dateOfBirth: patientData.birthDate || "",
            gender: patientData.gender || "",
            phone: patientData.telecom?.find((t: any) => t.system === 'phone')?.value || "",
            email: patientData.telecom?.find((t: any) => t.system === 'email')?.value || "",
          })
        } catch (err) {
          setError("Failed to load patient data.")
        } finally {
          setIsLoading(false)
        }
      }
      fetchPatient()
    }
  }, [patientId])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSaving(true)
    try {
      const updatePayload = {
        id: patientId,
        resourceType: "Patient",
        name: [{ family: formData.lastName, given: [formData.firstName] }],
        birthDate: formData.dateOfBirth,
        gender: formData.gender,
        telecom: [
            { system: 'phone', value: formData.phone },
            { system: 'email', value: formData.email },
        ]
      };
      await api.put(`/fhir/Patient/${patientId}`, updatePayload)
      router.push(`/patients/${patientId}`)
    } catch (err: any) {
      setError(err.message || "Failed to update patient record.")
    } finally {
      setIsSaving(false)
    }
  }

  // --- NEW: Handler for deactivating a patient ---
  const handleDeactivate = async () => {
    setError("")
    setIsDeactivating(true)
    try {
      // In FHIR, deactivation is done by setting the 'active' property to false
      const deactivatePayload = { active: false };
      // We use a PATCH request here since we are only updating one field
      await api.patch(`/fhir/Patient/${patientId}`, deactivatePayload)
      // On success, redirect to the main patient list
      router.push("/patients")
    } catch (err: any) {
      setError(err.message || "Failed to deactivate patient.")
    } finally {
      setIsDeactivating(false)
    }
  }


  if (isLoading) {
    // ... Loading Skeleton UI (remains the same)
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Skeleton className="h-10 w-1/3 mb-8" />
                <div className="space-y-8">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    )
  }

  // ... Error and initial load UI (remains the same)
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ... Header (remains the same) ... */}
        {formData && (
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* ... Main form cards for editing info (remain the same) ... */}
                <Card>
                    {/* ... Basic Information Card Content ... */}
                </Card>

                <div className="flex items-center justify-end space-x-4">
                    <Button type="button" variant="outline" asChild>
                        <Link href={`/patients/${patientId}`}>Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </>
                        )}
                    </Button>
                </div>
            </form>
        )}

        {/* --- NEW: Danger Zone for deactivation --- */}
        <div className="mt-12">
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="font-heading text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                        Deactivating a patient will archive their record and remove them from the active patient list.
                        This action cannot be undone through the UI.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeactivating}>
                                {isDeactivating ? "Deactivating..." : "Deactivate Patient Record"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This will deactivate the patient's record. They will no longer appear in active searches
                                or be available for new consultations.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeactivate}>
                                    Yes, Deactivate Record
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}

