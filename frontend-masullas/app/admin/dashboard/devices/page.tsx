"use client"

import React, { useEffect, useState } from "react"
import { 
  Cpu, 
  RefreshCw, 
  Search, 
  Wifi, 
  WifiOff, 
  Clock, 
  AlertTriangle, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  Power,
  Wrench,
  RotateCw,
  Ban
} from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAuthHeaders } from "@/lib/auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "@/lib/translations"

// Define interfaces for data structures
interface Device {
  deviceId: string;
  deviceType?: string;
  deviceIndex?: string;
  model?: string;
  firmwareVersion?: string;
  status: 'online' | 'offline' | 'maintenance' | 'unknown';
  lastConnected?: string;
  registeredAt?: string;
  uptime?: { last24Hours?: string };
}

interface Campsite {
  campsiteId: string;
  campsiteName: string;
  status: 'available' | 'occupied' | 'maintenance';
  currentState: {
    electricity: boolean;
    water: boolean;
    barrier: boolean;
  };
  activeBooking?: {
    user: {
      fullName: string;
      email: string;
    };
    startDate: string;
    endDate: string;
  };
}

interface ConnectionEvent {
  status: 'online' | 'offline';
  previousStatus?: string;
  timestamp: string;
}

interface DeviceDetails {
  device: Device;
  campsites?: Campsite[];
  connectionHistory?: ConnectionEvent[];
  controls?: {
    canReboot?: boolean;
    canSetMaintenance?: boolean;
    canSendCommand?: boolean;
  };
}

interface CommandParams {
  deviceId: string;
  commandType: string;
  parameters: Record<string, any>;
  campsiteId: string;
  reason: string;
}

interface MaintenanceParams {
  deviceId: string;
  maintenanceMode: boolean;
  reason: string;
}

// API functions with types
const fetchDevices = async (): Promise<{ devices: Device[] }> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      throw new Error("API URL is not configured");
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/devices`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch devices");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw error;
  }
};

const fetchDeviceDetails = async (deviceId: string): Promise<DeviceDetails> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/devices/${deviceId}/details`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch device details");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch device details:", error);
    throw error;
  }
};

const sendDeviceCommand = async (
  deviceId: string,
  commandType: string,
  parameters: Record<string, any>,
  campsiteId: string,
  reason: string
): Promise<any> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/devices/${deviceId}/control`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        commandType,
        parameters,
        campsiteId,
        reason
      })
    });
    
    if (!response.ok) {
      throw new Error("Failed to send device command");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to send device command:", error);
    throw error;
  }
};

const setDeviceMaintenance = async (
  deviceId: string,
  maintenanceMode: boolean,
  reason: string
): Promise<any> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/devices/${deviceId}/maintenance`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        maintenanceMode,
        reason
      })
    });
    
    if (!response.ok) {
      throw new Error("Failed to set device maintenance mode");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to set device maintenance mode:", error);
    throw error;
  }
};

export default function DevicesPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [deviceDetails, setDeviceDetails] = useState<DeviceDetails | null>(null);
  const [commandDialogOpen, setCommandDialogOpen] = useState<boolean>(false);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("");
  const [commandParams, setCommandParams] = useState<CommandParams>({
    deviceId: "",
    commandType: "",
    parameters: {},
    campsiteId: "",
    reason: ""
  });
  const [maintenanceParams, setMaintenanceParams] = useState<MaintenanceParams>({
    deviceId: "",
    maintenanceMode: false,
    reason: ""
  });
  const [confirmAction, setConfirmAction] = useState<(() => Promise<void>) | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    filterDevices();
  }, [searchQuery, currentFilter, devices]);

  const loadDevices = async () => {
    setIsLoading(true);
    setError(null);
    setIsRefreshing(true);

    try {
      const data = await fetchDevices();
      setDevices(data.devices || []);
    } catch (err: any) {
      setError(err.message || t('admin.devices.failedToLoadDevices'));
      toast({
        title: t('admin.devices.error'),
        description: t('admin.devices.failedToLoadDevices'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const filterDevices = () => {
    let filtered: Device[] = [...devices];

    if (currentFilter !== "all") {
      filtered = filtered.filter(device => device.status === currentFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        device => 
          device.deviceId.toLowerCase().includes(query) ||
          device.model?.toLowerCase().includes(query) ||
          device.deviceType?.toLowerCase().includes(query)
      );
    }

    setFilteredDevices(filtered);
  };

  const handleDeviceClick = async (device: Device) => {
    setSelectedDevice(device);
    setDetailsOpen(true);
    setDeviceDetails(null);

    try {
      const details = await fetchDeviceDetails(device.deviceId);
      setDeviceDetails(details);
    } catch (err: any) {
      toast({
        title: t('admin.devices.error'),
        description: t('admin.devices.failedToLoadDetails'),
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    }).format(date);
  };

  const handleOpenCommandDialog = (device: Device) => {
    setCommandParams({
      ...commandParams,
      deviceId: device.deviceId,
      campsiteId: deviceDetails?.campsites?.[0]?.campsiteId || ""
    });
    setCommandDialogOpen(true);
  };

  const handleOpenMaintenanceDialog = (device: Device, isEnteringMaintenance: boolean) => {
    setMaintenanceParams({
      deviceId: device.deviceId,
      maintenanceMode: isEnteringMaintenance,
      reason: ""
    });
    setMaintenanceDialogOpen(true);
  };

  const confirmCommand = async () => {
    setIsActionLoading(true);
    try {
      await sendDeviceCommand(
        commandParams.deviceId,
        commandParams.commandType,
        commandParams.parameters,
        commandParams.campsiteId,
        commandParams.reason
      );
      
      toast({
        title: t('common.success'),
        description: t('admin.devices.commandSentFor', commandParams.commandType),
      });
      
      const details = await fetchDeviceDetails(commandParams.deviceId);
      setDeviceDetails(details);
      
      loadDevices();
    } catch (err: any) {
      toast({
        title: t('admin.devices.error'),
        description: t('admin.devices.failedToSendCommand'),
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
      setCommandDialogOpen(false);
    }
  };

  const confirmMaintenance = async () => {
    setIsActionLoading(true);
    try {
      await setDeviceMaintenance(
        maintenanceParams.deviceId,
        maintenanceParams.maintenanceMode,
        maintenanceParams.reason
      );
      
      toast({
        title: t('common.success'),
        description: maintenanceParams.maintenanceMode ? t('admin.devices.deviceMaintenanceEntered') : t('admin.devices.deviceMaintenanceExited'),
      });
      
      const details = await fetchDeviceDetails(maintenanceParams.deviceId);
      setDeviceDetails(details);
      
      loadDevices();
    } catch (err: any) {
      toast({
        title: t('admin.devices.error'),
        description: t('admin.devices.failedToUpdateMaintenance'),
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
      setMaintenanceDialogOpen(false);
    }
  };

  const getStatusBadge = (status: Device['status']) => {
    switch (status) {
      case "online":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <Wifi className="h-3.5 w-3.5 mr-1" />
            {t('admin.devices.online')}
          </Badge>
        );
      case "offline":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <WifiOff className="h-3.5 w-3.5 mr-1" />
            {t('admin.devices.offline')}
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Wrench className="h-3.5 w-3.5 mr-1" />
            {t('admin.devices.maintenance')}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {t('admin.devices.unknown')}
          </Badge>
        );
    }
  };

  return (
    <AuthGuard requireAdmin>
      <AdminLayout>
        <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('admin.devices.title')}</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                {t('admin.devices.subtitle')}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={loadDevices}
              disabled={isRefreshing}
              className="h-9 w-9 p-0"
              aria-label={t('admin.devices.refresh')}
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              <span className="sr-only">{t('admin.devices.refresh')}</span>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('admin.devices.searchPlaceholder')}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Dropdown filter on mobile */}
            <div className="flex lg:hidden">
              <Select value={currentFilter} onValueChange={setCurrentFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.devices.allDevices')}</SelectItem>
                  <SelectItem value="online">{t('admin.devices.online')}</SelectItem>
                  <SelectItem value="offline">{t('admin.devices.offline')}</SelectItem>
                  <SelectItem value="maintenance">{t('admin.devices.maintenance')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="all" className="hidden lg:block lg:col-span-2" onValueChange={setCurrentFilter} value={currentFilter}>
              <TabsList className="grid grid-cols-4 md:w-[400px]">
                <TabsTrigger value="all">{t('admin.devices.allDevices')}</TabsTrigger>
                <TabsTrigger value="online">{t('admin.devices.online')}</TabsTrigger>
                <TabsTrigger value="offline">{t('admin.devices.offline')}</TabsTrigger>
                <TabsTrigger value="maintenance">{t('admin.devices.maintenance')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="shadow-sm">
                  <CardHeader className="px-4 pb-2">
                    <Skeleton className="h-5 w-28" />
                  </CardHeader>
                  <CardContent className="px-4 py-3">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Loading Devices</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredDevices.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Cpu className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No devices found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery || currentFilter !== "all" 
                  ? "Try adjusting your filters" 
                  : "No devices are currently registered in the system."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredDevices.map((device: Device) => (
                <Card 
                  key={device.deviceId} 
                  className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleDeviceClick(device)}
                >
                  <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-1.5">
                      <CardTitle className="text-base">{device.deviceType || "Device"} {device.deviceIndex || ""}</CardTitle>
                      <CardDescription className="text-xs hidden md:flex items-center">
                        ID: {device.deviceId}
                      </CardDescription>
                    </div>
                    {getStatusBadge(device.status)}
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="truncate">
                          <p className="text-muted-foreground text-xs">Model</p>
                          <p className="font-medium truncate max-w-[120px]">{device.model || "Unknown"}</p>
                        </div>
                        <div className="hidden sm:block truncate">
                          <p className="text-muted-foreground text-xs">Firmware</p>
                          <p className="font-medium truncate max-w-[120px]">{device.firmwareVersion || "Unknown"}</p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        Last seen: {formatDate(device.lastConnected)}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 border-t mt-2 flex justify-end">
                    <Button variant="ghost" size="sm" className="gap-1 h-8">
                      Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="md:max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                {deviceDetails?.device?.deviceType || "Device"} {deviceDetails?.device?.deviceIndex || ""} Details
              </DialogTitle>
              <DialogDescription>
                Device ID: {deviceDetails?.device?.deviceId}
              </DialogDescription>
            </DialogHeader>

            {!deviceDetails ? (
              <div className="flex flex-col space-y-4 p-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <ScrollArea className="flex-1 overflow-auto pr-4">
                <div className="space-y-6 p-1">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Device Information</h3>
                      {getStatusBadge(deviceDetails.device.status)}
                    </div>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium">Model</h4>
                          <p className="text-sm">{deviceDetails.device.model || "Unknown"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Firmware Version</h4>
                          <p className="text-sm">{deviceDetails.device.firmwareVersion || "Unknown"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Device Type</h4>
                          <p className="text-sm">{deviceDetails.device.deviceType || "Unknown"}</p>
                        </div>
                      </div>
                      <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium">Registered</h4>
                          <p className="text-sm">{formatDate(deviceDetails.device.registeredAt)}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Last Connected</h4>
                          <p className="text-sm">{formatDate(deviceDetails.device.lastConnected)}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Uptime (Last 24h)</h4>
                          <p className="text-sm">{deviceDetails.device.uptime?.last24Hours || "Unknown"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {deviceDetails.campsites && deviceDetails.campsites.length > 0 && (
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Associated Campsites</h3>
                      <div className="space-y-4">
                        {deviceDetails.campsites.map((campsite: Campsite) => (
                          <div key={campsite.campsiteId} className="bg-muted/30 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium">{campsite.campsiteName}</h4>
                              <Badge 
                                className={cn(
                                  campsite.status === "available" && "bg-green-100 text-green-800",
                                  campsite.status === "occupied" && "bg-blue-100 text-blue-800",
                                  campsite.status === "maintenance" && "bg-yellow-100 text-yellow-800"
                                )}
                              >
                                {campsite.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-3">
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-muted-foreground mb-1">Electricity</span>
                                {campsite.currentState.electricity ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-muted-foreground mb-1">Water</span>
                                {campsite.currentState.water ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-muted-foreground mb-1">Barrier</span>
                                {campsite.currentState.barrier ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                            </div>
                            {campsite.activeBooking && (
                              <div className="mt-3 pt-3 border-t border-border/40">
                                <h5 className="text-sm font-medium mb-2">Active Booking</h5>
                                <div className="text-xs space-y-1">
                                  <p className="text-muted-foreground">
                                    <span className="font-medium text-foreground">{campsite.activeBooking.user.fullName}</span>{' '}
                                    ({campsite.activeBooking.user.email})
                                  </p>
                                  <p className="text-muted-foreground">
                                    {formatDate(campsite.activeBooking.startDate)} - {formatDate(campsite.activeBooking.endDate)}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {deviceDetails.connectionHistory && deviceDetails.connectionHistory.length > 0 && (
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Connection History</h3>
                      <div className="max-h-48 overflow-y-auto pr-2 border rounded-lg divide-y">
                        {deviceDetails.connectionHistory.map((event: ConnectionEvent, index: number) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 text-sm">
                            <div className="flex items-center">
                              {event.status === "online" ? (
                                <Wifi className="h-4 w-4 text-green-600 mr-2" />
                              ) : (
                                <WifiOff className="h-4 w-4 text-red-600 mr-2" />
                              )}
                              <span>{event.status}</span>
                              {event.previousStatus && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  from {event.previousStatus}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(event.timestamp)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}

            <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4">
              <TooltipProvider>
                <div className="flex flex-wrap gap-2 justify-between w-full">
                  <div className="space-x-2">
                    {deviceDetails?.controls?.canReboot && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCommandParams({
                                ...commandParams,
                                deviceId: deviceDetails.device.deviceId,
                                commandType: "reboot",
                                parameters: {},
                                campsiteId: deviceDetails?.campsites?.[0]?.campsiteId || "",
                                reason: ""
                              });
                              setCommandDialogOpen(true);
                            }}
                          >
                            <RotateCw className="h-4 w-4 mr-2" />
                            Reboot
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reboot the device</TooltipContent>
                      </Tooltip>
                    )}

                    {deviceDetails?.controls?.canSetMaintenance && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={deviceDetails?.device?.status === "maintenance" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleOpenMaintenanceDialog(
                              deviceDetails.device,
                              deviceDetails?.device?.status !== "maintenance"
                            )}
                          >
                            <Wrench className="h-4 w-4 mr-2" />
                            {deviceDetails?.device?.status === "maintenance" ? "End Maintenance" : "Set Maintenance"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {deviceDetails?.device?.status === "maintenance" 
                            ? "Remove device from maintenance mode" 
                            : "Put device in maintenance mode"}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>

                  <div className="space-x-2">
                    {deviceDetails?.controls?.canSendCommand && deviceDetails?.campsites?.[0] && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenCommandDialog(deviceDetails.device)}
                          >
                            <Power className="h-4 w-4 mr-2" />
                            Control
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Control campsite utilities</TooltipContent>
                      </Tooltip>
                    )}
                    
                    <Button variant="ghost" size="sm" asChild>
                      <DialogClose>Cancel</DialogClose>
                    </Button>
                  </div>
                </div>
              </TooltipProvider>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={commandDialogOpen} onOpenChange={setCommandDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Send Command to Device</DialogTitle>
              <DialogDescription>
                Control utilities for the selected campsite
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="command-type">Command Type</Label>
                <Select 
                  onValueChange={(value) => setCommandParams({...commandParams, commandType: value})}
                  value={commandParams.commandType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select command type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toggleElectricity">Toggle Electricity</SelectItem>
                    <SelectItem value="toggleWater">Toggle Water</SelectItem>
                    <SelectItem value="toggleBarrier">Toggle Barrier</SelectItem>
                    <SelectItem value="reboot">Reboot Device</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {deviceDetails?.campsites && deviceDetails.campsites.length > 1 && (
                <div className="space-y-2">
                  <Label htmlFor="campsite">Campsite</Label>
                  <Select 
                    onValueChange={(value) => setCommandParams({...commandParams, campsiteId: value})}
                    value={commandParams.campsiteId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select campsite" />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceDetails?.campsites?.map((campsite: Campsite) => (
                        <SelectItem key={campsite.campsiteId} value={campsite.campsiteId}>
                          {campsite.campsiteName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Provide a reason for this action"
                  value={commandParams.reason}
                  onChange={(e) => setCommandParams({...commandParams, reason: e.target.value})}
                  className="resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" size="sm" onClick={() => setCommandDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmCommand} 
                disabled={!commandParams.commandType || isActionLoading}
                className="gap-2"
              >
                {isActionLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
                Send Command
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {maintenanceParams.maintenanceMode 
                  ? "Place Device in Maintenance Mode" 
                  : "Remove Device from Maintenance Mode"}
              </DialogTitle>
              <DialogDescription>
                {maintenanceParams.maintenanceMode 
                  ? "This will disable the device until maintenance is complete." 
                  : "This will re-enable the device for normal operation."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="maintenance-reason">Reason</Label>
                <Textarea
                  id="maintenance-reason"
                  placeholder="Provide a reason for this action"
                  value={maintenanceParams.reason}
                  onChange={(e) => setMaintenanceParams({...maintenanceParams, reason: e.target.value})}
                  className="resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" size="sm" onClick={() => setMaintenanceDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmMaintenance} 
                disabled={!maintenanceParams.reason || isActionLoading}
                variant={maintenanceParams.maintenanceMode ? "default" : "secondary"}
                className="gap-2"
              >
                {isActionLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
                {maintenanceParams.maintenanceMode 
                  ? "Set Maintenance Mode" 
                  : "End Maintenance Mode"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </AuthGuard>
  );
}