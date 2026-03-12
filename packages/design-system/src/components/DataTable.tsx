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
  type Table,
  type Column,
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
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings2,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table"
import { NoDataMessage } from "./No-data-message"
import { Button } from "./Button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./Dropdown-menu"

/* ─────────────────────────────────────────────
 * 1. Internal Context (not exported)
 * ───────────────────────────────────────────── */

interface DataTableContextValue<TData = unknown> {
  table: Table<TData>
  isLoading: boolean
  loadingRowCount: number
  emptyState?: React.ReactNode
  enableColumnReordering: boolean
  selectedRowsCount: number
  clearSelection: () => void
  columnTitles: React.RefObject<Map<string, string>>
  registerColumnTitle: (id: string, title: string) => void
}

const DataTableContext = React.createContext<DataTableContextValue | null>(null)

function useDataTableInstance<TData = unknown>(): DataTableContextValue<TData> {
  const ctx = React.useContext(DataTableContext)
  if (!ctx) {
    throw new Error(
      "DataTable compound components must be used inside <DataTable>"
    )
  }
  return ctx as DataTableContextValue<TData>
}

function useOptionalDataTableInstance<
  TData = unknown,
>(): DataTableContextValue<TData> | null {
  return React.useContext(DataTableContext) as DataTableContextValue<TData> | null
}

/* ─────────────────────────────────────────────
 * 2. DataTableToolbar
 * ───────────────────────────────────────────── */

export interface DataTableToolbarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

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

/* ─────────────────────────────────────────────
 * 3. ColumnHeaderWrapper (internal)
 * ───────────────────────────────────────────── */

interface ColumnHeaderWrapperProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

function ColumnHeaderWrapper<TData, TValue>({
  column,
  title,
  className,
  ...props
}: ColumnHeaderWrapperProps<TData, TValue>) {
  const ctx = useOptionalDataTableInstance()
  const isReorderingEnabled = ctx?.enableColumnReordering ?? false

  // Register title synchronously — safe because it only writes to a ref
  ctx?.registerColumnTitle(column.id, title)

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

  if (!column.getCanSort() && !isReorderingEnabled) {
    return (
      <div className={cn(className)} {...props}>
        {title}
      </div>
    )
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

      <span>{title}</span>
      {column.getCanSort() && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation()
            column.toggleSorting(column.getIsSorted() === "asc")
          }}
        >
          {column.getIsSorted() === "desc" ? (
            <ChevronDown className="h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronsUpDown className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
 * 4. DataTableViewOptions
 * ───────────────────────────────────────────── */

export interface DataTableViewOptionsProps<TData> {
  table?: Table<TData>
}

export function DataTableViewOptions<TData>({
  table: tableProp,
}: DataTableViewOptionsProps<TData>) {
  const ctx = useOptionalDataTableInstance<TData>()
  const table = tableProp ?? ctx?.table

  if (!table) {
    throw new Error(
      "DataTableViewOptions requires a `table` prop or must be used inside <DataTable>"
    )
  }

  const columns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8">
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
              {ctx?.columnTitles.current.get(column.id) ?? (typeof column.columnDef.header === "string" ? column.columnDef.header : column.id)}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

DataTableViewOptions.displayName = "DataTableViewOptions"

/* ─────────────────────────────────────────────
 * 5. DataTablePagination
 * ───────────────────────────────────────────── */

export interface DataTablePaginationProps<TData> {
  table?: Table<TData>
  pageSizeOptions?: number[]
  showRowSelection?: boolean
}

export function DataTablePagination<TData>({
  table: tableProp,
  pageSizeOptions = [3, 5, 10, 20, 30, 50],
  showRowSelection = true,
}: DataTablePaginationProps<TData>) {
  const ctx = useOptionalDataTableInstance<TData>()
  const table = tableProp ?? ctx?.table

  if (!table) {
    throw new Error(
      "DataTablePagination requires a `table` prop or must be used inside <DataTable>"
    )
  }

  const currentPageSize = table.getState().pagination.pageSize
  const resolvedPageSizeOptions = pageSizeOptions.includes(currentPageSize)
    ? pageSizeOptions
    : [...pageSizeOptions, currentPageSize].sort((a, b) => a - b)

  const selectedRowCount = ctx?.selectedRowsCount ?? table.getSelectedRowModel().rows.length
  const totalRowCount = table.getRowModel().rows.length

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {showRowSelection && selectedRowCount > 0 ? (
          <span>
            {selectedRowCount} of {totalRowCount} row(s) selected
          </span>
        ) : (
          <span>{totalRowCount} row(s)</span>
        )}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue
                placeholder={table.getState().pagination.pageSize}
              />
            </SelectTrigger>
            <SelectContent side="top">
              {resolvedPageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

DataTablePagination.displayName = "DataTablePagination"

/* ─────────────────────────────────────────────
 * 6. DataTableContent (NEW)
 * ───────────────────────────────────────────── */

export function DataTableContent() {
  const { table, isLoading, loadingRowCount, emptyState } =
    useDataTableInstance()

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <UITable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : typeof header.column.columnDef.header === "string"
                      ? <ColumnHeaderWrapper column={header.column} title={header.column.columnDef.header} />
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {Array.from({ length: loadingRowCount }).map((_, index) => (
              <TableRow key={index}>
                {table.getVisibleLeafColumns().map((column) => (
                  <TableCell key={column.id}>
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </UITable>
      </div>
    )
  }

  const rows = table.getRowModel().rows
  const showEmptyState = rows.length === 0

  return (
    <div className="rounded-md border">
      <UITable>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder ? null : typeof header.column.columnDef.header === "string"
                    ? <ColumnHeaderWrapper column={header.column} title={header.column.columnDef.header} />
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {showEmptyState ? (
            <TableRow>
              <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-24 text-center">
                {emptyState ?? (
                  <NoDataMessage title="No data" message="No records found." />
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
      </UITable>
    </div>
  )
}

DataTableContent.displayName = "DataTableContent"

/* ─────────────────────────────────────────────
 * 6.5. DataTableSelectionBar
 * ───────────────────────────────────────────── */

export interface DataTableSelectionBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function DataTableSelectionBar({
  children,
  className,
  ...props
}: DataTableSelectionBarProps) {
  const { selectedRowsCount, clearSelection } = useDataTableInstance()

  if (selectedRowsCount === 0) return null

  return (
    <div
      className={cn(
        "fixed z-50",
        "bottom-2 left-2 right-2 rounded-lg border sm:bottom-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2",
        "bg-secondary px-4 py-3 shadow-lg",
        "animate-in fade-in-0 slide-in-from-bottom-4 duration-300",
        className
      )}
      role="toolbar"
      aria-label="Bulk actions"
      {...props}
    >
      {/* Mobile: two rows / Desktop: single row */}
      <div className="flex items-center justify-center sm:hidden">
        <span className="text-sm font-medium text-secondary-foreground">
          {selectedRowsCount} selected
        </span>
      </div>
      <div className="mt-2 flex items-center justify-center gap-2 overflow-x-auto sm:hidden">
        {children}
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={clearSelection}
        >
          <X className="mr-1 h-4 w-4" />
          Deselect
        </Button>
      </div>

      {/* Desktop: single row */}
      <div className="hidden sm:flex sm:items-center sm:gap-4">
        <span className="text-sm font-medium text-secondary-foreground whitespace-nowrap">
          {selectedRowsCount} selected
        </span>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">{children}</div>
        <div className="h-4 w-px bg-border" />
        <Button
          variant="outline"
          size="sm"
          onClick={clearSelection}
        >
          <X className="mr-1 h-4 w-4" />
          Deselect
        </Button>
      </div>
    </div>
  )
}

DataTableSelectionBar.displayName = "DataTableSelectionBar"

/* ─────────────────────────────────────────────
 * 7. DataTable (main component)
 * ───────────────────────────────────────────── */

export interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  selectedRows?: Record<string, TData>
  onSelectedRowsChange?: (selectedRows: Record<string, TData>) => void
  rowSelectionKey?: (row: TData) => string
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>
  columnOrder?: ColumnOrderState
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>
  enableColumnReordering?: boolean
  className?: string
  emptyState?: React.ReactNode
  isLoading?: boolean
  loadingRowCount?: number
  children?: React.ReactNode
}

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
  selectedRows: controlledSelectedRows,
  onSelectedRowsChange,
  rowSelectionKey,
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
  children,
}: DataTableProps<TData, TValue>) {
  // Validate: rowSelectionKey is required when enableRowSelection is true
  if (enableRowSelection && !rowSelectionKey) {
    throw new Error(
      "DataTable: `rowSelectionKey` is required when `enableRowSelection` is true. " +
        "Provide a function that returns a unique identifier for each row, " +
        "e.g. rowSelectionKey={(row) => String(row.id)}"
    )
  }

  // Internal hydration tracking - prevents SSR hydration mismatches with @dnd-kit
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Internal state for optional controlled props
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([])
  const [internalColumnFilters, setInternalColumnFilters] =
    React.useState<ColumnFiltersState>([])
  const [internalSelectedRows, setInternalSelectedRows] =
    React.useState<Record<string, TData>>({})
  const [internalColumnVisibility, setInternalColumnVisibility] =
    React.useState<VisibilityState>({})
  const [internalColumnOrder, setInternalColumnOrder] =
    React.useState<ColumnOrderState>([])

  // Drag-and-drop state
  const [activeColumnId, setActiveColumnId] = React.useState<string | null>(
    null
  )

  // Use controlled state if provided, otherwise use internal state
  const sorting = controlledSorting ?? internalSorting
  const columnFilters = controlledColumnFilters ?? internalColumnFilters
  const selectedRows = controlledSelectedRows ?? internalSelectedRows
  const columnVisibility = controlledColumnVisibility ?? internalColumnVisibility
  const columnOrder = controlledColumnOrder ?? internalColumnOrder

  // Derive TanStack's RowSelectionState (Record<string, boolean>) from selectedRows
  const tanstackRowSelection = React.useMemo<RowSelectionState>(
    () =>
      Object.fromEntries(
        Object.keys(selectedRows).map((key) => [key, true])
      ),
    [selectedRows]
  )

  // Intercept TanStack's onRowSelectionChange to maintain selectedRows with full row data
  const handleRowSelectionChange: OnChangeFn<RowSelectionState> =
    React.useCallback(
      (updaterOrValue) => {
        const newTanstackState =
          typeof updaterOrValue === "function"
            ? updaterOrValue(tanstackRowSelection)
            : updaterOrValue

        // Build lookup for current page data
        const dataByKey = new Map<string, TData>()
        if (rowSelectionKey) {
          data.forEach((row) => {
            dataByKey.set(rowSelectionKey(row), row)
          })
        }

        // Build new selectedRows: keep existing entries that are still selected,
        // add new entries from current page data
        const newSelectedRows: Record<string, TData> = {}
        for (const [key, isSelected] of Object.entries(newTanstackState)) {
          if (isSelected) {
            newSelectedRows[key] = selectedRows[key] ?? dataByKey.get(key)!
          }
        }

        const changeFn = onSelectedRowsChange ?? setInternalSelectedRows
        changeFn(newSelectedRows)
      },
      [
        tanstackRowSelection,
        data,
        rowSelectionKey,
        selectedRows,
        onSelectedRowsChange,
      ]
    )

  const table = useReactTable({
    data,
    columns,
    pageCount,
    defaultColumn: { enableSorting: false },
    state: {
      pagination: controlledPagination,
      sorting,
      columnFilters,
      rowSelection: tanstackRowSelection,
      columnVisibility,
      columnOrder,
    },
    enableRowSelection,
    onPaginationChange,
    onSortingChange: onSortingChange ?? setInternalSorting,
    onColumnFiltersChange: onColumnFiltersChange ?? setInternalColumnFilters,
    onRowSelectionChange: handleRowSelectionChange,
    onColumnVisibilityChange:
      onColumnVisibilityChange ?? setInternalColumnVisibility,
    onColumnOrderChange: onColumnOrderChange ?? setInternalColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    // Server-side mode: always manual
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getRowId: rowSelectionKey
      ? (row: TData) => rowSelectionKey(row)
      : undefined,
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

  // Context value
  const selectedRowsCount = Object.keys(selectedRows).length
  const clearSelection = React.useCallback(() => {
    const changeFn = onSelectedRowsChange ?? setInternalSelectedRows
    changeFn({})
  }, [onSelectedRowsChange])

  const columnTitles = React.useRef<Map<string, string>>(new Map())
  const registerColumnTitle = React.useCallback((id: string, title: string) => {
    columnTitles.current.set(id, title)
  }, [])

  const contextValue: DataTableContextValue<TData> = React.useMemo(
    () => ({
      table,
      isLoading,
      loadingRowCount,
      emptyState,
      enableColumnReordering,
      selectedRowsCount,
      clearSelection,
      columnTitles,
      registerColumnTitle,
    }),
    [table, isLoading, loadingRowCount, emptyState, enableColumnReordering, selectedRowsCount, clearSelection, registerColumnTitle]
  )

  // Only enable DndContext after hydration AND if prop is true
  const shouldEnableDnd = enableColumnReordering && isHydrated

  // Determine content: children or default DataTableContent
  const content = children ?? <DataTableContent />

  if (shouldEnableDnd) {
    const columnIds = table.getAllLeafColumns().map((col) => col.id)

    return (
      <DataTableContext.Provider value={contextValue as DataTableContextValue}>
        <div className={cn("space-y-4", className)}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(event) =>
              setActiveColumnId(event.active.id as string)
            }
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={columnIds}
              strategy={horizontalListSortingStrategy}
            >
              {content}
            </SortableContext>
            <DragOverlay>
              {activeColumnId ? (
                <div className="rounded bg-muted p-2 shadow-lg">
                  {columnTitles.current.get(activeColumnId) ?? activeColumnId}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </DataTableContext.Provider>
    )
  }

  return (
    <DataTableContext.Provider value={contextValue as DataTableContextValue}>
      <div className={cn("space-y-4", className)}>{content}</div>
    </DataTableContext.Provider>
  )
}

DataTable.displayName = "DataTable"
