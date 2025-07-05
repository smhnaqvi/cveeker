import React, { useState, useEffect, useRef } from "react";
import { 
  Box, 
  IconButton, 
  Typography, 
  Stack
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import ResumePreview from "./ResumePreview2";
import type { ResumeFormValues } from "../pages/dashboard/resume/components/ResumeForm";

type Props = {
  data: ResumeFormValues;
  theme?: string;
  printMode?: boolean;
};

const MultiPageResumePreview: React.FC<Props> = ({ data, theme = 'modern-blue', printMode = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageBreaks, setPageBreaks] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // A4 dimensions and viewport settings
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  const VIEWPORT_WIDTH_PX = 480;
  const VIEWPORT_HEIGHT_PX = 676;
  
  // Convert A4 dimensions to pixels for proper scaling
  const MM_TO_PX = 3.779527559; // 1mm = 3.779527559px at 96 DPI
  const A4_WIDTH_PX = A4_WIDTH_MM * MM_TO_PX;
  const A4_HEIGHT_PX = A4_HEIGHT_MM * MM_TO_PX;
  
  // Calculate scale to fit A4 in viewport while maintaining aspect ratio
  const scaleX = VIEWPORT_WIDTH_PX / A4_WIDTH_PX;
  const scaleY = VIEWPORT_HEIGHT_PX / A4_HEIGHT_PX;
  const baseScale = Math.min(scaleX, scaleY) * 0.9; // Use 0.9 to ensure fit with some margin
  const scale = baseScale;
  
  // Calculate actual display dimensions
  const displayWidth = A4_WIDTH_PX * scale;
  const displayHeight = A4_HEIGHT_PX * scale;
  
  // Calculate page breaks and total pages
  useEffect(() => {
    if (!containerRef.current || printMode) return;

    const calculatePageBreaks = () => {
      const container = containerRef.current;
      if (!container) return;

      const contentHeight = container.scrollHeight;
      const calculatedPages = Math.ceil(contentHeight / A4_HEIGHT_PX);
      
      setTotalPages(Math.max(1, calculatedPages));
      
      // Calculate page break positions
      const breaks: number[] = [];
      for (let i = 1; i < calculatedPages; i++) {
        breaks.push(i * A4_HEIGHT_PX);
      }
      setPageBreaks(breaks);
    };

    // Use ResizeObserver to recalculate when content changes
    const resizeObserver = new ResizeObserver(calculatePageBreaks);
    resizeObserver.observe(containerRef.current);

    // Initial calculation
    calculatePageBreaks();

    return () => {
      resizeObserver.disconnect();
    };
  }, [data, theme, printMode]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFirstPage = () => handlePageChange(1);
  const handleLastPage = () => handlePageChange(totalPages);
  const handlePrevPage = () => handlePageChange(currentPage - 1);
  const handleNextPage = () => handlePageChange(currentPage + 1);

  // If in print mode, render normally without pagination
  if (printMode) {
    return (
      <ResumePreview 
        data={data} 
        theme={theme} 
        printMode={true} 
      />
    );
  }

  // Calculate the visible content for the current page
  const getPageContent = () => {
    const startY = (currentPage - 1) * A4_HEIGHT_PX;
    
    return (
      <Box
        sx={{
          position: 'relative',
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
          overflow: 'hidden',
          mx: 'auto',
          backgroundColor: 'white',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              transform: `translateY(-${startY * scale}px) scale(${scale})`,
              transformOrigin: 'top left',
              width: `${A4_WIDTH_PX}px`,
              height: 'auto',
            }}
          >
            <ResumePreview 
              data={data} 
              theme={theme} 
              printMode={false} 
            />
          </Box>
        </Box>
        
        {/* Page break indicators */}
        {pageBreaks.map((breakY, index) => {
          const adjustedBreakY = (breakY - startY) * scale;
          if (adjustedBreakY > 0 && adjustedBreakY < displayHeight) {
            return (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  top: adjustedBreakY,
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  zIndex: 10,
                }}
              />
            );
          }
          return null;
        })}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: `${VIEWPORT_WIDTH_PX}px`, mx: 'auto' }}>
      {/* Resume Preview Container */}
      <Stack 
        sx={{
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: `${VIEWPORT_HEIGHT_PX}px`,
        }}
      >
        {/* Hidden container for calculating total height */}
        <Box
          ref={containerRef}
          sx={{
            position: 'absolute',
            top: '-9999px',
            left: '-9999px',
            width: `${A4_WIDTH_PX}px`,
            visibility: 'hidden',
          }}
        >
          <ResumePreview 
            data={data} 
            theme={theme} 
            printMode={false} 
          />
        </Box>

        {/* Visible page content */}
        {getPageContent()}
      </Stack>
      
      {/* Navigation Controls */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 1, 
      }}>
        <IconButton
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          size="small"
          title="First page"
        >
          <FirstPageIcon />
        </IconButton>
        
        <IconButton
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          size="small"
          title="Previous page"
        >
          <ChevronLeftIcon />
        </IconButton>

        <Typography variant="body2" sx={{ minWidth: '80px', textAlign: 'center' }}>
          Page {currentPage} of {totalPages}
        </Typography>

        <IconButton
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          size="small"
          title="Next page"
        >
          <ChevronRightIcon />
        </IconButton>

        <IconButton
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          size="small"
          title="Last page"
        >
          <LastPageIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MultiPageResumePreview; 