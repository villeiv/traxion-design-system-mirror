# DataTable Component Documentation

A powerful, feature-rich table component built on TanStack Table with built-in support for sorting, filtering, pagination, column visibility, and reordering.

## Installation

```tsx
import {
  DataTable,
  DataTableContent,
  DataTableToolbar,
  DataTablePagination,
  DataTableViewOptions,
  DataTableColumnHeader,
  useDataTable,
  type ColumnDef,
} from "@traxion-global/design-system/react"
```

## Basic Usage

### 1. Define Your Data Type

```tsx
type User = {
  id: string
  name: string
  email: string
  age: number
}
```

### 2. Define Columns

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
    cell: ({ row }) => <span>{row.getValue("age")} years</span>,
  },
]
```

### 3. Use the DataTable Hook

```tsx
const tableState = useDataTable({
  pageSize: 10, // Optional: default is 10
})
```

### 4. Fetch Your Data

```tsx
// Mock data for example
const data: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", age: 30 },
  { id: "2", name: "Jane Smith", email: "jane@example.com", age: 25 },
]

const pageCount = Math.ceil(data.length / tableState.pagination.pageSize)
```

### 5. Render the DataTable

```tsx
<DataTable
  columns={columns}
  data={data}
  pageCount={pageCount}
  {...tableState}
>
  <DataTableContent />
  <DataTablePagination />
</DataTable>
```

## Features

### Compound Components Pattern

The DataTable uses a compound components pattern for maximum flexibility:

- **`<DataTableToolbar>`** - Container for filters, search, and actions
- **`<DataTableContent>`** - The table itself with loading and empty states
- **`<DataTablePagination>`** - Pagination controls
- **`<DataTableViewOptions>`** - Column visibility toggle
- **`<DataTableColumnHeader>`** - Sortable column headers

### Full Example with All Features

```tsx
<DataTable
  columns={columns}
  data={data}
  pageCount={pageCount}
  isLoading={isLoading}
  emptyState={<div>No results found</div>}
  enableRowSelection
  enableColumnReordering
  {...tableState}
>
  <DataTableToolbar>
    <Input
      placeholder="Search..."
      value={(tableState.columnFilters.find(f => f.id === "name")?.value as string) ?? ""}
      onChange={(e) => {
        tableState.setColumnFilters([
          { id: "name", value: e.target.value }
        ])
      }}
      className="max-w-sm"
    />
    <DataTableViewOptions />
  </DataTableToolbar>

  <DataTableContent />

  <DataTablePagination
    pageSizeOptions={[5, 10, 20, 50]}
    showRowSelection
  />
</DataTable>
```

## Advanced Usage

### URL State Synchronization

Sync table state to URL parameters (useful for shareable links and back button support):

```tsx
"use client"
import { useRouter, useSearchParams } from "next/navigation"

function MyComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const tableState = useDataTable({
    pageSize: 10,
    router,
    searchParams,
  })

  // Table state is now synced to URL
  // URL format: ?page=1&pageSize=10&sort=name.asc&filters=status:active
}
```

### Multiple Tables on Same Page

Use namespaces to avoid conflicts:

```tsx
const ordersTableState = useDataTable({ namespace: "orders" })
const shipmentsTableState = useDataTable({ namespace: "shipments" })

// URLs will be: ?orders_page=1&shipments_page=2
```

### Server-Side Data Fetching

```tsx
function MyServerDataTable() {
  const tableState = useDataTable({ pageSize: 10 })

  // Use the helper to get search params for your API
  const params = tableState.getSearchParams()

  const { data, isLoading } = useQuery({
    queryKey: ["data", params.toString()],
    queryFn: () => fetchData(params),
  })

  return (
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      pageCount={data?.pageCount ?? 0}
      isLoading={isLoading}
      {...tableState}
    >
      <DataTableContent />
      <DataTablePagination />
    </DataTable>
  )
}
```

### Loading State

```tsx
<DataTable
  columns={columns}
  data={data}
  pageCount={pageCount}
  isLoading={true}
  loadingRowCount={5} // Number of skeleton rows to show
  {...tableState}
>
  <DataTableContent />
</DataTable>
```

### Row Selection

```tsx
const tableState = useDataTable()

<DataTable
  columns={columns}
  data={data}
  pageCount={pageCount}
  enableRowSelection
  rowSelection={tableState.rowSelection}
  onRowSelectionChange={tableState.onRowSelectionChange}
  getRowId={(row) => row.id} // Important: provide unique row ID
  {...tableState}
>
  <DataTableContent />
  <DataTablePagination showRowSelection />
</DataTable>

// Access selected rows
const selectedRows = table.getSelectedRowModel().rows
```

### Column Reordering (Drag & Drop)

```tsx
<DataTable
  columns={columns}
  data={data}
  pageCount={pageCount}
  enableColumnReordering
  columnOrder={tableState.columnOrder}
  onColumnOrderChange={tableState.onColumnOrderChange}
  {...tableState}
>
  <DataTableContent />
</DataTable>
```

### Custom Empty State

```tsx
<DataTable
  columns={columns}
  data={[]}
  pageCount={0}
  emptyState={
    <div className="flex flex-col items-center gap-2">
      <p className="text-lg font-semibold">No orders found</p>
      <Button>Create your first order</Button>
    </div>
  }
  {...tableState}
>
  <DataTableContent />
</DataTable>
```

## API Reference

### useDataTable(options)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pageSize` | `number` | `10` | Initial page size |
| `namespace` | `string` | `undefined` | Prefix for URL params (for multiple tables) |
| `debounceMs` | `number` | `300` | Debounce delay for filter changes |
| `router` | `NextRouter` | `undefined` | Next.js router for URL sync |
| `searchParams` | `URLSearchParams` | `undefined` | Next.js searchParams for reading URL |

**Returns:**
```tsx
{
  pagination: PaginationState
  sorting: SortingState
  columnFilters: ColumnFiltersState
  columnVisibility: VisibilityState
  columnOrder: ColumnOrderState
  onPaginationChange: (state) => void
  onSortingChange: (state) => void
  onColumnFiltersChange: (state) => void
  onColumnVisibilityChange: (state) => void
  onColumnOrderChange: (state) => void
  isPending: boolean
  getSearchParams: () => URLSearchParams
}
```

### DataTable Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `columns` | `ColumnDef<TData>[]` | Yes | Column definitions |
| `data` | `TData[]` | Yes | Table data |
| `pageCount` | `number` | Yes | Total number of pages |
| `pagination` | `PaginationState` | Yes | Current pagination state |
| `onPaginationChange` | `OnChangeFn` | Yes | Pagination change handler |
| `sorting` | `SortingState` | No | Current sorting state |
| `onSortingChange` | `OnChangeFn` | No | Sorting change handler |
| `columnFilters` | `ColumnFiltersState` | No | Current filter state |
| `onColumnFiltersChange` | `OnChangeFn` | No | Filter change handler |
| `rowSelection` | `RowSelectionState` | No | Row selection state |
| `onRowSelectionChange` | `OnChangeFn` | No | Selection change handler |
| `enableRowSelection` | `boolean \| function` | No | Enable row selection |
| `columnVisibility` | `VisibilityState` | No | Column visibility state |
| `onColumnVisibilityChange` | `OnChangeFn` | No | Visibility change handler |
| `columnOrder` | `ColumnOrderState` | No | Column order state |
| `onColumnOrderChange` | `OnChangeFn` | No | Order change handler |
| `enableColumnReordering` | `boolean` | No | Enable drag-and-drop reordering |
| `getRowId` | `(row, index) => string` | No | Function to get unique row ID |
| `isLoading` | `boolean` | No | Show loading skeleton |
| `loadingRowCount` | `number` | No | Number of skeleton rows (default: 5) |
| `emptyState` | `ReactNode` | No | Custom empty state component |
| `className` | `string` | No | Additional CSS classes |
| `children` | `ReactNode` | No | Compound components |

## Best Practices

1. **Always provide `getRowId`** when using row selection to ensure unique identification
2. **Use `{...tableState}`** to spread all state props instead of passing them individually
3. **Prefer compound components** (`<DataTableContent />`) over custom rendering for consistency
4. **Use URL sync** for user-facing tables to enable shareable links
5. **Debounce filters** - the hook does this automatically (300ms default)
6. **Server-side pagination** - DataTable always uses manual pagination/sorting/filtering

## TypeScript Support

The component is fully typed. Export and use the provided types:

```tsx
import type { ColumnDef, Row, Column } from "@traxion-global/design-system/react"
```

## Notes

- All pagination, sorting, and filtering is **server-side** by default (`manualPagination: true`)
- The component includes built-in loading skeletons and empty states
- Column reordering requires the `enableColumnReordering` prop and persists via `columnOrder` state
- The `DataTableColumnHeader` component automatically handles both sorting and drag-and-drop reordering
