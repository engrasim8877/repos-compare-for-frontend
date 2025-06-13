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
import { useTranslation } from "@/lib/translations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"

// Define the schema for pricing settings (simplified - only what admin should control)
const createPricingFormSchema = (t: any) => z.object({
  basePrice: z.coerce.number().positive().min(1, t('admin.settings.mustBePositive')),
  maxBookingDays: z.coerce.number().positive().min(1, t('admin.settings.mustBeAtLeastOneDay')),
  minBookingDays: z.coerce.number().positive().min(1, t('admin.settings.mustBeAtLeastOneDay')),
}).refine((data) => data.minBookingDays <= data.maxBookingDays, {
  message: t('admin.settings.minCannotBeGreater'),
  path: ["minBookingDays"],
})

export default function SystemSettingsPage() {
  const { toast } = useToast()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form
  const pricingFormSchema = createPricingFormSchema(t)
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
        throw new Error(t('admin.settings.failedToLoadPricing'))
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
      setError(err.message || t('admin.settings.failedToLoadPricing'))
      toast({
        title: t('common.error'),
        description: t('admin.settings.failedToLoadPricing'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (values: z.infer<ReturnType<typeof createPricingFormSchema>>) => {
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
        throw new Error(t('admin.settings.failedToUpdatePricing'))
      }

      toast({
        title: t('common.success'),
        description: t('admin.settings.settingsUpdated'),
        variant: "default",
      })
    } catch (err: any) {
      console.error("Error updating pricing settings:", err)
      toast({
        title: t('common.error'),
        description: err.message || t('admin.settings.failedToUpdatePricing'),
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AuthGuard requireAdmin>
      <AdminLayout>
        <div className="space-y-6 p-6 pb-24 md:pb-6 overflow-x-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('admin.settings.title')}</h1>
              <p className="text-muted-foreground mt-1">{t('admin.settings.subtitle')}</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-primary" />
                {t('admin.settings.pricingConfiguration')}
              </CardTitle>
              <CardDescription>
                {t('admin.settings.pricingDescription')}
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
                    <AlertTriangle className="h-4 w-4" /> {t('common.error')}
                  </AlertTitle>
                  <AlertDescription className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                    <span>{error}</span>
                    <Button onClick={fetchPricingData} variant="outline" size="sm">
                      {t('admin.settings.tryAgain')}
                    </Button>
                  </AlertDescription>
                </Alert>
              </CardContent>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="basePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Euro className="h-4 w-4 text-yellow-500" />
                              {t('admin.settings.basePrice')}
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
                              {t('admin.settings.basePriceDescription')}
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
                            <FormLabel>{t('admin.settings.minBookingDays')}</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                placeholder="1"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              {t('admin.settings.minBookingDaysDescription')}
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
                            <FormLabel>{t('admin.settings.maxBookingDays')}</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                placeholder="30"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              {t('admin.settings.maxBookingDaysDescription')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                  </CardContent>
                  <CardFooter className="border-t pt-6 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 p-0"
                      onClick={fetchPricingData}
                      disabled={isLoading}
                      aria-label={t('common.refresh')}
                    >
                      <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          {t('admin.settings.saving')}
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {t('admin.settings.saveSettings')}
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