'use client'

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Set launch date (1 month from 2025-08-19)
    // To change the countdown period, modify the number below:
    // - For 2 months: setMonth(launchDate.getMonth() + 2)
    // - For 3 weeks: setDate(launchDate.getDate() + 21)
    // - For specific date: new Date('2025-08-19')
    const startDate = new Date('2025-08-19')
    const launchDate = new Date(startDate)
    launchDate.setMonth(launchDate.getMonth())

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = launchDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Show loading state during SSR to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
          <Card key={unit} className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                00
              </div>
              <div className="text-sm text-gray-300 uppercase tracking-wider">
                {unit}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {Object.entries(timeLeft).map(([unit, value], index) => (
        <Card 
          key={unit} 
          className="bg-white/10 backdrop-blur-sm border-white/20 hover-lift transition-all duration-300 animate-scale-in-subtle"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardContent className="p-6 text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              {value.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-300 uppercase tracking-wider">
              {unit}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 