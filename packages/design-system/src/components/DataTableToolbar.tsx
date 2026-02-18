"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Props for DataTableToolbar component
 */
export interface DataTableToolbarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content to render in the toolbar (filters, search inputs, etc.)
   */
  children: React.ReactNode
}

/**
 * A flexible toolbar wrapper for DataTable filters and search inputs
 * Provides consistent spacing and layout for table controls
 *
 * @example
 * ```tsx
 * <DataTableToolbar>
 *   <Input
 *     placeholder="Filter by name..."
 *     value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
 *     onChange={(event) =>
 *       table.getColumn("name")?.setFilterValue(event.target.value)
 *     }
 *     className="max-w-sm"
 *   />
 *   <DataTableViewOptions table={table} />
 * </DataTableToolbar>
 * ```
 */
export function DataTableToolbar({
  children,
  className,
  ...props
}: DataTableToolbarProps) {
  return (
    <div
      className={cn("flex items-center justify-between gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

DataTableToolbar.displayName = "DataTableToolbar"
