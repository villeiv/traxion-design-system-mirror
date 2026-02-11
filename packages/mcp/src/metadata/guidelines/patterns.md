# Traxion Design System — Component Patterns

## Component Structure

All Traxion components follow these conventions:

### 1. ForwardRef Pattern
Every component uses `React.forwardRef` to allow parent components to access the underlying DOM element:

```tsx
const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("base-classes", className)} {...props} />
  )
);
MyComponent.displayName = "MyComponent";
```

### 2. className Override
All components accept a `className` prop that merges with the default styles using the `cn()` utility:

```tsx
import { cn } from "@traxion-global/design-system";

// cn() combines clsx (conditional classes) + tailwind-merge (deduplication)
cn("px-4 py-2 bg-primary", className)
```

### 3. CVA (Class Variance Authority) for Variants
Components with multiple visual variants use CVA:

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const myVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "variant-default-classes",
      secondary: "variant-secondary-classes",
    },
    size: {
      default: "size-default-classes",
      sm: "size-sm-classes",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface MyProps extends VariantProps<typeof myVariants> {
  // additional props
}
```

### 4. Compound Components
Complex components use the compound pattern with separate sub-components:

```tsx
// Good: Card with compound sub-components
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### 5. Radix UI Primitives
Interactive components are built on Radix UI primitives for accessibility:
- Dialog, AlertDialog, Sheet → `@radix-ui/react-dialog`
- DropdownMenu → `@radix-ui/react-dropdown-menu`
- Select → `@radix-ui/react-select`
- Checkbox, Switch, Radio → respective Radix packages
- Tooltip, Popover, HoverCard → respective Radix packages

### 6. Slot Pattern (asChild)
The `Button` component supports `asChild` via Radix `Slot` to render as a different element while keeping button styles:

```tsx
<Button asChild>
  <a href="/page">Link styled as button</a>
</Button>
```

## Tailwind CSS Conventions

### Use Theme Colors (CSS Variables)
Always use Traxion theme colors instead of raw Tailwind colors:

```tsx
// Good: uses design system tokens
"bg-primary text-primary-foreground"
"text-muted-foreground"
"border-destructive"

// Bad: hardcoded colors
"bg-blue-600 text-white"
"text-gray-500"
"border-red-600"
```

### HSL Color Format
Traxion tokens use full `hsl()` CSS color values. This ensures compatibility with both Tailwind v3 and v4:

```css
/* :root CSS variables use hsl()-wrapped values */
--primary: hsl(64 100% 44%);
```

```tsx
"bg-primary"      /* uses the CSS variable directly */
"bg-primary/50"   /* Tailwind v4: uses color-mix() for opacity */
```

> **Tailwind v3 vs v4:** Tailwind v3 expected bare HSL values (e.g., `64 100% 44%`) and wrapped them in `hsl()` via the config. Tailwind v4 passes CSS variable values through as-is via `@theme inline`, so they must be valid CSS colors. The `hsl()`-wrapped format works correctly in both versions. Opacity modifiers like `/50` work in v4 via `color-mix()`.

## Import Patterns

### Component Imports
```tsx
import { Button, Card, CardHeader, CardContent } from "@traxion-global/design-system/react";
```

### Utility Imports
```tsx
import { cn } from "@traxion-global/design-system";
```

### Tailwind Preset
```js
// tailwind.config.js
module.exports = {
  presets: [require("@traxion-global/design-system/tailwind-preset")],
};
```

### Theme CSS
```tsx
import "@traxion-global/design-system/theme.css";
```
