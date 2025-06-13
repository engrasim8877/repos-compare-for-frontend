"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CalendarDays, Zap, BarChart2, HelpCircle, User, Home, LogOut, Menu, X, ChevronLeft, ChevronRight } from "lucide-react"

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

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [pageTitle, setPageTitle] = useState("Dashboard")

  useEffect(() => {
    const userData = getUser()
    if (userData) {
      setUser(userData)
    }
    
    // Load collapsed state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState) {
      setIsCollapsed(savedState === 'true')
    }

    // Set page title based on current path
    if (pathname === "/dashboard") {
      setPageTitle("Dashboard")
    } else if (pathname === "/dashboard/bookings") {
      setPageTitle("My Bookings")
    } else if (pathname === "/dashboard/controls") {
      setPageTitle("Campsite Control")
    } else if (pathname === "/dashboard/usage") {
      setPageTitle("Usage History")
    } else if (pathname === "/dashboard/support") {
      setPageTitle("Help & Support")
    } else if (pathname === "/dashboard/profile") {
      setPageTitle("Profile")
    }
  }, [pathname])
  
  // Save sidebar state when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString())
  }, [isCollapsed])

  const userNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
    { name: "Campsite Control", href: "/dashboard/controls", icon: Zap },
    { name: "Usage History", href: "/dashboard/usage", icon: BarChart2 },
    { name: "Help & Support", href: "/dashboard/support", icon: HelpCircle },
  ]

  const getInitials = (name: string) => {
    if (!name) return "U"
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
          {
            !isCollapsed && (
              <Link href="/dashboard" className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-1 flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-primary" />
              </div>
              <span className="font-display font-bold text-lg">Tergucamperarea</span>
            </Link>
            )
          }
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
            {userNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  (item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href))
                    ? 'bg-primary/10 text-primary'
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
              <div className="rounded-full bg-primary/10 p-1">
                <div className="h-6 w-6 rounded-full bg-primary" />
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
                  <Avatar className="h-9 w-9 border-2 border-primary/10">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${user ? `${user.firstName} ${user.lastName}` : "User"}`}
                      alt="User"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user ? getInitials(`${user.firstName} ${user.lastName}`) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user ? `${user.firstName} ${user.lastName}` : "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer flex w-full items-center">
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Link>
                </DropdownMenuItem>
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
              {userNavigation.map((item) => (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={`flex flex-col items-center justify-center pt-1 w-1/5 text-xs ${
                        (item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href))
                          ? 'text-primary'
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
        <main className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6">{children}</main>
      </div>
    </div>
  )
}

