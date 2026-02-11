# Traxion Design System — Z-Index Scale

## The Problem

Unmanaged z-index values create stacking bugs: sidebars covering modals, tooltips hiding behind headers, or dropdowns clipped by their containers. A shared scale prevents these collisions.

## Z-Index Scale

Use this fixed scale across all Traxion applications. Never invent ad-hoc values outside this table.

| Token / Layer       | `z-index` | Tailwind class | Purpose                                        |
|---------------------|-----------|----------------|-------------------------------------------------|
| **Base content**    | `0`       | `z-0`          | Default document flow                           |
| **Raised content**  | `10`      | `z-10`         | Cards, panels, sticky elements within content   |
| **Sticky headers**  | `20`      | `z-20`         | Sticky table headers, top bars, sub-headers     |
| **Fixed header**    | `30`      | `z-30`         | Main top header / app bar                       |
| **Sidebar**         | `40`      | `z-40`         | Navigation sidebar (fixed/collapsible)          |
| **Overlay / Modal** | `50`      | `z-50`         | Dialog, AlertDialog, Sheet, full-screen overlays|
| **Popover**         | `50`      | `z-50`         | DropdownMenu, Popover, HoverCard, Select, Command |
| **Toast**           | `[100]`   | `z-[100]`      | Toast notifications (must sit above everything) |

### Why Sidebar Is z-40 (Not z-50 or z-100)

Modals and sheets must visually cover the entire page — including the sidebar. If the sidebar uses `z-50` or higher, modal backdrops and content slip behind it, breaking the overlay pattern. Keeping sidebar at `z-40` and overlays at `z-50` ensures modals always win.

```tsx
// Good: sidebar at z-40, modal overlays render above it
<aside className="fixed inset-y-0 left-0 z-40 w-64 bg-card border-r">
  {/* sidebar content */}
</aside>

// Bad: sidebar at z-[100] — modals (z-50) can't cover it
<aside className="fixed inset-y-0 left-0 z-[100] w-64 bg-card border-r">
  {/* sidebar blocks all overlays */}
</aside>
```

## Rules

### 1. Use the Scale — Never Invent Values

```tsx
// Good
className="z-40"   // sidebar — matches the scale
className="z-50"   // modal — matches the scale

// Bad
className="z-[999]"   // arbitrary, will collide
className="z-[100]"   // reserved for toasts only
className="z-[9999]"  // arms race
```

### 2. Layer Ordering Guarantees

The scale guarantees this stacking order from bottom to top:

```
Content (z-0)
  ↑ Raised panels (z-10)
    ↑ Sticky headers (z-20)
      ↑ Fixed header (z-30)
        ↑ Sidebar (z-40)
          ↑ Modals & Popovers (z-50)
            ↑ Toasts (z-[100])
```

Any element at a higher layer will always render above elements at lower layers, regardless of DOM order.

### 3. Same-Layer Stacking

Elements that share a z-index tier (e.g., Dialog and DropdownMenu both at `z-50`) rely on **DOM order** for stacking. Since Radix portals these to `document.body`, the most-recently-opened element naturally stacks on top. Do not bump one to `z-[51]` — let portal order handle it.

### 4. Avoid Nesting z-index

Setting `z-index` creates a new stacking context. Nested z-index values only compete within their parent's context, which leads to confusing behavior. Prefer flat stacking where possible:

```tsx
// Good: flat stacking at the layout level
<Header className="fixed top-0 z-30" />
<Sidebar className="fixed left-0 z-40" />

// Avoid: nested z-index inside a positioned parent
<div className="relative z-10">
  <div className="absolute z-50">
    {/* This z-50 only wins inside the z-10 parent, not globally */}
  </div>
</div>
```

### 5. Tailwind v4 Compatibility

Tailwind v4 uses the same `z-*` utilities. The scale values (0, 10, 20, 30, 40, 50) are all built-in Tailwind classes. Only `z-[100]` for toasts uses the arbitrary value syntax.

## Common Patterns

### Fixed Layout Shell

```tsx
<div className="min-h-screen">
  {/* Header: z-30 */}
  <header className="fixed top-0 inset-x-0 h-14 z-30 bg-background border-b">
    <TopHeader />
  </header>

  {/* Sidebar: z-40 (above header) */}
  <aside className="fixed top-14 left-0 bottom-0 w-64 z-40 bg-card border-r">
    <Sidebar />
  </aside>

  {/* Main content: no z-index needed */}
  <main className="ml-64 mt-14 p-6">
    <Outlet />
  </main>
</div>

{/* Modals rendered via Radix portal: z-50 (above sidebar) */}
{/* Toasts rendered via Sonner: z-[100] (above everything) */}
```

### Modal Over Sidebar

Radix `Dialog` and `Sheet` portals already render at `z-50` via the design system styles. No extra work is needed — the sidebar at `z-40` is naturally covered:

```tsx
// The Dialog overlay and content use z-50 from the component styles.
// No z-index override needed when opening a modal.
<Dialog>
  <DialogTrigger asChild>
    <Button>Open settings</Button>
  </DialogTrigger>
  <DialogContent>
    {/* This renders above the z-40 sidebar automatically */}
  </DialogContent>
</Dialog>
```

## Checklist

- [ ] Sidebar uses `z-40` (not `z-50` or arbitrary high values)
- [ ] Modals, sheets, and dialogs use `z-50`
- [ ] Toasts use `z-[100]`
- [ ] No arbitrary z-index values outside the defined scale
- [ ] No nested z-index that creates confusing stacking contexts
- [ ] Fixed header uses `z-30`, below sidebar
