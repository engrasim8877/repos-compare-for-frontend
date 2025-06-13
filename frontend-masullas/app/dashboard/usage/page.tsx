"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { 
  AlertTriangle,
  Info,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Zap,
  Loader2,
  ClockIcon,
  HistoryIcon,
  Power,
  Wifi,
  Calendar
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthGuard } from "@/components/auth-guard"
import { getAuthHeaders } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/translations"

// Type definitions
interface ConsumptionData {
  water: number;
  electricity: number;
}

interface HistoryItem {
  operationState: string;
  deviceId: string;
  deviceType: string;
  userId: string;
  timestamp: string;
  consumption: ConsumptionData;
  campsiteId: string;
  expiryTime: number;
  state: {
    water: boolean;
    electricity: boolean;
    barrier: boolean;
  };
  type: "state" | "command";
  command?: {
    type: string;
    state: boolean;
  };
  source?: string;
}

interface Booking {
  bookingId: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface Device {
  deviceId: string;
  status: string;
  model: string;
  lastConnected: string;
}

interface CampsiteSummaryResponse {
  hasActiveBooking: boolean;
  hasCampsite: boolean;
  booking?: Booking;
  device?: Device;
  state?: {
    water: boolean;
    electricity: boolean;
    barrier: boolean;
  };
  timeRange?: {
    startDate: string;
    endDate: string;
  };
  history?: HistoryItem[];
}

export default function UsageHistoryPage() {
  const { toast } = useToast()
  const { t } = useTranslation()
  
  // State
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summaryData, setSummaryData] = useState<CampsiteSummaryResponse | null>(null)
  const [allHistory, setAllHistory] = useState<HistoryItem[]>([])
  const [displayedHistory, setDisplayedHistory] = useState<HistoryItem[]>([])
  const [historyLimit, setHistoryLimit] = useState<number>(20)
  
  // Calculate total electricity consumption
  const calculateElectricityUsage = (history: HistoryItem[]): number => {
    return history.reduce((total, item) => total + (item.consumption?.electricity || 0), 0);
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    return format(parseISO(dateString), "MMM d, yyyy");
  }

  // Fetch summary data function
  const fetchCampsiteSummary = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/active-campsite/summary`
      console.log('📊 Fetching usage data:', {
        url,
        timestamp: new Date().toISOString()
      })
      
      const response = await fetch(url, {
        headers: getAuthHeaders(),
        credentials: 'omit',
      })
      
      if (!response.ok) {
        let errorMessage = 'Failed to fetch campsite data'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          errorMessage = `${errorMessage}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }
      
      const data: CampsiteSummaryResponse = await response.json()
      console.log('📈 Usage data received:', {
        timestamp: new Date().toISOString(),
        bookingPeriod: data.booking ? {
          start: data.booking.startDate,
          end: data.booking.endDate
        } : null,
        deviceStatus: data.device?.status,
        historyCount: data.history?.length || 0,
        totalElectricityUsage: calculateElectricityUsage(data.history || [])
      })
      
      setSummaryData(data)
      setAllHistory(data.history || [])
      setDisplayedHistory((data.history || []).slice(0, historyLimit))
      
      if (!data.hasActiveBooking) {
        toast({
          title: t('dashboard.usage.noActiveBookingTitle'),
          description: t('dashboard.usage.noActiveBookingToast'),
          variant: "destructive",
        })
      } else if (!data.hasCampsite) {
        toast({
          title: t('dashboard.usage.noCampsiteAssignedTitle'),
          description: t('dashboard.usage.noCampsiteToast'),
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error("Error fetching campsite summary:", err)
      setError(err.message || "An unknown error occurred")
      toast({
        title: t('dashboard.usage.error'),
        description: err.message || t('dashboard.usage.errorToast'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [historyLimit, toast])

  // Load more history from local state
  const loadMoreHistory = useCallback(() => {
    const nextBatch = allHistory.slice(0, displayedHistory.length + 20)
    console.log('📜 Loading more history:', {
      previousCount: displayedHistory.length,
      newCount: nextBatch.length,
      total: allHistory.length,
      timestamp: new Date().toISOString()
    })
    
    setDisplayedHistory(nextBatch)
    setHistoryLimit(prev => prev + 20)
  }, [allHistory, displayedHistory.length])

  // Initial data fetch
  useEffect(() => {
    fetchCampsiteSummary()
  }, [fetchCampsiteSummary])

  // Render Loading Skeleton
  const renderLoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-[400px]" />
    </div>
  )

  // Render Summary Cards
  const renderSummaryCards = () => {
    if (!summaryData?.booking || !summaryData?.device) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Booking Period Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {t('dashboard.usage.bookingPeriod')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {formatDate(summaryData.booking.startDate)}
            </div>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.usage.singleDayBooking')}
            </p>
          </CardContent>
        </Card>

        {/* Device Status Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              {t('dashboard.usage.deviceStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-3 w-3 rounded-full",
                summaryData.device.status === "online" 
                  ? "bg-green-500" 
                  : "bg-red-500"
              )} />
              <span className="text-lg font-semibold">
                {summaryData.device.status === "online" ? t('dashboard.usage.online') : t('dashboard.usage.offline')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {t('dashboard.usage.lastConnected')}: {format(parseISO(summaryData.device.lastConnected), "h:mm a")}
            </p>
          </CardContent>
        </Card>

        {/* Electricity Usage Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Power className="h-4 w-4 text-muted-foreground" />
              {t('dashboard.usage.electricityUsage')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {calculateElectricityUsage(allHistory).toFixed(6)} {t('dashboard.usage.kwh')}
            </div>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.usage.totalConsumptionToday')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const getCommandDescription = (historyItem: HistoryItem): { title: string; details: string[] } => {
    if (historyItem.type === "command") {
      const commandType = historyItem.command?.type || "";
      const state = historyItem.command?.state ? "ON" : "OFF";
      
      if (commandType === "setElectricity") return {
        title: t('dashboard.usage.electricityControl'),
        details: [`${t('dashboard.usage.changedStateTo')} ${state === "ON" ? t('dashboard.usage.on') : t('dashboard.usage.off')}`]
      };
      if (commandType === "setWater") return {
        title: t('dashboard.usage.waterControl'),
        details: [`${t('dashboard.usage.changedStateTo')} ${state === "ON" ? t('dashboard.usage.on') : t('dashboard.usage.off')}`]
      };
      if (commandType === "setBarrier") return {
        title: t('dashboard.usage.barrierControl'),
        details: [`${state === "ON" ? t('dashboard.usage.opened') : t('dashboard.usage.closed')} the ${t('dashboard.usage.barrier').toLowerCase()}`]
      };
      
      return {
        title: commandType,
        details: [`${t('dashboard.usage.changedStateTo')} ${state}`]
      };
    } else {
      // State changes
      const newState = historyItem.state || {};
      const changes: string[] = [];
      
      if (newState.electricity !== undefined) {
        changes.push(`${t('dashboard.usage.electricity')}: ${newState.electricity ? t('dashboard.usage.on') : t('dashboard.usage.off')}`);
      }
      if (newState.water !== undefined) {
        changes.push(`${t('dashboard.usage.water')}: ${newState.water ? t('dashboard.usage.on') : t('dashboard.usage.off')}`);
      }
      if (newState.barrier !== undefined) {
        changes.push(`${t('dashboard.usage.barrier')}: ${newState.barrier ? t('dashboard.usage.open') : t('dashboard.usage.closed')}`);
      }
      
      return {
        title: t('dashboard.usage.stateUpdate'),
        details: changes.length > 0 ? changes : [t('dashboard.usage.stateValuesUpdated')]
      };
    }
  }

  // Render Command History Section
  const renderHistoryContent = () => {
    if (displayedHistory.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <HistoryIcon className="h-10 w-10 text-muted-foreground mb-3 opacity-60" />
            <h3 className="text-lg font-medium mb-1">{t('dashboard.usage.noCommandHistory')}</h3>
            <p className="text-muted-foreground max-w-md">
              {t('dashboard.usage.noHistoryMessage')}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <HistoryIcon className="h-5 w-5 text-muted-foreground" />
              {t('dashboard.usage.commandStateHistory')}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {displayedHistory.length} {t('dashboard.usage.recordsOf')} {allHistory.length} {t('dashboard.usage.records')}
            </Badge>
          </div>
          <CardDescription>
            {t('dashboard.usage.showingMostRecent')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayedHistory.map((item, index) => {
              const description = getCommandDescription(item);
              return (
                <div 
                  key={index} 
                  className={cn(
                    "relative p-4 rounded-lg border transition-all duration-200",
                    "hover:shadow-md hover:border-primary/20",
                    "bg-card dark:bg-card/90"
                  )}
                >
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg",
                    item.type === 'command' 
                      ? "bg-blue-500 dark:bg-blue-400" 
                      : "bg-primary dark:bg-primary/80"
                  )} />
                  
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-1.5 rounded-md",
                          item.type === 'command' 
                            ? "bg-blue-100 dark:bg-blue-900/30" 
                            : "bg-primary/10 dark:bg-primary/20"
                        )}>
                          {item.type === 'command' ? (
                            <ToggleRight className={cn(
                              "h-4 w-4",
                              "text-blue-600 dark:text-blue-400"
                            )} />
                          ) : (
                            <ToggleLeft className={cn(
                              "h-4 w-4",
                              "text-primary dark:text-primary/80"
                            )} />
                          )}
                        </div>
                        <div>
                          <span className={cn(
                            "text-sm font-medium",
                            item.type === 'command' 
                              ? "text-blue-600 dark:text-blue-400" 
                              : "text-primary dark:text-primary/80"
                          )}>
                            {description.title}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 ml-8">
                        {description.details.map((detail, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center gap-2 text-sm text-foreground"
                          >
                            <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:items-end gap-1 text-xs text-muted-foreground min-w-[180px]">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {format(parseISO(item.timestamp), "MMM d, yyyy • h:mm a")}
                      </span>
                      {item.source && (
                        <span className="flex items-center gap-1">
                          <Info className="h-3 w-3" />
                          {t('dashboard.usage.source')}: {item.source}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        {displayedHistory.length < allHistory.length && (
          <CardFooter className="flex justify-center pt-2 pb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadMoreHistory}
              className="min-w-[120px]"
            >
              {t('dashboard.usage.loadMore')}
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="flex flex-col gap-6 container mx-auto p-4 lg:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{t('dashboard.usage.title')}</h1>
              <p className="text-muted-foreground">
                {summaryData?.booking 
                  ? `${t('dashboard.usage.viewingDataFor')} ${formatDate(summaryData.booking.startDate)}`
                  : t('dashboard.usage.subtitle')}
              </p>
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchCampsiteSummary}
              disabled={isLoading}
              aria-label={t('dashboard.usage.refreshData')}
              className="sm:ml-auto"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {isLoading ? (
            renderLoadingSkeleton()
          ) : error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('dashboard.usage.error')}</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          ) : !summaryData?.hasActiveBooking ? (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('dashboard.usage.noActiveBookingTitle')}</AlertTitle>
              <AlertDescription>
                {t('dashboard.usage.noActiveBookingMessage')}
              </AlertDescription>
            </Alert>
          ) : !summaryData?.hasCampsite ? (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('dashboard.usage.noCampsiteAssignedTitle')}</AlertTitle>
              <AlertDescription>
                {t('dashboard.usage.noCampsiteAssignedMessage')}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {renderSummaryCards()}
              {renderHistoryContent()}
            </>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}