import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AboutUs() {
  return (
    <div className="py-20 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About CVilo
          </h1>
          <p className="text-xl text-gray-600">
            Empowering professionals to build stunning resumes with ease
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Mission Statement */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                CVilo is an online platform built for professionals, students, and job seekers who want to create stunning, personalized resumes with ease. Our mission is to simplify the resume-building process while offering the flexibility to tailor each CV for different roles, industries, and skill sets.
              </p>
            </CardContent>
          </Card>

          {/* Who We Serve */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💼</span>
                </div>
                <CardTitle>Professionals</CardTitle>
                <CardDescription>
                  Advancing your career with tailored resumes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Whether you&apos;re switching careers or climbing the corporate ladder, create resumes that highlight your unique experience and skills.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎓</span>
                </div>
                <CardTitle>Students</CardTitle>
                <CardDescription>
                  Starting your career journey with confidence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Build professional resumes that showcase your education, projects, and potential, even without extensive work experience.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <CardTitle>Job Seekers</CardTitle>
                <CardDescription>
                  Finding your dream job with standout resumes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Create multiple versions of your resume optimized for different job applications and industry requirements.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Why Choose CVilo */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Why Choose CVilo?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Whether you&apos;re applying for your first job, switching careers, or freelancing across industries, CVilo helps you build multiple resumes, save templates, and showcase your strengths—fast and effectively.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">🎯 Multiple Focus Areas</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>✓ Different career paths and industries</li>
                    <li>✓ Tailored skill highlighting</li>
                    <li>✓ Role-specific customization</li>
                    <li>✓ Easy template switching</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-purple-600">⚡ Speed & Efficiency</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>✓ Professional resumes in minutes</li>
                    <li>✓ Smart content suggestions</li>
                    <li>✓ Drag & drop functionality</li>
                    <li>✓ Real-time preview</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Build Your Success Story?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who trust CVilo to create their perfect resumes
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
              🚀 Start Building Today
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 