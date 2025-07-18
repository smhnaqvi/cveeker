'use client'

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-bold text-sm">CV</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CVilo
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 text-gray-600">
          <Link 
            href="/" 
            className={`hover:text-blue-600 transition-colors font-medium ${isActive('/') ? 'text-blue-600 font-semibold' : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={`hover:text-blue-600 transition-colors font-medium ${isActive('/about') ? 'text-blue-600 font-semibold' : ''}`}
          >
            About Us
          </Link>
          <Link 
            href="/pricing" 
            className={`hover:text-blue-600 transition-colors font-medium ${isActive('/pricing') ? 'text-blue-600 font-semibold' : ''}`}
          >
            Pricing
          </Link>
          <Link 
            href="/faq" 
            className={`hover:text-blue-600 transition-colors font-medium ${isActive('/faq') ? 'text-blue-600 font-semibold' : ''}`}
          >
            FAQ
          </Link>
          <Link 
            href="/contact" 
            className={`hover:text-blue-600 transition-colors font-medium ${isActive('/contact') ? 'text-blue-600 font-semibold' : ''}`}
          >
            Contact
          </Link>
        </div>
        
        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-4">
          <Button variant="outline" className="font-medium">Sign In</Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
          <div className="flex flex-col space-y-4 pt-4">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-lg font-medium ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`px-4 py-2 rounded-lg font-medium ${isActive('/about') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              href="/pricing" 
              className={`px-4 py-2 rounded-lg font-medium ${isActive('/pricing') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/faq" 
              className={`px-4 py-2 rounded-lg font-medium ${isActive('/faq') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link 
              href="/contact" 
              className={`px-4 py-2 rounded-lg font-medium ${isActive('/contact') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-200">
              <Button variant="outline" className="w-full font-medium">Sign In</Button>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 