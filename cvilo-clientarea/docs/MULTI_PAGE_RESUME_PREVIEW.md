# Multi-Page Resume Preview

## Overview

The Multi-Page Resume Preview feature allows users to view their resumes in a paginated format that accurately represents how the resume will appear when printed or exported as PDF. This feature provides:

- **Page Navigation**: Navigate between pages using arrow buttons or page indicator dots
- **Page Count Display**: Shows current page and total number of pages
- **A4 Page Simulation**: Each page is sized to A4 dimensions (210mm × 297mm)
- **Print Mode Support**: Automatically switches to full resume view when printing

## Components

### MultiPageResumePreview

The main component that handles the multi-page display logic.

**Props:**
- `data: ResumeFormValues` - The resume data to display
- `theme?: string` - The theme to apply (defaults to 'modern-blue')
- `printMode?: boolean` - Whether to render in print mode (defaults to false)

**Features:**
- Automatic page calculation based on content height
- Page navigation controls (First, Previous, Next, Last)
- Page indicator dots for quick navigation
- Responsive design that works on different screen sizes
- Print mode that shows the full resume without pagination

## Usage

### In Preview Mode

```tsx
import MultiPageResumePreview from '../components/MultiPageResumePreview';

<MultiPageResumePreview 
  data={resumeData} 
  theme="modern-blue" 
  printMode={false} 
/>
```

### In Print Mode

```tsx
<MultiPageResumePreview 
  data={resumeData} 
  theme="modern-blue" 
  printMode={true} 
/>
```

## Page Calculation Logic

The component automatically calculates the number of pages needed by:

1. **Measuring Content Height**: Uses a hidden container to measure the total height of the resume content
2. **A4 Page Height**: Calculates the height of a single A4 page (297mm × 0.4 scale factor)
3. **Page Count**: Divides total content height by A4 page height to determine number of pages
4. **Dynamic Updates**: Recalculates when content changes using ResizeObserver

## Navigation Controls

### Arrow Buttons
- **First Page** (FirstPageIcon): Jump to the first page
- **Previous Page** (ChevronLeftIcon): Go to the previous page
- **Next Page** (ChevronRightIcon): Go to the next page
- **Last Page** (LastPageIcon): Jump to the last page

### Page Indicator
- **Page Counter**: Shows "Page X of Y" format
- **Page Dots**: Clickable dots representing each page for quick navigation

## Styling

The component uses Material-UI styling with:
- A4 dimensions (210mm × 297mm)
- 0.4 scale factor for proper display
- Paper elevation for visual depth
- Responsive design that centers content
- Theme-aware colors and spacing

## Integration

The MultiPageResumePreview component is integrated into:

1. **PreviewResume Page**: Main resume preview page with download functionality
2. **ResumeForm Component**: Live preview during resume editing
3. **ThemeSelector Component**: Theme preview in the theme selection dialog

## Print Mode

When `printMode={true}`, the component:
- Disables pagination controls
- Shows the full resume content
- Maintains A4 dimensions
- Preserves theme styling
- Optimizes for PDF generation

## Technical Details

### Page Break Calculation
```typescript
const A4_HEIGHT_MM = 297;
const MM_TO_PX = 3.779527559; // 1mm = 3.779527559px at 96 DPI
const A4_HEIGHT_PX = A4_HEIGHT_MM * MM_TO_PX * 0.4; // Apply zoom factor

const contentHeight = container.scrollHeight;
const calculatedPages = Math.ceil(contentHeight / A4_HEIGHT_PX);
```

### Content Positioning
```typescript
const startY = (currentPage - 1) * A4_HEIGHT_PX;
const transform = `translateY(-${startY}px)`;
```

## Browser Compatibility

- **Modern Browsers**: Full support for ResizeObserver and CSS transforms
- **Mobile Devices**: Responsive design with touch-friendly navigation
- **Print Support**: Optimized for PDF generation and printing

## Future Enhancements

Potential improvements for future versions:
- Zoom controls for better content viewing
- Thumbnail preview of all pages
- Custom page size support
- Page break indicators in edit mode
- Drag and drop page reordering 