"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Home } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthRedirect } from "@/components/auth-redirect"
import { useTranslation } from "@/lib/translations"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { t, language, switchLanguage } = useTranslation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      // Check if the response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response. Please try again later.")
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed. Please check your credentials.")
      }

      const data = await response.json()

      // Store token in localStorage or sessionStorage based on rememberMe
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem("token", data.token)
      storage.setItem("user", JSON.stringify(data.user))

      toast({
        title: t('auth.messages.loginSuccess', 'Login successful'),
        description: t('auth.messages.redirecting', 'Redirecting to dashboard...'),
      })

      // Redirect based on user role
      if (data.user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Failed to login. Please check your credentials.")
      toast({
        title: t('auth.messages.loginFailed', 'Login failed'),
        description: err.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Add this near the top of your auth-related component
console.log("API BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
    }, [])

  return (
    <AuthRedirect>
      <div className="relative min-h-screen overflow-y-auto">
        {/* Split background containers */}
        <div className="flex min-h-screen">
          {/* Left Side - Image */}
          <div className="w-1/2 relative hidden md:block">
            <Image 
              src="/images/camping-register.jpg" 
              alt="Beautiful campsite view" 
              quality={90}
              priority
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
          
          {/* Right Side - White with subtle design */}
          <div className="md:w-1/2 w-full bg-white relative">
            <div className="absolute inset-0 overflow-hidden">
              {/* Subtle bubble patterns */}
              <div className="absolute top-[10%] right-[20%] w-64 h-64 rounded-full bg-primary/5"></div>
              <div className="absolute bottom-[30%] left-[15%] w-40 h-40 rounded-full bg-secondary/5"></div>
              <div className="absolute top-[60%] right-[10%] w-32 h-32 rounded-full bg-accent/5"></div>
              
              {/* Wavy patterns */}
              <svg className="absolute bottom-0 right-0 w-full h-48 text-primary/5 fill-current" 
                viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M1200,0V46.29c-47.79,22.2-103.59,32.17-158,28-70.36-5.37-136.33-33.31-206.8-37.5C761.36,32.43,687.66,53.67,617,72.05c-69.27,18-138.3,24.88-209.4,13.08-36.15-6-69.85-17.84-104.45-29.34C211.59,25,88,14.28,0,52.47V0Z" opacity=".25"></path>
                <path d="M1200,0V15.81c-13,21.11-27.64,41.05-47.69,56.24C1100.41,111.27,1035,111,975.42,91.58c-31.15-10.15-60.09-26.07-89.67-39.8-40.92-19-84.73-46-130.83-49.67-36.26-2.85-70.9,9.42-98.6,31.56-31.77,25.39-62.32,62-103.63,73-40.44,10.79-81.35-6.69-119.13-24.28s-75.16-39-116.92-43.05c-59.73-5.85-113.28,22.88-168.9,38.84-30.2,8.66-59,6.17-87.09-7.5C38.23,20.73,13.85,5.09,0.62,0H0Z" opacity=".5"></path>
                <path d="M1200,0V5.63C1050.07,59,885.91,71.32,724.17,42.57c-43-7.64-84.23-20.12-127.61-26.46-59-8.63-112.48,12.24-165.56,35.4-59.29,26.46-112.45,42.93-176.31,38.1-86.53-7-172.46-45.71-248.8-84.81V0Z" opacity=".25"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Mobile background (full width image) */}
        <div className="absolute inset-0 md:hidden z-0">
          <div className="absolute inset-0 bg-white/50 z-10"></div>
          <Image 
            src="/images/camping-register.jpg" 
            alt="Beautiful campsite view" 
            quality={80}
            priority
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        
        {/* Home button */}
        <div className="fixed top-4 left-4 z-50">
          <Link href="/" className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-white shadow-md backdrop-blur-sm text-primary hover:bg-white/90 transition-colors">
            <Home className="h-5 w-5" />
            <span className="sr-only">{t('common.home', 'Home')}</span>
          </Link>
        </div>
        
        {/* Back button */}
        <div className="fixed top-4 left-16 z-50">
          <Link
            href="/"
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-white shadow-md backdrop-blur-sm py-2 px-3 rounded-lg"
          >
            {t('auth.login.backToHome', 'Back to home')}
          </Link>
        </div>

        {/* Language Switcher */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher
            language={language}
            onLanguageChange={switchLanguage}
            className="bg-white shadow-md backdrop-blur-sm"
          />
        </div>

        {/* Login Card - centered with proper spacing */}
        <div className="absolute inset-0 overflow-y-auto z-20">
          <div className="flex min-h-screen items-center justify-center py-16 px-4">
            <Card className="w-full max-w-md shadow-xl bg-white/95 backdrop-blur-sm border-0 my-8">
              <CardHeader className="space-y-1">
                <div className="flex justify-center mb-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <div className="h-10 w-10 rounded-full bg-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center">{t('auth.login.title', 'Login to Masullas')}</CardTitle>
                <CardDescription className="text-center">
                  {t('auth.login.subtitle', 'Enter your email and password to access your account')}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.login.email', 'Email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('auth.login.emailPlaceholder', 'your.email@example.com')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">{t('auth.login.password', 'Password')}</Label>
                      <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                        {t('auth.login.forgotPassword', 'Forgot password?')}
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-background/60"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showPassword ? t('auth.login.hidePassword', 'Hide password') : t('auth.login.showPassword', 'Show password')}</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t('auth.login.rememberMe', 'Remember me')}
                    </label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button className="w-full" type="submit" disabled={isLoading} variant="gradient">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('auth.login.loggingIn', 'Logging in...')}
                      </>
                    ) : (
                      t('auth.login.loginButton', 'Login')
                    )}
                  </Button>
                  <div className="text-center text-sm">
                    {t('auth.login.noAccount', "Don't have an account?")}{" "}
                    <Link href="/register" className="text-primary hover:underline">
                      {t('auth.login.registerLink', 'Register')}
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </AuthRedirect>
  )
}

