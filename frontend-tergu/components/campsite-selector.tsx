"use client"

import { useState, useEffect } from "react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getAuthHeaders } from "@/lib/auth"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CampsiteSelectorProps {
  selectedCampsiteId: string | null
  onCampsiteSelect: (campsiteId: string) => void
  className?: string
}

export function CampsiteSelector({ 
  selectedCampsiteId, 
  onCampsiteSelect,
  className = ""
}: CampsiteSelectorProps) {
  const [campsites, setCampsites] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCampsites()
  }, [])

  const fetchCampsites = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campsites`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch campsites")
      }

      const data = await response.json()
      setCampsites(data.campsites || [])
      
      // If we have campsites and no selection yet, select the first one
      if (data.campsites && data.campsites.length > 0 && !selectedCampsiteId) {
        onCampsiteSelect(data.campsites[0].campsiteId)
      }
    } catch (err: any) {
      console.error("Error fetching campsites:", err)
      setError(err.message || "Failed to load campsites")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "expired":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (isLoading) {
    return <Skeleton className={`h-10 w-[260px] ${className}`} />
  }

  if (error) {
    return (
      <Alert variant="destructive" className={`max-w-md ${className}`}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (campsites.length === 0) {
    return null
  }

  if (campsites.length === 1) {
    const campsite = campsites[0]
    return (
      <div className={`inline-flex items-center ${className}`}>
        <span className="text-sm font-medium mr-2">Campsite:</span>
        <span>{campsite.campsiteName || `Campsite ${campsite.campsiteId}`}</span>
        <Badge className={`ml-2 ${getStatusColor(campsite.assignmentStatus || "active")}`}>
          {campsite.assignmentStatus || "Active"}
        </Badge>
      </div>
    )
  }

  return (
    <Select
      value={selectedCampsiteId || ""}
      onValueChange={onCampsiteSelect}
      className={className}
    >
      <SelectTrigger className="min-w-[260px]">
        <SelectValue placeholder="Select Campsite" />
      </SelectTrigger>
      <SelectContent>
        {campsites.map((campsite) => (
          <SelectItem key={campsite.campsiteId} value={campsite.campsiteId}>
            <div className="flex items-center gap-2">
              <span>{campsite.campsiteName || `Campsite ${campsite.campsiteId}`}</span>
              <Badge className={getStatusColor(campsite.assignmentStatus || "active")}>
                {campsite.assignmentStatus || "Active"}
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 