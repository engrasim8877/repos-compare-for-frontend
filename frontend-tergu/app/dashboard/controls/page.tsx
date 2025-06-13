"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Zap, 
  Droplet, 
  AlertTriangle, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  CalendarDays,
  BadgePlus,
  Loader2
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthGuard } from "@/components/auth-guard"
import { getAuthHeaders, getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { CampsiteSelector } from "@/components/campsite-selector"
import { motion } from "framer-motion"

// Simple Traffic Barrier SVG Component
const TrafficBarrier = ({ isOpen, isAnimating }) => {
  const pivotX = 10;
  const pivotY = 90;
  const armWidth = 80;
  const armHeight = 10;

  const variants = {
    closed: { rotate: 0 },
    open: { rotate: -90 },
    // Adjusted animation state names to match usage
    opening: { rotate: -90, transition: { duration: 1.5, ease: "easeInOut" } },
    closing: { rotate: 0, transition: { duration: 1.5, ease: "easeInOut" } },
  };

  // Determine the current animation state based on props
  const animationState = isAnimating ? (isOpen ? "opening" : "closing") : (isOpen ? "open" : "closed");

  return (
    <svg viewBox="0 0 100 100" className="w-36 h-36 md:w-40 md:h-40 mx-auto">
      {/* Base */}
      <rect x="5" y="85" width="10" height="15" fill="#4A5568" rx="2" />
      {/* Pivot */}
      <circle cx={pivotX} cy={pivotY} r="3" fill="#718096" />
      {/* Arm */}
      <motion.rect 
        x={pivotX}
        y={pivotY - armHeight / 2}
        width={armWidth}
        height={armHeight}
        fill="#E53E3E" // Red color for the arm
        rx="3"
        style={{ originX: `${pivotX}px`, originY: `${pivotY}px`, transformOrigin: `${pivotX}px ${pivotY}px` }} // Ensure transform origin is set
        initial={isOpen ? "open" : "closed"} // Set initial based on state
        animate={animationState} // Animate based on calculated state
        variants={variants}
      />
      {/* Optional stripes on arm */}
      {[...Array(4)].map((_, i) => (
        <motion.rect
          key={i}
          x={pivotX + 15 + (i * 15)}
          y={pivotY - armHeight / 2 + 1}
          width={8}
          height={armHeight - 2}
          fill="white"
          rx="1"
          style={{ originX: `${pivotX}px`, originY: `${pivotY}px`, transformOrigin: `${pivotX}px ${pivotY}px` }} // Ensure transform origin is set
          initial={isOpen ? "open" : "closed"}
          animate={animationState}
          variants={variants}
        />
      ))}
    </svg>
  );
};

export default function CampsiteControlsPage() {
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true) // For initial load
  const [isRefreshing, setIsRefreshing] = useState(false) // For manual refresh button
  const [isUpdating, setIsUpdating] = useState<{[key: string]: boolean}>({}) // For individual controls
  const [error, setError] = useState<string | null>(null)
  const [noActiveBooking, setNoActiveBooking] = useState(false)
  const [deviceOffline, setDeviceOffline] = useState(false)
  const [selectedCampsiteId, setSelectedCampsiteId] = useState<string | null>(null)
  const [barrierAnimation, setBarrierAnimation] = useState<"opening" | "closing" | "idle">("idle")
  
  useEffect(() => {
    const userData = getUser()
    if (userData) {
      setUser(userData)
    }
    // Fetch initial profile data which includes the default campsite
    fetchUserProfile();
  }, [])

  // Effect to fetch specific campsite state when selectedCampsiteId changes
  useEffect(() => {
    if (selectedCampsiteId && !profileData) { // Fetch only if selected and no data yet
      fetchCampsiteState(selectedCampsiteId)
    }
  }, [selectedCampsiteId])

  const fetchUserProfile = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
         const errorText = await response.text();
         console.error("Profile fetch error:", errorText);
        throw new Error("Failed to fetch profile data")
      }

      const data = await response.json()
      setProfileData(data)
      
      // Check if the user has an active booking
      if (!data.activeBooking || Object.keys(data.activeBooking).length === 0) {
        setNoActiveBooking(true)
        setIsLoading(false) // Stop loading if no booking
        return;
      }
      
      // Set the initially selected campsite from profile
      if (data.campsite) {
        setSelectedCampsiteId(data.campsite.campsiteId);
        // Update offline status based on initial profile data
        if (data.campsite.device?.status === 'offline') {
           setDeviceOffline(true);
        } else {
           setDeviceOffline(false);
        }
      } else {
        // Handle case where profile might not have a campsite initially
        console.warn("No campsite found in user profile data.");
        // Optionally, fetch available campsites if needed
      }

    } catch (err: any) {
      console.error("Error fetching profile data:", err)
      setError(err.message || "Failed to load profile data")
      toast({
        title: "Error",
        description: "Failed to load your profile data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetches state for a specific campsiteId
  const fetchCampsiteState = async (campsiteId: string, isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else if (!profileData) { // Show initial loading only if no data exists yet
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campsites/${campsiteId}/state`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`State fetch error for ${campsiteId}:`, errorText);
        throw new Error("Failed to fetch campsite state")
      }

      const data = await response.json()
      
      // ** FIXED: Correctly merge fetched state into profileData **
      setProfileData(prev => {
        // If there's no previous data (e.g., first load after selection), use the fetched data directly
        if (!prev) {
            // Structure the initial data based on fetched state
            return {
                campsite: { // Nest campsite info
                   campsiteId: data.campsite?.campsiteId,
                   campsiteName: data.campsite?.campsiteName,
                   status: data.campsite?.status,
                   device: data.device, 
                   currentState: data.state // Put state here
                },
                // Include other potential top-level fields if they exist in your full profile structure
                // activeBooking: {}, // Example
                // user: {}, // Example
                lastUpdated: data.lastUpdated
            };
        }

        // If previous data exists, merge carefully
        
        // Exclude barrier state from the fetched data before merging
        const { barrier, ...restOfState } = data.state || {};
        
        return {
          ...prev,
          campsite: {
            ...(prev.campsite || {}), // Keep existing campsite info
            // Update specific campsite details if provided by the state endpoint
            ...(data.campsite && { 
              campsiteId: data.campsite.campsiteId, 
              campsiteName: data.campsite.campsiteName, 
              status: data.campsite.status 
            }),
            // Update device info within the campsite object
            device: {
              ...(prev.campsite?.device || {}), // Keep existing device info
              ...(data.device || {})          // Overwrite with new device info
            },
            // Merge the fetched state into currentState, EXCLUDING barrier
            currentState: {
              ...(prev.campsite?.currentState || {}), // Keep previous state fields
              ...restOfState // Overwrite with fetched state fields (without barrier)
            }
          },
          lastUpdated: data.lastUpdated || prev.lastUpdated // Update top-level lastUpdated if needed
        };
      });
      
      // Update device offline status based on fetched data
      setDeviceOffline(data.device?.status === 'offline');
      
    } catch (err: any) {
      console.error("Error fetching campsite state:", err)
      setError(err.message || "Failed to load campsite state")
      toast({
        title: "Error",
        description: "Failed to load campsite state. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false) // Turn off initial loading
      setIsRefreshing(false) // Turn off manual refresh loading
    }
  }

  const handleCampsiteSelect = (campsiteId: string) => {
    setSelectedCampsiteId(campsiteId)
    // Immediately fetch state for the newly selected campsite
    // We don't clear profileData here, fetchCampsiteState handles merging/setting
    fetchCampsiteState(campsiteId)
  }

  const toggleUtility = async (campsiteId: string, utilityType: string, currentState: boolean) => {
    if (!campsiteId) {
      toast({ title: "Error", description: "No campsite selected.", variant: "destructive" });
      return;
    }
    if (deviceOffline) {
      toast({ title: "Device Offline", description: "Cannot send commands.", variant: "destructive" });
      return;
    }
    
    setIsUpdating(prev => ({...prev, [utilityType]: true}))
    if (utilityType === "barrier") {
      setBarrierAnimation(!currentState ? "opening" : "closing");
    }
    
    // Optimistically update the UI *correctly*
    setProfileData((prevData: any) => {
      if (!prevData?.campsite?.currentState) return prevData; // Safety check
      return {
        ...prevData,
        campsite: {
          ...prevData.campsite,
          currentState: {
            ...prevData.campsite.currentState,
            [utilityType]: !currentState, // Set the new state
          }
        }
      };
    });

    try {
      const commandType = utilityType === "electricity" ? "setElectricity" : "setBarrier";
      const newState = !currentState;

      const commandPayload = { type: commandType, state: newState };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campsites/${campsiteId}/command`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ command: commandPayload }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API command error ${response.status}: ${errorText}`);
        let errorMessage = `Failed to toggle ${utilityType}`;
        try {
          errorMessage = JSON.parse(errorText).message || errorMessage;
        } catch (e) { /* Ignore parsing error */ }
        throw new Error(errorMessage);
      }

      // Command successful
      toast({
        title: "Command Sent",
        description: `${utilityType.charAt(0).toUpperCase() + utilityType.slice(1)} command successful.`,
      });

      // Reset barrier animation after a short delay on success
      if (utilityType === "barrier") {
        setTimeout(() => setBarrierAnimation("idle"), 2000);
      }

      // ** FIX: Fetch state *after* a longer delay to allow backend to update **
      setTimeout(() => {
        fetchCampsiteState(campsiteId); // Fetch the confirmed state
      }, 2500); // Increased delay to 2.5 seconds

    } catch (err: any) {
      console.error(`Error toggling ${utilityType}:`, err);

      // Revert optimistic update on error
      setProfileData((prevData: any) => {
         if (!prevData?.campsite?.currentState) return prevData; // Safety check
         // Only revert if the current state is the optimistic one
         if (prevData.campsite.currentState[utilityType] !== currentState) {
            return {
               ...prevData,
               campsite: {
                  ...prevData.campsite,
                  currentState: {
                  ...prevData.campsite.currentState,
                  [utilityType]: currentState, // Revert to original state
                  }
               }
            };
         }
         return prevData; // No reversion needed
      });

      if (utilityType === "barrier") {
        setBarrierAnimation("idle"); // Reset animation on error
      }

      toast({ title: "Error", description: err.message, variant: "destructive" });

    } finally {
       // Clear loading state after potential state refresh delay
       // This needs to account for the fetchCampsiteState delay inside setTimeout
       setTimeout(() => {
         setIsUpdating(prev => ({...prev, [utilityType]: false}))
       }, 3000); // Ensure this runs after the state fetch timeout
    }
  }

  // --- UI Components --- 

  // Loading state for initial page load
  if (isLoading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex flex-col gap-6 max-w-xl mx-auto py-8">
            {/* Header Skeleton */}
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-64" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </div>
            {/* Controls Skeleton */}
            <div className="flex flex-col gap-6">
              {Array(3).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden border shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-8 w-16 rounded-md" />
                    </div>
                    {/* Barrier skeleton */}
                    {i === 2 && (
                      <div className="mt-6 flex flex-col items-center gap-4">
                        <Skeleton className="h-40 w-40 rounded-lg" />
                        <Skeleton className="h-12 w-full rounded-md" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  // Message for users without active bookings
  if (noActiveBooking) {
     return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex flex-col gap-6 max-w-xl mx-auto py-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Campsite Controls</h1>
              <p className="text-muted-foreground">Control your campsite utilities</p>
            </div>
            <Card className="shadow-sm border-yellow-200 bg-yellow-50/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-yellow-100 p-3 mb-4 border border-yellow-200">
                  <CalendarDays className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Active Booking</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  You need an active booking to control campsite utilities.
                  Book a campsite to access the control panel.
                </p>
                <Link href="/dashboard/bookings">
                  <Button variant="default">
                    <BadgePlus className="mr-2 h-4 w-4" />
                    Request Booking
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  // Error display
  if (error && !profileData) { // Show full error page only if profile data failed entirely
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex flex-col gap-6 max-w-xl mx-auto py-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Campsite Controls</h1>
              <p className="text-muted-foreground">Control your campsite utilities</p>
            </div>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Loading Controls</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button className="w-fit" onClick={fetchUserProfile}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Loading Profile
            </Button>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }
  
  // Get current states safely
  const currentElectricityState = profileData?.campsite?.currentState?.electricity || false;
  const currentWaterState = profileData?.campsite?.currentState?.water || false;
  const currentBarrierState = profileData?.campsite?.currentState?.barrier || false;

  // -- Main Controls UI --
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="flex flex-col gap-6 max-w-xl mx-auto py-8">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold tracking-tight">Campsite Controls</h1>
              <Badge 
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${deviceOffline ? "bg-red-100 text-red-800 border border-red-200" : "bg-green-100 text-green-800 border border-green-200"}`}
              >
                {deviceOffline ? (
                  <><WifiOff className="h-3 w-3 mr-1.5" /> Offline</>
                ) : (
                  <><Wifi className="h-3 w-3 mr-1.5" /> Online</>
                )}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground text-sm">Manage utilities for your selected campsite.</p>
              <div className="flex items-center gap-2">
                <CampsiteSelector 
                  selectedCampsiteId={selectedCampsiteId} 
                  onCampsiteSelect={handleCampsiteSelect}
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9" // Slightly larger icon button
                  onClick={() => selectedCampsiteId && fetchCampsiteState(selectedCampsiteId, true)} // Pass true for manual refresh
                  disabled={isRefreshing} // Disable while refreshing
                  aria-label="Refresh Controls"
                >
                  {isRefreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
             {/* Show general error loading state here if profile loaded but state failed */}
             {error && profileData && (
                <Alert variant="destructive" className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>State Update Error</AlertTitle>
                  <AlertDescription>{error} - Controls might not reflect the actual state.</AlertDescription>
                </Alert>
             )}
          </div>
          
          {/* Controls Section - Vertical Layout */}
          <div className="flex flex-col gap-6">
            
            {/* Electricity Control */}
            <Card className="overflow-hidden border shadow-sm">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center border border-orange-200">
                      <Zap className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Electricity</h3>
                      <Badge 
                        variant="outline"
                        className={`mt-1 text-xs px-2 py-0.5 rounded-full ${currentElectricityState
                          ? "border-green-300 bg-green-50 text-green-800"
                          : "border-gray-300 bg-gray-100 text-gray-700"
                        }`}
                      >
                        {currentElectricityState ? "ON" : "OFF"}
                      </Badge>
                    </div>
                  </div>
                  
                  {isUpdating['electricity'] ? (
                    <div className="h-8 w-14 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Switch 
                      checked={currentElectricityState}
                      onCheckedChange={() => toggleUtility(
                        selectedCampsiteId!, 
                        'electricity', 
                        currentElectricityState
                      )}
                      disabled={deviceOffline}
                      className="scale-110 data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-300"
                      aria-label="Toggle Electricity"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Water Status (read-only) */}
            <Card className="overflow-hidden border shadow-sm bg-slate-50/50">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center border border-blue-200">
                      <Droplet className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Water Supply</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                           variant="outline"
                           className={`text-xs px-2 py-0.5 rounded-full ${currentWaterState
                            ? "border-blue-300 bg-blue-50 text-blue-800"
                            : "border-gray-300 bg-gray-100 text-gray-700"
                          }`}
                        >
                          {currentWaterState ? "ON" : "OFF"}
                        </Badge>
                        <Badge variant="secondary" className="text-xs font-normal h-5">Read Only</Badge>
                      </div>
                    </div>
                  </div>
                  {/* No control, just status */}
                </div>
              </CardContent>
            </Card>

            {/* Barrier Control */}           
            <Card className="overflow-hidden border shadow-sm">
              <CardContent className="p-5 md:p-6">
                {/* Header part for Barrier */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                     {/* Simple visual icon for barrier state */}
                     <div className={`h-12 w-12 rounded-lg flex items-center justify-center border ${currentBarrierState ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'}`}>
                      <div className="w-6 h-6 relative overflow-hidden">
                         {/* Static Base */}
                         <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-2 w-3 bg-gray-600 rounded-sm"></div>
                         {/* Arm - simple line representation */}
                         <div className={`absolute left-1/2 transform -translate-x-1/2 w-1 rounded-t-sm ${currentBarrierState ? 'h-3 bottom-2 bg-green-600' : 'h-5 bottom-0 bg-red-600'}`}></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Gate Barrier</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                           variant="outline"
                           className={`text-xs px-2 py-0.5 rounded-full ${currentBarrierState
                            ? "border-green-300 bg-green-50 text-green-800"
                            : "border-red-300 bg-red-50 text-red-800"
                          }`}
                        >
                          {currentBarrierState ? "OPEN" : "CLOSED"}
                        </Badge>
                        {barrierAnimation !== "idle" && (
                          <Badge variant="outline" className="animate-pulse text-xs h-5">
                            {barrierAnimation === "opening" ? "Opening..." : "Closing..."}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Barrier Animation */}
                <div className="flex justify-center items-center h-44 bg-gradient-to-b from-gray-50 to-gray-100 border rounded-lg mb-6 overflow-hidden">
                   <TrafficBarrier 
                     isOpen={currentBarrierState} 
                     isAnimating={barrierAnimation !== "idle"} 
                   />
                </div>
                
                <Button 
                  variant={currentBarrierState ? "destructive" : "default"}
                  size="lg"
                  className={`w-full text-base font-medium h-12 transition-all duration-150 ${isUpdating['barrier'] ? 'opacity-70' : ''}`}
                  onClick={() => toggleUtility(
                    selectedCampsiteId!, 
                    'barrier', 
                    currentBarrierState
                  )}
                  disabled={deviceOffline || isUpdating['barrier']}
                  aria-label={currentBarrierState ? "Close Barrier" : "Open Barrier"}
                >
                  {isUpdating['barrier'] ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    currentBarrierState ? "Close Barrier" : "Open Barrier"
                  )}
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}

