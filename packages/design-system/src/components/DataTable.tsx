"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  type ColumnOrderState,
} from "@tanstack/react-table"
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"

import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table"
import { NoDataMessage } from "./No-data-message"

/**
 * Props for DataTable component
 */
export interface DataTableProps<TData, TValue = unknown> {
  /**
   * Column definitions for the table
   */
  columns: ColumnDef<TData, TValue>[]

  /**
   * Data to display in the table
   */
  data: TData[]

  /**
   * Total number of pages (required for server-side pagination)
   */
  pageCount: number

  /**
   * Controlled pagination state (required)
   */
  pagination: PaginationState

  /**
   * Pagination state change handler (required)
   */
  onPaginationChange: OnChangeFn<PaginationState>

  /**
   * Controlled sorting state
   */
  sorting?: SortingState

  /**
   * Sorting state change handler
   */
  onSortingChange?: OnChangeFn<SortingState>

  /**
   * Controlled column filters state
   */
  columnFilters?: ColumnFiltersState

  /**
   * Column filters state change handler
   */
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>

  /**
   * Controlled row selection state
   */
  rowSelection?: RowSelectionState

  /**
   * Row selection state change handler
   */
  onRowSelectionChange?: OnChangeFn<RowSelectionState>

  /**
   * Function to get unique row ID
   */
  getRowId?: (row: TData, index: number) => string

  /**
   * Enable row selection
   * Can be a boolean or a function that determines if a row is selectable
   * @default false
   */
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)

  /**
   * Controlled column visibility state
   */
  columnVisibility?: VisibilityState

  /**
   * Column visibility state change handler
   */
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>

  /**
   * Controlled column order state
   */
  columnOrder?: ColumnOrderState

  /**
   * Column order state change handler
   */
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>

  /**
   * Enable column reordering via drag-and-drop
   * @default false
   */
  enableColumnReordering?: boolean

  /**
   * Additional CSS class name
   */
  className?: string

  /**
   * Custom empty state component
   */
  emptyState?: React.ReactNode

  /**
   * Show loading state with skeleton rows
   * @default false
   */
  isLoading?: boolean

  /**
   * Number of skeleton rows to show when loading
   * @default 5
   */
  loadingRowCount?: number
}

/**
 * A flexible, production-ready DataTable component built on TanStack Table v8
 *
 * **Server-side only**: This component expects pre-filtered, pre-sorted, and pre-paginated
 * data from the server. All pagination, sorting, and filtering logic must be handled server-side.
 *
 * Supports row selection, column visibility, and column reordering via drag-and-drop.
 *
 * @example
 * Server-side with URL state (recommended):
 * ```tsx
 * const tableState = useDataTable({ serverSide: true })
 *
 * // Fetch data based on tableState (pagination, sorting, filters)
 * const { data, pageCount } = await fetchData({
 *   page: tableState.pagination.pageIndex,
 *   pageSize: tableState.pagination.pageSize,
 *   sort: tableState.sorting,
 *   filters: tableState.columnFilters,
 * })
 *
 * <DataTable
 *   columns={columns}
 *   data={data}
 *   pageCount={pageCount}
 *   pagination={tableState.pagination}
 *   onPaginationChange={tableState.setPagination}
 *   sorting={tableState.sorting}
 *   onSortingChange={tableState.setSorting}
 *   columnFilters={tableState.columnFilters}
 *   onColumnFiltersChange={tableState.setColumnFilters}
 * />
 * ```
 *
 * @example
 * With row selection:
 * ```tsx
 * <DataTable
 *   columns={columns}
 *   data={data}
 *   pageCount={totalPages}
 *   pagination={pagination}
 *   onPaginationChange={setPagination}
 *   enableRowSelection
 * />
 * ```
 */
export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  pageCount,
  pagination: controlledPagination,
  onPaginationChange,
  sorting: controlledSorting,
  onSortingChange,
  columnFilters: controlledColumnFilters,
  onColumnFiltersChange,
  rowSelection: controlledRowSelection,
  onRowSelectionChange,
  getRowId,
  enableRowSelection = false,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange,
  columnOrder: controlledColumnOrder,
  onColumnOrderChange,
  enableColumnReordering = false,
  className,
  emptyState,
  isLoading = false,
  loadingRowCount = 5,
}: DataTableProps<TData, TValue>) {
  // Internal hydration tracking - prevents SSR hydration mismatches with @dnd-kit
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Internal state for optional controlled props
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([])
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([])
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({})
  const [internalColumnVisibility, setInternalColumnVisibility] = React.useState<VisibilityState>({})
  const [internalColumnOrder, setInternalColumnOrder] = React.useState<ColumnOrderState>([])

  // Drag-and-drop state
  const [activeColumnId, setActiveColumnId] = React.useState<string | null>(null)

  // Use controlled state if provided, otherwise use internal state
  const sorting = controlledSorting ?? internalSorting
  const columnFilters = controlledColumnFilters ?? internalColumnFilters
  const rowSelection = controlledRowSelection ?? internalRowSelection
  const columnVisibility = controlledColumnVisibility ?? internalColumnVisibility
  const columnOrder = controlledColumnOrder ?? internalColumnOrder

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination: controlledPagination,
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
      columnOrder,
    },
    enableRowSelection,
    onPaginationChange,
    onSortingChange: onSortingChange ?? setInternalSorting,
    onColumnFiltersChange: onColumnFiltersChange ?? setInternalColumnFilters,
    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,
    onColumnVisibilityChange: onColumnVisibilityChange ?? setInternalColumnVisibility,
    onColumnOrderChange: onColumnOrderChange ?? setInternalColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    // Server-side mode: always manual
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getRowId,
  })

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handle drag end
  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        const oldIndex = table
          .getAllLeafColumns()
          .findIndex((col) => col.id === active.id)
        const newIndex = table
          .getAllLeafColumns()
          .findIndex((col) => col.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          const newColumnOrder = arrayMove(
            table.getAllLeafColumns().map((col) => col.id),
            oldIndex,
            newIndex
          )

          if (onColumnOrderChange) {
            onColumnOrderChange(newColumnOrder)
          } else {
            setInternalColumnOrder(newColumnOrder)
          }
        }
      }

      setActiveColumnId(null)
    },
    [table, onColumnOrderChange]
  )

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {Array.from({ length: loadingRowCount }).map((_, index) => (
                <TableRow key={index}>
                  {table.getAllLeafColumns().map((column) => (
                    <TableCell key={column.id}>
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  // Empty state
  const rows = table.getRowModel().rows
  const showEmptyState = !isLoading && rows.length === 0

  const tableContent = (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {showEmptyState ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyState ?? (
                  <NoDataMessage
                    title="No data"
                    message="No records found."
                  />
                )}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )

  // Only enable DndContext after hydration AND if prop is true
  // This prevents hydration mismatches from @dnd-kit's dynamic IDs
  const shouldEnableDnd = enableColumnReordering && isHydrated

  // Wrap with DndContext if column reordering is enabled and client is hydrated
  if (shouldEnableDnd) {
    const columnIds = table.getAllLeafColumns().map((col) => col.id)

    return (
      <div className={cn("space-y-4", className)}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(event) => setActiveColumnId(event.active.id as string)}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columnIds}
            strategy={horizontalListSortingStrategy}
          >
            {tableContent}
          </SortableContext>
          <DragOverlay>
            {activeColumnId ? (
              <div className="rounded bg-muted p-2 shadow-lg">
                {activeColumnId}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    )
  }

  return <div className={cn("space-y-4", className)}>{tableContent}</div>
}

DataTable.displayName = "DataTable"
