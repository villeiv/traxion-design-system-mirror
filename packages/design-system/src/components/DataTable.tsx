"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  type ColumnOrderState,
  type ColumnPinningState,
  type Table,
  type Column,
  type ColumnDef as TanStackColumnDef,
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
import { useDesignSystemLanguage } from "./Language-provider"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip"

/* ─────────────────────────────────────────────
 * 0. Public types — cell editing
 * ───────────────────────────────────────────── */

/**
 * Column definition re-exported from TanStack Table, augmented with
 * DataTable-specific column options.
 *
 * - `enableEditing` makes the column's cells editable (mirrors the
 *   `enableSorting` / `enableHiding` column flags). Requires
 *   `enableCellEditing` on `<DataTable>`.
 * - `editCell` renders a custom editor instead of the default text input.
 * - `pin` freezes the column to the `"left"` or `"right"` edge while the
 *   remaining columns scroll horizontally. Pinned columns are always grouped
 *   consecutively at their edge (the model cannot pin a lone middle column).
 *
 * Editable columns must use `accessorKey` (string) so the new value can be
 * written back into the row when committed.
 */
export type ColumnDef<TData, TValue = unknown> = TanStackColumnDef<
  TData,
  TValue
> & {
  /** Enables inline editing for this column's cells. */
  enableEditing?: boolean
  /** Custom editor renderer. Defaults to a text Input when omitted. */
  editCell?: (context: EditCellContext<TData, TValue>) => React.ReactNode
  /**
   * Freezes (pins) the column to an edge so it stays visible while the rest of
   * the table scrolls horizontally. `"left"` and `"right"` columns are grouped
   * at their respective edges in declaration order. Requires the column to have
   * a stable `id` or string `accessorKey`.
   */
  pin?: "left" | "right"
}

/** Context passed to a column's `editCell` renderer. */
export interface EditCellContext<TData = unknown, TValue = unknown> {
  /** Current draft value of the cell while editing. */
  value: TValue
  /** Updates the draft value (does not commit). */
  onChange: (value: TValue) => void
  /** Stages `value` as a pending (yellow) change, accumulated until saved via DataTableEditBar. Pass the value explicitly to avoid stale-closure issues. */
  stage: (value: TValue) => void
  /** Cancels the edit (Escape semantics): reverts to the value in `data`. */
  cancel: () => void
  /** The TanStack row being edited. */
  row: Row<TData>
  /** The TanStack column being edited. */
  column: Column<TData, TValue>
}

/** A single committed cell change. */
export interface CellEdit<TData = unknown> {
  /** Row identifier from `rowSelectionKey`. */
  rowId: string
  /** Column id of the edited cell. */
  columnId: string
  /** Value before the edit. */
  previousValue: unknown
  /** New value. */
  value: unknown
  /** The full row object with the change applied. */
  row: TData
}

/** Payload delivered to `onCellsEdited` when the pending edits are saved. */
export interface CellsEditedPayload<TData = unknown> {
  /** Current page data with the saved change(s) applied — pass to your `setData`. */
  data: TData[]
  /** The saved change(s) — use to build your API request. */
  changes: CellEdit<TData>[]
}

/* ─────────────────────────────────────────────
 * 0.1. Cell-editing helpers (internal)
 * ───────────────────────────────────────────── */

type PendingEdits = Record<string, Record<string, unknown>>

/** Reads a value from a (possibly dotted) accessor path. */
function getByPath(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc == null ? acc : (acc as Record<string, unknown>)[key],
      obj
    )
}

/** Immutably sets a value at a (possibly dotted) accessor path, cloning along the way. */
function setByPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".")
  const clone = (
    Array.isArray(obj) ? [...obj] : { ...(obj as object) }
  ) as Record<string, unknown>
  let cursor = clone
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    const next = cursor[key]
    cursor[key] =
      next == null ? {} : Array.isArray(next) ? [...next] : { ...(next as object) }
    cursor = cursor[key] as Record<string, unknown>
  }
  cursor[keys[keys.length - 1]] = value
  return clone as T
}

/** Removes a single cell entry from the pending-edits map, pruning empty rows. */
function removePendingEdit(
  prev: PendingEdits,
  rowId: string,
  columnId: string
): PendingEdits {
  if (!prev[rowId] || !(columnId in prev[rowId])) return prev
  const rowEdits = { ...prev[rowId] }
  delete rowEdits[columnId]
  const next = { ...prev }
  if (Object.keys(rowEdits).length === 0) {
    delete next[rowId]
  } else {
    next[rowId] = rowEdits
  }
  return next
}

/** Resolves the accessor path used to write a committed value back into a row. */
function resolveAccessorPath<TData>(
  table: Table<TData>,
  columnId: string
): string {
  const accessorKey = (
    table.getColumn(columnId)?.columnDef as { accessorKey?: string } | undefined
  )?.accessorKey
  return accessorKey ?? columnId
}

/* ─────────────────────────────────────────────
 * 1. i18n strings
 * ───────────────────────────────────────────── */

const DATA_TABLE_TEXTS = {
  en: {
    dragToReorder: "Drag to reorder column",
    viewButton: "View",
    toggleColumns: "Toggle columns",
    rowsSelected: (selected: number, total: number) => `${selected} of ${total} row(s) selected`,
    rows: (total: number) => `${total} row(s)`,
    rowsPerPage: "Rows per page",
    page: (index: number, count: number) => `Page ${index} of ${count}`,
    goToFirstPage: "Go to first page",
    goToPreviousPage: "Go to previous page",
    goToNextPage: "Go to next page",
    goToLastPage: "Go to last page",
    noData: "No data",
    noRecordsFound: "No records found.",
    bulkActions: "Bulk actions",
    selected: (count: number) => `${count} selected`,
    deselect: "Deselect",
    unsavedChanges: "Unsaved changes",
    changesMade: (count: number) =>
      `${count} change${count === 1 ? "" : "s"} made`,
    saveChanges: "Save changes",
    discardChanges: "Discard changes",
  },
  es: {
    dragToReorder: "Arrastrar para reordenar columna",
    viewButton: "Vista",
    toggleColumns: "Alternar columnas",
    rowsSelected: (selected: number, total: number) => `${selected} de ${total} fila(s) seleccionada(s)`,
    rows: (total: number) => `${total} fila(s)`,
    rowsPerPage: "Filas por página",
    page: (index: number, count: number) => `Página ${index} de ${count}`,
    goToFirstPage: "Ir a la primera página",
    goToPreviousPage: "Ir a la página anterior",
    goToNextPage: "Ir a la siguiente página",
    goToLastPage: "Ir a la última página",
    noData: "Sin datos",
    noRecordsFound: "No se encontraron registros.",
    bulkActions: "Acciones en masa",
    selected: (count: number) => `${count} seleccionado(s)`,
    deselect: "Deseleccionar",
    unsavedChanges: "Cambios sin guardar",
    changesMade: (count: number) =>
      `${count} cambio${count === 1 ? "" : "s"} realizado${count === 1 ? "" : "s"}`,
    saveChanges: "Guardar cambios",
    discardChanges: "Descartar cambios",
  },
} as const

/* ─────────────────────────────────────────────
 * 1.5. Column pinning helpers (internal)
 * ───────────────────────────────────────────── */

/** Tracks whether content is hidden behind the left / right pinned columns. */
interface PinShadow {
  left: boolean
  right: boolean
}

/**
 * Resolves the id TanStack assigns to a column from its raw definition, so the
 * declarative `pin` flags can be turned into a `columnPinning` state before the
 * table instance exists. Mirrors TanStack: explicit `id`, else string `accessorKey`.
 */
function resolveColumnId(column: {
  id?: string
  accessorKey?: unknown
}): string | undefined {
  if (typeof column.id === "string") return column.id
  if (typeof column.accessorKey === "string") return column.accessorKey
  return undefined
}

/**
 * Inline styles that make a pinned column sticky at its edge. Returns `undefined`
 * for unpinned columns. The sticky offset uses TanStack's size-aware
 * `getStart`/`getAfter`; `zIndex: 1` lifts the column (and its seam gradient)
 * above the scrolling cells.
 */
function getPinStyles<TData>(
  column: Column<TData, unknown>
): React.CSSProperties | undefined {
  const pinned = column.getIsPinned()
  if (!pinned) return undefined

  return {
    position: "sticky",
    left: pinned === "left" ? column.getStart("left") : undefined,
    right: pinned === "right" ? column.getAfter("right") : undefined,
    zIndex: 1,
    width: column.getSize(),
  }
}

/**
 * Seam gradient for the pinned/scrolling boundary, drawn as a `::before` /
 * `::after` pseudo-element just outside the seam column's inner edge. A real
 * painted element (not a `box-shadow`, which is unreliable on sticky table
 * cells) so it reliably sits above the scrolling content — reading as the pinned
 * column casting a shadow onto it. Shown only while content is scrolled away on
 * that side. Returns `false` (cn-friendly) when no seam shadow applies.
 */
function getPinSeamClassName<TData>(
  column: Column<TData, unknown>,
  shadow: PinShadow
): string | false {
  const pinned = column.getIsPinned()
  if (!pinned) return false
  if (pinned === "left" && shadow.left && column.getIsLastColumn("left")) {
    return "after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-2 after:translate-x-full after:content-[''] after:bg-gradient-to-r after:from-[hsl(var(--foreground)/0.18)] after:to-transparent"
  }
  if (pinned === "right" && shadow.right && column.getIsFirstColumn("right")) {
    return "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-2 before:-translate-x-full before:content-[''] before:bg-gradient-to-l before:from-[hsl(var(--foreground)/0.18)] before:to-transparent"
  }
  return false
}

/**
 * Background classes for a pinned body cell. Pinned cells need an opaque
 * background so scrolled-away content doesn't bleed through, while still
 * matching the row's hover / selected state (via the `group/row` marker on
 * TableRow). Unpinned cells get no class.
 *
 * Hover is the tricky case: regular rows use a translucent `bg-muted/50`, which
 * can't be reused here (it would let scrolled content show through). Instead we
 * paint a uniform 50%-muted gradient *over* the opaque `bg-background` — the
 * composited color is identical to `bg-muted/50` on the background, but opaque.
 * Selected rows are already opaque (`bg-muted`), so we match them directly.
 */
function getPinCellClassName<TData>(
  column: Column<TData, unknown>
): string | false {
  if (!column.getIsPinned()) return false
  return cn(
    "bg-background",
    "group-hover/row:bg-gradient-to-r group-hover/row:from-[hsl(var(--muted)/0.5)] group-hover/row:to-[hsl(var(--muted)/0.5)]",
    "group-data-[state=selected]/row:bg-muted group-data-[state=selected]/row:bg-none"
  )
}

/* ─────────────────────────────────────────────
 * 2. Internal Context (not exported)
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
  // Cell editing
  enableCellEditing: boolean
  getRowKey?: (row: TData) => string
  pendingEdits: PendingEdits
  pendingEditCount: number
  cellErrors?: Record<string, Record<string, string>>
  stageCellEdit: (rowId: string, columnId: string, value: unknown) => void
  saveCellEdits: () => Promise<void>
  discardCellEdits: () => void
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
  // Pinned columns are anchored to an edge, so they can't be dragged to reorder.
  const isReorderingEnabled =
    (ctx?.enableColumnReordering ?? false) && !column.getIsPinned()
  const language = useDesignSystemLanguage()
  const t = DATA_TABLE_TEXTS[language]

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
          aria-label={t.dragToReorder}
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
  const language = useDesignSystemLanguage()
  const t = DATA_TABLE_TEXTS[language]

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
          {t.viewButton}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>{t.toggleColumns}</DropdownMenuLabel>
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
  const language = useDesignSystemLanguage()
  const t = DATA_TABLE_TEXTS[language]

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
          <span>{t.rowsSelected(selectedRowCount, totalRowCount)}</span>
        ) : (
          <span>{t.rows(totalRowCount)}</span>
        )}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{t.rowsPerPage}</p>
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
          {t.page(table.getState().pagination.pageIndex + 1, table.getPageCount())}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t.goToFirstPage}</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t.goToPreviousPage}</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t.goToNextPage}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t.goToLastPage}</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

DataTablePagination.displayName = "DataTablePagination"

/* ─────────────────────────────────────────────
 * 5.5. CellEditor (internal)
 * ───────────────────────────────────────────── */

interface CellEditorProps<TData, TValue> {
  initialValue: TValue
  editCell?: (context: EditCellContext<TData, TValue>) => React.ReactNode
  row: Row<TData>
  column: Column<TData, TValue>
  onStage: (value: unknown) => void
  onCancel: () => void
}

/**
 * Mounted only while a cell is being edited. Owns the draft value locally so
 * keystrokes don't re-render the whole table body. The `actionRef` guard
 * prevents the trailing blur (fired when the editor unmounts after an explicit
 * Enter/Escape/custom action) from double-committing the change.
 */
function CellEditor<TData, TValue>({
  initialValue,
  editCell,
  row,
  column,
  onStage,
  onCancel,
}: CellEditorProps<TData, TValue>) {
  const [draft, setDraft] = React.useState<TValue>(initialValue)
  const actionRef = React.useRef<"stage" | "cancel" | null>(null)

  const stage = React.useCallback(
    (value: unknown) => {
      actionRef.current = "stage"
      onStage(value)
    },
    [onStage]
  )
  const cancel = React.useCallback(() => {
    actionRef.current = "cancel"
    onCancel()
  }, [onCancel])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault()
      stage(draft)
    } else if (event.key === "Escape") {
      event.preventDefault()
      cancel()
    }
  }

  const handleBlur = () => {
    // An explicit action already committed/cancelled — ignore the unmount blur.
    if (actionRef.current) {
      actionRef.current = null
      return
    }
    stage(draft)
  }

  // Custom editors fully control commit via stage/cancel. We attach no wrapper
  // key/blur handlers here: editors that render portals (e.g. Select) would
  // otherwise commit prematurely when the dropdown opens/closes.
  if (editCell) {
    return (
      <>
        {editCell({
          value: draft,
          onChange: setDraft,
          stage: (value) => stage(value),
          cancel,
          row,
          column,
        })}
      </>
    )
  }

  // Bare input styled to blend into the cell — it should look like the text is
  // being edited in place, not like a separate form field. The cell's primary
  // ring (applied while editing) provides the visible affordance.
  return (
    <input
      autoFocus
      value={draft == null ? "" : String(draft)}
      onChange={(event) => setDraft(event.target.value as unknown as TValue)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onFocus={(event) => event.target.select()}
      className="m-0 w-full border-0 bg-transparent p-0 text-sm text-foreground outline-none focus:outline-none focus:ring-0"
    />
  )
}

CellEditor.displayName = "CellEditor"

/* ─────────────────────────────────────────────
 * 6. DataTableContent (NEW)
 * ───────────────────────────────────────────── */

export function DataTableContent() {
  const {
    table,
    isLoading,
    loadingRowCount,
    emptyState,
    enableCellEditing,
    getRowKey,
    pendingEdits,
    cellErrors,
    stageCellEdit,
  } = useDataTableInstance()
  const language = useDesignSystemLanguage()
  const t = DATA_TABLE_TEXTS[language]

  // Ephemeral editing UI state — only one cell is selected/editing at a time.
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null)
  const [editingKey, setEditingKey] = React.useState<string | null>(null)

  // Pinned-column shadows: the seam shadow shows only when there is content
  // scrolled away behind the pinned columns. We watch the scroll viewport.
  const pinningState = table.getState().columnPinning
  const hasPinnedColumns =
    (pinningState.left?.length ?? 0) > 0 || (pinningState.right?.length ?? 0) > 0
  // With pinned columns we force the table to keep the sum of its column widths
  // as a minimum. Otherwise `table-layout: auto` shrinks columns to fit the
  // viewport (no overflow → nothing to scroll → pinning never engages). With the
  // min-width, the table overflows whenever it's wider than its container and the
  // sticky columns work; when it fits, it still stretches to full width as before.
  //
  // `table-layout: fixed` makes column widths exact instead of content-driven
  // hints, so the sticky offsets (computed from each column's configured size via
  // `getStart`/`getAfter`) line up to the pixel — without it, sub-pixel rounding
  // leaves a transparent seam between adjacent pinned columns.
  const tableStyle: React.CSSProperties | undefined = hasPinnedColumns
    ? { minWidth: table.getTotalSize(), tableLayout: "fixed" }
    : undefined
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const [pinShadow, setPinShadow] = React.useState<PinShadow>({
    left: false,
    right: false,
  })
  React.useEffect(() => {
    if (!hasPinnedColumns) return
    const el = viewportRef.current
    if (!el) return
    const update = () => {
      const left = el.scrollLeft > 0
      const right = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth
      // Only re-render when a boundary is actually crossed — not on every scroll
      // tick. Returning the previous object lets React bail out of the update.
      setPinShadow((prev) =>
        prev.left === left && prev.right === right ? prev : { left, right }
      )
    }
    update()
    el.addEventListener("scroll", update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => {
      el.removeEventListener("scroll", update)
      observer.disconnect()
    }
  }, [hasPinnedColumns, isLoading])

  // Keyboard navigation: refs to editable cells so arrows can move DOM focus.
  const cellRefs = React.useRef(new Map<string, HTMLTableCellElement>())
  React.useEffect(() => {
    // Move focus to the selected cell — but not while editing (the editor owns focus).
    if (!selectedKey || editingKey) return
    const cell = cellRefs.current.get(selectedKey)
    if (!cell) return
    cell.focus()

    // The browser's focus scroll treats a cell hidden behind a sticky pinned
    // column as "visible", so arrow-key navigation can leave the selected cell
    // tucked under a pinned edge. Nudge the horizontal scroll by the minimum
    // needed for the cell to clear the pinned columns (plus a small gap). No-op
    // when the cell is already fully in view.
    const viewport = viewportRef.current
    if (!viewport) return
    const leftPinned = table
      .getLeftLeafColumns()
      .reduce((sum, col) => sum + col.getSize(), 0)
    const rightPinned = table
      .getRightLeafColumns()
      .reduce((sum, col) => sum + col.getSize(), 0)
    const gap = 8
    const vp = viewport.getBoundingClientRect()
    const rect = cell.getBoundingClientRect()
    const leftBound = vp.left + leftPinned + gap
    const rightBound = vp.right - rightPinned - gap
    if (rect.left < leftBound) {
      viewport.scrollBy({ left: rect.left - leftBound })
    } else if (rect.right > rightBound) {
      viewport.scrollBy({ left: rect.right - rightBound })
    }
  }, [selectedKey, editingKey, table])

  // Clear the selection when the user clicks/taps outside the table. Disabled while
  // editing so clicks inside portal editors (Select, Calendar) don't deselect the cell.
  const containerRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!selectedKey || editingKey) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setSelectedKey(null)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [selectedKey, editingKey])

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <UITable viewportRef={viewportRef} style={tableStyle}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      ...getPinStyles(header.column),
                    }}
                    className={cn(
                      header.column.getIsPinned() && "bg-background",
                      getPinSeamClassName(header.column, pinShadow)
                    )}
                  >
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
              <TableRow key={index} className="group/row">
                {table.getVisibleLeafColumns().map((column) => (
                  <TableCell
                    key={column.id}
                    style={getPinStyles(column)}
                    className={cn(
                      getPinCellClassName(column),
                      getPinSeamClassName(column, pinShadow)
                    )}
                  >
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

  // Navigable grid for keyboard navigation: editable visible columns × current page rows.
  const editableColumnIds = enableCellEditing
    ? table
        .getVisibleLeafColumns()
        .filter((column) =>
          Boolean(
            (column.columnDef as ColumnDef<unknown, unknown>).enableEditing
          )
        )
        .map((column) => column.id)
    : []
  const rowKeys =
    enableCellEditing && getRowKey
      ? rows.map((row) => getRowKey(row.original))
      : []
  // The first editable cell is tabbable when nothing is selected (roving tabindex entry point).
  const firstCellKey =
    rowKeys.length > 0 && editableColumnIds.length > 0
      ? `${rowKeys[0]}:${editableColumnIds[0]}`
      : null

  const moveSelection = (
    currentKey: string,
    direction: "up" | "down" | "left" | "right"
  ) => {
    const separator = currentKey.lastIndexOf(":")
    const currentRowKey = currentKey.slice(0, separator)
    const currentColumnId = currentKey.slice(separator + 1)
    let rowIndex = rowKeys.indexOf(currentRowKey)
    let columnIndex = editableColumnIds.indexOf(currentColumnId)
    if (rowIndex === -1 || columnIndex === -1) return
    if (direction === "up") rowIndex = Math.max(0, rowIndex - 1)
    else if (direction === "down")
      rowIndex = Math.min(rowKeys.length - 1, rowIndex + 1)
    else if (direction === "left") columnIndex = Math.max(0, columnIndex - 1)
    else columnIndex = Math.min(editableColumnIds.length - 1, columnIndex + 1)
    // The focus effect moves DOM focus to the newly selected cell.
    setSelectedKey(`${rowKeys[rowIndex]}:${editableColumnIds[columnIndex]}`)
  }

  return (
    <div ref={containerRef} className="rounded-md border">
      <UITable viewportRef={viewportRef} style={tableStyle}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{
                    width: header.getSize(),
                    ...getPinStyles(header.column),
                  }}
                  className={cn(
                    header.column.getIsPinned() && "bg-background",
                    getPinSeamClassName(header.column, pinShadow)
                  )}
                >
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
                  <NoDataMessage title={t.noData} message={t.noRecordsFound} />
                )}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const rowId =
                enableCellEditing && getRowKey ? getRowKey(row.original) : row.id
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group/row"
                >
                  {row.getVisibleCells().map((cell) => {
                    const columnId = cell.column.id
                    const columnDef = cell.column.columnDef as ColumnDef<
                      unknown,
                      unknown
                    >
                    const editable =
                      enableCellEditing && Boolean(columnDef.enableEditing)

                    if (!editable) {
                      return (
                        <TableCell
                          key={cell.id}
                          style={getPinStyles(cell.column)}
                          className={cn(
                            getPinCellClassName(cell.column),
                            getPinSeamClassName(cell.column, pinShadow)
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )
                    }

                    const cellKey = `${rowId}:${columnId}`
                    const errorMessage = cellErrors?.[rowId]?.[columnId]
                    const hasPending = Boolean(
                      pendingEdits[rowId] && columnId in pendingEdits[rowId]
                    )
                    const pendingValue = hasPending
                      ? pendingEdits[rowId][columnId]
                      : undefined
                    const selected = selectedKey === cellKey
                    const editing = editingKey === cellKey
                    const dataValue = cell.getValue()

                    const stateClass = errorMessage
                      ? "ring-1 ring-inset ring-destructive bg-destructive/10"
                      : editing || selected
                        ? "ring-1 ring-inset ring-primary bg-primary/10"
                        : hasPending
                          ? "ring-1 ring-inset ring-primary/40 bg-primary/5"
                          : // Idle: hint editability on hover (accent box), lowest priority
                            "hover:bg-accent/60 hover:ring-1 hover:ring-inset hover:ring-accent-foreground/20"

                    const startEdit = () => {
                      setSelectedKey(cellKey)
                      setEditingKey(cellKey)
                    }

                    const display = hasPending
                      ? String(pendingValue ?? "")
                      : flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )

                    // Roving tabindex: only the selected cell is tabbable; if nothing
                    // is selected, the first editable cell is the entry point.
                    const tabbable =
                      !editing &&
                      (selected ||
                        (selectedKey === null && cellKey === firstCellKey))

                    return (
                      <TableCell
                        key={cell.id}
                        ref={(el) => {
                          if (el) cellRefs.current.set(cellKey, el)
                          else cellRefs.current.delete(cellKey)
                        }}
                        data-cell-key={cellKey}
                        style={getPinStyles(cell.column)}
                        tabIndex={tabbable ? 0 : -1}
                        onClick={() => {
                          if (!editing) setSelectedKey(cellKey)
                        }}
                        onFocus={() => {
                          if (!editing) setSelectedKey(cellKey)
                        }}
                        onDoubleClick={startEdit}
                        onKeyDown={(event) => {
                          if (editing) return
                          switch (event.key) {
                            case "Enter":
                            case "F2":
                              event.preventDefault()
                              startEdit()
                              break
                            case "Escape":
                              setSelectedKey(null)
                              break
                            case "ArrowUp":
                              event.preventDefault()
                              moveSelection(cellKey, "up")
                              break
                            case "ArrowDown":
                              event.preventDefault()
                              moveSelection(cellKey, "down")
                              break
                            case "ArrowLeft":
                              event.preventDefault()
                              moveSelection(cellKey, "left")
                              break
                            case "ArrowRight":
                              event.preventDefault()
                              moveSelection(cellKey, "right")
                              break
                          }
                        }}
                        className={cn(
                          "cursor-pointer select-none outline-none transition-shadow",
                          getPinCellClassName(cell.column),
                          getPinSeamClassName(cell.column, pinShadow),
                          stateClass
                        )}
                      >
                        {editing ? (
                          <CellEditor
                            key={cellKey}
                            initialValue={hasPending ? pendingValue : dataValue}
                            editCell={columnDef.editCell}
                            row={row}
                            column={cell.column}
                            onStage={(value) => {
                              // Enter and blur both stage the change (pending);
                              // it's applied only when saved via DataTableEditBar.
                              // Keep the cell selected so keyboard navigation can continue.
                              stageCellEdit(rowId, columnId, value)
                              setEditingKey(null)
                            }}
                            onCancel={() => setEditingKey(null)}
                          />
                        ) : errorMessage ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="block w-full">{display}</span>
                              </TooltipTrigger>
                              <TooltipContent>{errorMessage}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          display
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })
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
  const language = useDesignSystemLanguage()
  const t = DATA_TABLE_TEXTS[language]

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
      aria-label={t.bulkActions}
      {...props}
    >
      {/* Mobile: two rows / Desktop: single row */}
      <div className="flex items-center justify-center sm:hidden">
        <span className="text-sm font-medium text-secondary-foreground">
          {t.selected(selectedRowsCount)}
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
          {t.deselect}
        </Button>
      </div>

      {/* Desktop: single row */}
      <div className="hidden sm:flex sm:items-center sm:gap-4">
        <span className="text-sm font-medium text-secondary-foreground whitespace-nowrap">
          {t.selected(selectedRowsCount)}
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
          {t.deselect}
        </Button>
      </div>
    </div>
  )
}

DataTableSelectionBar.displayName = "DataTableSelectionBar"

/* ─────────────────────────────────────────────
 * 6.6. DataTableEditBar
 * ───────────────────────────────────────────── */

export type DataTableEditBarProps = React.HTMLAttributes<HTMLDivElement>

/**
 * Fixed bottom bar that appears when there are pending (yellow) cell edits.
 * Shows the count of unsaved changes and Save / Discard actions. "Save changes"
 * commits all pending edits via `onCellsEdited({ trigger: "save" })`; the bar
 * stays open if that callback rejects (e.g. validation failed). Place inside
 * `<DataTable>` after `<DataTablePagination>`.
 */
export function DataTableEditBar({
  className,
  ...props
}: DataTableEditBarProps) {
  const { pendingEditCount, saveCellEdits, discardCellEdits } =
    useDataTableInstance()
  const language = useDesignSystemLanguage()
  const t = DATA_TABLE_TEXTS[language]
  const [isSaving, setIsSaving] = React.useState(false)

  if (pendingEditCount === 0) return null

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveCellEdits()
    } finally {
      setIsSaving(false)
    }
  }

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
      aria-label={t.unsavedChanges}
      {...props}
    >
      {/* Mobile: two rows / Desktop: single row */}
      <div className="flex items-center justify-center sm:hidden">
        <span className="text-sm font-medium text-secondary-foreground">
          {t.changesMade(pendingEditCount)}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-center gap-2 sm:hidden">
        <Button size="sm" onClick={handleSave} disabled={isSaving}>
          {t.saveChanges}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={discardCellEdits}
          disabled={isSaving}
        >
          {t.discardChanges}
        </Button>
      </div>

      {/* Desktop: single row */}
      <div className="hidden sm:flex sm:items-center sm:gap-4">
        <span className="text-sm font-medium text-secondary-foreground whitespace-nowrap">
          {t.changesMade(pendingEditCount)}
        </span>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {t.saveChanges}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={discardCellEdits}
            disabled={isSaving}
          >
            {t.discardChanges}
          </Button>
        </div>
      </div>
    </div>
  )
}

DataTableEditBar.displayName = "DataTableEditBar"

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
  /**
   * Enables inline cell editing. Columns opt in with `enableEditing: true`.
   * Requires `rowSelectionKey` (used as the row identity). Default false.
   */
  enableCellEditing?: boolean
  /**
   * Called when the user saves the pending edits via DataTableEditBar. Receives
   * the updated page `data` (pass to your setData) and the `changes` diff (build
   * your API request). Return a Promise to make the save transactional — if it
   * rejects, the pending edits are kept so the user can correct them.
   */
  onCellsEdited?: (payload: CellsEditedPayload<TData>) => void | Promise<void>
  /**
   * Called when the user discards the pending edits via DataTableEditBar. Use it
   * to clear any consumer-owned state derived from the edits — in particular
   * `cellErrors` set during a previous failed save, which would otherwise remain
   * after the cells revert to their original values.
   */
  onDiscardEdits?: () => void
  /**
   * Marks cells as invalid from outside. Shape: { [rowId]: { [columnId]: message } }.
   * Invalid cells are painted with the destructive color and show the message in a tooltip.
   */
  cellErrors?: Record<string, Record<string, string>>
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
  enableCellEditing = false,
  onCellsEdited,
  onDiscardEdits,
  cellErrors,
  className,
  emptyState,
  isLoading = false,
  loadingRowCount = 5,
  children,
}: DataTableProps<TData, TValue>) {
  // Validate: rowSelectionKey is required when selection or cell editing is enabled
  if ((enableRowSelection || enableCellEditing) && !rowSelectionKey) {
    throw new Error(
      "DataTable: `rowSelectionKey` is required when `enableRowSelection` or " +
        "`enableCellEditing` is true. Provide a function that returns a unique " +
        "identifier for each row, e.g. rowSelectionKey={(row) => String(row.id)}"
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

  // Pending (yellow) cell edits accumulated until saved via DataTableEditBar.
  // Kept internal — the consumer only deals with committed results via onCellsEdited.
  const [pendingEdits, setPendingEdits] = React.useState<PendingEdits>({})

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

  // Derive the column-pinning state from each column's declarative `pin` flag.
  // Pinned columns are grouped at their edge in declaration order; TanStack then
  // renders left → center → right, so a "middle" column declared as pinned is
  // pulled to its edge rather than leaving a gap.
  const columnPinning = React.useMemo<ColumnPinningState>(() => {
    const left: string[] = []
    const right: string[] = []
    for (const column of columns) {
      const pin = column.pin
      if (!pin) continue
      const id = resolveColumnId(column)
      if (!id) continue
      if (pin === "left") left.push(id)
      else right.push(id)
    }
    return { left, right }
  }, [columns])

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
      columnPinning,
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

  /* ── Cell editing handlers ── */

  // Enter or blur: stage the change as a pending (yellow) edit. All edits go
  // through DataTableEditBar — nothing reaches `data` until the user saves.
  const stageCellEdit = React.useCallback(
    (rowId: string, columnId: string, value: unknown) => {
      if (!rowSelectionKey) return
      const rowIndex = data.findIndex((row) => rowSelectionKey(row) === rowId)
      if (rowIndex === -1) return
      const previousValue = getByPath(
        data[rowIndex],
        resolveAccessorPath(table, columnId)
      )
      setPendingEdits((prev) => {
        // Editing back to the original value clears the pending mark.
        if (Object.is(previousValue, value)) {
          return removePendingEdit(prev, rowId, columnId)
        }
        return {
          ...prev,
          [rowId]: { ...(prev[rowId] ?? {}), [columnId]: value },
        }
      })
    },
    [data, rowSelectionKey, table]
  )

  const discardCellEdits = React.useCallback(() => {
    setPendingEdits({})
    onDiscardEdits?.()
  }, [onDiscardEdits])

  // Save changes: commit every pending edit at once. Transactional — if
  // onCellsEdited rejects, the buffer is preserved so the user can correct.
  const saveCellEdits = React.useCallback(async () => {
    if (!rowSelectionKey) return
    const changes: CellEdit<TData>[] = []
    let newData = data
    for (const [rowId, cols] of Object.entries(pendingEdits)) {
      const rowIndex = newData.findIndex((row) => rowSelectionKey(row) === rowId)
      if (rowIndex === -1) continue
      for (const [columnId, value] of Object.entries(cols)) {
        const path = resolveAccessorPath(table, columnId)
        const previousValue = getByPath(newData[rowIndex], path)
        const updatedRow = setByPath(newData[rowIndex], path, value)
        newData = newData === data ? [...data] : newData
        newData[rowIndex] = updatedRow
        changes.push({ rowId, columnId, previousValue, value, row: updatedRow })
      }
    }
    if (changes.length === 0) return
    try {
      await onCellsEdited?.({ data: newData, changes })
      setPendingEdits({})
    } catch {
      // Keep the pending buffer so the user can fix invalid cells
      // (the consumer can flag them via the `cellErrors` prop).
    }
  }, [data, pendingEdits, rowSelectionKey, table, onCellsEdited])

  const pendingEditCount = React.useMemo(
    () =>
      Object.values(pendingEdits).reduce(
        (sum, cols) => sum + Object.keys(cols).length,
        0
      ),
    [pendingEdits]
  )

  // Dev guard: editing writes the new value to the column's `accessorKey`. A
  // column with `enableEditing` but no `accessorKey` (e.g. a composite/display
  // column) has nowhere to write — the edit would silently fail to update the
  // data — so warn the developer once per offending column.
  const warnedEditableColumnsRef = React.useRef<Set<string>>(new Set())
  React.useEffect(() => {
    if (!enableCellEditing) return
    const isProduction =
      typeof process !== "undefined" &&
      process.env &&
      process.env.NODE_ENV === "production"
    if (isProduction) return
    for (const column of columns as Array<{
      id?: string
      accessorKey?: string
      enableEditing?: boolean
    }>) {
      if (!column.enableEditing) continue
      if (typeof column.accessorKey === "string") continue
      const key = column.accessorKey ?? column.id ?? "(unknown)"
      if (warnedEditableColumnsRef.current.has(key)) continue
      warnedEditableColumnsRef.current.add(key)
      console.warn(
        `DataTable: column "${key}" has \`enableEditing\` but no \`accessorKey\`. ` +
          `Cell editing writes the new value to the column's \`accessorKey\`, so ` +
          `without it the edit has nowhere to be written and will not update your ` +
          `data. Add an \`accessorKey\`, or remove \`enableEditing\` from this column ` +
          `(composite/display columns are not editable in the single-field model).`
      )
    }
  }, [columns, enableCellEditing])

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
      enableCellEditing,
      getRowKey: rowSelectionKey,
      pendingEdits,
      pendingEditCount,
      cellErrors,
      stageCellEdit,
      saveCellEdits,
      discardCellEdits,
    }),
    [table, isLoading, loadingRowCount, emptyState, enableColumnReordering, selectedRowsCount, clearSelection, registerColumnTitle, enableCellEditing, rowSelectionKey, pendingEdits, pendingEditCount, cellErrors, stageCellEdit, saveCellEdits, discardCellEdits]
  )

  // Only enable DndContext after hydration AND if prop is true
  const shouldEnableDnd = enableColumnReordering && isHydrated

  // Determine content: children or default DataTableContent
  const content = children ?? <DataTableContent />

  if (shouldEnableDnd) {
    const columnIds = table.getAllLeafColumns().map((col) => col.id)

    return (
      <DataTableContext.Provider value={contextValue as DataTableContextValue}>
        <div className={cn("space-y-4 min-w-0", className)}>
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
