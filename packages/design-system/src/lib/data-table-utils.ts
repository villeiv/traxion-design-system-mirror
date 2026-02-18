import type { Column, RowData, Table } from "@tanstack/react-table"

/**
 * Type utilities for DataTable
 */
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

/**
 * Helper to get selected row data from table
 */
export function getSelectedRowData<TData>(table: Table<TData>): TData[] {
  return table.getSelectedRowModel().rows.map((row) => row.original)
}

/**
 * Helper to get all row IDs
 */
export function getAllRowIds<TData>(table: Table<TData>): string[] {
  return table.getRowModel().rows.map((row) => row.id)
}

/**
 * Helper to check if a column is sortable
 */
export function isColumnSortable<TData>(column: Column<TData>): boolean {
  return column.getCanSort()
}

/**
 * Helper to check if a column is filterable
 */
export function isColumnFilterable<TData>(column: Column<TData>): boolean {
  return column.getCanFilter()
}

/**
 * Utility to format cell values based on type
 */
export const formatters = {
  /**
   * Format date with options
   */
  date: (
    value: Date | string,
    options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ) => {
    const date = typeof value === "string" ? new Date(value) : value
    return new Intl.DateTimeFormat("en-US", options).format(date)
  },

  /**
   * Format number with options
   */
  number: (
    value: number,
    options: Intl.NumberFormatOptions = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  ) => {
    return new Intl.NumberFormat("en-US", options).format(value)
  },

  /**
   * Format currency
   */
  currency: (value: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value)
  },

  /**
   * Format boolean as Yes/No
   */
  boolean: (value: boolean) => {
    return value ? "Yes" : "No"
  },

  /**
   * Truncate string with ellipsis
   */
  truncate: (value: string, maxLength = 50) => {
    if (value.length <= maxLength) return value
    return `${value.slice(0, maxLength)}...`
  },
}
