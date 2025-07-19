import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Zap, 
  Star, 
  Users, 
  TrendingUp, 
  CheckCircle,
  Sparkles,
  Rocket
} from "lucide-react"
import CountdownTimer from "@/components/CountdownTimer"
import EmailSubscription from "@/components/EmailSubscription"

export default function ComingSoon() {
  const features = [
    { icon: Zap, title: "AI-Powered Resume Builder", description: "Create professional resumes with intelligent suggestions" },
    { icon: Star, title: "Premium Templates", description: "Beautiful, industry-specific templates designed by experts" },
    { icon: Users, title: "LinkedIn Integration", description: "Seamlessly import your LinkedIn profile data" },
    { icon: TrendingUp, title: "ATS Optimization", description: "Ensure your resume passes through Applicant Tracking Systems" },
    { icon: CheckCircle, title: "Real-time Preview", description: "See your changes instantly with live preview" },
    { icon: Sparkles, title: "Export Options", description: "Download as PDF, Word, or share directly" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-gentle-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-gentle-float delay-500"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-gentle-float delay-1000"></div>
        
        {/* Additional subtle orbs */}
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-indigo-500/8 rounded-full mix-blend-multiply filter blur-2xl animate-slow-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-cyan-500/8 rounded-full mix-blend-multiply filter blur-2xl animate-soft-glow"></div>
      </div>

      {/* Minimal Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-slow-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '80px 80px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Header with elegant animations */}
        <header className="pt-8 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge 
              variant="secondary" 
              className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm animate-fade-in-smooth delay-200"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Coming Soon
            </Badge>
            
            <h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up-gentle delay-400"
            >
              The Future of
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Resume Building
              </span>
            </h1>
            
            <p 
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-smooth delay-600"
            >
              CVilo is revolutionizing how professionals create stunning resumes. 
              Powered by AI, designed for success.
            </p>
          </div>
        </header>

        {/* Countdown Timer with subtle animations */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-slide-up-gentle delay-800">
              <h2 className="text-3xl font-bold text-white mb-4">Launching In</h2>
              <div className="animate-scale-in-subtle delay-1000">
                <CountdownTimer />
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview with elegant card animations */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-smooth delay-1000">
              <h2 className="text-4xl font-bold text-white mb-6">
                What&apos;s Coming
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover the powerful features that will transform your resume creation experience
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-500 group hover-lift hover-glow animate-scale-in-subtle"
                  style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                >
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-all duration-300">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Email Subscription with elegant animations */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center animate-fade-in-smooth delay-1200">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 hover-lift transition-all duration-500">
              <h2 className="text-3xl font-bold text-white mb-4">
                Be the First to Know
              </h2>
              <p className="text-gray-300 mb-8">
                Get early access and exclusive updates when we launch
              </p>
              
              <div className="animate-scale-in-subtle delay-1400">
                <EmailSubscription />
              </div>
            </div>
          </div>
        </section>

        {/* Footer with subtle animations */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-smooth delay-1600">
            <div className="flex items-center justify-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">CV</span>
              </div>
              <span className="text-2xl font-bold text-white">CVilo</span>
            </div>
            <p className="text-gray-400">
              © 2024 CVilo. All rights reserved. The future of resume building is coming.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
} 