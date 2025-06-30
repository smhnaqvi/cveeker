package services

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/cdproto/runtime"
	"github.com/chromedp/chromedp"
)

type PDFService struct{}

func NewPDFService() *PDFService {
	return &PDFService{}
}

// GeneratePDFFromURL generates a PDF from a given URL
func (ps *PDFService) GeneratePDFFromURL(url string, filename string) ([]byte, error) {
	// Create a new Chrome context
	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	// Set timeout
	ctx, cancel = context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	var pdfBuffer []byte

	// Navigate to the URL and generate PDF
	err := chromedp.Run(ctx,
		chromedp.Navigate(url),
		// Wait for the page to be ready
		chromedp.WaitReady("body", chromedp.ByQuery),
		// Wait for any dynamic content to load
		chromedp.Sleep(3*time.Second),
		// Wait for page to be completely loaded
		chromedp.ActionFunc(func(ctx context.Context) error {
			// Wait for the page to be fully loaded
			_, _, err := runtime.Evaluate(`document.readyState`).Do(ctx)
			if err != nil {
				return err
			}

			// Wait for all images to load
			_, _, err = runtime.Evaluate(`
				Promise.all(
					Array.from(document.images).map(img => {
						if (img.complete) return Promise.resolve();
						return new Promise(resolve => {
							img.onload = resolve;
							img.onerror = resolve;
						});
					})
				)
			`).Do(ctx)
			return err
		}),
		// Generate PDF
		chromedp.ActionFunc(func(ctx context.Context) error {
			var err error
			pdfBuffer, _, err = page.PrintToPDF().
				WithPrintBackground(true).
				WithPaperWidth(8.27).   // A4 width in inches
				WithPaperHeight(11.69). // A4 height in inches
				WithMarginTop(0.4).     // 10mm margin
				WithMarginBottom(0.4).
				WithMarginLeft(0.4).
				WithMarginRight(0.4).
				Do(ctx)
			return err
		}),
	)

	if err != nil {
		return nil, fmt.Errorf("failed to generate PDF: %v", err)
	}

	return pdfBuffer, nil
}

// GeneratePDFFromHTML generates a PDF from HTML content
func (ps *PDFService) GeneratePDFFromHTML(htmlContent string, filename string) ([]byte, error) {
	// Create a temporary HTML file
	tempFile, err := os.CreateTemp("", "resume-*.html")
	if err != nil {
		return nil, fmt.Errorf("failed to create temp file: %v", err)
	}
	defer os.Remove(tempFile.Name())

	// Write HTML content to temp file
	_, err = tempFile.WriteString(htmlContent)
	if err != nil {
		tempFile.Close()
		return nil, fmt.Errorf("failed to write HTML content: %v", err)
	}
	tempFile.Close()

	// Convert file path to file URL
	fileURL := fmt.Sprintf("file://%s", tempFile.Name())

	// Generate PDF from the temporary file
	return ps.GeneratePDFFromURL(fileURL, filename)
}

// SavePDFToFile saves PDF buffer to a file
func (ps *PDFService) SavePDFToFile(pdfBuffer []byte, filepath string) error {
	return os.WriteFile(filepath, pdfBuffer, 0644)
}
