import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const gridVariants = cva(
  "grid",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5",
        6: "grid-cols-6",
        7: "grid-cols-7",
        8: "grid-cols-8",
        9: "grid-cols-9",
        10: "grid-cols-10",
        11: "grid-cols-11",
        12: "grid-cols-12",
      },
      gap: {
        0: "gap-0",
        1: "gap-1",
        2: "gap-2",
        3: "gap-3",
        4: "gap-4",
        5: "gap-5",
        6: "gap-6",
        8: "gap-8",
      },
    },
    defaultVariants: {
      cols: 12,
      gap: 4,
    },
  }
)

const gridColumnVariants = cva(
  "",
  {
    variants: {
      span: {
        1: "col-span-1",
        2: "col-span-2",
        3: "col-span-3",
        4: "col-span-4",
        5: "col-span-5",
        6: "col-span-6",
        7: "col-span-7",
        8: "col-span-8",
        9: "col-span-9",
        10: "col-span-10",
        11: "col-span-11",
        12: "col-span-12",
        full: "col-span-full",
      },
      start: {
        1: "col-start-1",
        2: "col-start-2",
        3: "col-start-3",
        4: "col-start-4",
        5: "col-start-5",
        6: "col-start-6",
        7: "col-start-7",
        8: "col-start-8",
        9: "col-start-9",
        10: "col-start-10",
        11: "col-start-11",
        12: "col-start-12",
        13: "col-start-13",
      },
      end: {
        1: "col-end-1",
        2: "col-end-2",
        3: "col-end-3",
        4: "col-end-4",
        5: "col-end-5",
        6: "col-end-6",
        7: "col-end-7",
        8: "col-end-8",
        9: "col-end-9",
        10: "col-end-10",
        11: "col-end-11",
        12: "col-end-12",
        13: "col-end-13",
      },
    },
    defaultVariants: {
      span: 12,
    },
  }
)

interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

interface GridColumnProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridColumnVariants> {}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(gridVariants({ cols, gap, className }))}
      {...props}
    />
  )
)
Grid.displayName = "Grid"

const GridColumn = React.forwardRef<HTMLDivElement, GridColumnProps>(
  ({ className, span, start, end, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(gridColumnVariants({ span, start, end, className }))}
      {...props}
    />
  )
)
GridColumn.displayName = "GridColumn"

// Responsive grid component
interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    default?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  }
  gap?: {
    default?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8
    sm?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8
    md?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8
    lg?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8
    xl?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8
  }
}

const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({ className, cols, gap, ...props }, ref) => {
    const gridClasses = cn(
      "grid",
      // Default columns
      cols?.default && `grid-cols-${cols.default}`,
      cols?.sm && `sm:grid-cols-${cols.sm}`,
      cols?.md && `md:grid-cols-${cols.md}`,
      cols?.lg && `lg:grid-cols-${cols.lg}`,
      cols?.xl && `xl:grid-cols-${cols.xl}`,
      // Default gaps
      gap?.default !== undefined && `gap-${gap.default}`,
      gap?.sm !== undefined && `sm:gap-${gap.sm}`,
      gap?.md !== undefined && `md:gap-${gap.md}`,
      gap?.lg !== undefined && `lg:gap-${gap.lg}`,
      gap?.xl !== undefined && `xl:gap-${gap.xl}`,
      className
    )

    return <div ref={ref} className={gridClasses} {...props} />
  }
)
ResponsiveGrid.displayName = "ResponsiveGrid"

// Responsive grid column component
interface ResponsiveGridColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: {
    default?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full"
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full"
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full"
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full"
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full"
  }
}

const ResponsiveGridColumn = React.forwardRef<HTMLDivElement, ResponsiveGridColumnProps>(
  ({ className, span, ...props }, ref) => {
    const columnClasses = cn(
      // Default span
      span?.default && (span.default === "full" ? "col-span-full" : `col-span-${span.default}`),
      span?.sm && (span.sm === "full" ? "sm:col-span-full" : `sm:col-span-${span.sm}`),
      span?.md && (span.md === "full" ? "md:col-span-full" : `md:col-span-${span.md}`),
      span?.lg && (span.lg === "full" ? "lg:col-span-full" : `lg:col-span-${span.lg}`),
      span?.xl && (span.xl === "full" ? "xl:col-span-full" : `xl:col-span-${span.xl}`),
      className
    )

    return <div ref={ref} className={columnClasses} {...props} />
  }
)
ResponsiveGridColumn.displayName = "ResponsiveGridColumn"

export { 
  Grid, 
  GridColumn, 
  ResponsiveGrid, 
  ResponsiveGridColumn,
  gridVariants,
  gridColumnVariants
} 