"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Cpu, 
  Tent, 
  CalendarDays, 
  Settings, 
  Activity,
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getUser, logout } from "@/lib/auth"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [pageTitle, setPageTitle] = useState("Dashboard")

  // Add debug logging
  useEffect(() => {
    console.log('Current pathname:', pathname)
  }, [pathname])

  useEffect(() => {
    const userData = getUser()
    if (userData) {
      setUser(userData)
    }
    
    // Load collapsed state from localStorage
    const savedState = localStorage.getItem('adminSidebarCollapsed')
    if (savedState) {
      setIsCollapsed(savedState === 'true')
    }

    // Set page title based on current path
    if (pathname === "/admin/dashboard") {
      setPageTitle("Admin Dashboard")
      console.log('Setting title to Admin Dashboard')
    } else if (pathname === "/admin/dashboard/users") {
      setPageTitle("User Management")
      console.log('Setting title to User Management')
    } else if (pathname === "/admin/dashboard/bookings") {
      setPageTitle("Booking Management")
      console.log('Setting title to Booking Management')
    } else if (pathname === "/admin/dashboard/campsites") {
      setPageTitle("Campsite Management")
      console.log('Setting title to Campsite Management')
    } else if (pathname === "/admin/dashboard/devices") {
      setPageTitle("Device Management")
      console.log('Setting title to Device Management')
    } else if (pathname === "/admin/dashboard/settings") {
      setPageTitle("System Settings")
      console.log('Setting title to System Settings')
    } else if (pathname === "/admin/dashboard/system") {
      setPageTitle("System Health")
    }
  }, [pathname])
  
  // Save sidebar state when it changes
  useEffect(() => {
    localStorage.setItem('adminSidebarCollapsed', isCollapsed.toString())
  }, [isCollapsed])

  const adminNavigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/dashboard/users", icon: Users },
    { name: "Bookings", href: "/admin/dashboard/bookings", icon: CalendarDays },
    { name: "Campsites", href: "/admin/dashboard/campsites", icon: Tent },
    { name: "Devices", href: "/admin/dashboard/devices", icon: Cpu },
    { name: "Settings", href: "/admin/dashboard/settings", icon: Settings }
  ]

  const getInitials = (name: string) => {
    if (!name) return "A"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar for desktop */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 hidden md:flex md:flex-col bg-background border-r border-border/40 shadow-sm transition-all duration-300 ${
          isCollapsed ? 'md:w-16' : 'md:w-64'
        }`}
      >
        <div className="flex h-16 items-center border-b border-border/20 px-4">
          {!isCollapsed && (
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="rounded-full bg-secondary/10 p-1 flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-secondary" />
              </div>
              <span className="font-display font-bold text-lg">
                Tergucamperarea <span className="text-secondary">Admin</span>
              </span>
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto h-8 w-8"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-2">
            {adminNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  (item.href === "/admin/dashboard" ? pathname === "/admin/dashboard" : pathname.startsWith(item.href))
                    ? 'bg-secondary/10 text-secondary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        {/* Top navigation */}
        <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background/95 backdrop-blur px-4 md:px-6 shadow-sm">
          {/* Left: Logo on mobile, Page title on all devices */}
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2">
              <div className="rounded-full bg-secondary/10 p-1">
                <div className="h-6 w-6 rounded-full bg-secondary" />
              </div>
            </div>
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
          </div>
          
          <div className="flex-1" />
          
          {/* Right: User profile dropdown */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" size="icon">
                  <Avatar className="h-9 w-9 border-2 border-secondary/10">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${user ? `${user.firstName} ${user.lastName}` : "Admin"}`}
                      alt="Admin"
                    />
                    <AvatarFallback className="bg-secondary/10 text-secondary">
                      {user ? getInitials(`${user.firstName} ${user.lastName}`) : "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user ? `${user.firstName} ${user.lastName}` : "Admin"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile bottom navigation bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-around h-16">
            <TooltipProvider>
              {adminNavigation.map((item) => (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={`flex flex-col items-center justify-center pt-1 w-1/5 text-xs ${
                        (item.href === "/admin/dashboard" ? pathname === "/admin/dashboard" : pathname.startsWith(item.href))
                          ? 'text-secondary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-[10px] mt-1 max-[450px]:hidden">{item.name}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="top" 
                    className="max-[450px]:block hidden"
                  >
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 pb-20 md:pb-6">{children}</main>
      </div>
    </div>
  )
}
