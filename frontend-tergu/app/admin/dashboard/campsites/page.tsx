"use client"

import React, { useEffect, useState } from "react"
import {
  Tent,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  CircleDot, // Available
  Timer, // Occupied
  Wrench, // Maintenance
  AlertTriangle,
  ChevronRight,
  Power, // Control
  PlugZap, // Electricity
  Droplets, // Water
  DoorClosed, // Barrier
  Cpu, // Device
  User, // User
  CalendarDays, // Booking
  Info // Details
} from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Types
interface CampsiteBasic {
  campsiteId: string;
  campsiteName: string;
  status: 'available' | 'occupied' | 'maintenance' | 'unknown';
  deviceId?: string;
  lastUpdated?: string;
  maintenanceReason?: string;
}

interface CampsiteDetail extends CampsiteBasic {
  currentState: {
    electricity: boolean;
    water: boolean;
    barrier: boolean;
  } | null;
  device?: {
    deviceId: string;
    status: string;
    model?: string;
    firmwareVersion?: string;
  } | null;
  activeBooking?: {
    bookingId: string;
    startDate: string;
    endDate: string;
    user: {
      userId: string;
      email: string;
      fullName: string;
    } | null;
  } | null;
  controls?: {
    canSetMaintenance?: boolean;
    canControlUtilities?: boolean;
  };
  commandHistory?: any[];
  bookingHistory?: any[];
}

interface ControlParams {
  campsiteId: string;
  commandType: 'toggleElectricity' | 'toggleWater' | 'toggleBarrier' | '';
  reason: string;
}

interface MaintenanceParams {
  campsiteId: string;
  maintenanceMode: boolean;
  reason: string;
}

interface SendCommandParams {
  campsiteId: string;
  commandType: ControlParams['commandType'];
  reason: string;
  currentState: CampsiteDetail['currentState'];
}

// API Functions
const fetchCampsites = async (): Promise<{ campsites: CampsiteBasic[] }> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/campsites`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch campsites");
  return response.json();
};

const fetchCampsiteDetails = async (campsiteId: string): Promise<CampsiteDetail> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/campsites/${campsiteId}/details`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch campsite details");
  return response.json();
};

const sendCampsiteCommand = async (params: SendCommandParams): Promise<any> => {
  if (!params.currentState) {
    throw new Error("Cannot determine toggle state: Current state information is missing.");
  }

  let utility: string;
  let state: boolean;

  switch (params.commandType) {
    case 'toggleElectricity':
      utility = 'electricity';
      state = !params.currentState.electricity;
      break;
    case 'toggleWater':
      utility = 'water';
      state = !params.currentState.water;
      break;
    case 'toggleBarrier':
      utility = 'barrier';
      state = !params.currentState.barrier;
      break;
    default:
      throw new Error(`Invalid command type: ${params.commandType}`);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/campsites/${params.campsiteId}/control`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ utility, state, reason: params.reason }),
  });
  if (!response.ok) throw new Error("Failed to send command");
  return response.json();
};

const setCampsiteMaintenance = async (params: MaintenanceParams): Promise<any> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/campsites/${params.campsiteId}/maintenance`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ maintenanceMode: params.maintenanceMode, reason: params.reason }),
  });
  if (!response.ok) throw new Error("Failed to set maintenance mode");
  return response.json();
};

export default function CampsitesPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [campsites, setCampsites] = useState<CampsiteBasic[]>([]);
  const [filteredCampsites, setFilteredCampsites] = useState<CampsiteBasic[]>([]);
  const [selectedCampsite, setSelectedCampsite] = useState<CampsiteBasic | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [campsiteDetails, setCampsiteDetails] = useState<CampsiteDetail | null>(null);
  const [controlDialogOpen, setControlDialogOpen] = useState<boolean>(false);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState<boolean>(false);
  const [controlParams, setControlParams] = useState<ControlParams>({ campsiteId: "", commandType: "", reason: "" });
  const [maintenanceParams, setMaintenanceParams] = useState<MaintenanceParams>({ campsiteId: "", maintenanceMode: false, reason: "" });
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  useEffect(() => {
    loadCampsites();
  }, []);

  useEffect(() => {
    filterCampsites();
  }, [searchQuery, currentFilter, campsites]);

  const loadCampsites = async () => {
    setIsLoading(true);
    setError(null);
    setIsRefreshing(true);
    try {
      const data = await fetchCampsites();
      setCampsites(data.campsites || []);
    } catch (err: any) {
      setError(err.message || "Failed to load campsites");
      toast({ title: "Error", description: "Failed to load campsites.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const filterCampsites = () => {
    let filtered: CampsiteBasic[] = [...campsites];
    if (currentFilter !== "all") {
      filtered = filtered.filter(c => c.status === currentFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.campsiteName.toLowerCase().includes(query) ||
        c.campsiteId.toLowerCase().includes(query) ||
        c.deviceId?.toLowerCase().includes(query)
      );
    }
    setFilteredCampsites(filtered);
  };

  const handleCampsiteClick = async (campsite: CampsiteBasic) => {
    setSelectedCampsite(campsite);
    setDetailsOpen(true);
    setCampsiteDetails(null);
    try {
      const details = await fetchCampsiteDetails(campsite.campsiteId);
      setCampsiteDetails(details);
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to fetch campsite details.", variant: "destructive" });
      setDetailsOpen(false);
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateString));
  };

  const handleOpenControlDialog = (campsiteId: string) => {
    setControlParams({ ...controlParams, campsiteId, commandType: "", reason: "" });
    setControlDialogOpen(true);
  };

  const handleOpenMaintenanceDialog = (campsiteId: string, isEnteringMaintenance: boolean) => {
    setMaintenanceParams({ campsiteId, maintenanceMode: isEnteringMaintenance, reason: "" });
    setMaintenanceDialogOpen(true);
  };

  const confirmControl = async () => {
    if (!controlParams.commandType) {
      toast({ title: "Error", description: "Please select a command type.", variant: "destructive" });
      return;
    }
    if (!campsiteDetails) {
      toast({ title: "Error", description: "Campsite details unavailable, cannot send command.", variant: "destructive" });
      return;
    }

    setIsActionLoading(true);
    try {
      const commandToSend: SendCommandParams = {
        ...controlParams,
        currentState: campsiteDetails.currentState,
      };

      await sendCampsiteCommand(commandToSend);
      toast({ title: "Success", description: `Command '${controlParams.commandType}' sent.` });

      const details = await fetchCampsiteDetails(controlParams.campsiteId);
      setCampsiteDetails(details);
      loadCampsites();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to send command.", variant: "destructive" });
    } finally {
      setIsActionLoading(false);
      setControlDialogOpen(false);
    }
  };

  const confirmMaintenance = async () => {
    if (!maintenanceParams.reason) {
        toast({ title: "Error", description: "Please provide a reason.", variant: "destructive" });
        return;
      }
    setIsActionLoading(true);
    try {
      await setCampsiteMaintenance(maintenanceParams);
      toast({ title: "Success", description: `Campsite maintenance status updated.` });
      const details = await fetchCampsiteDetails(maintenanceParams.campsiteId);
      setCampsiteDetails(details);
      loadCampsites();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update maintenance status.", variant: "destructive" });
    } finally {
      setIsActionLoading(false);
      setMaintenanceDialogOpen(false);
    }
  };

  const getStatusBadge = (status: CampsiteBasic['status']) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800"><CircleDot className="h-3 w-3 mr-1" />Available</Badge>;
      case "occupied":
        return <Badge className="bg-blue-100 text-blue-800"><Timer className="h-3 w-3 mr-1" />Occupied</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800"><Wrench className="h-3 w-3 mr-1" />Maintenance</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const UtilityStatusIcon = ({ state }: { state: boolean }) => (
    state ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />
  );

  return (
    <AuthGuard requireAdmin>
      <AdminLayout>
        <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Campsite Management</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">Monitor and manage all campsites</p>
            </div>
            <Button variant="outline" size="sm" onClick={loadCampsites} disabled={isRefreshing} className="h-9 gap-2">
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} /> Refresh
            </Button>
          </div>

          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search campsites..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Tabs defaultValue="all" className="md:col-span-2" onValueChange={setCurrentFilter}>
              <TabsList className="grid grid-cols-4 md:w-[400px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="available">Available</TabsTrigger>
                <TabsTrigger value="occupied">Occupied</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Campsite List */}
          {isLoading ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}><CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2 mt-2" /></CardContent></Card>
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
          ) : filteredCampsites.length === 0 ? (
            <div className="text-center py-8"><div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4"><Tent className="h-6 w-6 text-muted-foreground" /></div><h3 className="text-lg font-medium">No campsites found</h3><p className="text-muted-foreground mt-1">{searchQuery || currentFilter !== "all" ? "Try adjusting filters." : "No campsites registered."}</p></div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredCampsites.map((campsite) => (
                <Card key={campsite.campsiteId} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCampsiteClick(campsite)}>
                  <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-1.5"><CardTitle className="text-base">{campsite.campsiteName}</CardTitle><CardDescription className="text-xs">ID: {campsite.campsiteId}</CardDescription></div>
                    {getStatusBadge(campsite.status)}
                  </CardHeader>
                  <CardContent className="p-4 pt-2 text-sm">
                    <div className="flex items-center text-muted-foreground text-xs mb-2">
                       <Cpu className="h-3.5 w-3.5 mr-1.5" /> Device: {campsite.deviceId || 'N/A'}
                    </div>
                    <div className="flex items-center text-muted-foreground text-xs">
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Updated: {formatDate(campsite.lastUpdated)}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 border-t mt-2 flex justify-end">
                    <Button variant="ghost" size="sm" className="gap-1 h-8">Details <ChevronRight className="h-4 w-4" /></Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Campsite Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="md:max-w-3xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{campsiteDetails?.campsiteName || "Campsite"} Details</DialogTitle>
              <DialogDescription>ID: {campsiteDetails?.campsiteId}</DialogDescription>
            </DialogHeader>

            {!campsiteDetails ? (
              <div className="flex-1 p-4"><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4 mt-2" /></div>
            ) : (
              <ScrollArea className="flex-1 overflow-auto pr-4">
                <div className="space-y-6 p-1">
                  {/* Status & Device */}
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                       <h4 className="text-sm font-medium flex items-center justify-between">
                         Status {campsiteDetails.status ? getStatusBadge(campsiteDetails.status) : <Badge variant="secondary">Unknown</Badge>}
                       </h4>
                       <p className="text-sm">Current status: {campsiteDetails.status || 'Unknown'}</p>
                       {campsiteDetails.status === 'maintenance' && campsiteDetails.maintenanceReason && (
                         <p className="text-xs text-muted-foreground">Reason: {campsiteDetails.maintenanceReason}</p>
                       )}
                    </div>
                     <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                       <h4 className="text-sm font-medium flex items-center"><Cpu className="h-4 w-4 mr-2"/>Associated Device</h4>
                       <p className="text-sm">Device ID: {campsiteDetails.device?.deviceId || 'N/A'}</p>
                       <p className="text-sm">Device Status: {campsiteDetails.device?.status || 'N/A'}</p>
                       <p className="text-sm">Model: {campsiteDetails.device?.model || 'N/A'}</p>
                       <p className="text-sm">Firmware: {campsiteDetails.device?.firmwareVersion || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Current State */}
                  {campsiteDetails.currentState ? (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Current Utility State</h3>
                      <div className="grid grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
                         <div className="flex flex-col items-center space-y-1">
                           <PlugZap className="h-5 w-5 text-muted-foreground"/>
                           <span className="text-xs font-medium">Electricity</span>
                           <UtilityStatusIcon state={campsiteDetails.currentState.electricity} />
                         </div>
                          <div className="flex flex-col items-center space-y-1">
                           <Droplets className="h-5 w-5 text-muted-foreground"/>
                           <span className="text-xs font-medium">Water</span>
                           <UtilityStatusIcon state={campsiteDetails.currentState.water} />
                         </div>
                         <div className="flex flex-col items-center space-y-1">
                           <DoorClosed className="h-5 w-5 text-muted-foreground"/>
                           <span className="text-xs font-medium">Barrier</span>
                           <UtilityStatusIcon state={campsiteDetails.currentState.barrier} />
                         </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-right">Last State Update: {formatDate(campsiteDetails.lastUpdated)}</p>
                    </div>
                  ) : (
                    <div className="pt-4 border-t text-center text-muted-foreground text-sm">
                      Current utility state information is unavailable.
                    </div>
                  )}

                  {/* Active Booking */}
                  {campsiteDetails.activeBooking ? (
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-3 flex items-center"><CalendarDays className="h-5 w-5 mr-2"/>Active Booking</h3>
                      <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-2">
                        <p className="flex items-center"><User className="h-4 w-4 mr-2 text-muted-foreground"/> {campsiteDetails.activeBooking.user?.fullName || 'Unknown User'} ({campsiteDetails.activeBooking.user?.email || 'No Email'})</p>
                        <p className="text-muted-foreground">Booking ID: {campsiteDetails.activeBooking.bookingId}</p>
                        <p className="text-muted-foreground">Dates: {formatDate(campsiteDetails.activeBooking.startDate)} - {formatDate(campsiteDetails.activeBooking.endDate)}</p>
                      </div>
                    </div>
                  ) : (
                     <div className="pt-4 border-t text-center text-muted-foreground text-sm">
                       No active booking.
                    </div>
                  )}
                  
                   {/* Recent Command History */}
                  {campsiteDetails.commandHistory && campsiteDetails.commandHistory.length > 0 && (
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
                      <ScrollArea className="max-h-48 border rounded-lg">
                        <div className="divide-y">
                          {campsiteDetails.commandHistory.map((cmd: any, index: number) => {
                            let title = 'Unknown Action';
                            let details = cmd.reason || 'No reason provided';
                            
                            if (cmd.type === 'admin_command' || cmd.type === 'command') {
                                if (cmd.utility && cmd.state !== undefined) {
                                    title = `Utility Control (${cmd.utility})`;
                                    details = `Set to ${cmd.state ? 'ON' : 'OFF'}${cmd.reason ? ` - ${cmd.reason}` : ''} by ${cmd.source || 'system'}`;
                                } else if (cmd.commandType === 'reboot') {
                                    title = 'Device Reboot';
                                    details = `Requested by ${cmd.source || 'system'}${cmd.reason ? ` - ${cmd.reason}` : ''}`;
                                } else {
                                    title = cmd.commandType || cmd.type || 'Command'; // Fallback title
                                }
                            } else if (cmd.type === 'maintenance_update') {
                                title = 'Maintenance Mode';
                                details = `${cmd.action === 'enable_maintenance' ? 'Enabled' : 'Disabled'}${cmd.reason ? ` - ${cmd.reason}` : ''} by admin`;
                            } else if (cmd.type) {
                                title = cmd.type; // Fallback for other types
                            }

                            return (
                              <div key={index} className="flex items-center justify-between py-2 px-3 text-sm">
                                <div className="flex flex-col">
                                  <span className="font-medium">{title}</span>
                                  <span className="text-xs text-muted-foreground">{details}</span>
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap pl-2">
                                  {formatDate(cmd.timestamp)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                  
                  {/* Booking History */}
                  {campsiteDetails.bookingHistory && campsiteDetails.bookingHistory.length > 0 && (
                     <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-3">Booking History</h3>
                       <ScrollArea className="max-h-48 border rounded-lg">
                         <div className="divide-y">
                          {campsiteDetails.bookingHistory.map((booking: any, index: number) => (
                            <div key={booking.bookingId || index} className="flex items-center justify-between py-2 px-3 text-sm">
                              <div className="flex flex-col">
                                <span className="font-medium">{booking.user?.fullName || 'Unknown User'}</span>
                                <span className="text-xs text-muted-foreground">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                              </div>
                              <Badge variant={booking.status === 'completed' ? 'outline' : booking.status === 'cancelled' ? 'destructive' : 'secondary'} className="ml-2">
                                {booking.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                  
                  {/* Usage Metrics (if available) */}
                  {/* Add display logic for usageMetrics if needed */}
                  
                </div>
              </ScrollArea>
            )}

            <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4">
              <TooltipProvider>
                <div className="flex flex-wrap gap-2 justify-between w-full">
                  <div className="space-x-2">
                    {campsiteDetails?.controls?.canSetMaintenance && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={campsiteDetails?.status === "maintenance" ? "default" : "outline"}
                            size="sm"
                            onClick={() => campsiteDetails && handleOpenMaintenanceDialog(campsiteDetails.campsiteId, campsiteDetails?.status !== "maintenance")}
                            disabled={!campsiteDetails}
                          >
                            <Wrench className="h-4 w-4 mr-2" />
                            {campsiteDetails?.status === "maintenance" ? "End Maintenance" : "Set Maintenance"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{campsiteDetails?.status === "maintenance" ? "Remove from maintenance" : "Put in maintenance"}</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <div className="space-x-2">
                     {campsiteDetails?.controls?.canControlUtilities && campsiteDetails?.currentState && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => campsiteDetails && handleOpenControlDialog(campsiteDetails.campsiteId)}
                            disabled={!campsiteDetails}
                           >
                            <Power className="h-4 w-4 mr-2" /> Control Utilities
                          </Button>
                        </TooltipTrigger>
                         <TooltipContent>Toggle electricity, water, or barrier</TooltipContent>
                      </Tooltip>
                    )}
                    <Button variant="ghost" size="sm" asChild><DialogClose>Close</DialogClose></Button>
                  </div>
                </div>
              </TooltipProvider>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Control Dialog */}
        <Dialog open={controlDialogOpen} onOpenChange={setControlDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Control Campsite Utilities</DialogTitle><DialogDescription>Select a utility to toggle its state.</DialogDescription></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="command-type">Utility Command</Label>
                <Select onValueChange={(value: ControlParams['commandType']) => setControlParams({...controlParams, commandType: value})} value={controlParams.commandType}>
                  <SelectTrigger><SelectValue placeholder="Select utility command" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toggleElectricity">Toggle Electricity</SelectItem>
                    <SelectItem value="toggleWater">Toggle Water</SelectItem>
                    <SelectItem value="toggleBarrier">Toggle Barrier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea id="reason" placeholder="Reason for action..." value={controlParams.reason} onChange={(e) => setControlParams({...controlParams, reason: e.target.value})} className="resize-none"/>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" size="sm" onClick={() => setControlDialogOpen(false)}>Cancel</Button>
              <Button onClick={confirmControl} disabled={!controlParams.commandType || isActionLoading} className="gap-2">
                {isActionLoading && <RefreshCw className="h-4 w-4 animate-spin" />} Send Command
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Maintenance Dialog */}
        <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{maintenanceParams.maintenanceMode ? "Set Maintenance Mode" : "End Maintenance Mode"}</DialogTitle>
              <DialogDescription>{maintenanceParams.maintenanceMode ? "Set campsite unavailable for maintenance." : "Make campsite available again."}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="maintenance-reason">Reason</Label>
                <Textarea id="maintenance-reason" placeholder="Reason for action..." value={maintenanceParams.reason} onChange={(e) => setMaintenanceParams({...maintenanceParams, reason: e.target.value})} className="resize-none"/>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" size="sm" onClick={() => setMaintenanceDialogOpen(false)}>Cancel</Button>
              <Button onClick={confirmMaintenance} disabled={!maintenanceParams.reason || isActionLoading} variant={maintenanceParams.maintenanceMode ? "default" : "secondary"} className="gap-2">
                {isActionLoading && <RefreshCw className="h-4 w-4 animate-spin" />} Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </AuthGuard>
  );
} 