"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarCheck, Clock, User, Check, MapPin, Phone } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface CheckIn {
  id: string
  bookingId: string
  siteNumber: number
  guestName: string
  guestEmail: string
  guestPhone: string
  expectedArrival: string
  checkInTime: string | null
  adults: number
  children: number
  vehiclePlate: string
  status: "pending" | "completed"
}

export default function TodayCheckInsPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingCheckIn, setProcessingCheckIn] = useState<string | null>(null)
  const { toast } = useToast()
  
  useEffect(() => {
    fetchTodayCheckIns()
  }, [])

  const fetchTodayCheckIns = async () => {
    setLoading(true)
    try {
      // In a real app, replace with actual API call
      // const response = await fetch("/api/check-ins/today")
      // const data = await response.json()
      
      // Mock data for demonstration
      const mockData: CheckIn[] = [
        {
          id: "ci001",
          bookingId: "b101",
          siteNumber: 7,
          guestName: "Robert Miller",
          guestEmail: "robert.miller@example.com",
          guestPhone: "+1 (555) 123-4567",
          expectedArrival: "2023-07-15T14:00:00Z",
          checkInTime: null,
          adults: 2,
          children: 1,
          vehiclePlate: "ABC123",
          status: "pending"
        },
        {
          id: "ci002",
          bookingId: "b102",
          siteNumber: 12,
          guestName: "Emily Davis",
          guestEmail: "emily.davis@example.com",
          guestPhone: "+1 (555) 234-5678",
          expectedArrival: "2023-07-15T15:30:00Z",
          checkInTime: null,
          adults: 2,
          children: 0,
          vehiclePlate: "XYZ789",
          status: "pending"
        },
        {
          id: "ci003",
          bookingId: "b103",
          siteNumber: 4,
          guestName: "Daniel Wilson",
          guestEmail: "daniel.wilson@example.com",
          guestPhone: "+1 (555) 345-6789",
          expectedArrival: "2023-07-15T13:00:00Z",
          checkInTime: null,
          adults: 4,
          children: 2,
          vehiclePlate: "DEF456",
          status: "pending"
        }
      ]
      
      setCheckIns(mockData)
      setError(null)
    } catch (err) {
      console.error("Error fetching today's check-ins:", err)
      setError("Failed to load today's check-ins. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a")
  }

  const handleCompleteCheckIn = async (checkInId: string) => {
    setProcessingCheckIn(checkInId)
    try {
      // In a real app, replace with actual API call
      // await fetch(`/api/check-ins/${checkInId}/complete`, { 
      //   method: 'POST',
      //   body: JSON.stringify({ checkInTime: new Date().toISOString() })
      // })
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCheckIns(checkIns.map(checkIn => 
        checkIn.id === checkInId 
          ? { ...checkIn, status: "completed", checkInTime: new Date().toISOString() } 
          : checkIn
      ))
      
      toast({
        title: "Check-in Completed",
        description: "The guest has been successfully checked in.",
      })
    } catch (err) {
      console.error("Error completing check-in:", err)
      toast({
        title: "Error",
        description: "Failed to complete check-in. Please try again.",
        variant: "destructive"
      })
    } finally {
      setProcessingCheckIn(null)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading today's check-ins...</p>
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

  if (checkIns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <CalendarCheck className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Check-ins Today</h3>
        <p className="text-sm text-muted-foreground mt-1">
          There are no guests scheduled to check in today.
        </p>
      </div>
    )
  }

  const pendingCheckIns = checkIns.filter(checkIn => checkIn.status === "pending")
  const completedCheckIns = checkIns.filter(checkIn => checkIn.status === "completed")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Today's Check-ins</h1>
        <Button variant="outline" onClick={fetchTodayCheckIns}>
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Pending Check-ins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Pending Check-ins ({pendingCheckIns.length})
            </CardTitle>
            <CardDescription>
              Guests expecting to arrive today
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] px-4">
              <div className="space-y-4 py-2">
                {pendingCheckIns.map((checkIn) => (
                  <div key={checkIn.id} className="flex items-start gap-4 p-3 rounded-lg border">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(checkIn.guestName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{checkIn.guestName}</p>
                        <Badge>Site #{checkIn.siteNumber}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground grid gap-1">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 opacity-70" />
                          Expected at {formatTime(checkIn.expectedArrival)}
                        </div>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 opacity-70" />
                          {checkIn.adults} adults, {checkIn.children} children
                        </div>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 opacity-70" />
                          {checkIn.guestPhone}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 opacity-70" />
                          Vehicle: {checkIn.vehiclePlate}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCompleteCheckIn(checkIn.id)}
                      disabled={processingCheckIn === checkIn.id}
                      className="mt-2"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Check-in
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Completed Check-ins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Check className="mr-2 h-5 w-5" />
              Completed Check-ins ({completedCheckIns.length})
            </CardTitle>
            <CardDescription>
              Guests who have already checked in today
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] px-4">
              <div className="space-y-4 py-2">
                {completedCheckIns.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4 text-center">
                    No completed check-ins yet today
                  </p>
                ) : (
                  completedCheckIns.map((checkIn) => (
                    <div key={checkIn.id} className="flex items-start gap-4 p-3 rounded-lg border">
                      <Checkbox checked disabled className="mt-1" />
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{checkIn.guestName}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm">Site #{checkIn.siteNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {checkIn.checkInTime ? `Checked in at ${formatTime(checkIn.checkInTime)}` : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 