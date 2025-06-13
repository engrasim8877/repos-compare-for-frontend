"use client"

import React, { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Users,
  Search, 
  RefreshCw, 
  AlertTriangle,
  EyeIcon,
  Mail,
  Shield,
  Clock,
  UserCircle,
  Loader2,
  Trash2,
  X
} from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { AuthGuard } from "@/components/auth-guard"
import { getAuthHeaders, getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/translations"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface User {
  userId: string
  email: string
  role: string
  createdAt: string
  subscriptionType?: string
  subscriptionStatus?: string
}

interface Campsite {
  campsiteId: string
  status: string
  assignedAt: string
  expiresAt: string
}

interface UserDetails {
  user: User
  campsites: Campsite[]
  subscriptionRequests?: any[]
}

export default function UserManagementPage() {
  const { toast } = useToast()
  const { t } = useTranslation()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [filterRole, setFilterRole] = useState<string>("all")
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false)

  // Delete user states
  const [isDeleting, setIsDeleting] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  // Get current authenticated user (admin)
  const currentUser = useMemo(() => getUser(), [])

  useEffect(() => {
    console.log('🔄 Initializing UserManagementPage')
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    console.log('📊 Fetching users list')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(t('admin.users.failedToFetchUsers'))
      }

      const data = await response.json()
      console.log('👥 Users data received:', {
        totalUsers: data.users?.length || 0,
        filters: data.filters,
        timestamp: new Date().toISOString()
      })
      
      setUsers(data.users || [])
    } catch (err: any) {
      console.error("❌ Error fetching users:", err)
      setError(err.message || t('admin.users.failedToFetchUsers'))
      toast({
        title: t('admin.users.error'),
        description: t('admin.users.failedToLoadUsers'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserDetails = async (userId: string) => {
    console.log('🔍 Fetching details for user:', userId)
    setIsLoadingDetails(true)
    setError(null)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${userId}`, {
        headers: getAuthHeaders(),
        credentials: 'omit'
      })

      if (!response.ok) {
        let errorMessage = t('admin.users.failedToFetchUserDetails');
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `${errorMessage}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json()
      console.log('👤 User details received:', {
        userId,
        campsitesCount: data.campsites?.length || 0,
        hasSubscriptionRequests: Boolean(data.subscriptionRequests?.length),
        timestamp: new Date().toISOString()
      })
      
      setSelectedUser(data)
      setIsUserDetailsOpen(true)
    } catch (err: any) {
      console.error("❌ Error fetching user details:", err)
      setError(err.message || t('admin.users.failedToFetchUserDetails'))
      toast({
        title: t('admin.users.error'),
        description: err.message || t('admin.users.failedToLoadUserDetails'),
        variant: "destructive",
      })
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const deleteUser = async () => {
    if (!userToDelete) return
    console.log('🗑️ Deleting user:', userToDelete.userId)
    setIsDeleting(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${userToDelete.userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      let errorMessage = t('admin.users.failedToDeleteUser');
      if (!response.ok) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `${errorMessage}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json()
      console.log('✅ User deleted successfully:', {
        userId: userToDelete.userId,
        deletionSummary: result.deletionSummary,
        timestamp: new Date().toISOString()
      })

      // Update users list by removing deleted user
      setUsers(prevUsers => prevUsers.filter(user => user.userId !== userToDelete.userId))
      
      // Close user details if the deleted user was selected
      if (selectedUser?.user.userId === userToDelete.userId) {
        setSelectedUser(null)
        setIsUserDetailsOpen(false)
      }

      // Reset delete states
      setUserToDelete(null)

      toast({
        title: t('admin.users.success'),
        description: `${userToDelete.email} ${t('admin.users.userDeletedSuccessfully')}`,
      })

    } catch (err: any) {
      console.error("❌ Error deleting user:", err)
      toast({
        title: t('admin.users.error'),
        variant: "destructive",
        description: err.message || t('admin.users.failedToDeleteUser'),
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteClick = (user: User) => {
    // Prevent deleting yourself
    if (currentUser?.userId === user.userId) {
      toast({
        title: t('admin.users.actionNotAllowed'),
        description: t('admin.users.cannotDeleteYourself'),
        variant: "destructive",
      })
      return
    }

    console.log('🔍 Initiating delete for user:', user.userId)
    setUserToDelete(user)
  }

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (!searchQuery && filterRole === "all") return true
      
      const matchesSearch = !searchQuery || user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = filterRole === "all" || user.role === filterRole
      
      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, filterRole])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  // Get user statistics - memoized to prevent re-renders
  const userStats = useMemo(() => ({
    total: users.length,
    admins: users.filter(user => user.role === "admin").length,
    regular: users.filter(user => user.role !== "admin").length
  }), [users])

  return (
    <AuthGuard requireAdmin>
      <AdminLayout>
        <div className="flex flex-col space-y-4 p-4 md:p-6 max-w-full pb-24 md:pb-6 overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('admin.users.title')}</h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">{t('admin.users.subtitle')}</p>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={fetchUsers}
              className="h-9 w-9 p-0"
              disabled={isLoading}
              title={t('admin.users.refresh')}
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              <span className="sr-only">{t('admin.users.refresh')}</span>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <Card className="bg-card hover:bg-accent/5 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('admin.users.totalUsers')}</p>
                    <p className="text-2xl font-bold">{userStats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:bg-accent/5 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Shield className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('admin.users.adminUsers')}</p>
                    <p className="text-2xl font-bold text-blue-500">{userStats.admins}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:bg-accent/5 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <UserCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('admin.users.regularUsers')}</p>
                    <p className="text-2xl font-bold text-green-500">{userStats.regular}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users List */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4">
                <CardTitle className="text-lg md:text-xl">{t('admin.users.systemUsers')}</CardTitle>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Select
                    value={filterRole}
                    onValueChange={setFilterRole}
                  >
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder={t('admin.users.filterByRole')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('admin.users.allRoles')}</SelectItem>
                      <SelectItem value="admin">{t('admin.users.admin')}</SelectItem>
                      <SelectItem value="user">{t('admin.users.regularUser')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder={t('admin.users.searchByEmail')} 
                      className="pl-8 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 sm:p-6">
              {isLoading ? (
                <div className="space-y-3 p-4 sm:p-0">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-4 p-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full max-w-[250px]" />
                        <Skeleton className="h-4 w-2/3 max-w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="p-4 sm:p-0">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>{t('admin.users.error')}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center p-6">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-semibold">{t('admin.users.noUsersFound')}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchQuery || filterRole !== "all"
                      ? t('admin.users.noUsersMatch')
                      : t('admin.users.noUsersInSystem')}
                  </p>
                </div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="block lg:hidden space-y-4 px-0 sm:px-4">
                    {filteredUsers.map((user) => (
                      <Card key={user.userId} className="border">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className={cn(
                                  "p-2 rounded-full flex-shrink-0",
                                  user.role === "admin" 
                                    ? "bg-blue-500/10" 
                                    : "bg-green-500/10"
                                )}>
                                  <UserCircle className={cn(
                                    "h-4 w-4",
                                    user.role === "admin"
                                      ? "text-blue-500"
                                      : "text-green-500"
                                  )} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="font-medium text-sm truncate">{user.email}</div>
                                  <div className="text-xs text-muted-foreground mt-1 break-all">
                                    ID: {user.userId}
                                  </div>
                                </div>
                              </div>
                              <Badge 
                                variant={user.role === "admin" ? "default" : "secondary"}
                                className="capitalize text-xs ml-2 flex-shrink-0"
                              >
                                {user.role === "admin" ? t('admin.users.admin') : t('admin.users.regularUser')}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(user.createdAt)}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                variant="outline"
                                size="default"
                                onClick={() => fetchUserDetails(user.userId)}
                                disabled={isLoadingDetails}
                                className="flex-1 text-sm rounded-full h-9"
                              >
                                <EyeIcon className="h-3 w-3 mr-2" />
                                {t('admin.users.viewDetails')}
                              </Button>
                              {currentUser?.userId !== user.userId && (
                              <Button
                                variant="outline"
                                size="default"
                                onClick={() => handleDeleteClick(user)}
                                className="text-destructive hover:text-destructive flex-1 text-sm rounded-full h-9"
                              >
                                <Trash2 className="h-3 w-3 mr-2" />
                                {t('admin.users.deleteUser')}
                              </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block">
                    <div className="rounded-md border overflow-hidden">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[300px]">{t('admin.users.user')}</TableHead>
                              <TableHead className="min-w-[100px]">{t('admin.users.role')}</TableHead>
                              <TableHead className="min-w-[180px]">{t('admin.users.registered')}</TableHead>
                              <TableHead className="text-right min-w-[240px]">{t('admin.users.actions')}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredUsers.map((user) => (
                              <TableRow key={user.userId}>
                                <TableCell className="max-w-0">
                                  <div className="flex items-center gap-3">
                                    <div className={cn(
                                      "p-2 rounded-full flex-shrink-0",
                                      user.role === "admin" 
                                        ? "bg-blue-500/10" 
                                        : "bg-green-500/10"
                                    )}>
                                      <UserCircle className={cn(
                                        "h-4 w-4",
                                        user.role === "admin"
                                          ? "text-blue-500"
                                          : "text-green-500"
                                      )} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="font-medium truncate">{user.email}</div>
                                      <div className="text-sm text-muted-foreground truncate">
                                        ID: {user.userId}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={user.role === "admin" ? "default" : "secondary"}
                                    className="capitalize"
                                  >
                                    {user.role === "admin" ? t('admin.users.admin') : t('admin.users.regularUser')}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{formatDate(user.createdAt)}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="default"
                                      onClick={() => fetchUserDetails(user.userId)}
                                      disabled={isLoadingDetails}
                                      className="rounded-full h-9"
                                    >
                                      <EyeIcon className="h-4 w-4 mr-2" />
                                      {t('admin.users.viewDetails')}
                                    </Button>
                                    {currentUser?.userId !== user.userId && (
                                    <Button
                                      variant="outline"
                                      size="default"
                                      onClick={() => handleDeleteClick(user)}
                                      className="text-destructive hover:text-destructive rounded-full h-9"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      {t('admin.users.deleteUser')}
                                    </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* User Details Dialog */}
          <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
            <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-3 rounded-full",
                    selectedUser?.user.role === "admin" 
                      ? "bg-blue-500/10" 
                      : "bg-green-500/10"
                  )}>
                    <UserCircle className={cn(
                      "h-5 w-5",
                      selectedUser?.user.role === "admin"
                        ? "text-blue-500"
                        : "text-green-500"
                    )} />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-left">{t('admin.users.userDetails')}</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">{selectedUser?.user.email}</p>
                  </div>
                  {isLoadingDetails && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </DialogHeader>
              
              <div className="mt-4">
                {isLoadingDetails ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-[250px]" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Skeleton className="h-[100px]" />
                      <Skeleton className="h-[100px]" />
                      <Skeleton className="h-[100px]" />
                      <Skeleton className="h-[100px]" />
                    </div>
                  </div>
                ) : selectedUser ? (
                  <div className="grid gap-6">
                    <div className="grid gap-1">
                      <h3 className="font-semibold">{t('admin.users.accountInformation')}</h3>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                        <div className="flex flex-col space-y-1 p-4 border rounded-lg">
                          <dt className="text-sm text-muted-foreground">{t('admin.users.userId')}</dt>
                          <dd className="text-sm font-medium break-all">{selectedUser.user.userId}</dd>
                        </div>
                        <div className="flex flex-col space-y-1 p-4 border rounded-lg">
                          <dt className="text-sm text-muted-foreground">{t('admin.users.role')}</dt>
                          <dd>
                            <Badge 
                              variant={selectedUser.user.role === "admin" ? "default" : "secondary"}
                              className="capitalize"
                            >
                              {selectedUser.user.role === "admin" ? t('admin.users.admin') : t('admin.users.regularUser')}
                            </Badge>
                          </dd>
                        </div>
                        <div className="flex flex-col space-y-1 p-4 border rounded-lg">
                          <dt className="text-sm text-muted-foreground">{t('admin.users.emailAddress')}</dt>
                          <dd className="text-sm font-medium break-all">{selectedUser.user.email}</dd>
                        </div>
                        <div className="flex flex-col space-y-1 p-4 border rounded-lg">
                          <dt className="text-sm text-muted-foreground">{t('admin.users.registrationDate')}</dt>
                          <dd className="text-sm font-medium">{formatDate(selectedUser.user.createdAt)}</dd>
                        </div>
                      </dl>
                    </div>

                    {selectedUser.campsites && selectedUser.campsites.length > 0 && (
                      <div className="grid gap-1">
                        <h3 className="font-semibold">{t('admin.users.assignedCampsites')}</h3>
                        <div className="rounded-md border overflow-hidden">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>{t('admin.users.campsiteId')}</TableHead>
                                  <TableHead>{t('admin.users.status')}</TableHead>
                                  <TableHead>{t('admin.users.assignedDate')}</TableHead>
                                  <TableHead>{t('admin.users.expiryDate')}</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedUser.campsites.map((campsite) => (
                                  <TableRow key={campsite.campsiteId}>
                                    <TableCell className="font-medium">{campsite.campsiteId}</TableCell>
                                    <TableCell>
                                      <Badge 
                                        variant={
                                          campsite.status === "active" ? "default" :
                                          campsite.status === "expired" ? "destructive" :
                                          "secondary"
                                        }
                                        className="capitalize"
                                      >
                                        {campsite.status === "active" ? t('admin.users.active') :
                                         campsite.status === "expired" ? t('admin.users.expired') :
                                         t('admin.users.inactive')}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(campsite.assignedAt)}</TableCell>
                                    <TableCell>{formatDate(campsite.expiresAt)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedUser.subscriptionRequests && selectedUser.subscriptionRequests.length > 0 && (
                      <div className="grid gap-1">
                        <h3 className="font-semibold">{t('admin.users.subscriptionRequests')}</h3>
                        <div className="rounded-md border overflow-hidden">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>{t('admin.users.requestDate')}</TableHead>
                                  <TableHead>{t('admin.users.type')}</TableHead>
                                  <TableHead>{t('admin.users.status')}</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedUser.subscriptionRequests.map((request: any, index: number) => (
                                  <TableRow key={index}>
                                    <TableCell>{formatDate(request.requestDate)}</TableCell>
                                    <TableCell className="capitalize">{request.type}</TableCell>
                                    <TableCell>
                                      <Badge 
                                        variant={
                                          request.status === "approved" ? "default" :
                                          request.status === "rejected" ? "destructive" :
                                          "secondary"
                                        }
                                        className="capitalize"
                                      >
                                        {request.status === "approved" ? t('admin.users.approved') :
                                         request.status === "rejected" ? t('admin.users.rejected') :
                                         t('admin.users.pending')}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete User Confirmation Dialog */}
          <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  {t('admin.users.deleteUserAccount')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t('admin.users.deleteConfirmation')}{" "}
                  <span className="font-semibold">
                    {userToDelete?.email}
                  </span>
                  ? {t('admin.users.actionCannotBeUndone')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-4">
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>{t('admin.users.deleteAccountPermanently')}</li>
                  <li>{t('admin.users.cancelPendingBookings')}</li>
                  <li>{t('admin.users.removeCampsiteAssignments')}</li>
                  <li>{t('admin.users.anonymizeHistoricalData')}</li>
                </ul>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  {t('common.cancel')}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteUser}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('admin.users.deleting')}
                    </>
                  ) : (
                    t('admin.users.deleteUser')
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
} 