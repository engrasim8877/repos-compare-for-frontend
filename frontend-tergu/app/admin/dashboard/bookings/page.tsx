"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminLayout } from "@/components/admin-layout";
import { AuthGuard } from "@/components/auth-guard";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  MapPin,
  User,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Loader2,
  AlertCircle,
  Check,
  AlertTriangle,
  Home,
} from "lucide-react";

// Supported booking statuses
type BookingStatus =
  | "pending"
  | "approved"
  | "active"
  | "completed"
  | "cancelled"
  | "rejected"
  | "notice";

interface Booking {
  bookingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  contactPhone?: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  totalPrice: number;
  campsiteId: string;
  campsite?: {
    campsiteName: string;
    deviceId: string;
    status: string;
    deviceStatus: string;
  };
  requestedAt: string;
  lastUpdated: string;
  adminNotes?: string;
  durationDays: number;
}

interface Campsite {
  campsiteId: string;
  campsiteName: string;
  deviceId?: string;
  status: string;
  deviceStatus: string;
  nextAvailable?: string;
  currentBooking?: {
    endDate: string;
    userName: string;
  };
}

interface BookingConflict {
  bookingId: string;
  campsiteId: string;
  startDate: string;
  endDate: string;
  userName: string;
}

interface ApiError {
  code: string;
  message: string;
  conflicts?: BookingConflict[];
  suggestions?: {
    campsiteId: string;
    availableFrom: string;
  }[];
}

export default function BookingsManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // Main state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  
  // Action dialogs state
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string>("");
  const [confirmMessage, setConfirmMessage] = useState<string>("");
  const [confirmBooking, setConfirmBooking] = useState<Booking | null>(null);
  
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Campsite assignment state
  const [availableCampsites, setAvailableCampsites] = useState<Campsite[]>([]);
  const [selectedCampsiteId, setSelectedCampsiteId] = useState<string | null>(null);
  const [isCampsitesLoading, setIsCampsitesLoading] = useState(false);

  // Fetch bookings when status filter changes
  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/bookings?${params}`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`Failed to fetch bookings: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      setError(err.message || "Failed to load bookings");
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Dialog open handlers
  const openConfirmDialog = (booking: Booking, action: string, message: string) => {
    setConfirmBooking(booking);
    setConfirmAction(action);
    setConfirmMessage(message);
    setIsConfirmDialogOpen(true);
  };
  
  const openRejectDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedBookingId(booking.bookingId);
    setAdminNotes("");
    setIsRejectDialogOpen(true);
  };

  const openCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedBookingId(booking.bookingId);
    setAdminNotes("");
    setIsCancelDialogOpen(true);
  };
  
  const openAssignDialog = async (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedBookingId(booking.bookingId);
    setAdminNotes("");
    setSelectedCampsiteId(null);
    setIsAssignDialogOpen(true);
    
    await fetchAvailableCampsites(booking.startDate, booking.endDate);
  };

  // Fetch available campsites for the booking period
  const fetchAvailableCampsites = async (startDate: string, endDate: string) => {
    setIsCampsitesLoading(true);
    setError(null);
    
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/campsites/available?startDate=${startDate}&endDate=${endDate}`;
      
      const response = await fetch(apiUrl, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({ 
          code: "UNKNOWN_ERROR",
          message: "Unknown error occurred" 
        }));

        // Handle conflicts if they exist
        if (errorData.conflicts && errorData.conflicts.length > 0) {
          const conflictMessages = errorData.conflicts.map(conflict => 
            `Booking conflict with ${conflict.userName} (${formatDate(conflict.startDate)} - ${formatDate(conflict.endDate)})`
          );
          
          toast({
            title: "Booking Conflicts Detected",
            description: (
              <div className="mt-2 space-y-2">
                {conflictMessages.map((msg, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span>{msg}</span>
                  </div>
                ))}
              </div>
            ),
            variant: "destructive",
          });
        }

        // Show alternative suggestions if available
        if (errorData.suggestions && errorData.suggestions.length > 0) {
          const suggestionMessages = errorData.suggestions.map(suggestion => 
            `${suggestion.campsiteId} (available from ${formatDate(suggestion.availableFrom)})`
          );
          
          toast({
            title: "Alternative Options Available",
            description: (
              <div className="mt-2">
                <p>Consider these alternatives:</p>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  {suggestionMessages.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            ),
            variant: "default",
          });
        }

        throw new Error(errorData.message || `Error ${response.status}: Failed to fetch available campsites`);
      }
      
      const data = await response.json();
      setAvailableCampsites(data.campsites || []);
    } catch (err: any) {
      console.error("Error fetching available campsites:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to load available campsites. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCampsitesLoading(false);
    }
  };

  // API action handlers
  const handleApproveBooking = async () => {
    if (!selectedBooking || !selectedCampsiteId) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/bookings/${selectedBooking.bookingId}/approve`,
        {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campsiteId: selectedCampsiteId,
            adminNotes: adminNotes.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        
        // Handle booking conflicts
        if (errorData.conflicts && errorData.conflicts.length > 0) {
          const conflictMessages = errorData.conflicts.map(conflict => 
            `Booking conflict with ${conflict.userName} (${formatDate(conflict.startDate)} - ${formatDate(conflict.endDate)})`
          );
          
          toast({
            title: "Cannot Approve Booking",
            description: (
              <div className="mt-2 space-y-2">
                <p>There are conflicts with existing bookings:</p>
                {conflictMessages.map((msg, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span>{msg}</span>
                  </div>
                ))}
              </div>
            ),
            variant: "destructive",
          });

          // If there are alternative suggestions, show them
          if (errorData.suggestions && errorData.suggestions.length > 0) {
            const suggestionMessages = errorData.suggestions.map(suggestion => 
              `${suggestion.campsiteId} (available from ${formatDate(suggestion.availableFrom)})`
            );
            
            toast({
              title: "Alternative Options",
              description: (
                <div className="mt-2">
                  <p>Consider these alternatives:</p>
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    {suggestionMessages.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </div>
              ),
              variant: "default",
            });
          }

          throw new Error(errorData.message || "Failed to approve booking due to conflicts");
        }

        throw new Error(errorData.message || "Failed to approve booking");
      }

      const data = await response.json();
      
      // Update the bookings list with the new data
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.bookingId === data.booking.bookingId ? data.booking : booking
        )
      );

      setIsAssignDialogOpen(false);
      setSelectedBooking(null);
      setSelectedBookingId(null);
      setAdminNotes("");
      setSelectedCampsiteId(null);

      toast({
        title: "Success",
        description: "Booking has been approved successfully.",
        variant: "default",
      });

    } catch (err: any) {
      console.error("Error approving booking:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to approve booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectBooking = async () => {
    if (!selectedBookingId) return;
    
    setIsProcessing(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/bookings/${selectedBookingId}/reject`,
        {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ adminNotes })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `Error ${response.status}: Failed to reject booking`);
      }

      toast({
        title: "Success",
        description: "Booking has been rejected"
      });

      // Refresh bookings list and close dialog
      fetchBookings();
      setIsRejectDialogOpen(false);
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
    if (!selectedBookingId) return;
    
    setIsProcessing(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/bookings/${selectedBookingId}/cancel`,
        {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ adminNotes })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `Error ${response.status}: Failed to cancel booking`);
      }

      toast({
        title: "Success",
        description: "Booking has been cancelled"
      });

      // Refresh bookings list and close dialog
      fetchBookings();
      setIsCancelDialogOpen(false);
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

  const getStatusBadge = (status: BookingStatus) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
      notice: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
      approved: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
      active: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
      completed: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200" },
      cancelled: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" },
      rejected: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={cn(config.bg, config.text, "border", config.border)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Helper functions for UI display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };
  
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "MMM d, h:mm a");
  };

  // Helper to derive the correct action buttons for each booking status
  const getBookingActions = (booking: Booking) => {
    switch (booking.status) {
      case "pending":
      case "notice":
        return (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={() => openAssignDialog(booking)}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm" 
              onClick={() => openConfirmDialog(
                booking, 
                "reject",
                "Are you sure you want to reject this booking request?"
              )}
            >
              Reject
            </Button>
          </>
        );
        
      case "approved":
      case "active":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openConfirmDialog(
              booking, 
              "cancel",
              "Are you sure you want to cancel this active booking?"
            )}
          >
            Cancel
          </Button>
        );
        
      default:
        return null;
    }
  };

  // Helper function for handling dialog confirmations
  const handleConfirmAction = (action: string) => {
    if (!confirmBooking) return;
    
    if (action === "reject") {
      openRejectDialog(confirmBooking);
    } else if (action === "cancel") {
      openCancelDialog(confirmBooking);
    }
    
    setIsConfirmDialogOpen(false);
  };

  // Import cn from utility library
  const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="container py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Booking Management</h1>
              <p className="text-muted-foreground">
                View and manage all campsite bookings
              </p>
            </div>
            <Button onClick={fetchBookings} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Status Filter */}
          <Card className="border-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Filter Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <div>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Bookings</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="notice">Notice</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Table */}
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
              <CardDescription>
                {bookings.length} bookings found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-4">
                      <div className="w-12 h-6 bg-muted animate-pulse rounded" />
                      <div className="h-6 bg-muted animate-pulse rounded w-32" />
                      <div className="h-6 bg-muted animate-pulse rounded w-24" />
                      <div className="h-6 bg-muted animate-pulse rounded w-40" />
                      <div className="h-6 bg-muted animate-pulse rounded w-32" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <AlertTriangle className="mx-auto h-8 w-8 text-yellow-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Error Loading Bookings</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={fetchBookings} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-8 text-center">
                  <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Bookings Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {statusFilter !== "all" 
                      ? `No ${statusFilter} bookings found` 
                      : "There are no bookings in the system yet"}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10"></TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <React.Fragment key={booking.bookingId}>
                            <TableRow>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    setExpandedBooking(
                                      expandedBooking === booking.bookingId
                                        ? null
                                        : booking.bookingId
                                    )
                                  }
                                >
                                  {expandedBooking === booking.bookingId ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </TableCell>
                              <TableCell>{getStatusBadge(booking.status)}</TableCell>
                              <TableCell className="font-medium">
                                #{booking.bookingId.slice(-6)}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">{booking.userName}</span>
                                  <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                    {booking.userEmail}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>{formatDate(booking.startDate)}</span>
                                  <span className="text-xs text-muted-foreground">
                                    to {formatDate(booking.endDate)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getBookingActions(booking)}
                                </div>
                              </TableCell>
                            </TableRow>
                            {expandedBooking === booking.bookingId && (
                              <TableRow className="bg-muted/30">
                                <TableCell colSpan={6} className="p-0">
                                  <div className="py-4 px-2 sm:px-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      {/* Customer Information */}
                                      <Card>
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-sm">Customer Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                          <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{booking.userName}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm break-all">{booking.userEmail}</span>
                                          </div>
                                          {booking.contactPhone && (
                                            <div className="flex items-center gap-2">
                                              <Phone className="h-4 w-4 text-muted-foreground" />
                                              <span className="text-sm">{booking.contactPhone}</span>
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>

                                      {/* Booking Details */}
                                      <Card>
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-sm">Booking Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                          <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                            <div className="flex flex-col">
                                              <span className="text-sm font-medium">
                                                Duration: {booking.durationDays} days
                                              </span>
                                              <span className="text-xs text-muted-foreground">
                                                {formatDate(booking.startDate)} - {" "}
                                                {formatDate(booking.endDate)}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <Home className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                              {booking.campsite?.campsiteName || "No campsite assigned"}
                                            </span>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <div className="flex flex-col">
                                              <span className="text-sm">
                                                Requested: {formatDateTime(booking.requestedAt)}
                                              </span>
                                              <span className="text-xs text-muted-foreground">
                                                Last Updated: {formatDateTime(booking.lastUpdated)}
                                              </span>
                                            </div>
                                          </div>
                                          
                                          <div className="flex items-center gap-2 mt-2">
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">
                                              Total: ${booking.totalPrice.toFixed(2)}
                                            </span>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      {/* Admin Notes */}
                                      <Card>
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-sm">Admin Notes</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          {booking.adminNotes ? (
                                            <p className="text-sm whitespace-pre-wrap">{booking.adminNotes}</p>
                                          ) : (
                                            <p className="text-sm text-muted-foreground italic">No admin notes</p>
                                          )}
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {confirmMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={confirmAction === "reject" || confirmAction === "cancel" ? "destructive" : "default"}
              onClick={() => handleConfirmAction(confirmAction)}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign & Approve Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Approve Booking</DialogTitle>
            <DialogDescription>
              {selectedBooking && (
                <>
                  Booking #{selectedBooking.bookingId.slice(-6)} for {selectedBooking.userName}
                  <br />
                  <span className="text-sm text-muted-foreground mt-1 block">
                    {formatDate(selectedBooking.startDate)} - {formatDate(selectedBooking.endDate)}
                    {" "}({selectedBooking.durationDays} days)
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {isCampsitesLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading available campsites...</p>
              </div>
            ) : availableCampsites.length === 0 ? (
              <div className="text-center py-6 space-y-4">
                <AlertCircle className="mx-auto h-10 w-10 text-amber-500" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No Campsites Available</h3>
                  <p className="text-sm text-muted-foreground">
                    There are no available campsites for the requested booking period.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="campsite-select" className="block text-sm font-medium">
                      Select Campsite
                    </label>
                    <Select
                      value={selectedCampsiteId || ""}
                      onValueChange={setSelectedCampsiteId}
                    >
                      <SelectTrigger id="campsite-select">
                        <SelectValue placeholder="Select a campsite" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCampsites.map((campsite) => (
                          <SelectItem 
                            key={campsite.campsiteId} 
                            value={campsite.campsiteId}
                            className="flex flex-col space-y-1 py-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {campsite.campsiteName || `Campsite ${campsite.campsiteId}`}
                              </span>
                              <Badge 
                                variant={campsite.deviceStatus === "online" ? "default" : "destructive"}
                                className="ml-2"
                              >
                                {campsite.deviceStatus}
                              </Badge>
                            </div>
                            {campsite.currentBooking && (
                              <p className="text-xs text-muted-foreground">
                                Current booking ends: {formatDate(campsite.currentBooking.endDate)}
                              </p>
                            )}
                            {campsite.nextAvailable && (
                              <p className="text-xs text-muted-foreground">
                                Next available: {formatDate(campsite.nextAvailable)}
                              </p>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCampsiteId && (
                    <div className="rounded-lg border p-4 space-y-3">
                      <h4 className="font-medium">Selected Campsite Details</h4>
                      {(() => {
                        const selected = availableCampsites.find(c => c.campsiteId === selectedCampsiteId);
                        if (!selected) return null;
                        
                        return (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Device Status</span>
                              <Badge variant={selected.deviceStatus === "online" ? "default" : "destructive"}>
                                {selected.deviceStatus}
                              </Badge>
                            </div>
                            {selected.currentBooking && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Current Booking</span>
                                <span className="text-sm">
                                  Ends {formatDate(selected.currentBooking.endDate)}
                                </span>
                              </div>
                            )}
                            {selected.nextAvailable && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Next Available</span>
                                <span className="text-sm">{formatDate(selected.nextAvailable)}</span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                
                  <div className="space-y-2">
                    <label htmlFor="adminNotes" className="block text-sm font-medium">
                      Admin Notes (Optional)
                    </label>
                    <Textarea
                      id="adminNotes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add any notes about this booking approval"
                      className="h-20"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleApproveBooking}
              disabled={!selectedCampsiteId || isProcessing || isCampsitesLoading}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Approve</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Booking Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Booking Request</DialogTitle>
            <DialogDescription>
              {selectedBooking && (
                <>
                  Booking #{selectedBooking.bookingId.slice(-6)} for {selectedBooking.userName}
                  <br />
                  <span className="text-sm text-muted-foreground mt-1 block">
                    {formatDate(selectedBooking.startDate)} - {formatDate(selectedBooking.endDate)}
                  </span>
                </>
              )}
              <span className="block mt-2">
                Please provide a reason for rejecting this booking request.
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <label htmlFor="reject-notes" className="text-sm font-medium mb-2 block">
              Rejection Reason <span className="text-destructive">*</span>
            </label>
            <Textarea 
              id="reject-notes"
              placeholder="Enter rejection reason..."
              className="h-[120px]"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={handleRejectBooking} 
              variant="destructive" 
              disabled={!adminNotes.trim() || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Reject Booking</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Active Booking</DialogTitle>
            <DialogDescription>
              {selectedBooking && (
                <>
                  Booking #{selectedBooking.bookingId.slice(-6)} for {selectedBooking.userName}
                  <br />
                  <span className="text-sm text-muted-foreground mt-1 block">
                    {formatDate(selectedBooking.startDate)} - {formatDate(selectedBooking.endDate)}
                  </span>
                  {selectedBooking.campsite && (
                    <span className="text-sm text-muted-foreground mt-1 block">
                      Campsite: {selectedBooking.campsite.campsiteName}
                    </span>
                  )}
                </>
              )}
              <span className="block mt-2">
                Please provide a reason for cancelling this booking.
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <label htmlFor="cancel-notes" className="text-sm font-medium mb-2 block">
              Cancellation Reason <span className="text-destructive">*</span>
            </label>
            <Textarea 
              id="cancel-notes"
              placeholder="Enter cancellation reason..."
              className="h-[120px]"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={handleCancelBooking} 
              variant="destructive" 
              disabled={!adminNotes.trim() || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Cancel Booking</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthGuard>
  );
}