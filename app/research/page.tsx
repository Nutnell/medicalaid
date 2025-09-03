"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Search,
  Filter,
  BookOpen,
  Calendar,
  Star,
  ExternalLink,
  Download,
  Bookmark,
  TrendingUp,
  FileText,
  Clock,
  Award,
  Microscope,
} from "lucide-react"

interface ResearchPaper {
  id: string
  title: string
  authors: string[]
  journal: string
  publishDate: string
  abstract: string
  doi: string
  pmid?: string
  evidenceLevel: "systematic-review" | "rct" | "cohort" | "case-control" | "case-series" | "expert-opinion"
  specialty: string[]
  keywords: string[]
  citationCount: number
  impactFactor: number
  openAccess: boolean
  relevanceScore: number
}

interface ClinicalTrial {
  id: string
  title: string
  phase: "I" | "II" | "III" | "IV"
  status: "recruiting" | "active" | "completed" | "terminated" | "suspended"
  condition: string
  intervention: string
  sponsor: string
  startDate: string
  estimatedCompletion: string
  enrollment: number
  primaryOutcome: string
  nctId: string
  locations: string[]
}

// Mock research data
const mockResearchPapers: ResearchPaper[] = [
  {
    id: "1",
    title: "Artificial Intelligence in Cardiovascular Disease Diagnosis: A Systematic Review and Meta-Analysis",
    authors: ["Smith, J.A.", "Johnson, M.B.", "Williams, C.D."],
    journal: "New England Journal of Medicine",
    publishDate: "2024-01-15",
    abstract:
      "Background: Artificial intelligence (AI) has shown promising applications in cardiovascular disease diagnosis. This systematic review evaluates the diagnostic accuracy of AI systems compared to traditional methods. Methods: We searched PubMed, Embase, and Cochrane databases for studies published between 2020-2024. Results: 45 studies met inclusion criteria, involving 125,000 patients. AI systems demonstrated superior diagnostic accuracy (AUC 0.92 vs 0.85, p<0.001). Conclusions: AI significantly improves cardiovascular diagnostic accuracy and may enhance clinical decision-making.",
    doi: "10.1056/NEJMoa2024001",
    pmid: "38234567",
    evidenceLevel: "systematic-review",
    specialty: ["Cardiology", "Artificial Intelligence"],
    keywords: ["artificial intelligence", "cardiovascular disease", "diagnosis", "machine learning"],
    citationCount: 127,
    impactFactor: 91.2,
    openAccess: true,
    relevanceScore: 95,
  },
  {
    id: "2",
    title: "Novel Biomarkers for Early Detection of Alzheimer's Disease: A Prospective Cohort Study",
    authors: ["Chen, L.", "Rodriguez, M.", "Thompson, K."],
    journal: "The Lancet Neurology",
    publishDate: "2024-01-10",
    abstract:
      "Background: Early detection of Alzheimer's disease remains challenging. We investigated novel plasma biomarkers for preclinical diagnosis. Methods: 2,500 cognitively normal adults were followed for 5 years with annual assessments. Results: Plasma p-tau217 and GFAP showed excellent diagnostic performance (AUC 0.89) for predicting cognitive decline. Conclusions: These biomarkers offer promise for early Alzheimer's detection in clinical practice.",
    doi: "10.1016/S1474-4422(24)00001-2",
    pmid: "38234568",
    evidenceLevel: "cohort",
    specialty: ["Neurology", "Geriatrics"],
    keywords: ["Alzheimer's disease", "biomarkers", "early detection", "plasma"],
    citationCount: 89,
    impactFactor: 59.9,
    openAccess: false,
    relevanceScore: 88,
  },
  {
    id: "3",
    title: "Effectiveness of Telemedicine in Diabetes Management: Randomized Controlled Trial",
    authors: ["Patel, R.", "Kumar, S.", "Anderson, B."],
    journal: "JAMA Internal Medicine",
    publishDate: "2024-01-08",
    abstract:
      "Importance: Telemedicine adoption accelerated during COVID-19, but long-term effectiveness in diabetes management remains unclear. Objective: To evaluate telemedicine vs traditional care for diabetes outcomes. Design: 12-month randomized controlled trial. Participants: 800 adults with type 2 diabetes. Results: Telemedicine group showed superior HbA1c reduction (-1.2% vs -0.7%, p<0.001) and higher patient satisfaction. Conclusions: Telemedicine effectively improves diabetes management and patient engagement.",
    doi: "10.1001/jamainternmed.2024.0001",
    pmid: "38234569",
    evidenceLevel: "rct",
    specialty: ["Endocrinology", "Telemedicine"],
    keywords: ["telemedicine", "diabetes", "HbA1c", "patient satisfaction"],
    citationCount: 45,
    impactFactor: 25.8,
    openAccess: true,
    relevanceScore: 82,
  },
]

const mockClinicalTrials: ClinicalTrial[] = [
  {
    id: "1",
    title: "Phase III Trial of Novel CAR-T Cell Therapy for Refractory B-Cell Lymphoma",
    phase: "III",
    status: "recruiting",
    condition: "B-Cell Lymphoma",
    intervention: "CAR-T Cell Therapy (CTX-001)",
    sponsor: "National Cancer Institute",
    startDate: "2024-02-01",
    estimatedCompletion: "2026-12-31",
    enrollment: 300,
    primaryOutcome: "Overall Response Rate at 6 months",
    nctId: "NCT05234567",
    locations: ["Boston, MA", "New York, NY", "Los Angeles, CA"],
  },
  {
    id: "2",
    title: "Efficacy of AI-Guided Antibiotic Selection in Sepsis Management",
    phase: "II",
    status: "active",
    condition: "Sepsis",
    intervention: "AI-Guided Antibiotic Selection Algorithm",
    sponsor: "Johns Hopkins University",
    startDate: "2023-09-15",
    estimatedCompletion: "2024-09-15",
    enrollment: 150,
    primaryOutcome: "Time to Clinical Improvement",
    nctId: "NCT05234568",
    locations: ["Baltimore, MD", "Philadelphia, PA"],
  },
]

export default function ResearchPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJournal, setSelectedJournal] = useState("all")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [selectedEvidenceLevel, setSelectedEvidenceLevel] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("papers")
  const [savedPapers, setSavedPapers] = useState<string[]>([])

  const filteredPapers = mockResearchPapers.filter((paper) => {
    const matchesSearch =
      searchQuery === "" ||
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesJournal = selectedJournal === "all" || paper.journal === selectedJournal
    const matchesSpecialty = selectedSpecialty === "all" || paper.specialty.includes(selectedSpecialty)
    const matchesEvidenceLevel = selectedEvidenceLevel === "all" || paper.evidenceLevel === selectedEvidenceLevel

    return matchesSearch && matchesJournal && matchesSpecialty && matchesEvidenceLevel
  })

  const toggleSavePaper = (paperId: string) => {
    setSavedPapers((prev) => (prev.includes(paperId) ? prev.filter((id) => id !== paperId) : [...prev, paperId]))
  }

  const getEvidenceLevelBadge = (level: string) => {
    const levels = {
      "systematic-review": { label: "Systematic Review", variant: "default" as const },
      rct: { label: "RCT", variant: "default" as const },
      cohort: { label: "Cohort Study", variant: "secondary" as const },
      "case-control": { label: "Case-Control", variant: "secondary" as const },
      "case-series": { label: "Case Series", variant: "outline" as const },
      "expert-opinion": { label: "Expert Opinion", variant: "outline" as const },
    }
    return levels[level as keyof typeof levels] || { label: level, variant: "outline" as const }
  }

  const getTrialStatusBadge = (status: string) => {
    const statuses = {
      recruiting: { label: "Recruiting", variant: "default" as const },
      active: { label: "Active", variant: "secondary" as const },
      completed: { label: "Completed", variant: "outline" as const },
      terminated: { label: "Terminated", variant: "destructive" as const },
      suspended: { label: "Suspended", variant: "outline" as const },
    }
    return statuses[status as keyof typeof statuses] || { label: status, variant: "outline" as const }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>Please sign in to access research resources</CardDescription>
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
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2 flex items-center">
            <BookOpen className="h-8 w-8 text-primary mr-3" />
            Research Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Access the latest medical literature, clinical trials, and evidence-based research
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search papers, authors, keywords, or conditions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="shrink-0">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Journal</label>
                    <Select value={selectedJournal} onValueChange={setSelectedJournal}>
                      <SelectTrigger>
                        <SelectValue placeholder="All journals" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All journals</SelectItem>
                        <SelectItem value="New England Journal of Medicine">NEJM</SelectItem>
                        <SelectItem value="The Lancet Neurology">The Lancet Neurology</SelectItem>
                        <SelectItem value="JAMA Internal Medicine">JAMA Internal Medicine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Specialty</label>
                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                      <SelectTrigger>
                        <SelectValue placeholder="All specialties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All specialties</SelectItem>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Neurology">Neurology</SelectItem>
                        <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                        <SelectItem value="Artificial Intelligence">AI/ML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Evidence Level</label>
                    <Select value={selectedEvidenceLevel} onValueChange={setSelectedEvidenceLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="All evidence levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All evidence levels</SelectItem>
                        <SelectItem value="systematic-review">Systematic Review</SelectItem>
                        <SelectItem value="rct">Randomized Controlled Trial</SelectItem>
                        <SelectItem value="cohort">Cohort Study</SelectItem>
                        <SelectItem value="case-control">Case-Control Study</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="papers" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Research Papers</span>
            </TabsTrigger>
            <TabsTrigger value="trials" className="flex items-center space-x-2">
              <Microscope className="h-4 w-4" />
              <span>Clinical Trials</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center space-x-2">
              <Bookmark className="h-4 w-4" />
              <span>Saved ({savedPapers.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="papers" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{filteredPapers.length} papers found</p>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Sort by Relevance</SelectItem>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="citations">Sort by Citations</SelectItem>
                  <SelectItem value="impact">Sort by Impact Factor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredPapers.map((paper) => (
                <Card key={paper.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <h3 className="font-heading font-semibold text-lg leading-tight">{paper.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{paper.authors.join(", ")}</span>
                            <span>•</span>
                            <span className="font-medium">{paper.journal}</span>
                            <span>•</span>
                            <span>{paper.publishDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSavePaper(paper.id)}
                            className={savedPapers.includes(paper.id) ? "text-primary" : ""}
                          >
                            <Bookmark className={`h-4 w-4 ${savedPapers.includes(paper.id) ? "fill-current" : ""}`} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge {...getEvidenceLevelBadge(paper.evidenceLevel)}>
                          {getEvidenceLevelBadge(paper.evidenceLevel).label}
                        </Badge>
                        {paper.openAccess && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Open Access
                          </Badge>
                        )}
                        {paper.specialty.map((spec) => (
                          <Badge key={spec} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">{paper.abstract}</p>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{paper.citationCount} citations</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4" />
                            <span>IF: {paper.impactFactor}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4" />
                            <span>{paper.relevanceScore}% relevance</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trials" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{mockClinicalTrials.length} clinical trials found</p>
            </div>

            <div className="space-y-4">
              {mockClinicalTrials.map((trial) => (
                <Card key={trial.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <h3 className="font-heading font-semibold text-lg leading-tight">{trial.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="font-medium">{trial.nctId}</span>
                            <span>•</span>
                            <span>{trial.sponsor}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge variant="default">Phase {trial.phase}</Badge>
                        <Badge {...getTrialStatusBadge(trial.status)}>{getTrialStatusBadge(trial.status).label}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium mb-1">Condition:</p>
                          <p className="text-muted-foreground">{trial.condition}</p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Intervention:</p>
                          <p className="text-muted-foreground">{trial.intervention}</p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Primary Outcome:</p>
                          <p className="text-muted-foreground">{trial.primaryOutcome}</p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Enrollment:</p>
                          <p className="text-muted-foreground">{trial.enrollment} participants</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Started: {trial.startDate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>Est. completion: {trial.estimatedCompletion}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View on ClinicalTrials.gov
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            {savedPapers.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-lg mb-2">No saved papers</h3>
                  <p className="text-muted-foreground">
                    Save papers by clicking the bookmark icon to access them later
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mockResearchPapers
                  .filter((paper) => savedPapers.includes(paper.id))
                  .map((paper) => (
                    <Card key={paper.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <h3 className="font-heading font-semibold text-lg leading-tight">{paper.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>{paper.authors.join(", ")}</span>
                                <span>•</span>
                                <span className="font-medium">{paper.journal}</span>
                                <span>•</span>
                                <span>{paper.publishDate}</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSavePaper(paper.id)}
                              className="text-primary"
                            >
                              <Bookmark className="h-4 w-4 fill-current" />
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge {...getEvidenceLevelBadge(paper.evidenceLevel)}>
                              {getEvidenceLevelBadge(paper.evidenceLevel).label}
                            </Badge>
                            {paper.specialty.map((spec) => (
                              <Badge key={spec} variant="secondary">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
