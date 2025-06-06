'use client'

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className="w-full py-6 px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CV</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CVilo
          </span>
        </Link>
        <div className="hidden md:flex space-x-8 text-gray-600">
          <Link 
            href="/" 
            className={`hover:text-blue-600 transition-colors ${isActive('/') ? 'text-blue-600 font-semibold' : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={`hover:text-blue-600 transition-colors ${isActive('/about') ? 'text-blue-600 font-semibold' : ''}`}
          >
            About Us
          </Link>
          <Link 
            href="/pricing" 
            className={`hover:text-blue-600 transition-colors ${isActive('/pricing') ? 'text-blue-600 font-semibold' : ''}`}
          >
            Pricing
          </Link>
          <Link 
            href="/faq" 
            className={`hover:text-blue-600 transition-colors ${isActive('/faq') ? 'text-blue-600 font-semibold' : ''}`}
          >
            FAQ
          </Link>
          <Link 
            href="/contact" 
            className={`hover:text-blue-600 transition-colors ${isActive('/contact') ? 'text-blue-600 font-semibold' : ''}`}
          >
            Contact
          </Link>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">Sign In</Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </nav>
  )
} 