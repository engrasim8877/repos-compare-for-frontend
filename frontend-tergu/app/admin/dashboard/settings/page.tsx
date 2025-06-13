"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  AlertTriangle, 
  RefreshCw, 
  Save, 
  Euro,
  CheckCircle
} from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { AuthGuard } from "@/components/auth-guard"
import { getAuthHeaders } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Define the schema for pricing settings (simplified - only what admin should control)
const pricingFormSchema = z.object({
  basePrice: z.coerce.number().positive().min(1, "Must be a positive number"),
  maxBookingDays: z.coerce.number().positive().min(1, "Must be at least 1 day"),
  minBookingDays: z.coerce.number().positive().min(1, "Must be at least 1 day"),
}).refine((data) => data.minBookingDays <= data.maxBookingDays, {
  message: "Minimum booking days cannot be greater than maximum booking days",
  path: ["minBookingDays"],
})

export default function SystemSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form
  const form = useForm<z.infer<typeof pricingFormSchema>>({
    resolver: zodResolver(pricingFormSchema),
    defaultValues: {
      basePrice: 0,
      maxBookingDays: 0,
      minBookingDays: 0,
    },
  })

  useEffect(() => {
    fetchPricingData()
  }, [])

  const fetchPricingData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/pricing`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch pricing data")
      }

      const data = await response.json()
      const settings = data.settings || {}
      
      // Update form with fetched data from backend
      form.reset({
        basePrice: settings.basePrice || 25,
        maxBookingDays: settings.maxBookingDays || 30,
        minBookingDays: settings.minBookingDays || 1,
      })
    } catch (err: any) {
      console.error("Error fetching pricing data:", err)
      setError(err.message || "Failed to load pricing data")
      toast({
        title: "Error",
        description: "Failed to load pricing settings. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof pricingFormSchema>) => {
    setIsSaving(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/pricing`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to update pricing settings")
      }

      toast({
        title: "Success",
        description: "Pricing settings updated successfully. Changes will be reflected immediately for new bookings.",
        variant: "default",
      })
    } catch (err: any) {
      console.error("Error updating pricing settings:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to update pricing settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AuthGuard requireAdmin>
      <AdminLayout>
        <div className="space-y-6 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Pricing Settings</h1>
              <p className="text-muted-foreground mt-1">Configure campsite pricing and booking duration limits</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-primary" />
                Campsite Pricing Configuration
              </CardTitle>
              <CardDescription>
                Set the base daily price for campsite bookings and configure booking duration limits. 
                Changes will apply immediately to new bookings and price estimates.
              </CardDescription>
            </CardHeader>
            
            {isLoading ? (
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            ) : error ? (
              <CardContent>
                <Alert variant="destructive">
                  <AlertTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Error
                  </AlertTitle>
                  <AlertDescription className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                    <span>{error}</span>
                    <Button onClick={fetchPricingData} variant="outline" size="sm">
                      Try Again
                    </Button>
                  </AlertDescription>
                </Alert>
              </CardContent>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="basePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Euro className="h-4 w-4 text-yellow-500" />
                              Base Price (per day)
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Euro className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  className="pl-8" 
                                  placeholder="25.00"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Base daily charge for campsite rental (in Euro €)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="minBookingDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min Booking Duration (days)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                placeholder="1"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Minimum duration in days for a single booking
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="maxBookingDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Booking Duration (days)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                placeholder="30"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum duration in days for a single booking
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-blue-900">
                            Real-time Price Updates
                          </h4>
                          <p className="text-sm text-blue-700">
                            When you update these settings, the new prices will be immediately available to users 
                            when they create new booking requests. The booking form will automatically fetch and 
                            display the current pricing for accurate cost estimates.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={fetchPricingData}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            )}
          </Card>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
} 