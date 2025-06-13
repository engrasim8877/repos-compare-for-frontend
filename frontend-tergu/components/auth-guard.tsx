"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated, isAdmin } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check authentication status
    const authenticated = isAuthenticated()
    const adminStatus = isAdmin()

    if (!authenticated) {
      // Not authenticated, redirect to login
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    } else if (requireAdmin && !adminStatus) {
      // Not an admin but admin access required
      router.push("/dashboard")
    } else {
      // Authorized
      setIsAuthorized(true)
    }

    setIsLoading(false)
  }, [router, pathname, requireAdmin])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return isAuthorized ? <>{children}</> : null
}

