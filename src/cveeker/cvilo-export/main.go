package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/chromedp"
	"github.com/gorilla/mux"
)

// ResumeData represents the structure of resume data
type ResumeData struct {
	Name           string          `json:"name"`
	Title          string          `json:"title"`
	Email          string          `json:"email"`
	Phone          string          `json:"phone"`
	LinkedIn       string          `json:"linkedin"`
	Summary        string          `json:"summary"`
	Skills         []string        `json:"skills"`
	Experience     []Experience    `json:"experience"`
	Education      Education       `json:"education"`
	Certifications []Certification `json:"certifications,omitempty"`
	Projects       []Project       `json:"projects,omitempty"`
	Languages      []Language      `json:"languages,omitempty"`
	Volunteer      []Volunteer     `json:"volunteer,omitempty"`
	Awards         []Award         `json:"awards,omitempty"`
}

type Experience struct {
	Role     string   `json:"role"`
	Company  string   `json:"company"`
	Duration string   `json:"duration"`
	Points   []string `json:"points"`
}

type Education struct {
	Degree  string `json:"degree"`
	School  string `json:"school"`
	Year    string `json:"year"`
	Details string `json:"details"`
}

type Certification struct {
	Name   string `json:"name"`
	Issuer string `json:"issuer"`
	Year   string `json:"year"`
}

type Project struct {
	Name   string   `json:"name"`
	Type   string   `json:"type"`
	Year   string   `json:"year"`
	Points []string `json:"points"`
}

type Language struct {
	Name        string `json:"name"`
	Proficiency string `json:"proficiency"`
}

type Volunteer struct {
	Role         string   `json:"role"`
	Organization string   `json:"organization"`
	Duration     string   `json:"duration"`
	Points       []string `json:"points"`
}

type Award struct {
	Name   string `json:"name"`
	Issuer string `json:"issuer"`
	Year   string `json:"year"`
}

// PDFGenerator handles PDF generation
type PDFGenerator struct {
	template    *template.Template
	pdfTemplate *template.Template
}

// NewPDFGenerator creates a new PDF generator
func NewPDFGenerator(templatePath string) (*PDFGenerator, error) {
	tmpl, err := template.ParseFiles(templatePath)
	if err != nil {
		return nil, fmt.Errorf("failed to parse template: %v", err)
	}

	pdfTmpl, err := template.ParseFiles("cv-pdf.html")
	if err != nil {
		return nil, fmt.Errorf("failed to parse PDF template: %v", err)
	}

	return &PDFGenerator{
		template:    tmpl,
		pdfTemplate: pdfTmpl,
	}, nil
}

// GeneratePDF generates a PDF from resume data
func (pg *PDFGenerator) GeneratePDF(data ResumeData) ([]byte, error) {
	// Execute template with data
	var buf bytes.Buffer
	err := pg.pdfTemplate.Execute(&buf, data)
	if err != nil {
		return nil, fmt.Errorf("failed to execute template: %v", err)
	}

	htmlContent := buf.String()

	// Create a temporary HTML file
	tmpFile, err := os.CreateTemp("", "resume-*.html")
	if err != nil {
		return nil, fmt.Errorf("failed to create temp file: %v", err)
	}
	defer os.Remove(tmpFile.Name())

	// Write HTML content to temp file
	if _, err := tmpFile.WriteString(htmlContent); err != nil {
		return nil, fmt.Errorf("failed to write temp file: %v", err)
	}
	tmpFile.Close()

	// Create Chrome context
	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()
	ctx, cancel = context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	var pdfBuffer []byte

	// Generate PDF using Chrome
	err = chromedp.Run(ctx,
		chromedp.Navigate("file://"+tmpFile.Name()),
		chromedp.WaitReady("body"),
		chromedp.ActionFunc(func(ctx context.Context) error {
			// Wait for any dynamic content to load
			time.Sleep(2 * time.Second)
			return nil
		}),
		chromedp.ActionFunc(func(ctx context.Context) error {
			// Generate PDF using Chrome DevTools API
			var result []byte
			var err error
			result, _, err = page.PrintToPDF().
				WithPrintBackground(true).
				WithPaperWidth(8.27).
				WithPaperHeight(11.69).
				WithMarginTop(0).
				WithMarginBottom(0).
				WithMarginLeft(0).
				WithMarginRight(0).
				Do(ctx)

			if err != nil {
				return err
			}

			// The result is already the PDF bytes
			pdfBuffer = result
			return nil
		}),
	)

	if err != nil {
		return nil, fmt.Errorf("failed to generate PDF: %v", err)
	}

	return pdfBuffer, nil
}

// Server handles HTTP requests
type Server struct {
	pdfGenerator *PDFGenerator
}

// NewServer creates a new server
func NewServer(pdfGenerator *PDFGenerator) *Server {
	return &Server{
		pdfGenerator: pdfGenerator,
	}
}

// generatePDFHandler handles PDF generation requests
func (s *Server) generatePDFHandler(w http.ResponseWriter, r *http.Request) {
	// Add CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Load sample data from JSON file instead of parsing request body
	resumeData, err := loadSampleData()
	if err != nil {
		http.Error(w, "Failed to load sample resume data", http.StatusInternalServerError)
		return
	}

	// Generate PDF
	pdfBytes, err := s.pdfGenerator.GeneratePDF(resumeData)
	if err != nil {
		log.Printf("Error generating PDF: %v", err)
		http.Error(w, "Failed to generate PDF", http.StatusInternalServerError)
		return
	}

	// Set response headers
	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", "attachment; filename=resume.pdf")
	w.Header().Set("Content-Length", fmt.Sprintf("%d", len(pdfBytes)))
	w.Header().Set("Content-Transfer-Encoding", "binary")

	// Write PDF to response
	w.Write(pdfBytes)
}

// serveTemplateHandler serves the HTML template
func (s *Server) serveTemplateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Set content type
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Content-Transfer-Encoding", "8bit")

	// Load sample data from JSON file
	sampleData, err := loadSampleData()
	if err != nil {
		log.Printf("Error loading sample data: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Execute template
	err = s.pdfGenerator.template.Execute(w, sampleData)
	if err != nil {
		log.Printf("Error executing template: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

// loadSampleData loads the sample resume data from JSON file
func loadSampleData() (ResumeData, error) {
	var data ResumeData

	// Read the JSON file
	jsonData, err := os.ReadFile("sample-resume.json")
	if err != nil {
		return data, fmt.Errorf("failed to read sample data: %v", err)
	}

	// Parse JSON
	err = json.Unmarshal(jsonData, &data)
	if err != nil {
		return data, fmt.Errorf("failed to parse sample data: %v", err)
	}

	return data, nil
}

// healthCheckHandler handles health check requests
func (s *Server) healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

func main() {
	// Initialize PDF generator
	pdfGenerator, err := NewPDFGenerator("cv.html")
	if err != nil {
		log.Fatalf("Failed to initialize PDF generator: %v", err)
	}

	// Create server
	server := NewServer(pdfGenerator)

	// Create router
	router := mux.NewRouter()

	// Define routes
	router.HandleFunc("/generate-pdf", server.generatePDFHandler).Methods("POST")
	router.HandleFunc("/health", server.healthCheckHandler).Methods("GET")
	router.HandleFunc("/template", server.serveTemplateHandler).Methods("GET")

	// Serve static files (for testing)
	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("."))))

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
