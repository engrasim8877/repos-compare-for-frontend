"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, User, Mail, Phone, AlertTriangle, CalendarClock } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthGuard } from "@/components/auth-guard"
import { getAuthHeaders } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTranslation } from "@/lib/translations"

export default function ProfilePage() {
  const { toast } = useToast()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<any | null>(null)
  
  // Fetch user profile data
  useEffect(() => {
    fetchUserProfile()
  }, [])

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return t("dashboard.profile.notAvailable")
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get booking status color
  const getBookingStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-800 border-gray-200"
    
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get translated booking status
  const getBookingStatus = (status?: string) => {
    if (!status) return ""
    
    switch (status.toLowerCase()) {
      case "active":
        return t("dashboard.profile.active")
      case "approved":
        return t("dashboard.profile.approved")
      case "pending":
        return t("dashboard.profile.pending")
      case "completed":
        return t("dashboard.profile.completed")
      case "cancelled":
        return t("dashboard.profile.cancelled")
      default:
        return status
    }
  }

  // Fetch user profile data from backend
  const fetchUserProfile = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user profile")
      }

      const data = await response.json()
      setProfileData(data)
    } catch (err: any) {
      console.error("Error fetching user profile:", err)
      setError(err.message || "Failed to load profile data")
      toast({
        title: t("dashboard.profile.error"),
        description: t("dashboard.profile.failedToLoadProfile"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Calculate booking count
  const calculateBookingCount = () => {
    if (!profileData?.bookingHistory) return 0
    return profileData.bookingHistory.count || 0
  }
  
  if (isLoading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }
  
  if (error) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="container mx-auto py-8 px-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t("dashboard.profile.error")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={fetchUserProfile} className="mt-4">
              {t("dashboard.profile.tryAgain")}
            </Button>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }
  
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">{t("dashboard.profile.title")}</h1>
            <Button variant="outline" size="sm" onClick={fetchUserProfile} className="h-9">
              <Loader2 className="mr-2 h-4 w-4" />
              {t("dashboard.profile.refreshProfile")}
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* User Information - First Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{t("dashboard.profile.userInformation")}</CardTitle>
                <CardDescription>{t("dashboard.profile.yourAccountDetails")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("dashboard.profile.name")}</p>
                        <p className="font-medium">{profileData?.user?.firstName} {profileData?.user?.lastName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("dashboard.profile.email")}</p>
                        <p className="font-medium">{profileData?.user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {profileData?.user?.phone && (
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t("dashboard.profile.phoneNumber")}</p>
                          <p className="font-medium">{profileData?.user?.phone}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <CalendarClock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("dashboard.profile.memberSince")}</p>
                        <p className="font-medium">{formatDate(profileData?.user?.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Booking Summary - Second Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{t("dashboard.profile.bookingSummary")}</CardTitle>
                    <CardDescription>{t("dashboard.profile.recentUpcomingBookings")}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/bookings">
                      {t("dashboard.profile.viewAllBookings")}
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Active Booking - Highest Priority */}
                  {profileData?.activeBooking && (
                    <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getBookingStatusColor("active")}>
                              {getBookingStatus("active")}
                            </Badge>
                            <span className="font-semibold">
                              {profileData.activeBooking.campsite?.campsiteName || 
                               profileData.activeBooking.campsiteName || 
                               `Campsite ${profileData.activeBooking.campsiteId}`}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(profileData.activeBooking.startDate)} - {formatDate(profileData.activeBooking.endDate)}
                          </p>
                        </div>
                        <Button size="sm" variant="default" asChild>
                          <Link href="/dashboard/controls">
                            {t("dashboard.profile.controlPanel")}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Approved Booking - If no active booking */}
                  {!profileData?.activeBooking && profileData?.approvedBooking && (
                    <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getBookingStatusColor("approved")}>
                              {getBookingStatus("approved")}
                            </Badge>
                            <span className="font-semibold">
                              {profileData.approvedBooking.campsite?.campsiteName || 
                               profileData.approvedBooking.campsiteName || 
                               `Campsite ${profileData.approvedBooking.campsiteId}`}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(profileData.approvedBooking.startDate)} - {formatDate(profileData.approvedBooking.endDate)}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href="/dashboard/bookings">
                            {t("dashboard.profile.viewDetails")}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Pending Booking - If no active or approved booking */}
                  {!profileData?.activeBooking && !profileData?.approvedBooking && profileData?.pendingBooking && (
                    <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getBookingStatusColor("pending")}>
                              {getBookingStatus("pending")}
                            </Badge>
                            <span className="font-semibold">
                              {t("dashboard.profile.bookingRequest")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(profileData.pendingBooking.startDate)} - {formatDate(profileData.pendingBooking.endDate)}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href="/dashboard/bookings">
                            {t("dashboard.profile.checkStatus")}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* No Bookings */}
                  {!profileData?.activeBooking && !profileData?.approvedBooking && !profileData?.pendingBooking && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CalendarClock className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                      <h3 className="font-medium mb-1">{t("dashboard.profile.noActiveUpcomingBookings")}</h3>
                      <p className="text-sm text-muted-foreground mb-4">Get started by making your first booking</p>
                      <Button size="sm" asChild>
                        <Link href="/dashboard/bookings">
                          {t("dashboard.profile.requestABooking")}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
} 