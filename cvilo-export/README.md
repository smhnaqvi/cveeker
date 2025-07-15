# CVilo Export - Resume PDF Generator

A Go application that generates professional PDF resumes using HTML templates and Chrome's PDF generation capabilities.

## Features

- ✅ **HTML Template-based** - Uses `cv.html` as a template with Go template syntax
- ✅ **High-quality PDFs** - Chrome-based PDF generation with A4 formatting
- ✅ **Multi-page support** - Automatic page breaks for long content
- ✅ **Professional styling** - Clean, modern resume design
- ✅ **REST API** - HTTP endpoint for PDF generation
- ✅ **JSON input** - Structured resume data via JSON

## Prerequisites

- Go 1.21 or higher
- Chrome/Chromium browser (for PDF generation)
- Git

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd cvilo-export
   ```

2. **Install dependencies:**
   ```bash
   go mod tidy
   ```

3. **Run the server:**
   ```bash
   go run main.go
   ```

The server will start on `http://localhost:8080`

## API Usage

### Generate PDF

**Endpoint:** `POST /generate-pdf`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "name": "John Doe",
  "title": "Senior Frontend Developer",
  "email": "john@example.com",
  "phone": "+1234567890",
  "linkedin": "linkedin.com/in/johndoe",
  "summary": "Experienced frontend developer...",
  "skills": ["React", "TypeScript", "JavaScript"],
  "experience": [
    {
      "role": "Senior Frontend Developer",
      "company": "Philia",
      "duration": "June 2023 – Present",
      "points": [
        "Led development of scalable UI components...",
        "Improved page load time by 30%..."
      ]
    }
  ],
  "education": {
    "degree": "Associate's in Computer Software Engineering",
    "school": "Islamic Azad University",
    "year": "2019",
    "details": "GPA: 3.8/4.0 • Dean's List"
  },
  "certifications": [
    {
      "name": "AWS Certified Developer Associate",
      "issuer": "Amazon Web Services",
      "year": "2023"
    }
  ],
  "projects": [
    {
      "name": "E-Commerce Platform",
      "type": "Personal Project",
      "year": "2023",
      "points": [
        "Built a full-stack e-commerce platform...",
        "Implemented real-time inventory management..."
      ]
    }
  ],
  "languages": [
    {
      "name": "English",
      "proficiency": "Native/Fluent"
    }
  ],
  "volunteer": [
    {
      "role": "Code Mentor",
      "organization": "Local Coding Bootcamp",
      "duration": "2022 – Present",
      "points": [
        "Mentor students in web development...",
        "Conduct code reviews..."
      ]
    }
  ],
  "awards": [
    {
      "name": "Best Developer Award",
      "issuer": "TechStart Inc.",
      "year": "2023"
    }
  ]
}
```

**Response:**
- **Content-Type:** `application/pdf`
- **Body:** PDF file bytes
- **Headers:** 
  - `Content-Disposition: attachment; filename=resume.pdf`
  - `Content-Length: <file-size>`

### Health Check

**Endpoint:** `GET /health`

**Response:** `200 OK` with body `"OK"`

## Testing

1. **Start the server:**
   ```bash
   go run main.go
   ```

2. **Test with curl:**
   ```bash
   curl -X POST http://localhost:8080/generate-pdf \
     -H "Content-Type: application/json" \
     -d @sample-resume.json \
     --output generated-resume.pdf
   ```

3. **Or use the sample data:**
   ```bash
   # The server includes sample data in sample-resume.json
   curl -X POST http://localhost:8080/generate-pdf \
     -H "Content-Type: application/json" \
     -d @sample-resume.json \
     --output test-resume.pdf
   ```

## Template Structure

The `cv.html` template uses Go template syntax with the following variables:

### Basic Information
- `{{.Name}}` - Full name
- `{{.Title}}` - Job title
- `{{.Email}}` - Email address
- `{{.Phone}}` - Phone number
- `{{.LinkedIn}}` - LinkedIn profile
- `{{.Summary}}` - Professional summary

### Skills
```html
{{range .Skills}}
<span class="skill-tag">{{.}}</span>
{{end}}
```

### Experience
```html
{{range .Experience}}
<div class="experience-item">
  <div class="experience-header">{{.Role}}</div>
  <div class="experience-company">{{.Company}} • {{.Duration}}</div>
  <ul class="experience-points">
    {{range .Points}}
    <li>{{.}}</li>
    {{end}}
  </ul>
</div>
{{end}}
```

### Education
```html
<div class="education">
  <strong>{{.Education.Degree}}</strong><br>
  {{.Education.School}} • {{.Education.Year}}<br>
  <em>{{.Education.Details}}</em>
</div>
```

### Optional Sections
- `{{if .Certifications}}` - Certifications section
- `{{if .Projects}}` - Projects section
- `{{if .Languages}}` - Languages section
- `{{if .Volunteer}}` - Volunteer experience
- `{{if .Awards}}` - Awards & recognition

## Configuration

### Environment Variables

- `PORT` - Server port (default: 8080)

### PDF Settings

The PDF generation uses Chrome's PDF capabilities with these settings:

- **Paper Size:** A4 (8.27" × 11.69")
- **Margins:** 0.4" on all sides
- **Background:** Printed
- **Quality:** High resolution

## Architecture

### Components

1. **PDFGenerator** - Handles HTML template processing and PDF generation
2. **Server** - HTTP server with REST API endpoints
3. **ChromeDP** - Chrome DevTools Protocol for PDF generation

### Flow

1. **JSON Input** → Parse resume data
2. **Template Processing** → Execute HTML template with data
3. **Chrome Rendering** → Load HTML in Chrome
4. **PDF Generation** → Generate PDF with proper formatting
5. **Response** → Return PDF file

## Dependencies

- `github.com/chromedp/chromedp` - Chrome automation for PDF generation
- `github.com/gorilla/mux` - HTTP router
- `html/template` - Go template engine

## Troubleshooting

### Common Issues

1. **Chrome not found:**
   ```bash
   # Install Chrome/Chromium
   # Ubuntu/Debian:
   sudo apt install chromium-browser
   
   # macOS:
   brew install --cask google-chrome
   
   # Windows:
   # Download from https://www.google.com/chrome/
   ```

2. **Port already in use:**
   ```bash
   # Change port
   PORT=8081 go run main.go
   ```

3. **Template not found:**
   ```bash
   # Ensure cv.html is in the same directory as main.go
   ls -la cv.html
   ```

### Debug Mode

Enable debug logging:
```bash
export DEBUG=1
go run main.go
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation 