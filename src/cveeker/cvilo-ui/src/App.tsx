import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Cvilo</h1>
          <p className="text-xl text-muted-foreground">
            Professional Resume & CV Management
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👥 User Management
              </CardTitle>
              <CardDescription>
                Complete CRUD operations for users with professional information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage user profiles with contact details, skills, and career progression tracking.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📄 Resume Builder
              </CardTitle>
              <CardDescription>
                Create and manage multiple resumes per user.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Rich JSON data structures for experience, education, and skills.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🗄️ Database Access
              </CardTitle>
              <CardDescription>
                Clean, centralized database connection management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Global access patterns for optimal performance and maintainability.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg">
            🚀 Get Started
          </Button>
          <Button variant="outline" size="lg">
            📚 View Documentation
          </Button>
          <Button variant="secondary" size="lg">
            🔗 API Reference
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-accent">15+</div>
              <p className="text-sm text-muted-foreground">API Endpoints</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-accent">2</div>
              <p className="text-sm text-muted-foreground">Core Models</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-accent">100%</div>
              <p className="text-sm text-muted-foreground">RESTful</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-accent">⚡</div>
              <p className="text-sm text-muted-foreground">Fast</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
