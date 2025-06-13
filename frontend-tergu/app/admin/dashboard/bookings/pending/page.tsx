"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarDays, Clock, User, Check, Eye } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

type BookingStatus = "pending" | "approved" | "rejected" | "cancelled" | "completed"

interface Booking {
  id: string
  siteNumber: number
  guestName: string
  startDate: string
  endDate: string
  status: BookingStatus
  totalAmount: number
  createdAt: string
}

export default function PendingBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingBooking, setProcessingBooking] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPendingBookings()
  }, [])

  const fetchPendingBookings = async () => {
    setLoading(true)
    try {
      // In a real app, replace with actual API call
      // const response = await fetch("/api/bookings/pending")
      // const data = await response.json()
      
      // Mock data for demonstration
      const mockData: Booking[] = [
        {
          id: "b001",
          siteNumber: 5,
          guestName: "John Smith",
          startDate: "2023-07-15",
          endDate: "2023-07-20",
          status: "pending",
          totalAmount: 250.00,
          createdAt: "2023-07-01T10:30:00Z"
        },
        {
          id: "b002",
          siteNumber: 12,
          guestName: "Sarah Johnson",
          startDate: "2023-07-18",
          endDate: "2023-07-25",
          status: "pending",
          totalAmount: 350.00,
          createdAt: "2023-07-02T14:15:00Z"
        },
        {
          id: "b003",
          siteNumber: 8,
          guestName: "Michael Brown",
          startDate: "2023-07-20",
          endDate: "2023-07-23",
          status: "pending",
          totalAmount: 150.00,
          createdAt: "2023-07-03T09:45:00Z"
        }
      ]
      
      setBookings(mockData)
      setError(null)
    } catch (err) {
      console.error("Error fetching pending bookings:", err)
      setError("Failed to load pending bookings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleApproveBooking = async (bookingId: string) => {
    setProcessingBooking(bookingId)
    try {
      // In a real app, replace with actual API call
      // await fetch(`/api/bookings/${bookingId}/approve`, { method: 'POST' })
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setBookings(bookings.filter(booking => booking.id !== bookingId))
      toast({
        title: "Booking Approved",
        description: "The booking has been successfully approved.",
      })
    } catch (err) {
      console.error("Error approving booking:", err)
      toast({
        title: "Error",
        description: "Failed to approve booking. Please try again.",
        variant: "destructive"
      })
    } finally {
      setProcessingBooking(null)
    }
  }

  const handleRejectBooking = async (bookingId: string) => {
    setProcessingBooking(bookingId)
    try {
      // In a real app, replace with actual API call
      // await fetch(`/api/bookings/${bookingId}/reject`, { method: 'POST' })
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setBookings(bookings.filter(booking => booking.id !== bookingId))
      toast({
        title: "Booking Rejected",
        description: "The booking has been rejected.",
      })
    } catch (err) {
      console.error("Error rejecting booking:", err)
      toast({
        title: "Error",
        description: "Failed to reject booking. Please try again.",
        variant: "destructive"
      })
    } finally {
      setProcessingBooking(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading pending bookings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Pending Bookings</h3>
        <p className="text-sm text-muted-foreground mt-1">
          There are no pending bookings that require your attention right now.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Pending Bookings</h1>
        <Button variant="outline" onClick={fetchPendingBookings}>
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>Site #{booking.siteNumber}</CardTitle>
                <Badge>{booking.status}</Badge>
              </div>
              <CardDescription>
                Requested on {new Date(booking.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-sm">{booking.guestName}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-sm">
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-sm">
                    {calculateDuration(booking.startDate, booking.endDate)} nights
                  </span>
                </div>
                <p className="font-medium mt-1">
                  ${booking.totalAmount.toFixed(2)}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              <Button 
                variant="ghost" 
                size="sm"
                asChild
              >
                <Link href={`/admin/dashboard/bookings/${booking.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRejectBooking(booking.id)}
                  disabled={processingBooking === booking.id}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApproveBooking(booking.id)}
                  disabled={processingBooking === booking.id}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}