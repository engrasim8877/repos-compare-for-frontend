import { jwtDecode } from "jwt-decode"

interface User {
  userId: string
  email: string
  firstName: string
  lastName: string
  role: "user" | "admin"
  subscriptionType: string
  subscriptionStatus: string
  subscriptionExpiry: string
}

interface DecodedToken {
  userId: string
  email: string
  role: "user" | "admin"
  exp: number
}

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null

  // Try localStorage first, then sessionStorage
  const token = localStorage.getItem("token") || sessionStorage.getItem("token")
  return token
}

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user") || sessionStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr) as User
  } catch (error) {
    console.error("Failed to parse user data:", error)
    return null
  }
}

export const isAuthenticated = (): boolean => {
  const token = getToken()
  if (!token) return false

  try {
    const decoded = jwtDecode<DecodedToken>(token)
    const currentTime = Date.now() / 1000

    // Check if token is expired
    if (decoded.exp < currentTime) {
      // Clear expired token
      localStorage.removeItem("token")
      sessionStorage.removeItem("token")
      localStorage.removeItem("user")
      sessionStorage.removeItem("user")
      return false
    }

    return true
  } catch (error) {
    console.error("Invalid token:", error)
    return false
  }
}

export const isAdmin = (): boolean => {
  const user = getUser()
  return user?.role === "admin"
}

export const logout = (): void => {
  if (typeof window === "undefined") return

  localStorage.removeItem("token")
  sessionStorage.removeItem("token")
  localStorage.removeItem("user")
  sessionStorage.removeItem("user")

  // Redirect to login page
  window.location.href = "/login"
}

export const getAuthHeaders = (): HeadersInit => {
  const token = getToken()
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  
  console.log("Auth headers:", headers);
  return headers;
}

