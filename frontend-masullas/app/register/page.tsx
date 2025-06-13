"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Check, X, Home } from "lucide-react"
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

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Password requirements
  const passwordRequirements = [
    { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { id: "uppercase", label: "At least one uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { id: "lowercase", label: "At least one lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { id: "number", label: "At least one number", test: (p: string) => /[0-9]/.test(p) },
    { id: "special", label: "At least one special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("All fields are required")
      return false
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    // Check if password meets all requirements
    const passesAllRequirements = passwordRequirements.every((req) => req.test(formData.password))
    if (!passesAllRequirements) {
      setError("Password does not meet all requirements")
      return false
    }

    return true
  }

  // Update the fetch URL to use the real API endpoint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      })

      // Check if the response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response. Please try again later.")
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || t('auth.messages.registerFailed'))
      }

      setSuccess(true)
      toast({
        title: t('auth.messages.registerSuccess'),
        description: "Your account has been created. You can now login.",
      })

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err.message || t('auth.messages.registerFailed'))
      toast({
        title: t('auth.messages.registerFailed'),
        description: err.message || "Please check your information and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthRedirect>
      <div className="relative min-h-screen overflow-y-auto">
        {/* Split background containers */}
        <div className="flex min-h-screen">
          {/* Left Side - White with subtle design */}
          <div className="md:w-1/2 w-full bg-white relative">
            <div className="absolute inset-0 overflow-hidden">
              {/* Subtle bubble patterns */}
              <div className="absolute top-[10%] left-[20%] w-64 h-64 rounded-full bg-primary/5"></div>
              <div className="absolute bottom-[30%] right-[15%] w-40 h-40 rounded-full bg-secondary/5"></div>
              <div className="absolute top-[60%] left-[10%] w-32 h-32 rounded-full bg-accent/5"></div>
              
              {/* Wavy patterns */}
              <svg className="absolute bottom-0 left-0 w-full h-48 text-primary/5 fill-current" 
                viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" opacity=".25"></path>
              </svg>
            </div>
          </div>
          
          {/* Right Side - Image */}
          <div className="w-1/2 relative hidden md:block">
            <Image 
              src="/images/camping-register.jpg" 
              alt="Nature campsite view" 
              quality={90}
              priority
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
        </div>
        
        {/* Mobile background (full width image) */}
        <div className="absolute inset-0 md:hidden z-0">
          <div className="absolute inset-0 bg-white/50 z-10"></div>
          <Image 
            src="/images/camping-register.jpg" 
            alt="Nature campsite view" 
            quality={80}
            priority
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        
        {/* Language Switcher and Navigation */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>
        
        {/* Home button */}
        <div className="fixed top-4 left-4 z-50">
          <Link href="/" className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-white shadow-md backdrop-blur-sm text-primary hover:bg-white/90 transition-colors">
            <Home className="h-5 w-5" />
            <span className="sr-only">{t('common.home')}</span>
          </Link>
        </div>
        
        {/* Back button */}
        <div className="fixed top-4 left-16 z-50">
          <Link
            href="/"
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-white shadow-md backdrop-blur-sm py-2 px-3 rounded-lg"
          >
            {t('auth.login.backToHome')}
          </Link>
        </div>

        {/* Register Card - centered with proper spacing */}
        <div className="absolute inset-0 overflow-y-auto z-20">
          <div className="flex min-h-screen items-center justify-center py-16 px-4">
            <Card className="w-full max-w-md shadow-xl bg-white/95 backdrop-blur-sm border-0 my-8">
              <CardHeader className="space-y-1">
                <div className="flex justify-center mb-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <div className="h-10 w-10 rounded-full bg-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center">{t('auth.register.title')}</CardTitle>
                <CardDescription className="text-center">{t('auth.register.subtitle')}</CardDescription>
              </CardHeader>
              {success ? (
                <CardContent className="space-y-4">
                  <div className="p-4 bg-success/10 border border-success/20 rounded-md text-success flex items-center">
                    <Check className="h-5 w-5 mr-2 text-success" />
                    <p>{t('auth.messages.registerSuccess')}! {t('auth.messages.redirecting')}</p>
                  </div>
                </CardContent>
              ) : (
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t('auth.register.firstName')}</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="bg-background/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t('auth.register.lastName')}</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="bg-background/60"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('auth.register.email')}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t('auth.login.emailPlaceholder')}
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-background/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">{t('auth.register.password')}</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
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
                          <span className="sr-only">{showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}</span>
                        </Button>
                      </div>
                      <div className="mt-2 space-y-2">
                        {passwordRequirements.map((req) => (
                          <div key={req.id} className="flex items-center text-sm">
                            {req.test(formData.password) ? (
                              <Check className="h-4 w-4 mr-2 text-success" />
                            ) : (
                              <X className="h-4 w-4 mr-2 text-destructive" />
                            )}
                            <span className={req.test(formData.password) ? "text-success" : "text-muted-foreground"}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t('auth.register.confirmPassword')}</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="bg-background/60"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">{showConfirmPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}</span>
                        </Button>
                      </div>
                      {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-sm text-destructive mt-1">Passwords do not match</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                        required
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t('auth.register.terms')}{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          terms and conditions
                        </Link>
                      </label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button className="w-full" type="submit" disabled={isLoading} variant="gradient">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('auth.register.registering')}
                        </>
                      ) : (
                        t('auth.register.registerButton')
                      )}
                    </Button>
                    <div className="text-center text-sm">
                      {t('auth.register.hasAccount')}{" "}
                      <Link href="/login" className="text-primary hover:underline">
                        {t('auth.register.loginLink')}
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AuthRedirect>
  )
}

