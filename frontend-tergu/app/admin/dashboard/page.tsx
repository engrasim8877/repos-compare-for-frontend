"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Loader2, 
  AlertTriangle,
  Users,
  CalendarDays,
  Cpu,
  Tent,
  Settings,
  RefreshCw,
  ArrowUpRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
  UserCheck,
  UserX,
  WifiOff,
  Wifi,
  CircleDot,
  Timer,
  Bell,
  Server,
  Database,
  Cloud,
  CheckCircle,
  HelpCircle,
  User
} from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { AuthGuard } from "@/components/auth-guard"
import { getAuthHeaders } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { LineChart, BarChart, PieChart } from "@/components/ui/charts"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function AdminDashboardPage() {
  const { toast } = useToast()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [healthData, setHealthData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState(30) // default 30 days
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    fetchDashboardData()
    fetchAnalyticsData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)
    setIsRefreshing(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/dashboard/overview`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }

      const data = await response.json()
      setDashboardData(data)

      // Fetch health data
      const healthResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/system/health`, {
        headers: getAuthHeaders(),
      })

      if (!healthResponse.ok) {
        throw new Error("Failed to fetch system health data")
      }

      const healthData = await healthResponse.json()
      setHealthData(healthData)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err)
      setError(err.message || "Failed to load dashboard data")
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const fetchAnalyticsData = async () => {
    setAnalyticsLoading(true)
    setAnalyticsError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/analytics?days=${timeRange}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data")
      }

      const data = await response.json()
      setAnalyticsData(data)
    } catch (err: any) {
      console.error("Error fetching analytics data:", err)
      setAnalyticsError(err.message || "Failed to load analytics data")
      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Healthy
          </Badge>
        )
      case 'unhealthy':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Unhealthy
          </Badge>
        )
      case 'not configured':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            Not Configured
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <HelpCircle className="h-3.5 w-3.5 mr-1" />
            Unknown
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    }).format(date);
  }

  return (
    <AuthGuard requireAdmin>
      <AdminLayout>
        <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">System Overview</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">Real-time monitoring and management</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {lastUpdated && (
                <span className="text-sm text-muted-foreground hidden sm:inline-block">
                  Last updated: {lastUpdated}
                </span>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchDashboardData}
                disabled={isRefreshing}
                className="h-9 flex-1 sm:flex-initial"
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-28 mt-1" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Loading Dashboard</AlertTitle>
              <AlertDescription className="flex items-center gap-2">
                {error}
                <Button onClick={fetchDashboardData} variant="outline" size="sm" className="ml-2">
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : dashboardData ? (
            <>
              {/* Quick Stats Grid - Improved sizing and spacing */}
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {/* Users Card */}
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Total Users</CardTitle>
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {dashboardData?.statistics?.users?.total || 0}
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800 flex items-center gap-1">
                          <UserCheck className="h-3.5 w-3.5" />
                          {healthData?.statistics?.users?.admins || dashboardData?.statistics?.users?.admins || 0} admins
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800 flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {healthData?.statistics?.users?.regular || dashboardData?.statistics?.users?.regular || (dashboardData?.statistics?.users?.total ? (dashboardData.statistics.users.total - (dashboardData.statistics.users.admins || 0)) : 0)} users
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Devices Card */}
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Total Devices</CardTitle>
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                        <Cpu className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {dashboardData?.statistics?.devices?.total || 0}
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <Badge variant="secondary" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800 flex items-center gap-1">
                          <Wifi className="h-3.5 w-3.5" />
                          {dashboardData?.statistics?.devices?.online || 0} online
                        </Badge>
                        <Badge variant="secondary" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800 flex items-center gap-1">
                          <WifiOff className="h-3.5 w-3.5" />
                          {dashboardData?.statistics?.devices?.offline || 0} offline
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Campsites Card */}
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Total Campsites</CardTitle>
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <Tent className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {dashboardData?.statistics?.campsites?.total || 0}
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <Badge variant="secondary" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800 flex items-center gap-1">
                          <CircleDot className="h-3.5 w-3.5" />
                          {dashboardData?.statistics?.campsites?.available || 0} available
                        </Badge>
                        <Badge variant="secondary" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800 flex items-center gap-1">
                          <Timer className="h-3.5 w-3.5" />
                          {dashboardData?.statistics?.campsites?.occupied || 0} occupied
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bookings Card */}
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Active Bookings</CardTitle>
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                        <CalendarDays className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {dashboardData?.statistics?.bookings?.byStatus?.active || 0}
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <Badge variant="secondary" className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {dashboardData?.statistics?.bookings?.byStatus?.pending || 0} pending
                        </Badge>
                        <Badge variant="secondary" className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {dashboardData?.statistics?.bookings?.byStatus?.completed || 0} completed
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* System Health Overview - Improved spacing */}
              {healthData && (
                <div className="grid gap-8 grid-cols-1">
                  {/* System Overview Card */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-start gap-6">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <CardTitle className="text-xl">System Health</CardTitle>
                            {healthData.healthScore && (
                              <Badge className={cn(
                                "h-7 px-3",
                                healthData.healthScore.status === 'healthy' 
                                  ? "bg-green-100 text-green-800 border-green-200" 
                                  : healthData.healthScore.status === 'degraded'
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                    : "bg-red-100 text-red-800 border-red-200"
                              )}>
                                {healthData.healthScore.status === 'healthy' ? (
                                <CheckCircle className="h-4 w-4 mr-2" />
                                ) : healthData.healthScore.status === 'degraded' ? (
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                ) : (
                                  <XCircle className="h-4 w-4 mr-2" />
                                )}
                                Health Score: {healthData.healthScore.score}/100
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-base">
                            Environment: {healthData.environment || 'Unknown'} | Region: {healthData.region || 'Unknown'}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                        {/* Service Status */}
                        <div className="space-y-6">
                          <h3 className="text-lg font-medium border-b pb-2">Service Status</h3>
                          <div className="space-y-5">
                        {/* Database Status */}
                            <div className="p-4 bg-muted/30 rounded-lg">
                              <details className="cursor-pointer">
                                <summary className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Database className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium">Database</span>
                            </div>
                            {getStatusBadge(healthData.services.database.status)}
                                </summary>
                                <div className="mt-3 pt-3 border-t border-border/50">
                          {healthData.services.database.tables && (
                                    <div className="space-y-2">
                                      <div className="text-xs text-muted-foreground font-medium">Table Names</div>
                                      <div className="grid grid-cols-1 gap-1.5 text-sm">
                                {Object.entries(healthData.services.database.tables).map(([name, tableName]: [string, any]) => (
                                          <div key={name} className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground capitalize">{name}:</span>
                                            <span className="font-mono text-xs bg-background/50 px-1.5 py-0.5 rounded" title={tableName}>
                                      {tableName}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                                  {healthData.services.database.error && (
                                    <Alert variant="destructive" className="mt-3">
                                      <AlertTitle>Error</AlertTitle>
                                      <AlertDescription className="text-xs">
                                        {healthData.services.database.error}
                                      </AlertDescription>
                                    </Alert>
                                  )}
                                </div>
                              </details>
                        </div>

                        {/* IoT Status */}
                            <div className="p-4 bg-muted/30 rounded-lg">
                              <details className="cursor-pointer">
                                <summary className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Cloud className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium">IoT Services</span>
                            </div>
                            {getStatusBadge(healthData.services.iot.status)}
                                </summary>
                                <div className="mt-3 pt-3 border-t border-border/50">
                                  <div className="space-y-2">
                                    <div className="text-xs text-muted-foreground font-medium">Endpoint</div>
                                    <code className="text-xs bg-background/50 px-2 py-1 rounded block font-mono break-all">
                                      {healthData.services.iot.endpoint}
                                    </code>
                          </div>
                          {healthData.services.iot.error && (
                                    <Alert variant="destructive" className="mt-3">
                                      <AlertTitle>Error</AlertTitle>
                                      <AlertDescription className="text-xs">
                                {healthData.services.iot.error}
                              </AlertDescription>
                            </Alert>
                          )}
                                </div>
                              </details>
                            </div>
                          </div>
                        </div>
                        
                        {/* System Statistics */}
                        <div className="space-y-6">
                          <h3 className="text-lg font-medium border-b pb-2">System Statistics</h3>
                          <div className="grid gap-4 grid-cols-2">
                            {/* Devices Stats */}
                            <div className="p-4 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Cpu className="h-4 w-4 text-purple-600" />
                                <span className="font-medium text-sm">Devices</span>
                              </div>
                              <div className="text-2xl font-bold mb-2">
                                {healthData.statistics.devices.total}
                              </div>
                              <div className="grid grid-cols-1 gap-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Online:</span>
                                  <span className="font-medium text-green-600">{healthData.statistics.devices.online}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Offline:</span>
                                  <span className="font-medium text-red-600">{healthData.statistics.devices.offline}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Maintenance:</span>
                                  <span className="font-medium text-amber-600">{healthData.statistics.devices.maintenance}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Campsites Stats */}
                            <div className="p-4 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Tent className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-sm">Campsites</span>
                              </div>
                              <div className="text-2xl font-bold mb-2">
                                {healthData.statistics.campsites.total}
                              </div>
                              <div className="grid grid-cols-1 gap-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Available:</span>
                                  <span className="font-medium text-green-600">{healthData.statistics.campsites.available}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Occupied:</span>
                                  <span className="font-medium text-blue-600">{healthData.statistics.campsites.occupied}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Maintenance:</span>
                                  <span className="font-medium text-amber-600">{healthData.statistics.campsites.maintenance}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Bookings Stats */}
                            <div className="p-4 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <CalendarDays className="h-4 w-4 text-amber-600" />
                                <span className="font-medium text-sm">Bookings</span>
                              </div>
                              <div className="text-2xl font-bold mb-2">
                                {healthData.statistics.bookings.total}
                              </div>
                              <div className="grid grid-cols-1 gap-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Active:</span>
                                  <span className="font-medium text-green-600">{healthData.statistics.bookings.active}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Pending:</span>
                                  <span className="font-medium text-amber-600">{healthData.statistics.bookings.pending}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Approved:</span>
                                  <span className="font-medium text-blue-600">{healthData.statistics.bookings.approved}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Commands Stats */}
                            <div className="p-4 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Activity className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-sm">Commands (24h)</span>
                              </div>
                              <div className="text-2xl font-bold mb-2">
                                {healthData.statistics.commands.last24Hours}
                              </div>
                              <div className="grid grid-cols-1 gap-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Success:</span>
                                  <span className="font-medium text-green-600">{healthData.statistics.commands.success}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Failed:</span>
                                  <span className="font-medium text-red-600">{healthData.statistics.commands.failed}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Success Rate:</span>
                                  <span className="font-medium">
                                    {healthData.statistics.commands.last24Hours > 0 
                                      ? Math.round((healthData.statistics.commands.success / healthData.statistics.commands.last24Hours) * 100) 
                                      : 0}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Runtime Info */}
                      {healthData.runtime && (
                        <div className="mt-8 pb-2">
                          <details className="cursor-pointer">
                            <summary className="text-lg font-medium pb-2 border-b">
                              <div className="flex items-center gap-2">
                                <Server className="h-4 w-4 text-muted-foreground" />
                                Runtime Information
                              </div>
                            </summary>
                            <div className="pt-3 mt-2">
                              <div className="grid gap-3 grid-cols-2 md:grid-cols-3 text-sm">
                                <div className="p-3 bg-muted/30 rounded-lg">
                                  <div className="text-muted-foreground mb-1">Node.js Version</div>
                                  <div className="font-mono">{healthData.runtime.nodejs}</div>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-lg">
                                  <div className="text-muted-foreground mb-1">Memory Limit</div>
                                  <div className="font-mono">{healthData.runtime.memoryLimitMB}MB</div>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-lg">
                                  <div className="text-muted-foreground mb-1">Lambda Function</div>
                                  <div className="font-mono text-xs truncate" title={healthData.runtime.lambda?.functionName}>
                                    {healthData.runtime.lambda?.functionName}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </details>
                          <div className="text-xs text-muted-foreground mt-4 text-right">
                            Last updated: {formatDateTime(healthData.timestamp)}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Action Required Section - Improved spacing */}
              <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                {/* Pending Bookings */}
                {dashboardData?.pendingBookings?.length > 0 && (
                  <Card className="shadow-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-start gap-6">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                          <Bell className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center flex-wrap gap-3">
                            <CardTitle className="text-xl">Pending Approvals</CardTitle>
                            <Badge variant="secondary" className="h-7 px-3">
                              {dashboardData.pendingBookings.length} new
                            </Badge>
                          </div>
                          <CardDescription className="text-base">
                            Bookings requiring immediate attention
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {dashboardData.pendingBookings.slice(0, 5).map((booking: any) => (
                        <div 
                          key={booking.bookingId} 
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-full shrink-0">
                              <CalendarDays className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate">
                                {booking.userDetails?.firstName} {booking.userDetails?.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                              </div>
                            </div>
                          </div>
                          <Button asChild size="sm" variant="outline" className="sm:shrink-0">
                            <Link href={`/admin/dashboard/bookings/${booking.bookingId}`}>
                              Review
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                    {dashboardData.pendingBookings.length > 5 && (
                      <CardFooter className="pt-2">
                        <Button asChild variant="ghost" className="w-full">
                          <Link href="/admin/dashboard/bookings?status=pending">
                            View All Pending ({dashboardData.pendingBookings.length})
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                )}
              </div>
            </>
          ) : null}
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}

