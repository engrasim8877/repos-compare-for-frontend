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

export default function ProfilePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<any | null>(null)
  
  // Fetch user profile data
  useEffect(() => {
    fetchUserProfile()
  }, [])

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
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
        title: "Error",
        description: "Failed to load your profile. Please try again later.",
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
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={fetchUserProfile} className="mt-4">
              Try Again
            </Button>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }
  
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <Button variant="outline" size="sm" onClick={fetchUserProfile} className="h-9">
              <Loader2 className="mr-2 h-4 w-4" />
              Refresh Profile
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Information */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>User Information</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{profileData?.user?.firstName} {profileData?.user?.lastName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{profileData?.user?.email}</p>
                    </div>
                  </div>

                  {profileData?.user?.phone && (
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                        <p className="font-medium">{profileData?.user?.phone}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <CalendarClock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">{formatDate(profileData?.user?.createdAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Booking Summaries */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Booking Summary</CardTitle>
                      <CardDescription>Your recent and upcoming bookings</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/bookings">
                        View All Bookings
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Active Booking */}
                    {profileData?.activeBooking && (
                      <div className="p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getBookingStatusColor("active")}>
                                Active
                              </Badge>
                              <span className="font-medium">
                                {profileData.activeBooking.campsite?.campsiteName || `Campsite ${profileData.activeBooking.campsiteId}`}
                              </span>
                            </div>
                            <p className="text-sm">
                              {formatDate(profileData.activeBooking.startDate)} - {formatDate(profileData.activeBooking.endDate)}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link href="/dashboard/controls">
                              Control Panel
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Approved Booking */}
                    {profileData?.approvedBooking && (
                      <div className="p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getBookingStatusColor("approved")}>
                                Approved
                              </Badge>
                              <span className="font-medium">
                                {profileData.approvedBooking.campsite?.campsiteName || `Campsite ${profileData.approvedBooking.campsiteId}`}
                              </span>
                            </div>
                            <p className="text-sm">
                              {formatDate(profileData.approvedBooking.startDate)} - {formatDate(profileData.approvedBooking.endDate)}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link href="/dashboard/bookings">
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Pending Booking */}
                    {profileData?.pendingBooking && (
                      <div className="p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getBookingStatusColor("pending")}>
                                Pending
                              </Badge>
                              <span className="font-medium">
                                Booking Request
                              </span>
                            </div>
                            <p className="text-sm">
                              {formatDate(profileData.pendingBooking.startDate)} - {formatDate(profileData.pendingBooking.endDate)}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link href="/dashboard/bookings">
                              Check Status
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* No Bookings */}
                    {!profileData?.activeBooking && !profileData?.approvedBooking && !profileData?.pendingBooking && (
                      <div className="flex flex-col items-center justify-center py-6">
                        <p className="text-muted-foreground">No active or upcoming bookings</p>
                        <Button size="sm" className="mt-3" asChild>
                          <Link href="/dashboard/bookings">
                            Request a Booking
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Booking History */}
              {profileData?.bookingHistory && profileData.bookingHistory.bookings && profileData.bookingHistory.bookings.length > 0 && (
                <Card className="mt-6">
                  <CardHeader className="pb-3">
                    <CardTitle>Recent Booking History</CardTitle>
                    <CardDescription>Your past bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profileData.bookingHistory.bookings.slice(0, 3).map((booking: any, index: number) => (
                        <div key={booking.bookingId || index} className="p-3 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={getBookingStatusColor(booking.status)}>
                                  {booking.status}
                                </Badge>
                                <span className="font-medium">
                                  {booking.campsite?.campsiteName || `Campsite ${booking.campsiteId}`}
                                </span>
                              </div>
                              <p className="text-sm">
                                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                              </p>
                              {booking.totalPrice && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Total: ${booking.totalPrice.toFixed(2)}
                                </p>
                              )}
                            </div>
                            {(booking.status === "completed" || booking.status === "cancelled") && (
                              <Button size="sm" variant="outline" asChild>
                                <Link href="/dashboard/bookings">
                                  Book Again
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {profileData.bookingHistory.count > 3 && (
                        <div className="text-center pt-2">
                          <Button variant="link" asChild>
                            <Link href="/dashboard/bookings">
                              View all {profileData.bookingHistory.count} bookings
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
} 