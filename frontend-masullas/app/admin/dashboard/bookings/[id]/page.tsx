"use client"

import React, { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, CreditCard, Home, MapPin, Phone, RefreshCw, User, Mail, CheckCircle2, AlertTriangle, Map } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AdminLayout } from "@/components/admin-layout"
import { AuthGuard } from "@/components/auth-guard"
import { getAuthHeaders } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const bookingId = use(params).id
  const [booking, setBooking] = useState<any>(null)
  const [availableCampsites, setAvailableCampsites] = useState<any[]>([])
  const [selectedCampsiteId, setSelectedCampsiteId] = useState<string | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isCampsitesLoading, setIsCampsitesLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null)

  // Add API health check
  useEffect(() => {
    const checkApiConnection = async () => {
      if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
        console.error("API base URL is not defined");
        setIsApiAvailable(false);
        return;
      }

      // Check if token exists first
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        setError("Authentication token not found. Please log in again.");
        setIsApiAvailable(false);
        return;
      }

      try {
        // Use a more reliable endpoint for health check - the user profile endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`, {
          method: 'GET',
          headers: getAuthHeaders()
        });
        
        if (response.ok) {
          setIsApiAvailable(true);
        } else {
          console.error("API health check failed with status:", response.status);
          setIsApiAvailable(false);
        }
      } catch (err) {
        console.error("API connection check failed:", err);
        setIsApiAvailable(false);
      }
    };

    checkApiConnection();
  }, []);

  useEffect(() => {
    // Only fetch booking details if API is available
    if (isApiAvailable) {
      fetchBookingDetails();
    }
  }, [bookingId, isApiAvailable]);

  useEffect(() => {
    // When booking data is loaded, set the admin notes from booking if available
    if (booking && booking.adminNotes) {
      setAdminNotes(booking.adminNotes)
    }
  }, [booking])

  const fetchBookingDetails = async () => {
    setIsLoading(true)
    setError(null)

    // Check if the API base URL is defined
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      console.error("API base URL is not defined");
      setError("API base URL is not configured. Please check your environment variables.");
      setIsLoading(false);
      return;
    }

    // Get the token and ensure it exists
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found");
      setError("No authentication token found. Please log in again.");
      setIsLoading(false);
      return;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/bookings/${bookingId}`;
    console.log("Fetching booking details from:", apiUrl);

    try {
      // Create explicit headers with token
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      console.log("Request headers:", headers);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: headers,
        // Add these options to help with CORS and credentials
        mode: 'cors',
        credentials: 'include'
      });

      // Log response status and details for debugging
      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("Error response:", errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Booking data received:", data);
      setBooking(data.booking || null);
      
      // If the booking is pending and has no campsite assigned, fetch available campsites
      if (data.booking && data.booking.status === 'pending' && (!data.booking.campsiteId || data.booking.campsiteId === 'UNASSIGNED')) {
        fetchAvailableCampsites(data.booking.startDate, data.booking.endDate);
      }
    } catch (err: any) {
      console.error("Error fetching booking details:", err);
      
      // Enhanced error handling
      let errorMessage = err.message || "Failed to load booking details";
      
      // Network error specific message
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        errorMessage = "Network error: Unable to connect to the API. Please check your network connection and ensure the backend is running.";
      }
      
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load booking details. Check the console for more information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchAvailableCampsites = async (startDate: string, endDate: string) => {
    setIsCampsitesLoading(true);
    
    // Get the token and ensure it exists
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found for campsite fetch");
      setIsCampsitesLoading(false);
      return;
    }
    
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/campsites/available?startDate=${startDate}&endDate=${endDate}`;
      console.log("Fetching available campsites from:", apiUrl);
      
      // Create explicit headers with token
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        credentials: 'include'
      });
      
      console.log("Campsites response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("Error response for campsites:", errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Available campsites received:", data);
      setAvailableCampsites(data.campsites || []);
    } catch (err: any) {
      console.error("Error fetching available campsites:", err);
      toast({
        title: "Warning",
        description: "Failed to load available campsites. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsCampsitesLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // Add 1 to include both start and end dates
    return diffDays
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Approved</Badge>
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Completed</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Cancelled</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleAssignCampsite = async () => {
    if (!selectedCampsiteId) {
      toast({
        title: "Error",
        description: "Please select a campsite to assign",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Get the token and ensure it exists
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found for assigning campsite");
      toast({
        title: "Error",
        description: "Authentication token not found. Please log in again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
    
    try {
      // Fix: Use the correct API endpoint for approving bookings
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/bookings/${bookingId}/approve`;
      console.log("Assigning campsite via:", apiUrl);
      
      // Create explicit headers with token
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      
      const requestBody = {
        campsiteId: selectedCampsiteId,
        adminNotes: adminNotes || ''
      };
      console.log("Request body:", requestBody);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
        mode: 'cors',
        credentials: 'include'
      });
      
      console.log("Assignment response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("Error response for assignment:", errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Assignment response:", data);

      toast({
        title: "Success",
        description: "Campsite assigned and booking approved",
        variant: "default",
      });
      
      // Refresh the booking details
      fetchBookingDetails();
    } catch (err: any) {
      console.error("Error assigning campsite:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to assign campsite",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectBooking = async () => {
    setIsProcessing(true);
    
    // Get the token and ensure it exists
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found for rejecting booking");
      toast({
        title: "Error",
        description: "Authentication token not found. Please log in again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
    
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/bookings/${bookingId}/reject`;
      console.log("Rejecting booking via:", apiUrl);
      
      // Create explicit headers with token
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      
      const requestBody = {
        adminNotes: adminNotes || ''
      };
      console.log("Request body:", requestBody);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
        mode: 'cors',
        credentials: 'include'
      });
      
      console.log("Rejection response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("Error response for rejection:", errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Rejection response:", data);

      toast({
        title: "Success",
        description: "Booking has been rejected",
        variant: "default",
      });
      
      // Refresh the booking details
      fetchBookingDetails();
    } catch (err: any) {
      console.error("Error rejecting booking:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to reject booking",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelBooking = async () => {
    setIsProcessing(true);
    
    // Get the token and ensure it exists
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found for cancelling booking");
      toast({
        title: "Error",
        description: "Authentication token not found. Please log in again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
    
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/bookings/${bookingId}/cancel`;
      console.log("Cancelling booking via:", apiUrl);
      
      // Create explicit headers with token
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      
      const requestBody = {
        adminNotes: adminNotes || ''
      };
      console.log("Request body:", requestBody);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
        mode: 'cors',
        credentials: 'include'
      });
      
      console.log("Cancellation response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("Error response for cancellation:", errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Cancellation response:", data);

      toast({
        title: "Success",
        description: "Booking has been cancelled",
        variant: "default",
      });
      
      // Refresh the booking details
      fetchBookingDetails();
    } catch (err: any) {
      console.error("Error cancelling booking:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to cancel booking",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="container py-6 space-y-8">
          <div className="flex items-center">
            <Button variant="outline" size="sm" asChild className="mr-4">
              <Link href="/admin/dashboard/bookings">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Bookings
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Booking Details</h1>
            {booking && (
              <Badge className="ml-4">{booking.bookingId}</Badge>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                    <div className="space-y-4">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-36" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : isApiAvailable === false ? (
            <Alert variant="destructive">
              <AlertTitle>API Connection Error</AlertTitle>
              <AlertDescription className="space-y-4">
                <p>Unable to connect to the backend API. This could be due to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Network connectivity issues</li>
                  <li>The backend server being offline</li>
                  <li>Incorrect API configuration</li>
                </ul>
                
                <div className="text-xs font-mono bg-black/5 p-3 rounded border">
                  API URL: {process.env.NEXT_PUBLIC_API_BASE_URL || 'Not configured'}
                </div>
                
                <div className="pt-2">
                  <p className="font-medium">Troubleshooting steps:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Check your internet connection</li>
                    <li>Verify the backend server is running</li>
                    <li>Check the API URL in your environment configuration</li>
                    <li>Clear your browser cache and refresh</li>
                  </ol>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="default"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Page
                  </Button>
                  
                  <Button variant="outline" asChild>
                    <Link href="/admin/dashboard/bookings">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to All Bookings
                    </Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error Loading Booking</AlertTitle>
              <AlertDescription className="space-y-4">
                <p>{error}</p>
                {/* Show API diagnostic information */}
                <div className="text-xs font-mono bg-black/5 p-3 rounded border">
                  API URL: {process.env.NEXT_PUBLIC_API_BASE_URL ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/bookings/${bookingId}` : 'Not configured'}
                </div>
                <Button onClick={fetchBookingDetails} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <div>
                  <Button variant="outline" asChild className="mt-2">
                    <Link href="/admin/dashboard/bookings">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to All Bookings
                    </Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : booking ? (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              {/* Left column - booking details */}
              <div className="col-span-1 lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Booking Information</CardTitle>
                      {getStatusBadge(booking.status)}
                    </div>
                    <CardDescription>Details about this booking</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Booking Date</h3>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="font-medium">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Duration: {calculateDuration(booking.startDate, booking.endDate)} days
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Request Date</h3>
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{formatDateTime(booking.requestedAt)}</p>
                            {booking.lastUpdated && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Last Updated: {formatDateTime(booking.lastUpdated)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Booking ID</h3>
                        <p className="font-medium font-mono">{booking.bookingId}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Information</h3>
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <p className="font-medium">${booking.totalPrice.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">
                              Method: {booking.paymentMethod || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer Information</h3>
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="font-medium">{booking.userName || "Not specified"}</p>
                        </div>
                        <div className="flex items-center mb-2">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="text-sm">{booking.contactEmail || booking.userEmail || "Not specified"}</p>
                        </div>
                        {booking.contactPhone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <p className="text-sm">{booking.contactPhone}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Campsite</h3>
                        {booking.campsiteId && booking.campsiteId !== 'UNASSIGNED' ? (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div className="flex flex-col">
                              <p className="font-medium">
                                {booking.campsite?.campsiteName || `Campsite ${booking.campsiteId}`}
                              </p>
                              {booking.campsite?.deviceId && (
                                <p className="text-xs text-muted-foreground">
                                  Device: {booking.campsite.deviceId}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                            <p className="text-sm">No campsite assigned</p>
                          </div>
                        )}
                      </div>

                      {booking.notes && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer Notes</h3>
                          <div className="bg-slate-50 border border-slate-100 rounded-md p-3 text-sm">
                            {booking.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* If booking is pending, show campsite assignment section */}
                {booking.status === 'pending' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Assign Campsite</CardTitle>
                      <CardDescription>
                        Assign a campsite to this booking to approve it
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {availableCampsites.length > 0 ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="campsite-select">Select Campsite</Label>
                            <Select
                              value={selectedCampsiteId || ""}
                              onValueChange={setSelectedCampsiteId}
                            >
                              <SelectTrigger id="campsite-select" className="w-full">
                                <SelectValue placeholder="Select a campsite" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableCampsites.map((campsite) => (
                                  <SelectItem key={campsite.campsiteId} value={campsite.campsiteId}>
                                    {campsite.campsiteName || `Campsite ${campsite.campsiteId}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="pt-4">
                            <Button
                              className="w-full"
                              disabled={!selectedCampsiteId || isProcessing}
                              onClick={handleAssignCampsite}
                            >
                              {isProcessing ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Map className="h-4 w-4 mr-2" />
                              )}
                              Assign Campsite & Approve Booking
                            </Button>
                          </div>
                        </>
                      ) : isCampsitesLoading ? (
                        <div className="py-4">
                          <Skeleton className="h-9 w-full rounded-md" />
                          <div className="text-center mt-2 text-sm text-muted-foreground">
                            Loading available campsites...
                          </div>
                        </div>
                      ) : (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>No campsites available</AlertTitle>
                          <AlertDescription>
                            There are no campsites available for this booking period. Please try another date range or free up a campsite.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right column - admin notes & actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Notes</CardTitle>
                    <CardDescription>Internal notes about this booking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Add notes about this booking (only visible to admins)"
                      className="min-h-[120px]"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                    />
                    <div className="text-xs text-muted-foreground mt-2">
                      These notes will be saved when you perform actions like assigning a campsite or rejecting the booking. 
                      You can also save them separately using the button below.
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={async () => {
                        // Get the token and ensure it exists
                        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                        if (!token) {
                          console.error("Authentication token not found for saving notes");
                          toast({
                            title: "Error",
                            description: "Authentication token not found. Please log in again.",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        try {
                          const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/bookings/${bookingId}/notes`;
                          console.log("Saving notes via:", apiUrl);
                          
                          // Create explicit headers with token
                          const headers = {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                          };
                          
                          const requestBody = { adminNotes };
                          console.log("Notes request body:", requestBody);
                          
                          const response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify(requestBody),
                            mode: 'cors',
                            credentials: 'include'
                          });
                          
                          console.log("Notes response status:", response.status);
                          
                          if (!response.ok) {
                            const errorText = await response.text().catch(() => "Unknown error");
                            console.error("Error saving notes:", errorText);
                            throw new Error(`Server responded with ${response.status}: ${errorText}`);
                          }
                          
                          toast({
                            title: "Success",
                            description: "Admin notes saved",
                          });
                        } catch (err: any) {
                          console.error("Error saving notes:", err);
                          toast({
                            title: "Error",
                            description: "Failed to save notes. Please try again.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      Save Notes
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>
                      Manage this booking
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      {booking.status === 'pending' && (
                        <>
                          <Button 
                            variant="destructive"
                            onClick={handleRejectBooking}
                            disabled={isProcessing}
                            className="w-full"
                          >
                            Reject Booking
                          </Button>
                        </>
                      )}

                      {(booking.status === 'approved' || booking.status === 'active') && (
                        <Button 
                          variant="destructive"
                          onClick={handleCancelBooking}
                          disabled={isProcessing}
                          className="w-full"
                        >
                          Cancel Booking
                        </Button>
                      )}

                      <Button variant="outline" asChild className="w-full">
                        <Link href={`/admin/dashboard/bookings`}>
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to All Bookings
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertTitle>Booking Not Found</AlertTitle>
              <AlertDescription>
                The requested booking could not be found. It may have been deleted or you may not have permission to view it.
                <div className="mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/admin/dashboard/bookings">
                      Back to All Bookings
                    </Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}