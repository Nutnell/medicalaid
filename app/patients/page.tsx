"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import api from "@/lib/api"
import { Search, Plus, Users, Calendar, FileText, Filter } from "lucide-react"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  lastVisit: string
  condition: string
  status: string
  mrn: string
}

export default function PatientsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  // --- State for live data ---
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // --- MODIFIED: Data fetching logic with Server-Side Search & Debouncing ---
  useEffect(() => {
    // Debounce to avoid sending API requests on every keystroke
    const debounceTimer = setTimeout(() => {
      const fetchPatients = async () => {
        try {
          setIsLoading(true)
          setError(null)
          // The search term is now sent as a query parameter to the backend
          const data = await api.get<Patient[]>(`/fhir/Patient?search=${searchTerm}`)
          setPatients(data)
        } catch (err: any) {
          setError(err.message || "Failed to load patient data.")
        } finally {
          setIsLoading(false)
        }
      }
      fetchPatients()
    }, 300) // Wait 300ms after the user stops typing

    // Cleanup function to clear the timer if the user types again
    return () => clearTimeout(debounceTimer)
  }, [searchTerm]) // Re-run this effect whenever the searchTerm changes

  if (!user) {
    // ... Access Denied Card ...
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

  // The client-side filtering is no longer needed as the backend handles it
  // const filteredPatients = patients.filter(...)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header remains the same */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl mb-2">Patient Management</h1>
            <p className="text-muted-foreground text-lg">Manage your patient records and consultations</p>
          </div>
          <Button size="lg" asChild>
            <Link href="/patients/new">
              <Plus className="h-4 w-4 mr-2" />
              New Patient
            </Link>
          </Button>
        </div>

        {/* --- MODIFIED: Search Input --- */}
        <Card className="mb-6">
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search patients by name, MRN, or condition..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                </div>
            </CardContent>
        </Card>

        {/* --- MODIFIED: Patients Table with Loading and Error States --- */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Patient Records</CardTitle>
            <CardDescription>
              {isLoading ? "Loading patients..." : `${patients.length} patient${patients.length !== 1 ? "s" : ""} found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>MRN</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[70px]" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-[60px]" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  patients.map((patient) => (
                    <TableRow key={patient.id}>
                        <TableCell>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Users className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-medium">{patient.name}</span>
                            </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{patient.mrn}</TableCell>
                        <TableCell>{patient.age} • {patient.gender}</TableCell>
                        <TableCell>{patient.lastVisit}</TableCell>
                        <TableCell>{patient.condition}</TableCell>
                        <TableCell>
                            <Badge variant={patient.status === "Active" ? "default" : "secondary"}>{patient.status}</Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/patients/${patient.id}`}>
                                        <FileText className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/diagnosis?patient=${patient.id}`}>
                                        <Calendar className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {!isLoading && error && (
                <div className="text-center py-8 text-red-500">{error}</div>
            )}
            {!isLoading && patients.length === 0 && !error && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">No patients found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first patient"}
                </p>
                <Button asChild>
                  <Link href="/patients/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Patient
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

