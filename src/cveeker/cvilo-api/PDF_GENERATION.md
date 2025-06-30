# PDF Generation Service

This service provides PDF generation capabilities for resumes using Chrome DevTools Protocol (CDP) via the `chromedp` library.

## Features

- **High-quality PDF generation** from HTML content
- **A4 page format** with proper margins
- **Complete page loading detection** - waits for all resources, images, and dynamic content to load
- **Background printing** enabled for full color and styling
- **Customizable margins** and page dimensions

## Implementation

### PDF Service (`services/pdf_service.go`)

The `PDFService` uses Chrome DevTools Protocol to generate PDFs:

```go
type PDFService struct{}

func NewPDFService() *PDFService {
    return &PDFService{}
}
```

### Key Methods

#### `GeneratePDFFromURL(url, filename)`

Generates a PDF from a given URL with comprehensive page loading detection:

1. **Navigates** to the specified URL
2. **Waits for page readiness** using `chromedp.WaitReady`
3. **Waits for dynamic content** with a 3-second delay
4. **Ensures complete page loading** by checking `document.readyState`
5. **Waits for all images** to load completely
6. **Generates PDF** with A4 formatting and proper margins

### Page Loading Detection

The service implements comprehensive page loading detection:

- **Body element readiness** - ensures the main page structure is loaded
- **Document ready state** - waits for `document.readyState` to be complete
- **Image loading** - waits for all images to finish loading
- **Dynamic content delay** - allows time for JavaScript and CSS to complete rendering

## API Endpoint

### Download Resume PDF

**Endpoint:** `GET /api/resumes/:id/pdf`

**Description:** Generates and downloads a PDF version of the specified resume

**Parameters:**
- `id` (path parameter): Resume ID

**Response:**
- **Success (200):** PDF file with proper headers
- **Error (404):** Resume not found
- **Error (500):** PDF generation failed

**Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="resume_{id}.pdf"
```

## Usage Examples

### Frontend Integration

```typescript
// Download resume PDF
const downloadResumePDF = async (resumeId: number) => {
  try {
    const response = await fetch(`/api/resumes/${resumeId}/pdf`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume_${resumeId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } catch (error) {
    console.error('Failed to download PDF:', error);
  }
};
```

### Direct API Call

```bash
curl -X GET "http://localhost:8080/api/resumes/1/pdf" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output resume_1.pdf
```

## Configuration

### A4 Page Settings

- **Width:** 8.27 inches (210mm)
- **Height:** 11.69 inches (297mm)
- **Margins:** 0.4 inches (10mm) on all sides
- **Background printing:** Enabled

### Timeout Settings

- **Page load timeout:** 30 seconds
- **Dynamic content wait:** 3 seconds
- **Image loading wait:** Until all images are complete

## Dependencies

- `github.com/chromedp/chromedp` - Chrome DevTools Protocol client
- `github.com/chromedp/cdproto/page` - Page manipulation commands
- `github.com/chromedp/cdproto/runtime` - JavaScript runtime evaluation

## Notes

- Requires Chrome/Chromium browser to be installed on the server
- The service waits for complete page loading to ensure all content is rendered
- PDFs are generated with full color and styling preservation
- A4 format ensures compatibility with standard printing and viewing 