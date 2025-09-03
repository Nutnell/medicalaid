"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Award,
  Brain,
  Users,
  Target,
  TrendingUp,
  Star,
  Lock,
  ArrowRight,
  Microscope,
  Heart,
  Stethoscope,
  Pill,
} from "lucide-react"

interface LearningModule {
  id: string
  title: string
  description: string
  specialty: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string
  progress: number
  totalLessons: number
  completedLessons: number
  isLocked: boolean
  prerequisites?: string[]
  learningObjectives: string[]
  topics: string[]
}

interface CaseStudy {
  id: string
  title: string
  specialty: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string
  patientAge: number
  patientGender: string
  chiefComplaint: string
  scenario: string
  learningPoints: string[]
  completed: boolean
}

interface Quiz {
  id: string
  title: string
  specialty: string
  questionCount: number
  duration: string
  difficulty: "beginner" | "intermediate" | "advanced"
  bestScore?: number
  attempts: number
  topics: string[]
}

// Mock learning data
const mockModules: LearningModule[] = [
  {
    id: "1",
    title: "Cardiovascular Disease Fundamentals",
    description: "Comprehensive introduction to cardiovascular pathophysiology, diagnosis, and management",
    specialty: "Cardiology",
    difficulty: "beginner",
    duration: "8 hours",
    progress: 85,
    totalLessons: 12,
    completedLessons: 10,
    isLocked: false,
    learningObjectives: [
      "Understand basic cardiac anatomy and physiology",
      "Recognize common cardiovascular conditions",
      "Interpret basic ECGs and cardiac imaging",
      "Apply evidence-based treatment protocols",
    ],
    topics: ["Anatomy", "Pathophysiology", "Diagnostics", "Treatment"],
  },
  {
    id: "2",
    title: "Advanced Diagnostic Imaging",
    description: "Master interpretation of CT, MRI, and ultrasound in clinical practice",
    specialty: "Radiology",
    difficulty: "intermediate",
    duration: "12 hours",
    progress: 62,
    totalLessons: 16,
    completedLessons: 10,
    isLocked: false,
    learningObjectives: [
      "Interpret complex imaging studies",
      "Understand imaging protocols and indications",
      "Recognize pathological findings",
      "Communicate findings effectively",
    ],
    topics: ["CT Interpretation", "MRI Basics", "Ultrasound", "Reporting"],
  },
  {
    id: "3",
    title: "Emergency Medicine Protocols",
    description: "Critical decision-making in emergency situations with AI-guided scenarios",
    specialty: "Emergency Medicine",
    difficulty: "advanced",
    duration: "15 hours",
    progress: 0,
    totalLessons: 20,
    completedLessons: 0,
    isLocked: true,
    prerequisites: ["Cardiovascular Disease Fundamentals"],
    learningObjectives: [
      "Manage acute medical emergencies",
      "Apply triage protocols effectively",
      "Perform emergency procedures",
      "Lead resuscitation efforts",
    ],
    topics: ["Trauma", "Cardiac Arrest", "Shock", "Toxicology"],
  },
]

const mockCaseStudies: CaseStudy[] = [
  {
    id: "1",
    title: "Acute Chest Pain in a 55-Year-Old Male",
    specialty: "Cardiology",
    difficulty: "intermediate",
    duration: "30 min",
    patientAge: 55,
    patientGender: "Male",
    chiefComplaint: "Sudden onset chest pain with radiation to left arm",
    scenario:
      "A 55-year-old male construction worker presents to the ED with sudden onset of severe chest pain that started 2 hours ago while lifting heavy equipment. The pain is described as crushing, 8/10 intensity, radiating to his left arm and jaw. He appears diaphoretic and anxious.",
    learningPoints: [
      "Recognition of acute coronary syndrome presentation",
      "Appropriate diagnostic workup and timing",
      "Risk stratification and treatment decisions",
      "Communication with patient and family",
    ],
    completed: false,
  },
  {
    id: "2",
    title: "Pediatric Fever and Rash",
    specialty: "Pediatrics",
    difficulty: "beginner",
    duration: "25 min",
    patientAge: 4,
    patientGender: "Female",
    chiefComplaint: "Fever and widespread rash for 2 days",
    scenario:
      "A 4-year-old girl is brought by her mother with a 2-day history of high fever (102°F) and a red, blotchy rash that started on her face and spread to her body. She has been irritable and refusing to eat.",
    learningPoints: [
      "Differential diagnosis of pediatric fever and rash",
      "Age-appropriate examination techniques",
      "Parent communication and reassurance",
      "When to consider serious bacterial infections",
    ],
    completed: true,
  },
]

const mockQuizzes: Quiz[] = [
  {
    id: "1",
    title: "Cardiology Fundamentals Assessment",
    specialty: "Cardiology",
    questionCount: 25,
    duration: "45 min",
    difficulty: "beginner",
    bestScore: 88,
    attempts: 2,
    topics: ["ECG Interpretation", "Heart Sounds", "Pathophysiology"],
  },
  {
    id: "2",
    title: "Advanced Imaging Interpretation",
    specialty: "Radiology",
    questionCount: 30,
    duration: "60 min",
    difficulty: "intermediate",
    attempts: 0,
    topics: ["CT Chest", "Abdominal MRI", "Cardiac Echo"],
  },
]

export default function LearningPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("modules")

  const getDifficultyBadge = (difficulty: string) => {
    const badges = {
      beginner: { label: "Beginner", variant: "secondary" as const },
      intermediate: { label: "Intermediate", variant: "default" as const },
      advanced: { label: "Advanced", variant: "destructive" as const },
    }
    return badges[difficulty as keyof typeof badges] || { label: difficulty, variant: "outline" as const }
  }

  const getSpecialtyIcon = (specialty: string) => {
    const icons = {
      Cardiology: Heart,
      Radiology: Microscope,
      "Emergency Medicine": Stethoscope,
      Pediatrics: Users,
      Pharmacology: Pill,
    }
    return icons[specialty as keyof typeof icons] || BookOpen
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>Please sign in to access learning modules</CardDescription>
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

  // Show access restriction for non-students
  if (user.role !== "student" && user.role !== "doctor") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader className="text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle>Learning Module Access</CardTitle>
              <CardDescription>
                Learning modules are available for medical students and healthcare professionals
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Contact your administrator to request access to educational content.
              </p>
              <Button asChild>
                <Link href="/dashboard">Return to Dashboard</Link>
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
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2 flex items-center">
            <BookOpen className="h-8 w-8 text-primary mr-3" />
            Learning Center
          </h1>
          <p className="text-muted-foreground text-lg">
            Interactive medical education with AI-powered case studies and assessments
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Modules Completed</p>
                  <p className="text-2xl font-bold">2/3</p>
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
                  <p className="text-2xl font-bold">28</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quiz Average</p>
                  <p className="text-2xl font-bold">88%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Certificates</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
                <Award className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="modules">Learning Modules</TabsTrigger>
            <TabsTrigger value="cases">Case Studies</TabsTrigger>
            <TabsTrigger value="quizzes">Assessments</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockModules.map((module) => {
                const SpecialtyIcon = getSpecialtyIcon(module.specialty)
                return (
                  <Card
                    key={module.id}
                    className={`relative ${module.isLocked ? "opacity-60" : "hover:shadow-md transition-shadow"}`}
                  >
                    {module.isLocked && (
                      <div className="absolute top-4 right-4 z-10">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <SpecialtyIcon className="h-8 w-8 text-primary" />
                          <div>
                            <CardTitle className="font-heading">{module.title}</CardTitle>
                            <CardDescription>{module.specialty}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{module.description}</p>

                      <div className="flex items-center space-x-2">
                        <Badge {...getDifficultyBadge(module.difficulty)}>
                          {getDifficultyBadge(module.difficulty).label}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {module.duration}
                        </Badge>
                      </div>

                      {!module.isLocked && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>
                              {module.completedLessons}/{module.totalLessons} lessons
                            </span>
                          </div>
                          <Progress value={module.progress} className="h-2" />
                        </div>
                      )}

                      {module.prerequisites && (
                        <Alert>
                          <AlertDescription>
                            <strong>Prerequisites:</strong> {module.prerequisites.join(", ")}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Learning Objectives:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {module.learningObjectives.slice(0, 2).map((objective, index) => (
                            <li key={index}>• {objective}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          {module.topics.slice(0, 2).map((topic) => (
                            <Badge key={topic} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        <Button disabled={module.isLocked} asChild={!module.isLocked}>
                          {module.isLocked ? (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Locked
                            </>
                          ) : (
                            <Link href={`/learning/modules/${module.id}`}>
                              {module.progress > 0 ? "Continue" : "Start"}
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="cases" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockCaseStudies.map((caseStudy) => {
                const SpecialtyIcon = getSpecialtyIcon(caseStudy.specialty)
                return (
                  <Card key={caseStudy.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <SpecialtyIcon className="h-8 w-8 text-primary" />
                          <div>
                            <CardTitle className="font-heading">{caseStudy.title}</CardTitle>
                            <CardDescription>{caseStudy.specialty}</CardDescription>
                          </div>
                        </div>
                        {caseStudy.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Badge {...getDifficultyBadge(caseStudy.difficulty)}>
                          {getDifficultyBadge(caseStudy.difficulty).label}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {caseStudy.duration}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm">
                          <strong>Patient:</strong> {caseStudy.patientAge}-year-old {caseStudy.patientGender}
                        </p>
                        <p className="text-sm">
                          <strong>Chief Complaint:</strong> {caseStudy.chiefComplaint}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground">{caseStudy.scenario}</p>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Learning Points:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {caseStudy.learningPoints.slice(0, 2).map((point, index) => (
                            <li key={index}>• {point}</li>
                          ))}
                        </ul>
                      </div>

                      <Button className="w-full" asChild>
                        <Link href={`/learning/cases/${caseStudy.id}`}>
                          <Play className="h-4 w-4 mr-2" />
                          {caseStudy.completed ? "Review Case" : "Start Case"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockQuizzes.map((quiz) => {
                const SpecialtyIcon = getSpecialtyIcon(quiz.specialty)
                return (
                  <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <SpecialtyIcon className="h-8 w-8 text-primary" />
                        <div>
                          <CardTitle className="font-heading">{quiz.title}</CardTitle>
                          <CardDescription>{quiz.specialty}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Badge {...getDifficultyBadge(quiz.difficulty)}>
                          {getDifficultyBadge(quiz.difficulty).label}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {quiz.duration}
                        </Badge>
                        <Badge variant="outline">{quiz.questionCount} questions</Badge>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Topics Covered:</p>
                        <div className="flex flex-wrap gap-1">
                          {quiz.topics.map((topic) => (
                            <Badge key={topic} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {quiz.bestScore && (
                        <div className="flex items-center justify-between text-sm">
                          <span>Best Score:</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-amber-500" />
                            <span className="font-medium">{quiz.bestScore}%</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Attempts: {quiz.attempts}</span>
                      </div>

                      <Button className="w-full" asChild>
                        <Link href={`/learning/quizzes/${quiz.id}`}>
                          <Brain className="h-4 w-4 mr-2" />
                          {quiz.attempts > 0 ? "Retake Quiz" : "Start Quiz"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Award className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="font-heading font-semibold mb-2">Cardiology Fundamentals</h3>
                  <p className="text-sm text-muted-foreground mb-4">Completed comprehensive cardiology training</p>
                  <Badge variant="default">Earned</Badge>
                </CardContent>
              </Card>

              <Card className="text-center opacity-60">
                <CardContent className="p-6">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading font-semibold mb-2">Quiz Master</h3>
                  <p className="text-sm text-muted-foreground mb-4">Score 90% or higher on 5 quizzes</p>
                  <Badge variant="outline">2/5 Progress</Badge>
                </CardContent>
              </Card>

              <Card className="text-center opacity-60">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading font-semibold mb-2">Case Study Expert</h3>
                  <p className="text-sm text-muted-foreground mb-4">Complete 10 case studies with perfect scores</p>
                  <Badge variant="outline">1/10 Progress</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
