"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { BookOpen, Search, Play, CheckCircle, Clock, Users, Star } from "lucide-react"

// Mock synthetic case data
const mockCases = [
  {
    id: "1",
    title: "Acute Myocardial Infarction - Emergency Department",
    specialty: "Cardiology",
    difficulty: "Advanced",
    duration: "45 min",
    patient: {
      age: 58,
      gender: "Male",
      presentation: "Chest pain with radiation to left arm",
    },
    learningObjectives: [
      "Recognize STEMI presentation",
      "Apply emergency protocols",
      "Interpret ECG findings",
      "Manage acute cardiac care",
    ],
    completed: false,
    rating: 4.8,
    enrolledStudents: 234,
  },
  {
    id: "2",
    title: "Pediatric Asthma Exacerbation",
    specialty: "Pediatrics",
    difficulty: "Intermediate",
    duration: "30 min",
    patient: {
      age: 7,
      gender: "Female",
      presentation: "Wheezing and shortness of breath",
    },
    learningObjectives: [
      "Assess pediatric respiratory distress",
      "Apply age-appropriate treatments",
      "Communicate with parents",
      "Recognize severity indicators",
    ],
    completed: true,
    rating: 4.6,
    enrolledStudents: 189,
  },
  {
    id: "3",
    title: "Diabetic Ketoacidosis Management",
    specialty: "Endocrinology",
    difficulty: "Advanced",
    duration: "60 min",
    patient: {
      age: 24,
      gender: "Female",
      presentation: "Altered mental status and dehydration",
    },
    learningObjectives: [
      "Diagnose DKA complications",
      "Manage fluid and electrolyte balance",
      "Monitor treatment response",
      "Prevent complications",
    ],
    completed: false,
    rating: 4.9,
    enrolledStudents: 156,
  },
]

export default function StudentCasesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  if (!user || user.role !== "student") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>This page is only accessible to medical students</CardDescription>
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

  const filteredCases = mockCases.filter((case_) => {
    const matchesSearch =
      case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = selectedSpecialty === "all" || case_.specialty === selectedSpecialty
    const matchesDifficulty = selectedDifficulty === "all" || case_.difficulty === selectedDifficulty

    return matchesSearch && matchesSpecialty && matchesDifficulty
  })

  const getDifficultyBadge = (difficulty: string) => {
    const badges = {
      Beginner: { variant: "secondary" as const, color: "text-green-600" },
      Intermediate: { variant: "default" as const, color: "text-blue-600" },
      Advanced: { variant: "destructive" as const, color: "text-red-600" },
    }
    return badges[difficulty as keyof typeof badges] || { variant: "outline" as const, color: "text-gray-600" }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2 flex items-center">
            <BookOpen className="h-8 w-8 text-primary mr-3" />
            Synthetic Case Library
          </h1>
          <p className="text-muted-foreground text-lg">
            Practice with AI-generated fictional patients in a safe learning environment
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cases Available</p>
                  <p className="text-2xl font-bold">{mockCases.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{mockCases.filter((c) => c.completed).length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Hours</p>
                  <p className="text-2xl font-bold">12.5</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">87%</p>
                </div>
                <Star className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cases by title or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Specialties</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Endocrinology">Endocrinology</option>
                </select>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCases.map((case_) => (
            <Card key={case_.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="font-heading text-lg leading-tight mb-2">{case_.title}</CardTitle>
                    <CardDescription>{case_.specialty}</CardDescription>
                  </div>
                  {case_.completed && <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge {...getDifficultyBadge(case_.difficulty)}>{case_.difficulty}</Badge>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {case_.duration}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Patient:</strong> {case_.patient.age}-year-old {case_.patient.gender}
                  </p>
                  <p className="text-sm">
                    <strong>Presentation:</strong> {case_.patient.presentation}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Learning Objectives:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {case_.learningObjectives.slice(0, 2).map((objective, index) => (
                      <li key={index}>• {objective}</li>
                    ))}
                    {case_.learningObjectives.length > 2 && (
                      <li className="text-xs">+ {case_.learningObjectives.length - 2} more</li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>{case_.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{case_.enrolledStudents} students</span>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href={`/student/cases/${case_.id}`}>
                    <Play className="h-4 w-4 mr-2" />
                    {case_.completed ? "Review Case" : "Start Case"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">No cases found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
