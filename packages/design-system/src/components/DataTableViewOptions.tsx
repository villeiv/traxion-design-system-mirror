"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { Settings2 } from "lucide-react"

import { Button } from "./Button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./Dropdown-menu"

/**
 * Props for DataTableViewOptions component
 */
export interface DataTableViewOptionsProps<TData> {
  /**
   * The table instance from TanStack Table
   */
  table: Table<TData>
}

/**
 * A dropdown menu for toggling column visibility in DataTable
 * Shows all columns that can be hidden/shown with checkboxes
 *
 * @example
 * ```tsx
 * <DataTableViewOptions table={table} />
 * ```
 */
export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  // Get all columns that can be toggled (excludes columns with enableHiding: false)
  const columns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8"
        >
          <Settings2 className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

DataTableViewOptions.displayName = "DataTableViewOptions"
