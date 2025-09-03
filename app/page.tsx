"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, Shield, Brain, Users, BookOpen, Search, CheckCircle, ArrowRight } from "lucide-react"

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Trusted by Healthcare Professionals
          </Badge>
          <h1 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl text-balance mb-6">
            AI-Powered Medical
            <span className="text-primary block">Diagnosis Aid</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto mb-8">
            Enhance your clinical decision-making with evidence-based AI assistance. Designed for doctors, medical
            students, and researchers who demand accuracy and reliability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href="/register">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                  <Link href="/demo">View Demo</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Built for Healthcare Excellence</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Every feature designed with clinical workflows and patient safety in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <Brain className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-heading">AI Differential Diagnosis</CardTitle>
                <CardDescription>
                  Multi-agent AI system provides comprehensive differential diagnoses with evidence citations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-heading">FHIR Compliant</CardTitle>
                <CardDescription>
                  Full HL7 FHIR standard compliance ensures seamless EHR integration and data interoperability
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <Search className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-heading">Research Integration</CardTitle>
                <CardDescription>
                  Access latest medical literature, clinical trials, and evidence-based guidelines in real-time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-heading">Multi-Role Support</CardTitle>
                <CardDescription>
                  Tailored experiences for doctors, medical students, and researchers with role-specific features
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-heading">Learning Platform</CardTitle>
                <CardDescription>
                  Interactive case studies and diagnostic training modules for continuous medical education
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-heading">Safety First</CardTitle>
                <CardDescription>
                  Built-in safety checks, contraindication alerts, and guideline compliance verification
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Ready to Transform Your Practice?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of healthcare professionals already using MedAI to enhance patient care
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/dashboard">
                  Access Your Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href="/register">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Stethoscope className="h-6 w-6 text-primary" />
              <span className="font-heading font-bold text-lg">MedAI</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 MedAI. All rights reserved. For healthcare professional use only.
          </div>
        </div>
      </footer>
    </div>
  )
}
