"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Database",
    href: "/database",
  },
  {
    name: "Paper Analysis",
    href: "/paper-analysis",
  },
  {
    name: "Advanced Analysis",
    href: "/advanced-analysis",
  },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left side - Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">DeepMarker</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium text-gray-600 transition-all duration-200 hover:text-blue-600 hover:scale-105",
                pathname === item.href ? "text-blue-600 font-semibold" : "",
              )}
            >
              {item.name}
            </Link>
          ))}
          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://github.com/your-org/DeepMarker"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-600 transition-colors duration-200 hover:text-blue-600"
            >
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="transition-colors duration-200 hover:bg-blue-50">
            Sign In
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105">
            Get Started
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden" size="sm">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-base font-medium text-gray-600 transition-colors hover:text-blue-600 py-2",
                    pathname === item.href ? "text-blue-600 font-semibold" : "",
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="https://github.com/your-org/DeepMarker"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-base font-medium text-gray-600 hover:text-blue-600 py-2"
                onClick={() => setIsOpen(false)}
              >
                <span>GitHub</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" size="sm" className="transition-colors duration-200 hover:bg-blue-50">
                  Sign In
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105">
                  Get Started
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
