"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Zap, 
  Droplet, 
  AlertTriangle, 
  CalendarDays, 
  ArrowUpRight, 
  BadgePlus, 
  FenceIcon, 
  Info,
  RefreshCw 
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthGuard } from "@/components/auth-guard"
import { getUser, getAuthHeaders } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFirstBookingOverlay, setShowFirstBookingOverlay] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const userData = getUser()
    if (userData) {
      setUser(userData)
    }

    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    setIsLoading(true)
    setError(null)
    setIsRefreshing(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`, {
        headers: getAuthHeaders(),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profile data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json()
      setProfileData(data)
      
      // Check if user has any bookings
      if (
        (!data.activeBooking || Object.keys(data.activeBooking).length === 0) &&
        (!data.pendingBooking || Object.keys(data.pendingBooking).length === 0) &&
        (!data.approvedBooking || Object.keys(data.approvedBooking).length === 0) &&
        (!data.bookingHistory || data.bookingHistory.count === 0)
      ) {
        setShowFirstBookingOverlay(true)
      }
    } catch (err: any) {
      console.error("Error fetching profile data:", err)
      setError(err.message || "Failed to load profile data")
      toast({
        title: "Error",
        description: "Failed to load your profile data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const toggleUtility = async (campsiteId: string, utilityType: string, currentState: boolean) => {
    if (!profileData?.activeBooking) return;
    
    try {
      const commandType =
        utilityType === "electricity" ? "setElectricity" : utilityType === "water" ? "setWater" : "setBarrier"

      // Optimistically update the UI
      setProfileData((prevData: any) => {
        const updatedCampsite = { 
          ...prevData.campsite,
          currentState: {
            ...prevData.campsite.currentState,
            [utilityType]: !currentState,
          }
        };
        
        return {
          ...prevData,
          campsite: updatedCampsite
        };
      });

      // Then perform the API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campsites/${campsiteId}/command`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          command: {
            type: commandType,
            state: !currentState,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to toggle ${utilityType}`)
      }

      toast({
        title: "Success",
        description: `${utilityType.charAt(0).toUpperCase() + utilityType.slice(1)} has been turned ${!currentState ? "on" : "off"}.`,
      })
    } catch (err: any) {
      console.error(`Error toggling ${utilityType}:`, err)
      
      // Revert the optimistic update since the API call failed
      setProfileData((prevData: any) => {
        const updatedCampsite = { 
          ...prevData.campsite,
          currentState: {
            ...prevData.campsite.currentState,
            [utilityType]: currentState,
          }
        };
        
        return {
          ...prevData,
          campsite: updatedCampsite
        };
      });
      
      toast({
        title: "Error",
        description: `Failed to toggle ${utilityType}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const today = new Date()
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const calculateDaysUntil = (startDate: string) => {
    const start = new Date(startDate)
    const today = new Date()
    const diffTime = start.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // First booking overlay
  if (showFirstBookingOverlay) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Welcome to Tergucamperarea!</CardTitle>
                <CardDescription>To get started, you'll need to request your first campsite booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <div className="mx-auto rounded-full bg-primary/10 w-20 h-20 flex items-center justify-center mb-2">
                  <CalendarDays className="h-10 w-10 text-primary" />
                </div>
                <p>You don't have any bookings yet. Request your first booking to use our smart campsite services.</p>
                <div className="text-sm text-muted-foreground">
                  <p>After your booking is approved, you'll be able to:</p>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      <span>Control your campsite utilities remotely</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      <span>Monitor your resource usage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      <span>Access all dashboard features</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button size="lg" asChild>
                  <Link href="/dashboard/bookings">Request Your First Booking</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          {/* Render the dashboard in background */}
          <DashboardContent 
            isLoading={isLoading} 
            error={error} 
            user={user} 
            profileData={profileData} 
            toggleUtility={toggleUtility}
            formatDate={formatDate}
            calculateDaysRemaining={calculateDaysRemaining}
            calculateDaysUntil={calculateDaysUntil}
            refreshData={fetchUserProfile}
            isRefreshing={isRefreshing}
          />
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <DashboardContent 
          isLoading={isLoading} 
          error={error} 
          user={user} 
          profileData={profileData} 
          toggleUtility={toggleUtility}
          formatDate={formatDate}
          calculateDaysRemaining={calculateDaysRemaining}
          calculateDaysUntil={calculateDaysUntil}
          refreshData={fetchUserProfile}
          isRefreshing={isRefreshing}
        />
      </DashboardLayout>
    </AuthGuard>
  )
}

interface DashboardContentProps {
  isLoading: boolean
  error: string | null
  user: any
  profileData: any
  toggleUtility: (campsiteId: string, utilityType: string, currentState: boolean) => Promise<void>
  formatDate: (dateString: string) => string
  calculateDaysRemaining: (endDate: string) => number
  calculateDaysUntil: (startDate: string) => number
  refreshData: () => Promise<void>
  isRefreshing: boolean
}

function DashboardContent({ 
  isLoading, 
  error, 
  user, 
  profileData, 
  toggleUtility,
  formatDate,
  calculateDaysRemaining,
  calculateDaysUntil,
  refreshData,
  isRefreshing
}: DashboardContentProps) {
  // Current date information
  const currentDate = new Date()
  const formattedDate = format(currentDate, "EEEE, MMMM d, yyyy")
  
  if (isLoading) {
    return <DashboardSkeleton />
  }
  
  if (error && !profileData) { // Show full error page only if profile data failed
    return (
      <div className="flex flex-col gap-6 py-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Error loading dashboard data.</p>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Dashboard</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={refreshData} className="w-fit">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  // Safely access potential booking data
  const activeBooking = profileData?.activeBooking;
  const approvedBooking = profileData?.approvedBooking;
  const pendingBooking = profileData?.pendingBooking;
  const hasActiveBooking = activeBooking && Object.keys(activeBooking).length > 0;
  const hasApprovedBooking = approvedBooking && Object.keys(approvedBooking).length > 0;
  const hasPendingBooking = pendingBooking && Object.keys(pendingBooking).length > 0;
  
  // Safely access campsite and device data only if there's an active booking
  const activeCampsite = hasActiveBooking ? profileData?.campsite : null;
  const deviceStatus = activeCampsite?.device?.status;
  const isDeviceOffline = deviceStatus === 'offline';

  return (
    <div className="flex flex-col gap-8 py-6"> {/* Increased gap and added padding */}
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, {user?.firstName}!</h1>
          <p className="text-muted-foreground text-sm md:text-base">{formattedDate}</p>
        </div>
        <Button 
          variant="outline"
          size="sm" 
          onClick={refreshData}
          disabled={isRefreshing}
          className="h-9"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      {/* Status Card */}
      <Card className="shadow-md border overflow-hidden bg-gradient-to-br from-white to-slate-50">
        <CardContent className="p-0">
          {hasActiveBooking ? (
            <div className="relative">
              {/* Visual accent bar at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
              <div className="p-5 md:p-6 flex flex-col sm:flex-row items-start gap-5">
                <div className="flex-1">
                  <Badge className="bg-green-100 text-green-800 border-0 mb-3 font-medium text-xs px-3 py-1 rounded-full shadow-sm">
                    Active Booking
                  </Badge>
                  <h2 className="text-xl font-semibold mb-1.5">
                    {activeCampsite?.campsiteName || `Campsite ${activeBooking.campsiteId}`}
                  </h2>
                  <div className="flex items-center text-sm text-muted-foreground mb-2.5">
                    <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted-foreground/70" />
                    {formatDate(activeBooking.startDate)} - {formatDate(activeBooking.endDate)}
                  </div>
                  <div className="mb-1.5 flex items-center text-sm bg-green-50 text-green-700 px-2.5 py-1 rounded-md w-fit">
                    <span className="font-medium">
                      {calculateDaysRemaining(activeBooking.endDate)} days remaining
                    </span>
                  </div>
                  {/* Device Status */} 
                  <div className={`flex items-center text-xs font-medium rounded-full px-2.5 py-0.5 w-fit ${isDeviceOffline ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                    <div className={`mr-1.5 h-2 w-2 rounded-full ${isDeviceOffline ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                    Device {isDeviceOffline ? 'Offline' : 'Online'}
                  </div>
                </div>
                <div className="w-full sm:w-auto self-stretch sm:self-center flex flex-col sm:flex-row justify-end">
                  <Link href="/dashboard/controls" passHref className="w-full sm:w-auto">
                    <Button className="w-full shadow-sm bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300">
                      Go to Controls
                      <ArrowUpRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : hasApprovedBooking ? (
            <div className="relative">
              {/* Visual accent bar at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-500"></div>
              <div className="p-5 md:p-6 flex flex-col sm:flex-row items-start gap-5">
                <div className="flex-1">
                  <Badge className="bg-blue-100 text-blue-800 border-0 mb-3 font-medium text-xs px-3 py-1 rounded-full shadow-sm">
                    Upcoming Booking
                  </Badge>
                  <h2 className="text-xl font-semibold mb-1.5">
                    {approvedBooking.campsite?.campsiteName || `Campsite ${approvedBooking.campsiteId}`}
                  </h2>
                  <div className="flex items-center text-sm text-muted-foreground mb-2.5">
                    <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted-foreground/70" />
                    From {formatDate(approvedBooking.startDate)}
                  </div>
                  <div className="flex items-center text-sm bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md w-fit">
                    <span className="font-medium">
                      Starts in {calculateDaysUntil(approvedBooking.startDate)} days
                    </span>
                  </div>
                </div>
                <div className="w-full sm:w-auto self-stretch sm:self-center flex mt-4 sm:mt-0">
                  <Link href={`/dashboard/bookings`} passHref className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800">
                      View Booking Details
                      <ArrowUpRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : hasPendingBooking ? (
            <div className="relative">
              {/* Visual accent bar at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500"></div>
              <div className="p-5 md:p-6 flex flex-col sm:flex-row items-start gap-5">
                <div className="flex-1">
                  <Badge className="bg-amber-100 text-amber-800 border-0 mb-3 font-medium text-xs px-3 py-1 rounded-full shadow-sm">
                    Pending Approval
                  </Badge>
                  <h2 className="text-xl font-semibold mb-1.5">Booking Request</h2>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="font-medium text-muted-foreground/80 mr-1.5">Campsite:</span>
                    {pendingBooking.campsite?.campsiteName || `ID ${pendingBooking.campsiteId}`}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted-foreground/70" />
                    {formatDate(pendingBooking.startDate)} - {formatDate(pendingBooking.endDate)}
                  </div>
                  <div className="flex items-center text-sm bg-amber-50 px-2.5 py-1 rounded-md w-fit text-amber-700">
                    <span className="font-medium">Waiting for approval</span>
                  </div>
                </div>
                <div className="w-full sm:w-auto self-stretch sm:self-center flex mt-4 sm:mt-0">
                  <Link href={`/dashboard/bookings`} passHref className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800">
                      View Request Status
                      <ArrowUpRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Visual accent bar at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 to-slate-300"></div>
              <div className="p-5 md:p-6 flex flex-col sm:flex-row items-start gap-5">
                <div className="flex-1">
                  <Badge className="bg-slate-100 text-slate-700 border-0 mb-3 font-medium text-xs px-3 py-1 rounded-full shadow-sm">
                    No Bookings Found
                  </Badge>
                  <h2 className="text-xl font-semibold mb-1.5">Request your first booking</h2>
                  <p className="text-sm text-muted-foreground mb-2.5">
                    Get started by requesting a campsite booking.
                  </p>
                </div>
                <div className="w-full sm:w-auto self-stretch sm:self-center flex mt-4 sm:mt-0">
                  <Link href="/dashboard/bookings" passHref className="w-full sm:w-auto">
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300">
                      Request Booking
                      <BadgePlus className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Quick Controls Section */}
      {hasActiveBooking && activeCampsite && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Quick Controls</h2>
            <Link href="/dashboard/controls" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center">
              Advanced controls
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex flex-col gap-6">
            {/* Electricity Control */}
            <Card className="overflow-hidden border shadow-sm">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center border border-orange-200">
                      <Zap className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Electricity</h3>
                      <Badge 
                        variant="outline"
                        className={`mt-1 text-xs px-2 py-0.5 rounded-full ${
                          activeCampsite.currentState?.electricity
                          ? "border-green-300 bg-green-50 text-green-800"
                          : "border-gray-300 bg-gray-100 text-gray-700"
                        }`}
                      >
                        {activeCampsite.currentState?.electricity ? "ON" : "OFF"}
                      </Badge>
                    </div>
                  </div>
                  <Switch 
                    checked={activeCampsite.currentState?.electricity || false}
                    onCheckedChange={() => toggleUtility(
                      activeCampsite.campsiteId,
                      "electricity",
                      activeCampsite.currentState?.electricity || false
                    )}
                    disabled={isDeviceOffline}
                    className="scale-110 data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-300"
                    aria-label="Toggle Electricity"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Water Status Card */}
            <Card className="overflow-hidden border shadow-sm bg-slate-50/50">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center border border-blue-200">
                      <Droplet className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Water Supply</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline"
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            activeCampsite.currentState?.water
                            ? "border-blue-300 bg-blue-50 text-blue-800"
                            : "border-gray-300 bg-gray-100 text-gray-700"
                          }`}
                        >
                          {activeCampsite.currentState?.water ? "ON" : "OFF"}
                        </Badge>
                        <Badge variant="secondary" className="text-xs font-normal h-5">Read Only</Badge>
                      </div>
                    </div>
                  </div>
                  {/* No control, just status */}
                </div>
              </CardContent>
            </Card>
            
            {/* Barrier Status Card */}
            <Card className="overflow-hidden border shadow-sm">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center border ${activeCampsite.currentState?.barrier ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'}`}>
                      <div className="w-8 h-8 relative overflow-hidden">
                        {/* Enhanced barrier animation */}
                        {/* Base */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-2 w-3.5 bg-gray-600 rounded-sm"></div>
                        
                        {/* Arm */}
                        <div className={`absolute left-1/2 transform -translate-x-1/2 w-1.5 rounded-t-sm shadow-sm ${
                          activeCampsite.currentState?.barrier 
                          ? 'h-4 bottom-2 bg-green-600 transition-all duration-700 ease-in-out' 
                          : 'h-6 bottom-0 bg-red-600 -rotate-90 transition-all duration-700 ease-in-out'
                        }`}></div>
                        
                        {/* Stripe on arm */}
                        <div className={`absolute left-1/2 transform -translate-x-1/2 h-0.5 bg-white/70 w-1.5 ${
                          activeCampsite.currentState?.barrier 
                          ? 'bottom-4 transition-all duration-700 ease-in-out' 
                          : 'rotate-90 bottom-3 transition-all duration-700 ease-in-out'
                        }`}></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Gate Barrier</h3>
                      <Badge 
                        variant="outline"
                        className={`mt-1 text-xs px-2 py-0.5 rounded-full ${
                          activeCampsite.currentState?.barrier
                          ? "border-green-300 bg-green-50 text-green-800"
                          : "border-red-300 bg-red-50 text-red-800"
                        }`}
                      >
                        {activeCampsite.currentState?.barrier ? "OPEN" : "CLOSED"}
                      </Badge>
                    </div>
                  </div>
                  <Switch 
                    checked={activeCampsite.currentState?.barrier || false}
                    onCheckedChange={() => toggleUtility(
                      activeCampsite.campsiteId,
                      "barrier",
                      activeCampsite.currentState?.barrier || false
                    )}
                    disabled={isDeviceOffline}
                    className="scale-110 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                    aria-label="Toggle Barrier"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8 py-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <Skeleton className="h-9 w-64 mb-1" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
      
      {/* Status Card Skeleton */}
      <Card className="shadow-md border overflow-hidden">
        <CardContent className="p-0">
          <div className="h-1 w-full bg-gradient-to-r from-gray-200 to-gray-300"></div>
          <div className="p-5 md:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-6 w-40 rounded-md" />
                <Skeleton className="h-5 w-32 rounded-full" />
              </div>
              <div className="mt-4 sm:mt-0 flex justify-start sm:justify-end w-full sm:w-auto">
                <Skeleton className="h-10 w-full sm:w-36 rounded-md" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Controls Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex flex-col gap-6">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden border shadow-sm">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>
                {i === 2 && (
                  <div className="flex justify-end mt-4">
                    <Skeleton className="h-9 w-32 rounded-md" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

