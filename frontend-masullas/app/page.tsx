"use client"

import Link from "next/link"
import Image from "next/image"
import { Zap, BarChart2, Clock, Droplet, Shield, History, ChevronRight, ArrowRight, Menu, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/translations"
import { LanguageSwitcher } from "@/components/language-switcher"

// Define TypeScript interfaces for component props
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  image: string;
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="rounded-full bg-primary/10 p-1">
                <div className="h-8 w-8 rounded-full bg-primary" />
              </div>
              <span className="font-display font-bold text-xl">Masullas</span>
            </Link>
            <nav className="hidden md:flex gap-6 ml-6">
              <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
                {t('home.features.badge')}
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
                {t('home.howItWorks.badge')}
              </Link>
              <Link href="#faq" className="text-sm font-medium transition-colors hover:text-primary">
                {t('common.faq')}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Desktop navigation buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="flex">
                  {t('common.login')}
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="gradient">{t('common.register')}</Button>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">{t('common.openMenu')}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="container mx-auto p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <Link href="/" className="flex items-center space-x-2">
                <div className="rounded-full bg-primary/10 p-1">
                  <div className="h-8 w-8 rounded-full bg-primary" />
                </div>
                <span className="font-display font-bold text-xl">Masullas</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
                <span className="sr-only">{t('common.closeMenu')}</span>
              </Button>
            </div>
            
            <nav className="flex flex-col gap-6 py-6 border-y">
              <Link 
                href="#features" 
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('home.features.badge')}
              </Link>
              <Link 
                href="#how-it-works" 
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('home.howItWorks.badge')}
              </Link>
              <Link 
                href="#faq" 
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('common.faq')}
              </Link>
            </nav>
            
            <div className="mt-6 flex flex-col gap-4">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">{t('common.login')}</Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="gradient" className="w-full">{t('common.register')}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/home.jpg"
              alt="Beautiful campsite with smart management"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 80vw"
              quality={90}
              className="object-cover object-center brightness-[0.8]"
              style={{ objectPosition: '50% 50%' }}
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiIxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGBEAAwEBAAAAAAAAAAAAAAAAAAECEQP/2gAMAwEAAhEDEQA/AKOgxbUeRj+n6q3rnLapDG7RwSXMLyqMMVDKSO4/A1pVvUFvfyXM8drdwxyyNrZhIoJY/kkZpSlKIRUcH//Z"
            />
            <div className="absolute inset-0 bg-black/10 z-10"></div>
          </div>
          <div className="container relative z-10 py-16 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6">
            <div className="max-w-3xl space-y-5 text-center sm:text-left text-white">
              <Badge variant="gradient" className="mb-4 animate-fade-in">
                {t('home.hero.badge')}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl font-display animate-fade-up">
                {t('home.hero.title')}
              </h1>
              <p className="text-base sm:text-lg md:text-xl animate-fade-up animation-delay-200">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center sm:justify-start animate-fade-up animation-delay-400">
                <Link href="/register">
                  <Button size="lg" variant="gradient" className="w-full sm:w-auto">
                    {t('home.hero.getStarted')}
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  >
                    {t('home.hero.learnMore')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-accent/30">
          <div className="container px-4 sm:px-6">
            <div className="text-center mb-12">
              <Badge variant="gradient" className="mb-4">
                {t('home.features.badge')}
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 font-display">
                {t('home.features.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('home.features.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-primary" />}
                title={t('home.features.remoteControl.title')}
                description={t('home.features.remoteControl.description')}
              />
              <FeatureCard
                icon={<BarChart2 className="h-10 w-10 text-primary" />}
                title={t('home.features.realTimeMonitoring.title')}
                description={t('home.features.realTimeMonitoring.description')}
              />
              <FeatureCard
                icon={<Clock className="h-10 w-10 text-primary" />}
                title={t('home.features.smartAutomation.title')}
                description={t('home.features.smartAutomation.description')}
              />
              <FeatureCard
                icon={<Droplet className="h-10 w-10 text-primary" />}
                title={t('home.features.resourceOptimization.title')}
                description={t('home.features.resourceOptimization.description')}
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-primary" />}
                title={t('home.features.security.title')}
                description={t('home.features.security.description')}
              />
              <FeatureCard
                icon={<History className="h-10 w-10 text-primary" />}
                title={t('home.features.historicalData.title')}
                description={t('home.features.historicalData.description')}
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24">
          <div className="container px-4 sm:px-6">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                {t('home.howItWorks.badge')}
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 font-display">
                {t('home.howItWorks.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('home.howItWorks.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8">
              <StepCard
                number="1"
                title={t('home.howItWorks.signUp.title')}
                description={t('home.howItWorks.signUp.description')}
              />
              <StepCard
                number="2"
                title={t('home.howItWorks.bookCampsite.title')}
                description={t('home.howItWorks.bookCampsite.description')}
              />
              <StepCard
                number="3"
                title={t('home.howItWorks.controlMonitor.title')}
                description={t('home.howItWorks.controlMonitor.description')}
              />
              <StepCard
                number="4"
                title={t('home.howItWorks.enjoy.title')}
                description={t('home.howItWorks.enjoy.description')}
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 sm:px-6">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                {t('home.testimonials.badge')}
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 font-display">
                {t('home.testimonials.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('home.testimonials.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <TestimonialCard
                name={t('home.testimonials.sarah.name')}
                role={t('home.testimonials.sarah.role')}
                quote={t('home.testimonials.sarah.quote')}
                image="/home.jpg"
              />
              <TestimonialCard
                name={t('home.testimonials.michael.name')}
                role={t('home.testimonials.michael.role')}
                quote={t('home.testimonials.michael.quote')}
                image="/home.jpg"
              />
              <TestimonialCard
                name={t('home.testimonials.emma.name')}
                role={t('home.testimonials.emma.role')}
                quote={t('home.testimonials.emma.quote')}
                image="/home.jpg"
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-24 bg-accent/30">
          <div className="container px-4 sm:px-6">
            <div className="text-center mb-12">
              <Badge variant="gradient" className="mb-4">
                {t('home.faq.badge')}
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 font-display">
                {t('home.faq.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('home.faq.subtitle')}
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  value="item-1"
                  className="border rounded-lg p-2 mb-3 border-border/60 bg-background shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline px-2">
                    {t('home.faq.howItWorks.question')}
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
                    {t('home.faq.howItWorks.answer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="item-2"
                  className="border rounded-lg p-2 mb-3 border-border/60 bg-background shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline px-2">
                    {t('home.faq.bookingProcess.question')}
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
                    {t('home.faq.bookingProcess.answer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="item-3"
                  className="border rounded-lg p-2 mb-3 border-border/60 bg-background shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline px-2">
                    {t('home.faq.internetConnection.question')}
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
                    {t('home.faq.internetConnection.answer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="item-4"
                  className="border rounded-lg p-2 mb-3 border-border/60 bg-background shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline px-2">
                    {t('home.faq.dataSecurity.question')}
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
                    {t('home.faq.dataSecurity.answer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="item-5"
                  className="border rounded-lg p-2 mb-3 border-border/60 bg-background shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline px-2">
                    {t('home.faq.extendBooking.question')}
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
                    {t('home.faq.extendBooking.answer')}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 animated-gradient text-white">
          <div className="container px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6 font-display">
                {t('home.cta.title')}
              </h2>
              <p className="text-lg mb-8 text-white/90">
                {t('home.cta.subtitle')}
              </p>
              <Link href="/register">
                <Button size="lg" variant="default" className="bg-white text-primary hover:bg-white/90">
                  {t('home.cta.getStarted')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-slate-900 text-slate-200">
        <div className="container py-12 px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-primary/20 p-1">
                  <div className="h-8 w-8 rounded-full bg-primary" />
                </div>
                <span className="font-display font-bold text-xl">Masullas</span>
              </div>
              <p className="text-slate-400">Smart campsite control system helping you manage your camping experience efficiently and sustainably.</p>
              <div className="flex space-x-4">
                <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Camping</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Available Campsites
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Booking Calendar
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Camping Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Local Attractions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Smart Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Electricity Management
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Water Control
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Barrier Access
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Usage Analytics
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>© {new Date().getFullYear()} Masullas. All rights reserved. Smart campsite control solutions.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card hover className="hover-lift h-full">
      <CardContent className="p-6">
        <div className="mb-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 font-display">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center transition-all duration-200 hover:translate-y-[-4px]">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary flex items-center justify-center text-2xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 font-display">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function TestimonialCard({ name, role, quote, image }: TestimonialCardProps) {
  return (
    <Card hover className="h-full hover-lift">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Image src={image || "/home.jpg"} alt={name} width={50} height={50} className="rounded-full mr-4" />
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
        <p className="italic text-muted-foreground">"{quote}"</p>
      </CardContent>
    </Card>
  )
}

