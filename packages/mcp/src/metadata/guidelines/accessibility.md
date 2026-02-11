# Traxion Design System — Accessibility Guidelines

## General Principles

1. **Semantic HTML First** — Always use the correct HTML element before adding ARIA attributes. A `<button>` is better than a `<div role="button">`.
2. **Keyboard Navigation** — All interactive elements must be operable via keyboard. Use `Tab` for focus, `Enter`/`Space` for activation, `Escape` to dismiss overlays.
3. **Color Contrast** — Text and interactive elements must meet WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text).
4. **Focus Indicators** — Never remove focus outlines. The design system uses `focus-visible:ring-2 focus-visible:ring-ring` for consistent focus styling.

## Component-Specific Guidelines

### Buttons
- Always provide visible text or `aria-label` for icon-only buttons (`size="icon"` variant).
- Use `aria-disabled` instead of the `disabled` attribute when you need screen readers to still announce the button.
- Loading states should use `aria-busy="true"` and disable interaction.

### Forms (Input, Textarea, Select, Checkbox, Radio, Switch)
- Always associate a `<Label>` with every form control using `htmlFor`/`id`.
- Use `aria-describedby` to link error messages and helper text.
- Group related controls with `fieldset` and `legend`.
- Mark required fields with `aria-required="true"` and a visual indicator.
- Error states: use `aria-invalid="true"` and `aria-errormessage` pointing to the error text element.

### Dialogs and Sheets (Dialog, AlertDialog, Sheet)
- Focus is automatically trapped within the dialog (handled by Radix).
- `Escape` key closes the dialog.
- On close, return focus to the trigger element.
- Use `AlertDialog` (not `Dialog`) for destructive or irreversible actions — it requires explicit user acknowledgment.

### Dropdowns and Popovers (DropdownMenu, Popover, HoverCard, Command)
- Keyboard navigation: `ArrowDown`/`ArrowUp` to move between items, `Enter` to select, `Escape` to close.
- `HoverCard` content should also be accessible via focus, not just hover.
- `Command` palette items should have descriptive text for screen readers.

### Tables
- Always include `<TableHeader>` with `<TableHead>` cells for column headers.
- Use `<TableCaption>` for table descriptions.
- For sortable columns, use `aria-sort` attribute.
- For selectable rows, use `aria-selected`.

### Accordion
- Triggers automatically have `aria-expanded` (from Radix).
- Use headings inside `AccordionTrigger` when appropriate for the page outline.
- Content regions are automatically associated with their triggers.

### Toast Notifications (ToasterService)
- Toasts use `aria-live` regions for screen reader announcements.
- Ensure toasts persist long enough to be read (minimum 5 seconds).
- Provide a close button (`closeButton={true}`) for all non-auto-dismissing toasts.

### Progress
- The Radix `Progress` component provides `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` automatically.
- Add `aria-label` or `aria-labelledby` to describe what the progress bar represents.

### Calendar
- Day buttons include date context for screen readers.
- Navigation between months is keyboard accessible.
- Selected dates are announced via `aria-selected`.

## Color Usage

### Semantic Colors
- **Primary (green):** Main brand actions and highlights. Ensure text on primary backgrounds uses `primary-foreground`.
- **Destructive (red):** Error states, delete actions, warnings. Always pair with descriptive text — never rely on color alone.
- **Muted:** Secondary/disabled content. Ensure `muted-foreground` maintains sufficient contrast against `muted` backgrounds.

### Do Not Rely on Color Alone
- Always pair color indicators with text labels, icons, or patterns.
- Badge variants (green, red, yellow) should include descriptive text content.
- Form validation errors need both red styling AND an error message.

## Focus Management

### Focus Ring
All interactive components use the design system's focus ring:
```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

### Skip Links
For page-level navigation, implement skip links at the top of the page to bypass repetitive content.

### Focus Trapping
Overlays (Dialog, AlertDialog, Sheet) automatically trap focus within the overlay while open.

## Testing Checklist

- [ ] All interactive elements are reachable via `Tab`
- [ ] All controls are operable via keyboard
- [ ] Focus order matches visual order
- [ ] Focus indicators are visible
- [ ] Color contrast ratios meet WCAG AA (4.5:1 / 3:1)
- [ ] Images and icons have alt text or aria-label
- [ ] Form controls have associated labels
- [ ] Error messages are announced to screen readers
- [ ] Modals trap and restore focus correctly
- [ ] Page works at 200% zoom
