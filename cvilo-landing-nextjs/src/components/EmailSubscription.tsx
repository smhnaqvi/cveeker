'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail, ArrowRight, CheckCircle } from "lucide-react"

export default function EmailSubscription() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      // Here you would typically send the email to your backend
      console.log("Email subscribed:", email)
    }
  }

  if (isSubscribed) {
    return (
      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 animate-scale-in-subtle">
        <div className="flex items-center justify-center text-green-400">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span className="font-semibold">You&apos;re on the list! We&apos;ll notify you soon.</span>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto animate-fade-in-smooth">
      <div className="flex-1 relative group">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-purple-400 transition-colors duration-300" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/15 focus:bg-white/15"
          required
        />
      </div>
      <Button 
        type="submit"
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover-lift hover-glow"
      >
        Notify Me
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
      </Button>
    </form>
  )
} 