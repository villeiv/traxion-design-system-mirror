"use client"

import * as React from "react"
import type { Column } from "@tanstack/react-table"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ChevronDown, ChevronUp, ChevronsUpDown, GripVertical } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./Button"

/**
 * Props for DataTableColumnHeader component
 */
export interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The column instance from TanStack Table
   */
  column: Column<TData, TValue>

  /**
   * The display title for the column
   */
  title: string
}

/**
 * A sortable and draggable column header component for DataTable
 * Shows sort indicators and optional drag handle for column reordering
 *
 * @example
 * ```tsx
 * {
 *   accessorKey: "name",
 *   header: ({ column }) => (
 *     <DataTableColumnHeader column={column} title="Name" />
 *   ),
 * }
 * ```
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  // useSortable is safe to call even outside DndContext
  // It will return default values when not inside a DndContext
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Check if we're inside a DndContext by checking if we have valid listeners
  // When outside DndContext, useSortable returns undefined for listeners
  // When inside DndContext, listeners is an object (even when not dragging)
  const isReorderingEnabled = listeners !== undefined

  if (!column.getCanSort() && !isReorderingEnabled) {
    return <div className={cn(className)} {...props}>{title}</div>
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center space-x-2",
        isDragging && "opacity-50",
        className
      )}
      {...props}
    >
      {isReorderingEnabled && (
        <button
          type="button"
          className={cn(
            "cursor-grab active:cursor-grabbing",
            "text-muted-foreground hover:text-foreground",
            "transition-colors",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          )}
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder column"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}

      {column.getCanSort() ? (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 data-[state=open]:bg-accent"
          onClick={(e) => {
            e.stopPropagation()
            column.toggleSorting(column.getIsSorted() === "asc")
          }}
        >
          <span>{title}</span>
          {column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ) : (
        <span>{title}</span>
      )}
    </div>
  )
}

DataTableColumnHeader.displayName = "DataTableColumnHeader"
