"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, isAdmin } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface AuthRedirectProps {
  children: React.ReactNode
}

/**
 * AuthRedirect - Redirects authenticated users away from public/auth pages
 * 
 * Use this component to wrap pages like login/register that should only be
 * accessible to non-authenticated users. It will automatically redirect
 * authenticated users to the dashboard.
 */
export function AuthRedirect({ children }: AuthRedirectProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Check if the user is already authenticated
    const authenticated = isAuthenticated()
    
    if (authenticated) {
      // If authenticated, redirect to the appropriate dashboard
      const adminStatus = isAdmin()
      if (adminStatus) {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard") 
      }
    } else {
      // Not authenticated, render the children (login/register page)
      setShouldRender(true)
    }
    
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Only render children if not authenticated
  return shouldRender ? <>{children}</> : null
} 