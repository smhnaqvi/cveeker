import * as React from "react"
import { cn } from "@/lib/utils"

const Grid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid",
      className
    )}
    {...props}
  />
))
Grid.displayName = "Grid"

const GridRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid grid-cols-12 gap-4",
      className
    )}
    {...props}
  />
))
GridRow.displayName = "GridRow"

const GridColumn = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    offset?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
  }
>(({ className, span = 12, offset = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      `col-span-${span}`,
      offset > 0 && `col-start-${offset + 1}`,
      className
    )}
    {...props}
  />
))
GridColumn.displayName = "GridColumn"

export { Grid, GridRow, GridColumn }
