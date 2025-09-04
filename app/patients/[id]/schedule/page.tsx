// app/patient/doctors/[id]/schedule/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import api from "@/lib/api"
import { Calendar, Clock, ArrowLeft, CheckCircle } from "lucide-react"

// Interfaces for our data
interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

interface TimeSlot {
  time: string; // e.g., "09:00 AM"
  available: boolean;
}

interface Schedule {
  date: string; // e.g., "2025-09-04"
  slots: TimeSlot[];
}

export default function ScheduleAppointmentPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const doctorId = params.id as string

  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [schedule, setSchedule] = useState<Schedule[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    if (doctorId) {
      const fetchScheduleData = async () => {
        try {
          setIsLoading(true)
          setError(null)
          // Fetch both doctor details and their schedule in parallel
          const [doctorData, scheduleData] = await Promise.all([
            api.get<Doctor>(`/doctors/${doctorId}`),
            api.get<Schedule[]>(`/doctors/${doctorId}/availability`),
          ])
          setDoctor(doctorData)
          setSchedule(scheduleData)
        } catch (err: any) {
          setError(err.message || "Failed to load schedule.")
        } finally {
          setIsLoading(false)
        }
      }
      fetchScheduleData()
    }
  }, [doctorId])

  const handleBooking = async () => {
    if (!selectedSlot || !user) return;
    setIsBooking(true)
    setError(null)

    try {
        await api.post('/appointments', {
            doctorId,
            patientId: user.id,
            slot: selectedSlot,
        });
        setBookingSuccess(true);
    } catch(err: any) {
        setError(err.message || "Failed to book appointment. The slot may have been taken.")
    } finally {
        setIsBooking(false)
    }
  }
  
  if (bookingSuccess) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Card className="w-full max-w-md text-center">
                <CardContent className="p-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="font-heading text-2xl font-bold mb-2">Appointment Booked!</h2>
                    <p className="text-muted-foreground mb-6">Your appointment with {doctor?.name} has been confirmed. You will receive a notification shortly.</p>
                    <Button asChild className="w-full">
                        <Link href="/dashboard">Go to My Dashboard</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
            <div>
                <Skeleton className="h-10 w-1/4 mb-8" />
                <Skeleton className="h-48 w-full" />
            </div>
        ) : error ? (
            <p className="text-destructive text-center">{error}</p>
        ) : doctor && (
          <div>
            <div className="mb-8">
                <Button variant="ghost" size="sm" asChild className="mb-4">
                  <Link href="/patient/doctors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Doctor List
                  </Link>
                </Button>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-3xl bg-secondary">
                    {doctor.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-heading font-bold text-3xl">{doctor.name}</h1>
                  <p className="text-primary text-lg">{doctor.specialty}</p>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Select an Appointment Time</CardTitle>
                <CardDescription>Choose an available time slot below.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {schedule.map((day) => (
                  <div key={day.date}>
                    <h3 className="font-medium mb-3 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" /> 
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {day.slots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedSlot === `${day.date}T${slot.time}` ? "default" : "outline"}
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(`${day.date}T${slot.time}`)}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
                 {schedule.length === 0 && <p className="text-muted-foreground text-center py-4">This doctor has no upcoming availability.</p>}
              </CardContent>
            </Card>

            {selectedSlot && (
                 <div className="mt-6 flex justify-end">
                    <Button size="lg" onClick={handleBooking} disabled={isBooking}>
                        {isBooking ? "Confirming..." : `Confirm Appointment for ${new Date(selectedSlot).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                    </Button>
                 </div>
            )}
             {error && <p className="text-destructive text-right mt-2">{error}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

