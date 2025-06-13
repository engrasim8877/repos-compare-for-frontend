"use client"

import { useState } from "react"
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
import { useTranslation } from "@/lib/translations"

interface BookingRequestFormProps {
  onBookingCreated: (success: boolean, message: string, details?: string) => void
  onCancel: () => void
}

// Constants for booking
const MAX_BOOKING_DAYS = 15; // Maximum number of days allowed for a booking
const BASE_PRICE = 45; // Base price per day

export function BookingRequestForm({ onBookingCreated, onCancel }: BookingRequestFormProps) {
  const user = getUser()
  const { t } = useTranslation()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Get current date at start of day for consistent comparison
  const today = startOfDay(new Date());
  
  // Form data
  const [formData, setFormData] = useState({
    startDate: today, // Default to today
    endDate: addDays(today, 2), // Default to 3-day stay (today + 2 days)
    contactPhone: "",
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
  const totalPrice = durationDays * BASE_PRICE;
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
        const maxAllowedEndDate = addDays(selectedDate, MAX_BOOKING_DAYS - 1);
        
        // If current end date is before new start date, adjust end date to start date (1 day booking)
        if (selectedDate > prev.endDate) {
          newState.endDate = selectedDate;
        } 
        // If current end date would make booking longer than max allowed, adjust it
        else if (calculateDuration(selectedDate, prev.endDate) > MAX_BOOKING_DAYS) {
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
      setError(t('dashboard.bookings.requestForm.pleaseProvidePhone'));
      return false;
    }
    
    if (!formData.contactEmail.trim()) {
      setError(t('dashboard.bookings.requestForm.pleaseProvideEmail'));
      return false;
    }
    
    if (durationDays < 1) {
      setError(t('dashboard.bookings.requestForm.bookingMinimumDays'));
      return false;
    }
    
    if (durationDays > MAX_BOOKING_DAYS) {
      setError(t('dashboard.bookings.requestForm.bookingMaximumDays').replace('{maxDays}', MAX_BOOKING_DAYS.toString()));
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
        t('dashboard.bookings.requestForm.requestSubmittedSuccess')
      );
    } catch (err: any) {
      console.error("Error creating booking:", err);
      setError(err.message || t('dashboard.bookings.requestForm.failedToCreateRequest'));
      
      // Call the onBookingCreated with failure details
      onBookingCreated(
        false, 
        t('dashboard.bookings.requestForm.failedToCreateRequestTitle'), 
        err.message || t('dashboard.bookings.requestForm.unexpectedError')
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // Calculate the maximum allowed end date
  const maxEndDate = addDays(formData.startDate, MAX_BOOKING_DAYS - 1);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-3xl mx-auto">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('dashboard.bookings.requestForm.errorTitle')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.bookings.requestForm.dateSelection')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">{t('dashboard.bookings.requestForm.checkInDate')}</Label>
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
                    {formData.startDate ? format(formData.startDate, "PPP") : t('dashboard.bookings.requestForm.selectDate')}
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
              <Label htmlFor="endDate">{t('dashboard.bookings.requestForm.checkOutDate')}</Label>
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
                    {formData.endDate ? format(formData.endDate, "PPP") : t('dashboard.bookings.requestForm.selectDate')}
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
              <p className="text-sm font-medium">{t('dashboard.bookings.requestForm.duration')}: <span className="text-primary">{durationDays} {durationDays === 1 ? t('dashboard.bookings.requestForm.day') : t('dashboard.bookings.requestForm.days')}</span></p>
              <p className="text-sm text-muted-foreground">{formattedStartDate} - {formattedEndDate}</p>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t('dashboard.bookings.requestForm.maxBookingDuration')}: {MAX_BOOKING_DAYS} {t('dashboard.bookings.requestForm.days')}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.bookings.requestForm.contactInformation')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">{t('dashboard.bookings.requestForm.phoneNumber')}</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder={t('dashboard.bookings.requestForm.phoneNumberPlaceholder')}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactEmail">{t('dashboard.bookings.requestForm.emailAddress')}</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder={t('dashboard.bookings.requestForm.emailAddressPlaceholder')}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.bookings.requestForm.bookingDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">{t('dashboard.bookings.requestForm.paymentMethod')}</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleSelectChange('paymentMethod', value)}
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder={t('dashboard.bookings.requestForm.selectPaymentMethod')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="creditCard">{t('dashboard.bookings.requestForm.creditCard')}</SelectItem>
                <SelectItem value="paypal">{t('dashboard.bookings.requestForm.paypal')}</SelectItem>
                <SelectItem value="bankTransfer">{t('dashboard.bookings.requestForm.bankTransfer')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">{t('dashboard.bookings.requestForm.specialRequests')}</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder={t('dashboard.bookings.requestForm.specialRequestsPlaceholder')}
              rows={3}
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="bg-slate-50 p-4 rounded-lg border">
            <div className="flex justify-between">
              <span className="font-medium">{t('dashboard.bookings.requestForm.duration')}:</span>
              <span>{durationDays} {durationDays === 1 ? t('dashboard.bookings.requestForm.day') : t('dashboard.bookings.requestForm.days')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t('dashboard.bookings.requestForm.pricePerDay')}:</span>
              <span>${BASE_PRICE.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-lg text-primary">
              <span>{t('dashboard.bookings.requestForm.totalPrice')}:</span>
              <span>${totalPrice.toFixed(2)}</span>
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
          {t('dashboard.bookings.requestForm.cancel')}
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('dashboard.bookings.requestForm.submitting')}
            </>
          ) : (
            t('dashboard.bookings.requestForm.submitBookingRequest')
          )}
        </Button>
      </div>
    </form>
  )
} 