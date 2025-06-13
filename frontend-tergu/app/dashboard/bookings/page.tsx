"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  CalendarDays, 
  AlertTriangle, 
  BadgePlus, 
  Calendar, 
  MapPin, 
  CreditCard,
  Clock,
  FileText,
  UserCheck,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthGuard } from "@/components/auth-guard"
import { getAuthHeaders } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { BookingRequestForm } from "@/components/booking-request-form"

export default function BookingsPage() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState<any[]>([])
  const [filteredBookings, setFilteredBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<{
    success: boolean;
    message: string;
    details?: string;
  } | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    // Filter bookings based on status
    let filtered = [...bookings]
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status.toLowerCase() === statusFilter)
    }
    
    setFilteredBookings(filtered)
  }, [bookings, statusFilter])

  const fetchBookings = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch bookings")
      }

      const data = await response.json()
      
      // Sort bookings by date (most recent first)
      const sortedBookings = (data.bookings || []).sort((a: any, b: any) => {
        return new Date(b.requestedAt || b.createdAt).getTime() - 
               new Date(a.requestedAt || a.createdAt).getTime()
      })
      
      setBookings(sortedBookings)
      setFilteredBookings(sortedBookings)
      
      toast({
        title: "Success",
        description: "Booking data refreshed successfully.",
      })
    } catch (err: any) {
      console.error("Error fetching bookings:", err)
      setError(err.message || "Failed to load booking data")
      toast({
        title: "Error",
        description: "Failed to load your bookings. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    setIsCancelling(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          reason: "User cancelled booking"
        })
      })

      if (!response.ok) {
        throw new Error("Failed to cancel booking")
      }

      // Close dialogs
      setShowCancelDialog(false)
      setShowDetailsDialog(false)
      
      // Refresh bookings list
      await fetchBookings()
      
      toast({
        title: "Success",
        description: "Your booking has been cancelled successfully.",
      })
    } catch (err: any) {
      console.error("Error cancelling booking:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to cancel booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  const handleBookingCreated = (success: boolean, message: string, details?: string) => {
    // Close the booking form
    setShowRequestForm(false)
    
    // Set the booking status for the dialog
    setBookingStatus({
      success,
      message,
      details
    })
    
    // Show the status dialog
    setShowStatusDialog(true)
    
    // If successful, refresh bookings list
    if (success) {
      fetchBookings()
    }
  }

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), "PPP")
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return 'Invalid Date';
    }
  }

  const formatShortDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      console.error("Error formatting short date:", dateString, error);
      return 'Invalid Date';
    }
  }

  const formatCurrency = (amount: number | undefined | null): string => {
    if (amount === null || amount === undefined) return '$--.--';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 border">Pending</Badge>
      case "approved":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 border">Approved</Badge>
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200 border">Active</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 border">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200 border">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="flex flex-col gap-6 max-w-7xl mx-auto p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
              <p className="text-muted-foreground">View and manage your campsite booking requests</p>
            </div>
            
            <Button variant="gradient" size="sm" onClick={() => setShowRequestForm(true)}>
              <BadgePlus className="mr-2 h-4 w-4" />
              Request New Booking
            </Button>
          </div>
          
          {/* Simplified Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bookings</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchBookings}
              aria-label="Refresh bookings"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Content */}
          {isLoading ? (
            <BookingsTableSkeleton />
          ) : error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredBookings.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <CalendarDays className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
                <p className="text-muted-foreground mb-4 text-center max-w-md">
                  {bookings.length === 0 
                    ? "You haven't requested any campsite bookings yet. Create your first booking to get started."
                    : "No bookings match your current filter. Try adjusting your filter or view all bookings."}
                </p>
                <Button variant="gradient" onClick={() => setShowRequestForm(true)}>
                  <BadgePlus className="mr-2 h-4 w-4" />
                  Request New Booking
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Booking ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Dates</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.bookingId}>
                      <TableCell className="font-medium">
                        #{booking.bookingId.slice(-6)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm">{formatShortDate(booking.startDate)}</span>
                          <span className="text-xs text-muted-foreground">to</span>
                          <span className="text-sm">{formatShortDate(booking.endDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex sm:flex-col gap-2 items-center sm:items-end justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 px-2 sm:px-3 w-auto whitespace-nowrap"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowDetailsDialog(true)
                            }}
                          >
                            View Details
                          </Button>
                          
                          {(booking.status === "pending" || booking.status === "approved") && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 px-2 sm:px-3 w-auto text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 whitespace-nowrap" 
                              onClick={() => {
                                setSelectedBooking(booking)
                                setShowCancelDialog(true)
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                          
                          {booking.status === "active" && (
                            <Link href="/dashboard/controls">
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="h-8 px-2 sm:px-3 w-auto whitespace-nowrap"
                              >
                                Controls
                              </Button>
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        {/* Booking Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-3 sm:p-6">
            <DialogHeader className="pb-2 sm:pb-4">
              <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg">
                <span>Booking #{selectedBooking?.bookingId.slice(-6)}</span>
                <span className="mt-2 sm:mt-0 sm:ml-2">
                  {selectedBooking && getStatusBadge(selectedBooking.status)}
                </span>
              </DialogTitle>
              <DialogDescription>
                Booking details and information
              </DialogDescription>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-2 md:mt-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Booking Information</h3>
                  <div className="space-y-3 md:space-y-4 text-[13px] sm:text-sm">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Dates</p>
                        <p className="text-muted-foreground">
                          {formatDate(selectedBooking.startDate)} - {formatDate(selectedBooking.endDate)}
                        </p>
                        {selectedBooking.durationDays !== undefined && (
                          <p className="text-muted-foreground">
                            ({selectedBooking.durationDays} days)
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 sm:gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Campsite</p>
                        <p className="text-muted-foreground">
                          {selectedBooking.campsite?.campsiteName || "Pending Assignment"}
                        </p>
                        {selectedBooking.preferredCampsiteId && !selectedBooking.campsiteId && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Preferred: Campsite {selectedBooking.preferredCampsiteId}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 sm:gap-3">
                      <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Payment Details</p>
                        <p className="text-muted-foreground">
                          {formatCurrency(selectedBooking.totalPrice)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Payment Method: {selectedBooking.paymentMethod || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedBooking.adminNotes && (
                    <div className="mt-4 md:mt-6">
                      <h3 className="text-sm font-medium mb-2">Admin Notes</h3>
                      <div className="p-2 sm:p-3 bg-muted rounded-md text-[13px] sm:text-sm">
                        {selectedBooking.adminNotes}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 md:mt-0">
                  <h3 className="text-sm font-medium mb-2">Request Timeline</h3>
                  <div className="space-y-3 text-[13px] sm:text-sm">
                    {(selectedBooking.requestedAt || selectedBooking.createdAt) && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <FileText className="h-3 w-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Booking Requested</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(selectedBooking.requestedAt || selectedBooking.createdAt)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {(selectedBooking.status !== "pending" && (selectedBooking.approvedAt || selectedBooking.updatedAt)) && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <UserCheck className="h-3 w-3 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Booking Approved</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(selectedBooking.approvedAt || selectedBooking.updatedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {(selectedBooking.status === "active" && selectedBooking.startDate) && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <Clock className="h-3 w-3 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Booking Activated</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(selectedBooking.startDate)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {(selectedBooking.status === "cancelled" && (selectedBooking.cancelledAt || selectedBooking.updatedAt)) && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Booking Cancelled</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(selectedBooking.cancelledAt || selectedBooking.updatedAt)}
                          </p>
                          {selectedBooking.cancellationReason && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Reason: {selectedBooking.cancellationReason}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {(selectedBooking.status === "completed" && selectedBooking.endDate) && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <Clock className="h-3 w-3 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Booking Completed</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(selectedBooking.endDate)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {selectedBooking.notes && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">Your Notes</h3>
                      <div className="p-3 bg-muted rounded-md text-sm">
                        {selectedBooking.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between mt-6">
              <div>
                {selectedBooking && (selectedBooking.status === "pending" || selectedBooking.status === "approved") && (
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 w-full sm:w-auto"
                    onClick={() => {
                      setShowDetailsDialog(false)
                      setShowCancelDialog(true)
                    }}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowDetailsDialog(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Booking Request Form Dialog */}
        <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Request New Booking</DialogTitle>
              <DialogDescription>
                Fill out the form below to request a new campsite booking
              </DialogDescription>
            </DialogHeader>
            <BookingRequestForm onBookingCreated={handleBookingCreated} onCancel={() => setShowRequestForm(false)} />
          </DialogContent>
        </Dialog>
        
        {/* Booking Status Dialog */}
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader className="items-center text-center pt-4 pb-0">
              <DialogTitle className="text-xl font-semibold mb-2">
                {bookingStatus?.success ? "Booking Successful" : "Booking Failed"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center pb-4 pt-0">
              {bookingStatus?.success ? (
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              ) : (
                <div className="rounded-full bg-red-100 p-3 mb-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              )}
              
              <p className="text-center mb-4 text-muted-foreground">
                {bookingStatus?.message}
              </p>
              
              {bookingStatus?.details && !bookingStatus.success && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error Details</AlertTitle>
                  <AlertDescription>{bookingStatus.details}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={() => setShowStatusDialog(false)} className="w-full">
                {bookingStatus?.success ? "View My Bookings" : "Try Again"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Confirmation Dialog for Cancellation */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent className="max-w-md p-4 sm:p-6">
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Booking</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => handleCancelBooking(selectedBooking?.bookingId)}
                disabled={isCancelling}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
              >
                {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Yes, Cancel Booking
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DashboardLayout>
    </AuthGuard>
  )
}

function BookingsTableSkeleton() {
  return (
    <div className="space-y-2">
      <div className="rounded-md border">
        <div className="p-4 border-b">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="hidden md:block h-5 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        <div className="p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-3 md:grid-cols-4 gap-4 py-3 border-b last:border-0">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="hidden md:block h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 