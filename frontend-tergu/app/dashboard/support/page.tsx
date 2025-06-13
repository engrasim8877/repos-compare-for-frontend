"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  HelpCircle, 
  Mail, 
  Phone, 
  Clock, 
  AlertCircle
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthGuard } from "@/components/auth-guard"
import { useToast } from "@/hooks/use-toast"

export default function SupportPage() {
  const { toast } = useToast()

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="flex flex-col gap-6 max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
            <p className="text-muted-foreground">Find answers to common questions or contact our support team</p>
          </div>
          
          {/* Contact Information Section - Fixed layout to prevent text clipping */}
          <Card className="shadow-sm border-primary/20">
            <CardHeader className="bg-primary/5 border-b pb-4">
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Contact Support
              </CardTitle>
              <CardDescription>Ways to reach our support team for immediate assistance</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                {/* Improved card layout to prevent text overflow/clipping */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {/* Email Support Card - Fixed Content Height */}
                  <div className="bg-card border rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="bg-primary/10 py-3 px-4 border-b flex items-center gap-3 flex-shrink-0">
                      <div className="bg-background p-2 rounded-full">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium truncate">Email Support</h3>
                    </div>
                    <div className="p-4 flex-grow">                      <a href="mailto:support@tergucamperarea.com" className="text-primary hover:underline font-medium block mb-1 break-all">
                        support@tergucamperarea.com
                      </a>
                      <p className="text-xs text-muted-foreground">
                        Response time: 24-48 hours
                      </p>
                    </div>
                  </div>
                  
                  {/* Phone Support Card - Fixed Content Height */}
                  <div className="bg-card border rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="bg-primary/10 py-3 px-4 border-b flex items-center gap-3 flex-shrink-0">
                      <div className="bg-background p-2 rounded-full">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium truncate">Phone Support</h3>
                    </div>
                    <div className="p-4 flex-grow">
                      <a href="tel:+11234567890" className="text-primary hover:underline font-medium block mb-1">
                        +1 (123) 456-7890
                      </a>
                      <p className="text-xs text-muted-foreground">
                        For urgent issues only
                      </p>
                    </div>
                  </div>
                  
                  {/* Support Hours Card - Fixed Content Height */}
                  <div className="bg-card border rounded-lg shadow-sm overflow-hidden flex flex-col h-full md:col-span-2 lg:col-span-1">
                    <div className="bg-primary/10 py-3 px-4 border-b flex items-center gap-3 flex-shrink-0">
                      <div className="bg-background p-2 rounded-full">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium truncate">Support Hours</h3>
                    </div>
                    <div className="p-4 flex-grow">
                      <div className="space-y-1">
                        <p className="text-sm">Monday to Friday: 9:00 AM - 6:00 PM</p>
                        <p className="text-sm">Saturday: 10:00 AM - 4:00 PM</p>
                        <p className="text-sm">Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Alert className="bg-muted/50 mt-2">
                  <HelpCircle className="h-4 w-4" />
                  <AlertTitle>Need immediate assistance?</AlertTitle>
                  <AlertDescription>
                    For urgent issues, please call our support line directly during business hours.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
          
          {/* FAQ Section - Second */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to our most commonly asked questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="section-1">
                  <AccordionTrigger className="text-left">Booking Questions</AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">How do I book a campsite?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          You can book a campsite by navigating to the "My Bookings" section and clicking on the "Request New Booking" button. Follow the form instructions to complete your booking.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">What is the cancellation policy?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Bookings can be cancelled up to 48 hours before the start date for a full refund. Cancellations made within 48 hours of the start date may incur a cancellation fee.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">How do I extend my booking?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Active bookings can be extended through the "My Bookings" section. Find your active booking, click "View Details" and then "Extend Stay". Extensions are subject to availability.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">How long can I book a campsite for?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Bookings can be made for a minimum of 1 day and a maximum of 30 days. For longer stays, please contact our support team.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="section-2">
                  <AccordionTrigger className="text-left">Device Control Questions</AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">How do I control my campsite utilities?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Once you have an active booking, navigate to the "Campsite Control" section where you'll find switches to control electricity, water, and the barrier/gate.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">What happens if I lose internet connection?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          The system maintains your last set states. If you lose connection, your campsite utilities will continue to operate based on your last commands until connection is restored.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Is there a limit to how much electricity/water I can use?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Yes, each campsite has a daily usage limit of 100 kWh for electricity and 500 liters for water. You can monitor your usage in the "Usage History" section.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">What should I do if a device appears offline?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          If a device shows as offline, first try refreshing the page. If it remains offline, contact our support team for assistance.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="section-3">
                  <AccordionTrigger className="text-left">Account Questions</AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">How do I update my profile information?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          You can update your profile information by navigating to the "Profile" section in the dashboard. Click on "Edit Profile" to update your personal details.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">What if I forgot my password?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          If you forgot your password, click on the "Forgot Password" link on the login page. You'll receive an email with instructions to reset your password.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">How is my personal data used?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          We only use your personal data to operate our services and improve your experience. We never share your data with third parties without your consent. For more details, please refer to our Privacy Policy.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="section-4">
                  <AccordionTrigger className="text-left">Technical Support</AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">What browsers are supported?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Our platform works best on the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, please keep your browser updated.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">How do I report a technical issue?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          You can report technical issues through the contact information provided in the support section. Please provide as much detail as possible, including screenshots if applicable.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Is the mobile app available?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Our mobile app is currently under development. In the meantime, our website is fully responsive and works well on mobile devices.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">What should I do if the system is not responding?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          If the system is not responding, try refreshing the page or clearing your browser cache. If the problem persists, contact our support team.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}