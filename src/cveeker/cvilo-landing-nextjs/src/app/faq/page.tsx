'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function FAQ() {
  const faqs = [
    {
      question: "Is CVilo free to use?",
      answer: "Yes, you can start for free! Our Free plan includes 1 resume, basic templates, and PDF export. You can upgrade to Pro or Ultimate plans for more advanced features like multiple resumes, premium templates, and AI suggestions."
    },
    {
      question: "Can I create multiple resumes?",
      answer: "Yes! That's one of our core features. With the Pro plan, you can create up to 5 resumes, and with the Ultimate plan, you can create unlimited resumes. Each resume can focus on different goals, industries, or skill sets."
    },
    {
      question: "Can I download my resume as a PDF?",
      answer: "Absolutely! You can export your resumes as PDF files anytime, even on the free plan. This ensures your resume maintains its formatting across different devices and applications."
    },
    {
      question: "Is my data safe?",
      answer: "Yes, we take data security very seriously. We use secure storage and encryption to protect your personal information and resume data. Your information is never shared with third parties without your consent."
    },
    {
      question: "What types of templates are available?",
      answer: "We offer a variety of professional templates suitable for different industries including Tech, Finance, Healthcare, Creative, Education, and more. Free users get access to basic templates, while Pro and Ultimate users get access to premium, industry-specific designs."
    },
    {
      question: "How does the AI suggestion feature work?",
      answer: "Our AI suggestion feature (available in the Ultimate plan) analyzes your experience and the job market to suggest relevant skills, improve job descriptions, and recommend better formatting. It helps you create more compelling resumes that stand out to employers."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time with no cancellation fees. If you cancel, you'll retain access to premium features until the end of your current billing period, then automatically switch to the free plan."
    },
    {
      question: "What's included in the Cover Letter Builder?",
      answer: "The Cover Letter Builder (Ultimate plan) helps you create professional cover letters that match your resume's style. It includes templates, AI-powered suggestions, and the ability to customize letters for different job applications."
    },
    {
      question: "How do Resume Analytics work?",
      answer: "Resume Analytics (Ultimate plan) provide insights into how your resume performs, including download statistics, view counts, and suggestions for improvement based on current hiring trends and industry standards."
    },
    {
      question: "Can I import my existing resume?",
      answer: "Yes, you can import existing resumes in various formats (PDF, Word, etc.) and our system will help you convert them into our editable format while maintaining your content and structure."
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes! Free users get community support, Pro users get priority email support, and Ultimate users get priority support with faster response times. We typically respond within 24 hours during business days."
    },
    {
      question: "Can I share my resume with others?",
      answer: "Yes, you can generate shareable links for your resumes, making it easy to send them to potential employers or share them on professional networks while maintaining control over access."
    }
  ]

  return (
    <div className="py-20 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about CVilo and resume building
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-left flex items-start justify-between">
                  <span className="flex-1 pr-4">{faq.question}</span>
                  <span className="text-blue-600 text-xl">+</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-2xl text-center">CVilo Features Overview</CardTitle>
              <CardDescription className="text-center">
                Everything you need to create professional resumes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">✨ Core Features</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span>Easy Resume Builder</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span>Multiple CVs with different focus</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span>Drag & Drop Sections</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span>PDF Export</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-purple-600">🚀 Premium Features</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span>Analytics to track resume views</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span>AI Suggestions for Skills & Descriptions</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-orange-500">⏳</span>
                      <span>Multilingual Support (coming soon)</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span>Cover Letter Builder</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Still Have Questions Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-xl mb-8 opacity-90">
              Our support team is here to help you succeed with your resume building journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                📧 Contact Support
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                💬 Live Chat
              </Button>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mt-12">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Can't find what you're looking for?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search for answers..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button>
                  Search
                </Button>
              </div>
              <p className="text-sm text-gray-500 text-center mt-4">
                Try searching for keywords like "export", "templates", "pricing", or "security"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 