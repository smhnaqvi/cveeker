import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Grid, GridColumn } from "@/components/ui/grid"

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Cvilo</h1>
          <p className="text-xl text-muted-foreground">
            Professional Resume & CV Management
          </p>
        </div>

        {/* Feature Cards using Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">Powerful Features</h2>
          <Grid cols={3} gap={6} className="mb-8">
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
          </Grid>
        </div>

        {/* Main content layout using Grid */}
        <Grid cols={12} gap={6}>
          <GridColumn span={8}>
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>
                  Comprehensive REST API for resume management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Key Endpoints:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <code className="bg-muted px-1 rounded">POST /api/v1/users</code> - Create user</li>
                    <li>• <code className="bg-muted px-1 rounded">GET /api/v1/users</code> - List users</li>
                    <li>• <code className="bg-muted px-1 rounded">POST /api/v1/resumes</code> - Create resume</li>
                    <li>• <code className="bg-muted px-1 rounded">GET /api/v1/resumes</code> - List resumes</li>
                  </ul>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button size="sm">
                    📚 View Docs
                  </Button>
                  <Button variant="outline" size="sm">
                    🔗 API Reference
                  </Button>
                </div>
              </CardContent>
            </Card>
          </GridColumn>

          <GridColumn span={4}>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">API Endpoints</span>
                      <span className="font-semibold text-accent">15+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Core Models</span>
                      <span className="font-semibold text-accent">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">RESTful Design</span>
                      <span className="font-semibold text-accent">100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <code className="block bg-muted p-2 rounded text-xs">
                      go run main.go
                    </code>
                    <p className="text-muted-foreground">Start the API server</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </GridColumn>
        </Grid>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center pt-8">
          <Button size="lg">
            🚀 Get Started
          </Button>
          <Button variant="outline" size="lg">
            📋 Documentation
          </Button>
          <Button variant="secondary" size="lg">
            🔗 GitHub
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
