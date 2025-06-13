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
import { useTranslation } from "@/lib/translations"

export default function SupportPage() {
  const { toast } = useToast()
  const { t } = useTranslation()

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="flex flex-col gap-6 max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{t("dashboard.support.title")}</h1>
            <p className="text-muted-foreground">{t("dashboard.support.subtitle")}</p>
          </div>
          
          {/* Contact Information Section - Fixed layout to prevent text clipping */}
          <Card className="shadow-sm border-primary/20">
            <CardHeader className="bg-primary/5 border-b pb-4">
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                {t("dashboard.support.contactSupport")}
              </CardTitle>
              <CardDescription>{t("dashboard.support.waysToReach")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                {/* Improved card layout to prevent text overflow/clipping */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                  {/* Email Support Card - Fixed Content Height */}
                  <div className="bg-card border rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="bg-primary/10 py-3 px-4 border-b flex items-center gap-3 flex-shrink-0">
                      <div className="bg-background p-2 rounded-full">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium truncate">{t("dashboard.support.emailSupport")}</h3>
                    </div>
                    <div className="p-4 flex-grow">
                                      <a href="mailto:support@masullas.com" className="text-primary hover:underline font-medium block mb-1 break-all">
                  support@masullas.com
                      </a>
                      <p className="text-xs text-muted-foreground">
                        {t("dashboard.support.responseTime24to48")}
                      </p>
                    </div>
                  </div>
                  
                  {/* Phone Support Card - Fixed Content Height */}
                  <div className="bg-card border rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="bg-primary/10 py-3 px-4 border-b flex items-center gap-3 flex-shrink-0">
                      <div className="bg-background p-2 rounded-full">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium truncate">{t("dashboard.support.phoneSupport")}</h3>
                    </div>
                    <div className="p-4 flex-grow">
                      <a href="tel:+11234567890" className="text-primary hover:underline font-medium block mb-1">
                        +1 (123) 456-7890
                      </a>
                      <p className="text-xs text-muted-foreground">
                        {t("dashboard.support.urgentIssuesOnly")}
                      </p>
                    </div>
                  </div>
                  
                  {/* Support Hours Card - Fixed Content Height */}
                  <div className="bg-card border rounded-lg shadow-sm overflow-hidden flex flex-col h-full lg:col-span-2 xl:col-span-1">
                    <div className="bg-primary/10 py-3 px-4 border-b flex items-center gap-3 flex-shrink-0">
                      <div className="bg-background p-2 rounded-full">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium truncate">{t("dashboard.support.supportHours")}</h3>
                    </div>
                    <div className="p-4 flex-grow">
                      <div className="space-y-1">
                        <p className="text-sm">{t("dashboard.support.mondayToFriday")}</p>
                        <p className="text-sm">{t("dashboard.support.saturday")}</p>
                        <p className="text-sm">{t("dashboard.support.sunday")}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Alert className="bg-muted/50 mt-2">
                  <HelpCircle className="h-4 w-4" />
                  <AlertTitle>{t("dashboard.support.needImmediateAssistance")}</AlertTitle>
                  <AlertDescription>
                    {t("dashboard.support.urgentIssuesCall")}
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
          
          {/* FAQ Section - Second */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>{t("dashboard.support.frequentlyAskedQuestions")}</CardTitle>
              <CardDescription>{t("dashboard.support.findAnswersCommon")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="section-1">
                  <AccordionTrigger className="text-left">{t("dashboard.support.bookingQuestions")}</AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">{t("dashboard.support.howToBookCampsite")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("dashboard.support.howToBookAnswer")}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">{t("dashboard.support.cancellationPolicy")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("dashboard.support.cancellationAnswer")}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">{t("dashboard.support.howToExtendBooking")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("dashboard.support.extendBookingAnswer")}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">{t("dashboard.support.bookingDurationLimit")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("dashboard.support.durationLimitAnswer")}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="section-2">
                  <AccordionTrigger className="text-left">{t("dashboard.support.deviceControlQuestions")}</AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">{t("dashboard.support.howToControlUtilities")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("dashboard.support.controlUtilitiesAnswer")}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">{t("dashboard.support.whatIfLoseConnection")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("dashboard.support.loseConnectionAnswer")}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">{t("dashboard.support.usageLimits")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("dashboard.support.usageLimitsAnswer")}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">{t("dashboard.support.deviceOfflineWhat")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("dashboard.support.deviceOfflineAnswer")}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="section-3">
                  <AccordionTrigger className="text-left">{t("dashboard.support.accountQuestions")}</AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">{t("dashboard.support.howToUpdateProfile")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("dashboard.support.updateProfileAnswer")}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">{t("dashboard.support.forgotPassword")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("dashboard.support.forgotPasswordAnswer")}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">{t("dashboard.support.personalDataUsage")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("dashboard.support.dataUsageAnswer")}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="section-4">
                  <AccordionTrigger className="text-left">{t("dashboard.support.technicalSupport")}</AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">{t("dashboard.support.supportedBrowsers")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("dashboard.support.browsersAnswer")}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">{t("dashboard.support.howToReportTechnical")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("dashboard.support.reportTechnicalAnswer")}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">{t("dashboard.support.mobileAppAvailable")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("dashboard.support.mobileAppAnswer")}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">{t("dashboard.support.systemNotResponding")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("dashboard.support.systemNotRespondingAnswer")}
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