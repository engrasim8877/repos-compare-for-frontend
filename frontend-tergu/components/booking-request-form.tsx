"use client"

import { useState, useEffect } from "react"
import { format, addDays, differenceInDays, startOfDay, isEqual } from "date-fns"
import { CalendarIcon, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { getAuthHeaders, getUser } from "@/lib/auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface BookingRequestFormProps {
  onBookingCreated: (success: boolean, message: string, details?: string) => void
  onCancel: () => void
}

// Constants for booking
const MAX_BOOKING_DAYS = 15; // Maximum number of days allowed for a booking (will be updated from API)

export function BookingRequestForm({ onBookingCreated, onCancel }: BookingRequestFormProps) {
  const user = getUser()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pricing, setPricing] = useState({
    basePrice: 25,
    currency: 'EUR',
    maxBookingDays: 15,
    minBookingDays: 1
  })
  const [isLoadingPricing, setIsLoadingPricing] = useState(true)
  
  // Get current date at start of day for consistent comparison
  const today = startOfDay(new Date());
  
  // Fetch pricing data on component mount
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pricing`)
        if (response.ok) {
          const data = await response.json()
          if (data.pricing) {
            setPricing(data.pricing)
          }
        }
      } catch (error) {
        console.error('Error fetching pricing:', error)
        // Keep default pricing if fetch fails
      } finally {
        setIsLoadingPricing(false)
      }
    }
    
    fetchPricing()
  }, [])
  
  // Form data
  const [formData, setFormData] = useState({
    startDate: today, // Default to today
    endDate: addDays(today, 2), // Default to 3-day stay (today + 2 days)
    contactPhone: user?.phone || "",
    contactEmail: user?.email || "",
    notes: "",
    paymentMethod: "creditCard"
  })
  
  // Calculate duration based on inclusive dates (startDate and endDate are both counted)
  // If start and end dates are the same, duration is 1 day
  const calculateDuration = (start: Date, end: Date): number => {
    // If dates are the same, return 1 (single day booking)
    if (isEqual(startOfDay(start), startOfDay(end))) {
      return 1;
    }
    // Otherwise calculate difference and add 1 to make it inclusive
    return differenceInDays(startOfDay(end), startOfDay(start)) + 1;
  };
  
  // Calculated values
  const durationDays = calculateDuration(formData.startDate, formData.endDate);
  const totalPrice = durationDays * pricing.basePrice;
  const formattedStartDate = format(formData.startDate, "PP");
  const formattedEndDate = format(formData.endDate, "PP");
  
  // Handle form data changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }
  
  const handleDateChange = (field: 'startDate' | 'endDate', value: Date) => {
    const selectedDate = startOfDay(value);
    
    setFormData(prev => {
      // Create a copy of the previous state
      const newState = { ...prev };
      
      // Update the selected field
      newState[field] = selectedDate;
      
      // If setting start date and it's after end date or too close to max limit
      if (field === 'startDate') {
        const maxAllowedEndDate = addDays(selectedDate, pricing.maxBookingDays - 1);
        
        // If current end date is before new start date, adjust end date to start date (1 day booking)
        if (selectedDate > prev.endDate) {
          newState.endDate = selectedDate;
        } 
        // If current end date would make booking longer than max allowed, adjust it
        else if (calculateDuration(selectedDate, prev.endDate) > pricing.maxBookingDays) {
          newState.endDate = maxAllowedEndDate;
        }
      }
      
      // If setting end date before start date, prevent it
      if (field === 'endDate' && selectedDate < prev.startDate) {
        return prev; // Reject the change
      }
      
      return newState;
    });
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }
  
  // Form validation
  const validateForm = () => {
    if (!formData.contactPhone.trim()) {
      setError("Please provide a contact phone number");
      return false;
    }
    
    if (!formData.contactEmail.trim()) {
      setError("Please provide a contact email");
      return false;
    }
    
    if (durationDays < pricing.minBookingDays) {
      setError(`Booking must be at least ${pricing.minBookingDays} day(s)`);
      return false;
    }
    
    if (durationDays > pricing.maxBookingDays) {
      setError(`Booking cannot exceed ${pricing.maxBookingDays} days`);
      return false;
    }
    
    setError(null);
    return true;
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/request`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          startDate: format(formData.startDate, "yyyy-MM-dd"),
          endDate: format(formData.endDate, "yyyy-MM-dd"),
          contactPhone: formData.contactPhone,
          contactEmail: formData.contactEmail,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
          campsiteId: "UNASSIGNED" // This ensures we have a string value for the campsiteId-index
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create booking request");
      }
      
      // Call the onBookingCreated with success details
      onBookingCreated(
        true, 
        "Your booking request has been submitted successfully. You'll be notified when it's approved."
      );
    } catch (err: any) {
      console.error("Error creating booking:", err);
      setError(err.message || "Failed to create booking request. Please try again.");
      
      // Call the onBookingCreated with failure details
      onBookingCreated(
        false, 
        "Failed to create booking request.", 
        err.message || "An unexpected error occurred. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // Calculate the maximum allowed end date
  const maxEndDate = addDays(formData.startDate, pricing.maxBookingDays - 1);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-3xl mx-auto">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isLoadingPricing && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Loading Pricing</AlertTitle>
          <AlertDescription>Fetching current pricing information...</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Date Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => date && handleDateChange('startDate', date)}
                    disabled={(date) => 
                      startOfDay(date) < startOfDay(today) // Can't book before today
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="endDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => date && handleDateChange('endDate', date)}
                    disabled={(date) => 
                      startOfDay(date) < startOfDay(formData.startDate) || // Can't end before start
                      startOfDay(date) > startOfDay(maxEndDate) // Can't exceed max booking length
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="pt-2 border-t border-muted">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
              <p className="text-sm font-medium">Duration: <span className="text-primary">{durationDays} {durationDays === 1 ? 'day' : 'days'}</span></p>
              <p className="text-sm text-muted-foreground">{formattedStartDate} - {formattedEndDate}</p>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Maximum booking duration: {pricing.maxBookingDays} days
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email Address</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleSelectChange('paymentMethod', value)}
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="creditCard">Credit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Special Requests (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any special requests or notes for your booking..."
              rows={3}
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="bg-slate-50 p-4 rounded-lg border">
            <div className="flex justify-between">
              <span className="font-medium">Duration:</span>
              <span>{durationDays} {durationDays === 1 ? 'day' : 'days'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Price per day:</span>
              <span>€{pricing.basePrice.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-lg text-primary">
              <span>Total Price:</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Booking Request"
          )}
        </Button>
      </div>
    </form>
  )
} 