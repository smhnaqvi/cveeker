# Cvilo REST API

A comprehensive REST API built with Go and Gin for managing users and their CV/resume data. Users can create multiple resumes with different titles, skills, and content to target different job applications.

## Features

- **User Management**: Create, read, update, delete users
- **Resume Management**: Multiple resumes per user with different titles and content
- **Rich Resume Data**: Support for work experience, education, skills, certifications, projects, and more
- **Resume Cloning**: Duplicate existing resumes for quick customization
- **JSON Storage**: Complex data structures stored as JSON for flexibility
- **Pagination**: Built-in pagination for list endpoints
- **Data Validation**: Input validation and error handling
- **Sample Data**: Seeding utility for testing and development

## Technology Stack

- **Language**: Go 1.21+
- **Framework**: Gin Web Framework
- **Database**: SQLite with GORM ORM
- **Architecture**: RESTful API with proper HTTP status codes

## Quick Start

### Prerequisites

- Go 1.21 or higher
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Cvilo
```

2. Install dependencies:
```bash
go mod tidy
```

3. Seed the database with sample data (optional):
```bash
go run main.go --seed
```

4. Start the server:
```bash
go run main.go
```

The API will be available at `http://localhost:8081`

## API Documentation

### Base URL
```
http://localhost:8081/api/v1
```

### Endpoints

#### Health Check
- `GET /ping` - Check if the API is running

#### API Documentation
- `GET /api/docs` - Get complete API documentation
- `GET /api/v1/sample-data` - Get sample data structures

#### Users
- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users` - Get all users (with pagination)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `GET /api/v1/users/search?email=<email>` - Get user by email

#### Resumes
- `POST /api/v1/resumes` - Create a new resume
- `GET /api/v1/resumes` - Get all resumes (with pagination)
- `GET /api/v1/resumes/:id` - Get resume by ID
- `PUT /api/v1/resumes/:id` - Update resume
- `DELETE /api/v1/resumes/:id` - Delete resume
- `POST /api/v1/resumes/:id/clone` - Clone resume
- `PUT /api/v1/resumes/:id/toggle-status` - Toggle resume active status
- `GET /api/v1/users/:userId/resumes` - Get all resumes for a user

#### Helpers
- `POST /api/v1/helpers/parse-experience` - Parse work experience to JSON
- `POST /api/v1/helpers/parse-education` - Parse education to JSON
- `POST /api/v1/helpers/parse-skills` - Parse skills to JSON

## Usage Examples

### Create a User

```bash
curl -X POST http://localhost:8081/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "summary": "Experienced Software Developer"
  }'
```

### Create a Resume

```bash
curl -X POST http://localhost:8081/api/v1/resumes \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "title": "Software Developer Resume",
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "summary": "Passionate software developer with 5+ years of experience",
    "skills": "[{\"name\": \"Go\", \"category\": \"Programming\", \"level\": 5}]"
  }'
```

### Get All Users

```bash
curl http://localhost:8081/api/v1/users?page=1&limit=10
```

### Get User's Resumes

```bash
curl http://localhost:8081/api/v1/users/1/resumes
```

### Clone a Resume

```bash
curl -X POST http://localhost:8081/api/v1/resumes/1/clone
```

## Data Models

### User Model
```go
type User struct {
    ID         uint      `json:"id"`
    CreatedAt  time.Time `json:"created_at"`
    UpdatedAt  time.Time `json:"updated_at"`
    ChatID     int64     `json:"chat_id"`
    Name       string    `json:"name"`
    Email      string    `json:"email"`
    Phone      string    `json:"phone"`
    Summary    string    `json:"summary"`
    Education  string    `json:"education"`
    Experience string    `json:"experience"`
    Skills     string    `json:"skills"`
    Languages  string    `json:"languages"`
    Step       string    `json:"step"`
}
```

### Resume Model
```go
type Resume struct {
    ID             uint      `json:"id"`
    CreatedAt      time.Time `json:"created_at"`
    UpdatedAt      time.Time `json:"updated_at"`
    UserID         uint      `json:"user_id"`
    Title          string    `json:"title"`
    IsActive       bool      `json:"is_active"`
    FullName       string    `json:"full_name"`
    Email          string    `json:"email"`
    Phone          string    `json:"phone"`
    Address        string    `json:"address"`
    Website        string    `json:"website"`
    LinkedIn       string    `json:"linkedin"`
    GitHub         string    `json:"github"`
    Summary        string    `json:"summary"`
    Objective      string    `json:"objective"`
    Experience     string    `json:"experience"`     // JSON string
    Education      string    `json:"education"`      // JSON string
    Skills         string    `json:"skills"`         // JSON string
    Languages      string    `json:"languages"`      // JSON string
    Certifications string    `json:"certifications"` // JSON string
    Projects       string    `json:"projects"`       // JSON string
    Awards         string    `json:"awards"`
    Interests      string    `json:"interests"`
    References     string    `json:"references"`
    Template       string    `json:"template"`
    Theme          string    `json:"theme"`
}
```

### Complex Data Structures

The API supports complex nested data structures stored as JSON strings:

#### Work Experience
```json
[
  {
    "company": "Tech Corp",
    "position": "Senior Developer",
    "location": "San Francisco, CA",
    "start_date": "2021-01-01T00:00:00Z",
    "end_date": null,
    "is_current": true,
    "description": "Led development of microservices architecture",
    "technologies": ["Go", "Docker", "Kubernetes"]
  }
]
```

#### Skills
```json
[
  {
    "name": "Go",
    "category": "Programming Languages",
    "level": 5,
    "years_experience": 3
  }
]
```

#### Education
```json
[
  {
    "institution": "University of Technology",
    "degree": "Bachelor of Science",
    "field_of_study": "Computer Science",
    "location": "Boston, MA",
    "start_date": "2015-09-01T00:00:00Z",
    "end_date": "2019-05-31T00:00:00Z",
    "gpa": "3.8/4.0"
  }
]
```

## Development

### Project Structure
```
Cvilo/
├── main.go              # Application entry point
├── models/              # Data models
│   ├── user.go         # User model
│   └── resume.go       # Resume model and related structures
├── handlers/           # HTTP handlers
│   ├── user.go        # User CRUD operations
│   └── resume.go      # Resume CRUD operations
├── utils/             # Utilities
│   └── seeder.go     # Database seeding utility
├── go.mod            # Go module dependencies
└── README.md         # This file
```

### Database

The application uses SQLite with GORM for simplicity. The database file (`cvilo.db`) is created automatically when you run the application.

To reset the database, simply delete the `cvilo.db` file and restart the application.

### Adding Sample Data

To populate the database with sample data for testing:

```bash
go run main.go --seed
```

This creates sample users and resumes with realistic data.

## API Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

### List Response (with pagination)
```json
{
  "data": [...],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total": 25,
    "total_pages": 3
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 