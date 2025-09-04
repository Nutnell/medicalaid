"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import api from "@/lib/api"
import { Search, Stethoscope, User, Calendar, MessageSquare } from "lucide-react"

// Interface for the doctor data we expect from the API
interface Doctor {
  id: string;
  name: string;
  specialty: string; // The backend should provide this
  location: string;
  availability: string; // e.g., "Mon, Wed, Fri"
}

export default function FindDoctorsPage() {
  const { user } = useAuth()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true)
        setError(null)
        // We'll fetch from a new '/doctors' endpoint, with optional search
        const fetchedDoctors = await api.get<Doctor[]>(`/doctors?search=${searchTerm}`)
        setDoctors(fetchedDoctors)
      } catch (err: any) {
        setError(err.message || "Failed to load doctors.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchDoctors()
  }, [searchTerm]) // Re-fetch whenever the search term changes

  if (!user) {
    // ... Access Denied Card ...
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="flex items-center justify-center min-h-[80vh]">
                 <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>Please sign in to find a doctor.</CardDescription>
                    </CardHeader>
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
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2">Find a Doctor</h1>
          <p className="text-muted-foreground text-lg">Search for specialists and book your next appointment.</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, specialty, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Doctors Grid */}
        {error && <p className="text-destructive text-center">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Skeleton className="h-20 w-20 rounded-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            doctors.map((doctor) => (
              <Card key={doctor.id}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarFallback className="text-2xl bg-secondary">
                      {doctor.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-heading font-semibold text-xl">{doctor.name}</h3>
                  <p className="text-primary mb-1">{doctor.specialty}</p>
                  <p className="text-muted-foreground text-sm mb-4">{doctor.location}</p>
                  <Button className="w-full" asChild>
                    <Link href={`/patient/doctors/${doctor.id}/schedule`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        {!isLoading && doctors.length === 0 && (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No doctors found matching your search.</p>
            </div>
        )}
      </div>
    </div>
  )
}
