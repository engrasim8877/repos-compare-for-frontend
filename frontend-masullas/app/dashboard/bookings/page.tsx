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
import { useTranslation } from "@/lib/translations"
import { BookingRequestForm } from "@/components/booking-request-form"

export default function BookingsPage() {
  const { toast } = useToast()
  const { t } = useTranslation()
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
        title: t('common.success'),
        description: t('dashboard.bookings.bookingDataRefreshed'),
      })
    } catch (err: any) {
      console.error("Error fetching bookings:", err)
      setError(err.message || "Failed to load booking data")
      toast({
        title: t('common.error'),
        description: t('dashboard.bookings.failedToLoadBookings'),
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
        title: t('common.success'),
        description: t('dashboard.bookings.bookingCancelledSuccess'),
      })
    } catch (err: any) {
      console.error("Error cancelling booking:", err)
      toast({
        title: t('common.error'),
        description: err.message || t('dashboard.bookings.failedToCancelBooking'),
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
    if (!dateString) return t('dashboard.bookings.notAvailable');
    try {
      return format(new Date(dateString), "PPP")
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return t('dashboard.bookings.invalidDate');
    }
  }

  const formatShortDate = (dateString: string | undefined | null): string => {
    if (!dateString) return t('dashboard.bookings.notAvailable');
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      console.error("Error formatting short date:", dateString, error);
      return t('dashboard.bookings.invalidDate');
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
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 border">{t('dashboard.bookings.pending')}</Badge>
      case "approved":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 border">{t('dashboard.bookings.approved')}</Badge>
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200 border">{t('dashboard.bookings.active')}</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 border">{t('dashboard.bookings.completed')}</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200 border">{t('dashboard.bookings.cancelled')}</Badge>
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
              <h1 className="text-2xl font-bold tracking-tight">{t('dashboard.bookings.title')}</h1>
              <p className="text-muted-foreground">{t('dashboard.bookings.subtitle')}</p>
            </div>
            
            <Button variant="gradient" size="sm" onClick={() => setShowRequestForm(true)}>
              <BadgePlus className="mr-2 h-4 w-4" />
              {t('dashboard.bookings.requestNewBooking')}
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
                  <SelectValue placeholder={t('dashboard.bookings.filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('dashboard.bookings.allBookings')}</SelectItem>
                  <SelectItem value="pending">{t('dashboard.bookings.pending')}</SelectItem>
                  <SelectItem value="approved">{t('dashboard.bookings.approved')}</SelectItem>
                  <SelectItem value="active">{t('dashboard.bookings.active')}</SelectItem>
                  <SelectItem value="completed">{t('dashboard.bookings.completed')}</SelectItem>
                  <SelectItem value="cancelled">{t('dashboard.bookings.cancelled')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchBookings}
              aria-label={t('dashboard.bookings.refreshBookings')}
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
              <AlertTitle>{t('common.error')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredBookings.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <CalendarDays className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('dashboard.bookings.noBookingsFound')}</h3>
                <p className="text-muted-foreground mb-4 text-center max-w-md">
                  {bookings.length === 0 
                    ? t('dashboard.bookings.noBookingsMessage')
                    : t('dashboard.bookings.noMatchingFilter')}
                </p>
                <Button variant="gradient" onClick={() => setShowRequestForm(true)}>
                  <BadgePlus className="mr-2 h-4 w-4" />
                  {t('dashboard.bookings.requestNewBooking')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="block lg:hidden space-y-4">
                {filteredBookings.map((booking) => (
                  <Card key={booking.bookingId} className="shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm">
                            {t('dashboard.bookings.bookingId')} #{booking.bookingId.slice(-6)}
                          </h3>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 pb-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="text-sm">
                          <span className="font-medium">{formatShortDate(booking.startDate)}</span>
                          <span className="text-muted-foreground mx-2">→</span>
                          <span className="font-medium">{formatShortDate(booking.endDate)}</span>
                        </div>
                      </div>
                      
                      {booking.campsite?.campsiteName && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{booking.campsite.campsiteName}</span>
                        </div>
                      )}
                      
                      {booking.totalPrice && (
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{formatCurrency(booking.totalPrice)}</span>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="pt-0 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedBooking(booking)
                          setShowDetailsDialog(true)
                        }}
                      >
                        {t('dashboard.bookings.viewDetails')}
                      </Button>
                      
                      {(booking.status === "pending" || booking.status === "approved") && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" 
                          onClick={() => {
                            setSelectedBooking(booking)
                            setShowCancelDialog(true)
                          }}
                        >
                          {t('dashboard.bookings.cancel')}
                        </Button>
                      )}
                      
                      {booking.status === "active" && (
                        <Link href="/dashboard/controls" className="flex-1">
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="w-full"
                          >
                            {t('dashboard.bookings.controls')}
                          </Button>
                        </Link>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden lg:block w-full overflow-hidden rounded-md border bg-white">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] min-w-[100px]">{t('dashboard.bookings.bookingId')}</TableHead>
                        <TableHead className="w-[120px] min-w-[120px]">{t('dashboard.bookings.status')}</TableHead>
                        <TableHead className="min-w-[200px]">{t('dashboard.bookings.dates')}</TableHead>
                        <TableHead className="w-[200px] min-w-[200px] text-right">{t('dashboard.bookings.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow key={booking.bookingId}>
                          <TableCell className="font-medium whitespace-nowrap">
                            #{booking.bookingId.slice(-6)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm font-medium">{formatShortDate(booking.startDate)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground ml-6">{t('dashboard.bookings.to')}</span>
                                <span className="text-sm">{formatShortDate(booking.endDate)}</span>
                              </div>
                              {booking.campsite?.campsiteName && (
                                <div className="flex items-center gap-2 mt-1">
                                  <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                  <span className="text-xs text-muted-foreground truncate">{booking.campsite.campsiteName}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col gap-2 items-end min-w-0">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="w-full max-w-[140px] text-xs h-7"
                                onClick={() => {
                                  setSelectedBooking(booking)
                                  setShowDetailsDialog(true)
                                }}
                              >
                                {t('dashboard.bookings.viewDetails')}
                              </Button>
                              
                              {(booking.status === "pending" || booking.status === "approved") && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="w-full max-w-[140px] text-xs h-7 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" 
                                  onClick={() => {
                                    setSelectedBooking(booking)
                                    setShowCancelDialog(true)
                                  }}
                                >
                                  {t('dashboard.bookings.cancel')}
                                </Button>
                              )}
                              
                              {booking.status === "active" && (
                                <Link href="/dashboard/controls" className="w-full max-w-[140px]">
                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    className="w-full text-xs h-7"
                                  >
                                    {t('dashboard.bookings.controls')}
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
              </div>
            </>
          )}
        </div>
        
        {/* Booking Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="pb-3 sm:pb-4">
              <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg">
                <span className="truncate">{t('dashboard.bookings.bookingId')} #{selectedBooking?.bookingId.slice(-6)}</span>
                <span className="mt-2 sm:mt-0 sm:ml-2">
                  {selectedBooking && getStatusBadge(selectedBooking.status)}
                </span>
              </DialogTitle>
              <DialogDescription className="text-sm">
                {t('dashboard.bookings.bookingDetailsTitle')}
              </DialogDescription>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-2 md:mt-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">{t('dashboard.bookings.bookingInformation')}</h3>
                  <div className="space-y-3 md:space-y-4 text-[13px] sm:text-sm">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{t('dashboard.bookings.datesLabel')}</p>
                        <p className="text-muted-foreground">
                          {formatDate(selectedBooking.startDate)} - {formatDate(selectedBooking.endDate)}
                        </p>
                        {selectedBooking.durationDays !== undefined && (
                          <p className="text-muted-foreground">
                            ({selectedBooking.durationDays} {t('dashboard.bookings.daysLabel')})
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 sm:gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{t('dashboard.bookings.campsiteLabel')}</p>
                        <p className="text-muted-foreground">
                          {selectedBooking.campsite?.campsiteName || t('dashboard.bookings.pendingAssignment')}
                        </p>
                        {selectedBooking.preferredCampsiteId && !selectedBooking.campsiteId && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('dashboard.bookings.preferred')}: {t('dashboard.bookings.campsiteLabel')} {selectedBooking.preferredCampsiteId}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 sm:gap-3">
                      <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{t('dashboard.bookings.paymentDetails')}</p>
                        <p className="text-muted-foreground">
                          {formatCurrency(selectedBooking.totalPrice)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('dashboard.bookings.paymentMethod')}: {selectedBooking.paymentMethod || t('dashboard.bookings.notAvailable')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedBooking.adminNotes && (
                    <div className="mt-4 md:mt-6">
                      <h3 className="text-sm font-medium mb-2">{t('dashboard.bookings.adminNotes')}</h3>
                      <div className="p-2 sm:p-3 bg-muted rounded-md text-[13px] sm:text-sm">
                        {selectedBooking.adminNotes}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 md:mt-0">
                  <h3 className="text-sm font-medium mb-2">{t('dashboard.bookings.requestTimeline')}</h3>
                  <div className="space-y-3 text-[13px] sm:text-sm">
                    {(selectedBooking.requestedAt || selectedBooking.createdAt) && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <FileText className="h-3 w-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('dashboard.bookings.bookingRequested')}</p>
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
                          <p className="text-sm font-medium">{t('dashboard.bookings.bookingApproved')}</p>
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
                          <p className="text-sm font-medium">{t('dashboard.bookings.bookingActivated')}</p>
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
                          <p className="text-sm font-medium">{t('dashboard.bookings.bookingCancelled')}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(selectedBooking.cancelledAt || selectedBooking.updatedAt)}
                          </p>
                          {selectedBooking.cancellationReason && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {t('dashboard.bookings.reason')}: {selectedBooking.cancellationReason}
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
                          <p className="text-sm font-medium">{t('dashboard.bookings.bookingCompleted')}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(selectedBooking.endDate)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {selectedBooking.notes && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">{t('dashboard.bookings.yourNotes')}</h3>
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
                    {t('dashboard.bookings.cancelBooking')}
                  </Button>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowDetailsDialog(false)}
                className="w-full sm:w-auto"
              >
                {t('dashboard.bookings.close')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Booking Request Form Dialog */}
        <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>{t('dashboard.bookings.requestNewBookingTitle')}</DialogTitle>
              <DialogDescription>
                {t('dashboard.bookings.requestFormDescription')}
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
                {bookingStatus?.success ? t('dashboard.bookings.bookingSuccessful') : t('dashboard.bookings.bookingFailed')}
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
                  <AlertTitle>{t('dashboard.bookings.errorDetails')}</AlertTitle>
                  <AlertDescription>{bookingStatus.details}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={() => setShowStatusDialog(false)} className="w-full">
                {bookingStatus?.success ? t('dashboard.bookings.viewMyBookings') : t('dashboard.bookings.tryAgain')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Confirmation Dialog for Cancellation */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent className="max-w-md p-4 sm:p-6">
            <AlertDialogHeader>
              <AlertDialogTitle>{t('dashboard.bookings.cancelBookingTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('dashboard.bookings.cancelConfirmation')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('dashboard.bookings.keepBooking')}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => handleCancelBooking(selectedBooking?.bookingId)}
                disabled={isCancelling}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
              >
                {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('dashboard.bookings.yesCancelBooking')}
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
    <>
      {/* Mobile Card Skeleton */}
      <div className="block lg:hidden space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-4 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter className="pt-0 gap-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Desktop Table Skeleton */}
      <div className="hidden lg:block w-full overflow-hidden rounded-md border bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] min-w-[100px]">
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead className="w-[120px] min-w-[120px]">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="min-w-[200px]">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead className="w-[200px] min-w-[200px]">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col gap-2 items-end">
                      <Skeleton className="h-7 w-[140px]" />
                      <Skeleton className="h-7 w-[140px]" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
} 