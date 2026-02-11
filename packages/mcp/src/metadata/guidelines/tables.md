# Traxion Design System — Table & Data Patterns

## Table Structure

Use the compound `Table` component for all tabular data. Every table must include a header, body, and caption:

```tsx
import {
  Table, TableHeader, TableBody, TableRow,
  TableHead, TableCell, TableCaption,
} from "@traxion-global/design-system/react";

<Table>
  <TableCaption>List of active facilities</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Location</TableHead>
      <TableHead className="text-right">Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.location}</TableCell>
        <TableCell className="text-right">
          <Badge variant={item.active ? "default" : "secondary"}>
            {item.active ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Pagination

### Every Table Gets Pagination

All backoffice tables **must** include pagination — even small-dataset tables. This keeps the UI consistent, prevents long scrolling pages, and makes behavior predictable for users.

### Recommended Page Sizes

| Dataset size   | `pageSize` | Rationale                                            |
|----------------|------------|------------------------------------------------------|
| Small (< 20)   | `5`        | Makes pagination visible and exercisable             |
| Medium (< 100) | `10`       | Balanced default for most admin views                |
| Large (100+)   | `20`       | Shows enough data without excessive scrolling        |

### usePagination Hook Pattern

Create a `usePagination` hook to encapsulate slicing and page-change logic:

```tsx
import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], pageSize: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // Reset to page 1 when items change (e.g. after filtering)
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize]
  );

  return {
    currentPage: safePage,
    totalPages,
    paginatedItems,
    setCurrentPage,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
  };
}
```

### TablePagination Component

Pair the hook with the Traxion `Pagination` components below every table:

```tsx
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationPrevious, PaginationNext,
  PaginationEllipsis,
} from "@traxion-global/design-system/react";

function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
```

For tables with many pages, use `PaginationEllipsis` to collapse middle page numbers and only show the first, last, and surrounding pages.

### Wiring It Together

```tsx
function FacilitiesTable({ facilities }: { facilities: Facility[] }) {
  const { paginatedItems, currentPage, totalPages, setCurrentPage } =
    usePagination(facilities, 5);

  return (
    <>
      <Table>
        <TableCaption>Facilities</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2}>
                <NoDataMessage title="No facilities" message="Add a facility to get started." />
              </TableCell>
            </TableRow>
          ) : (
            paginatedItems.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.name}</TableCell>
                <TableCell>{f.type}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
```

## Empty States

When a table has no data, render a `NoDataMessage` inside a full-width `TableCell`:

```tsx
<TableRow>
  <TableCell colSpan={columnCount}>
    <NoDataMessage
      title="No results found"
      message="Try adjusting your filters or adding new records."
    />
  </TableCell>
</TableRow>
```

Do **not** hide the table entirely — keep the header visible so users understand the page context and column structure.

## Icons in Tables and UI

### Always Use lucide-react

All icons across the application must come from `lucide-react`. Never use:
- Unicode escape sequences (`\u2639`, `\u27A4`)
- Emoji characters (❌, ✅, ➡️, 📦)
- Icon fonts (FontAwesome, Material Icons)
- Inline SVG strings

```tsx
// Good: lucide-react icon
import { Truck, MapPin, AlertCircle } from "lucide-react";

<TableCell>
  <div className="flex items-center gap-2">
    <Truck className="h-4 w-4 text-muted-foreground" />
    {carrier.name}
  </div>
</TableCell>

// Bad: emoji or unicode
<TableCell>🚛 {carrier.name}</TableCell>
<TableCell>{"\u{1F69B}"} {carrier.name}</TableCell>
```

### Icon Sizing Convention

| Context             | Size class     | Use case                                  |
|---------------------|----------------|-------------------------------------------|
| Inline with text    | `h-4 w-4`     | Table cells, labels, badges               |
| Buttons (icon-only) | `h-4 w-4`     | Icon buttons (`size="icon"`)              |
| Section headers     | `h-5 w-5`     | Sidebar items, card headers               |
| KPI / hero areas    | `h-6 w-6`     | Dashboard cards, empty states             |
| Large illustrations | `h-8 w-8`+    | Onboarding, error pages                   |

### Icon Color

Use semantic Tailwind classes — never hardcoded hex or rgb:

```tsx
// Good
<AlertCircle className="h-4 w-4 text-destructive" />
<Check className="h-4 w-4 text-primary" />
<Info className="h-4 w-4 text-muted-foreground" />

// Bad
<AlertCircle className="h-4 w-4 text-red-600" />
```

## Sortable Columns

For sortable table headers, indicate sort direction with icons and ARIA:

```tsx
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

<TableHead>
  <button
    className="flex items-center gap-1"
    onClick={() => toggleSort("name")}
    aria-sort={sortField === "name" ? sortDirection : "none"}
  >
    Name
    {sortField === "name" ? (
      sortDirection === "ascending" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
    ) : (
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    )}
  </button>
</TableHead>
```

## Checklist

- [ ] Table has `<TableHeader>` with `<TableHead>` cells
- [ ] Table has `<TableCaption>` describing the data
- [ ] Pagination is present (use `pageSize=5` for small datasets)
- [ ] Empty state uses `NoDataMessage` inside a full-width `TableCell`
- [ ] All icons are from `lucide-react` (no emoji, no unicode escapes)
- [ ] Icons use semantic color classes (`text-primary`, `text-destructive`, `text-muted-foreground`)
- [ ] Sortable columns have `aria-sort` and directional icon indicators
- [ ] Page resets to 1 when filters change
