import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Pricing() {
  return (
    <div className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your resume building needs. Start free and upgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🆓</span>
              </div>
              <CardTitle className="text-2xl">Free Plan</CardTitle>
              <CardDescription className="text-gray-600">
                Perfect for getting started
              </CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>1 Resume</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Basic Templates</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Export as PDF</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Limited Customization</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-gray-400">✕</span>
                  <span className="text-gray-400">Premium Templates</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-gray-400">✕</span>
                  <span className="text-gray-400">Priority Support</span>
                </li>
              </ul>
              <Button className="w-full mt-8" variant="outline">
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-blue-500 relative hover:border-blue-600 transition-colors">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">⭐</span>
              </div>
              <CardTitle className="text-2xl">Pro Plan</CardTitle>
              <CardDescription className="text-gray-600">
                Great for professionals
              </CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">$4.99</span>
                <span className="text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Up to 5 Resumes</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Access to Premium Templates</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Custom Skills & Sections</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Priority Support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>PDF Export</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-gray-400">✕</span>
                  <span className="text-gray-400">AI Suggestions</span>
                </li>
              </ul>
              <Button className="w-full mt-8">
                Start Pro Plan
              </Button>
            </CardContent>
          </Card>

          {/* Ultimate Plan */}
          <Card className="border-2 border-purple-500 hover:border-purple-600 transition-colors">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🚀</span>
              </div>
              <CardTitle className="text-2xl">Ultimate Plan</CardTitle>
              <CardDescription className="text-gray-600">
                Everything you need and more
              </CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Unlimited Resumes</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>All Templates</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>AI Resume Suggestions</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Advanced Customization</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Cover Letter Builder</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>Resume Analytics</span>
                </li>
              </ul>
              <Button className="w-full mt-8" variant="outline">
                Go Ultimate
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Compare Features
          </h2>
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold">Features</th>
                      <th className="text-center py-4 px-6 font-semibold">Free</th>
                      <th className="text-center py-4 px-6 font-semibold text-blue-600">Pro</th>
                      <th className="text-center py-4 px-6 font-semibold text-purple-600">Ultimate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-4 px-6">✨ Easy Resume Builder</td>
                      <td className="text-center py-4 px-6">✓</td>
                      <td className="text-center py-4 px-6">✓</td>
                      <td className="text-center py-4 px-6">✓</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-4 px-6">🎯 Multiple CVs</td>
                      <td className="text-center py-4 px-6">1</td>
                      <td className="text-center py-4 px-6">5</td>
                      <td className="text-center py-4 px-6">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6">🎨 Premium Templates</td>
                      <td className="text-center py-4 px-6">✕</td>
                      <td className="text-center py-4 px-6">✓</td>
                      <td className="text-center py-4 px-6">✓</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-4 px-6">🤖 AI Suggestions</td>
                      <td className="text-center py-4 px-6">✕</td>
                      <td className="text-center py-4 px-6">✕</td>
                      <td className="text-center py-4 px-6">✓</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6">📊 Resume Analytics</td>
                      <td className="text-center py-4 px-6">✕</td>
                      <td className="text-center py-4 px-6">✕</td>
                      <td className="text-center py-4 px-6">✓</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-4 px-6">📝 Cover Letter Builder</td>
                      <td className="text-center py-4 px-6">✕</td>
                      <td className="text-center py-4 px-6">✕</td>
                      <td className="text-center py-4 px-6">✓</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6">🎧 Priority Support</td>
                      <td className="text-center py-4 px-6">✕</td>
                      <td className="text-center py-4 px-6">✓</td>
                      <td className="text-center py-4 px-6">✓</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! You can cancel your subscription at any time. Your account will remain active until the end of your current billing period.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We offer a 30-day money-back guarantee. If you&apos;re not satisfied with CVilo, contact us for a full refund.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Can I upgrade or downgrade my plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Absolutely! You can change your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Is my data secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, we use industry-standard encryption and security measures to protect your personal information and resume data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Choose your plan and start building professional resumes today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
              🚀 Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
              💬 Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 