# Creating Components — Traxion Design System

A comprehensive methodology for adding new components to the Traxion Design System monorepo. Each component touches 4 packages: design-system, docs (Storybook), MCP metadata, and showcase. This guide ensures consistency across all of them.

## Phase Gate Rule

> **Each phase must be completed and validated by the user before the next phase begins.**
>
> After finishing a phase, stop and present the result. Do not proceed to the next phase until the user explicitly confirms. This applies even when the user says "continue" or "move forward" — treat that as approval for the **next single phase only**, not a blanket approval for all remaining phases.
>
> This rule prevents wasted work when the user wants to make tweaks mid-process (which is normal and expected).

## Quick-Reference Checklist

### New Component — Files to Create/Modify

| Action | File | Phase |
|--------|------|-------|
| **Create** | `packages/design-system/src/components/ComponentName.tsx` | 2 |
| **Edit** | `packages/design-system/src/react.ts` (add export) | 2 |
| **Create** | `apps/docs/stories/ComponentName.stories.tsx` | 3 |
| **Create** | `apps/docs/stories/sources/ComponentName.anatomy.tsx` (compound only) | 3 |
| **Create** | `apps/docs/stories/sources/ComponentName.variant.tsx` (optional) | 3 |
| **Edit** | `apps/showcase/app/page.tsx` (add Section) | 4 |
| **Edit** | `packages/design-system/package.json` (version bump) | 5 |
| **Edit** | `packages/design-system/CHANGELOG.md` | 5 |
| **Create** | `packages/mcp/src/metadata/components/ComponentName.json` | 6 |
| **Edit** | `packages/mcp/README.md` (counts) | 8 |
| **Edit** | `CLAUDE.md` (component count if referenced) | 8 |

### Conditional Files

| Condition | Action | File |
|-----------|--------|------|
| New design tokens needed | **Edit** | `packages/design-system/src/tokens/tokens.json` |
| New CSS variables needed | **Edit** | `packages/design-system/src/styles/theme.css` |
| New React hooks needed | **Create** | `packages/design-system/src/lib/use-hook-name.ts` |
| New non-React utils needed | **Create** | `packages/design-system/src/lib/util-name.ts` |
| Story needs toast decorator | Import `ToasterDecorator` from `apps/docs/stories/decorators/` |
| New cross-cutting decorator needed | **Create** | `apps/docs/stories/decorators/DecoratorName.tsx` |

---

## Phase 1: Research & Discovery

Before writing any code, understand the design space.

### 1.1 Define the Component Need

- What problem does this component solve?
- What are the primary use cases?
- Who are the consumers (which apps/teams)?
- Is this a primitive (used by other components) or a feature component?

### 1.2 Check Existing Components

Search the current 36 components for reuse or composition opportunities:

| Category | Components |
|----------|-----------|
| **navigation** | Accordion, Command, DropdownMenu, Pagination |
| **overlay** | AlertDialog, Dialog, HoverCard, Popover, Sheet, Tooltip |
| **data-display** | Avatar, Badge, DataTable, InfoCard, SortableBoard, Table |
| **actions** | Button |
| **forms** | Calendar, Checkbox, DatePicker, DateRangePicker, DateTimePicker, FileDropZone, Input, Label, RadioGroup, Select, Switch, Textarea, TimePicker |
| **layout** | Card, Separator |
| **feedback** | FullPageOverlayLoader, InlineLoader, NoDataMessage, Progress, ToasterService |

Ask: Can the need be met by composing existing components? If yes, consider adding a story or guideline instead of a new component.

### 1.3 Research External Libraries

Many Traxion components follow [shadcn/ui](https://ui.shadcn.com/) patterns (Radix + CVA + cn). Check these sources in order:

1. **shadcn/ui** — Primary reference. If shadcn has the component, use it as the starting point and adapt to Traxion conventions (tokens, naming, variants).
2. **[Radix UI Primitives](https://www.radix-ui.com/primitives)** — Accessible behavior base for interactive components. Check if a primitive exists.
3. **Other libraries** — Survey Ark UI, React Aria, Headless UI, or MUI for API design ideas, edge cases handled, and accessibility patterns.
4. **Community patterns** — Search for common approaches and known pitfalls for this component type.

### 1.4 Determine Complexity Level

| Level | Description | Pattern | Examples |
|-------|-------------|---------|----------|
| **Simple** | Single element, optional variants | `forwardRef` + `cn()` + optional CVA | Button, Badge, Input, Label, Progress |
| **Compound** | Multiple sub-components composing a whole | Multiple `forwardRef` exports + `displayName` | Card, Dialog, Sheet, Accordion |
| **Complex** | State management, custom hooks, context | React Context + hooks + compound structure | DataTable, SortableBoard, Command |

### 1.5 Identify Companion Components

Which existing components will this one commonly appear alongside? These become the `commonlyUsedWith` field in MCP metadata. Examples:
- A form component → commonly used with `label`, `button`, `card`
- A data display → commonly used with `badge`, `table`, `pagination`

### 1.6 Document Findings

Before proceeding to Phase 2, summarize:
- Which external reference(s) will be used and why
- Complexity level chosen
- Companion components identified
- Any design decisions or trade-offs

---

## Phase 2: Component Implementation

### 2.1 Create the Component File

**Path:** `packages/design-system/src/components/ComponentName.tsx`

File naming: PascalCase for single-word names (`Button.tsx`), kebab-case for multi-word names (`Alert-dialog.tsx`).

### 2.2 Pattern by Complexity

#### Simple Component Template

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const componentNameVariants = cva(
    "base-classes-here",
    {
        variants: {
            variant: {
                default: "default-variant-classes",
                // ... more variants
            },
            size: {
                default: "default-size-classes",
                // ... more sizes
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ComponentNameProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof componentNameVariants> {
    // Additional props here
}

const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(componentNameVariants({ variant, size, className }))}
                {...props}
            />
        )
    }
)
ComponentName.displayName = "ComponentName"

export { ComponentName, componentNameVariants }
```

#### Compound Component Template

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const ComponentName = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("base-classes", className)}
        {...props}
    />
))
ComponentName.displayName = "ComponentName"

const ComponentNameHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("header-classes", className)}
        {...props}
    />
))
ComponentNameHeader.displayName = "ComponentNameHeader"

const ComponentNameContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("content-classes", className)} {...props} />
))
ComponentNameContent.displayName = "ComponentNameContent"

export { ComponentName, ComponentNameHeader, ComponentNameContent }
```

#### Complex Component

For complex components with state management, follow the DataTable pattern:
- Create a custom hook in `packages/design-system/src/lib/use-component-name.ts`
- Use React Context for sharing state between sub-components
- Export the hook from `src/react.ts`

### 2.3 Conventions Checklist

- [ ] Extends native HTML attributes (`React.HTMLAttributes<...>` or similar)
- [ ] Uses Radix UI primitives for keyboard/ARIA/focus (interactive components)
- [ ] CVA for type-safe variants when the component has visual variants
- [ ] `cn()` for className merging on every component accepting `className`
- [ ] `React.forwardRef` on every exported component
- [ ] `displayName` set on every exported component
- [ ] Props interface exported for consumers
- [ ] No `"use client"` directive in component file (handled by `react.ts` barrel)

### 2.4 Register the Export

Add to `packages/design-system/src/react.ts`:

```ts
export * from "./components/ComponentName";
```

Place the export alphabetically among existing exports.

**If new hooks are needed:** Add hook exports to `src/react.ts` (hooks use React, so they go in the React entry point):
```ts
export * from "./lib/use-component-name";
```

**If new non-React utils are needed:** Add to `src/index.ts`:
```ts
export { utilName } from "./lib/util-name";
```

### 2.5 Design Tokens (if needed)

If the component introduces new design tokens:

1. Add to `packages/design-system/src/tokens/tokens.json`:
```json
{
  "colors": {
    "newToken": "H S% L%"
  }
}
```

2. Add CSS variable to `packages/design-system/src/styles/theme.css`:
```css
:root {
    --new-token: H S% L%;
}
```

### 2.6 Build Check

```bash
npm run build --workspace=@traxion-global/design-system
```

Fix any TypeScript or build errors before proceeding.

---

## Phase 3: Storybook Documentation

### 3.1 Create the Story File

**Path:** `apps/docs/stories/ComponentName.stories.tsx`

### 3.2 Story Structure Template

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "@traxion-global/design-system/react";

const meta = {
    component: ComponentName,
    title: "ComponentName",
    tags: ["autodocs"],
    parameters: {
        controls: { disable: true },
        actions: { disable: true },
        a11y: { disable: true },
        docs: {
            description: {
                component: `
El componente **ComponentName** permite...

### Importación
\`\`\`tsx
import { ComponentName } from "@traxion-global/design-system/react";
\`\`\`
                `,
            },
        },
    },
    argTypes: {
        // Define controls for each meaningful prop
        variant: {
            control: { type: "select" },
            options: ["default", "secondary"],
        },
        // ... more argTypes
    },
    args: {
        // Default args
        children: "Contenido",
    },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Named story exports for each variant ---

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: "Variante por defecto del componente.",
            },
        },
    },
};

export const Secondary: Story = {
    args: {
        variant: "secondary",
    },
    parameters: {
        docs: {
            description: {
                story: "Variante secundaria del componente.",
            },
        },
    },
};

// --- Demo story (interactive playground) ---

export const Demo: Story = {
    name: "Área de pruebas",
    tags: ["!autodocs"],
    parameters: {
        controls: { disable: false },
        actions: { disable: false },
    },
};
```

### 3.3 Key Patterns

**Descriptions in Spanish** — All story descriptions use Spanish with markdown formatting.

**Global disabling** — The meta-level `parameters` disables controls, actions, and a11y for all stories. Only the Demo story re-enables controls.

**Demo story convention** — Always include a `"Área de pruebas"` story with `tags: ["!autodocs"]` and controls enabled. This story doesn't appear in the docs page but provides an interactive playground.

**Code quality matters** — Stories serve as reference implementations that AI agents will read and replicate. Follow good coding patterns: clean imports, proper typing, realistic data, no shortcuts.

### 3.4 Compound Component Anatomy

For compound components, create an anatomy file:

**Path:** `apps/docs/stories/sources/ComponentName.anatomy.tsx`

```tsx
export const ComponentNameAnatomy = `
### Anatomía del componente
\`\`\`jsx
<ComponentName>
    <ComponentNameHeader>
        <ComponentNameTitle></ComponentNameTitle>
        <ComponentNameDescription></ComponentNameDescription>
    </ComponentNameHeader>
    <ComponentNameContent></ComponentNameContent>
</ComponentName>
\`\`\`
`;
```

Import and include in the meta description:
```tsx
import { ComponentNameAnatomy } from "./sources/ComponentName.anatomy";

// In meta.parameters.docs.description.component:
component: `
El componente **ComponentName** es un componente compuesto...

${ComponentNameAnatomy}
`,
```

### 3.5 External Source Files

When a story's code needs to be fully displayed in Storybook preview (for clarity), extract it to an external source file:

**Path:** `apps/docs/stories/sources/ComponentName.variant.tsx`

Import with `?raw` for code display:
```tsx
import VariantSource from "./sources/ComponentName.variant.tsx?raw";

export const Variant: Story = {
    render: () => <VariantComponent />,
    parameters: {
        docs: {
            source: { code: VariantSource },
        },
    },
};
```

### 3.6 Available Decorators

- **`ToasterDecorator`** (`apps/docs/stories/decorators/ToasterDecorator.tsx`) — Use in stories that trigger toast messages. Wraps the story with a `<Toaster>` component.

```tsx
import ToasterDecorator from "./decorators/ToasterDecorator";

// In a specific story:
export const WithToast: Story = {
    decorators: [ToasterDecorator],
    // ...
};
```

Create new decorators in `apps/docs/stories/decorators/` if needed for other cross-cutting concerns.

### 3.7 Verify

```bash
npm run dev --workspace=docs
```

Check localhost:6006 — confirm the component renders correctly in all story variants and the docs page looks good.

---

## Phase 4: Showcase Example

### 4.1 Add to Showcase Page

**Path:** `apps/showcase/app/page.tsx`

The showcase uses a `Section` wrapper component that renders each component group inside a Card:

```tsx
<Section title="ComponentName" description="Breve descripción del componente.">
    {/* Most comprehensive example here */}
</Section>
```

### 4.2 Guidelines

- Import the component from `@traxion-global/design-system/react` alongside existing imports
- Show the most complete usage: all key variants, states, and real-world usage in a single Section
- Use responsive Tailwind classes (`grid`, `sm:`, `md:` prefixes)
- Place the section logically near related components (forms together, overlays together, etc.)
- Use realistic Spanish-language content for labels and text
- Import any needed lucide-react icons alongside existing icon imports

### 4.3 Verify

```bash
npm run dev --workspace=showcase
```

Check localhost:3000 — confirm the Section renders correctly.

---

## Phase 5: Version Bump

### 5.1 Determine the New Version

While on `0.x.y`:
- **MINOR** (`0.X+1.0`): Adding a new component or new feature (non-breaking addition)
- **PATCH** (`0.x.Y+1`): Bug fixes and internal improvements with no API changes
- Any breaking change to existing component APIs also warrants a MINOR bump

### 5.2 Update package.json

**Path:** `packages/design-system/package.json`

Update the `"version"` field.

### 5.3 Update CHANGELOG.md

**Path:** `packages/design-system/CHANGELOG.md`

Add a new entry at the top following this format (in Spanish):

```markdown
### [X.Y.Z] - YYYY-MM-DD
### Added
- ComponentName: descripción breve del componente.

### Notes
- Notas adicionales si aplica.
```

---

## Phase 6: MCP Registration

### 6.1 Create Metadata JSON

**Path:** `packages/mcp/src/metadata/components/ComponentName.json`

File naming: match the component file name but with `.json` extension. Use kebab-case for multi-word names (e.g., `Alert-dialog.json`).

### 6.2 Required Fields

```json
{
  "name": "ComponentName",
  "slug": "component-name",
  "packageVersion": "0.x.y",
  "description": "Clear description of what it does and when to use it.",
  "category": "category-here",
  "tags": ["component-name", "relevant", "tags"],
  "props": [
    {
      "name": "propName",
      "type": "\"option1\" | \"option2\"",
      "default": "\"option1\"",
      "description": "What this prop controls."
    },
    {
      "name": "className",
      "type": "string",
      "default": "undefined",
      "description": "Additional CSS classes merged via cn()."
    },
    {
      "name": "children",
      "type": "React.ReactNode",
      "default": "undefined",
      "description": "The component content."
    }
  ],
  "dependencies": [],
  "peerDependencies": ["react", "react-dom"],
  "accessibility": {
    "role": "Describe the semantic role of the rendered element.",
    "keyboard": "Describe keyboard interaction patterns.",
    "aria": "Describe required/supported ARIA attributes.",
    "notes": "Additional accessibility considerations."
  }
}
```

### 6.3 Recommended Fields

```json
{
  "commonlyUsedWith": ["button", "card"],
  "recommendations": [
    {
      "type": "do",
      "description": "Usa ComponentName para X.",
      "code": "<ComponentName variant=\"accent\">...</ComponentName>"
    },
    {
      "type": "dont",
      "description": "No uses ComponentName para Y.",
      "code": "<ComponentName>...</ComponentName>"
    }
  ]
}
```

### 6.4 Sections (Complex Components Only)

For components that need documentation beyond props and examples (hook APIs, sub-component guides, column definitions):

```json
{
  "sections": [
    {
      "title": "Section Title",
      "blocks": [
        { "type": "text", "content": "Markdown text explaining the concept." },
        { "type": "code", "language": "tsx", "content": "import { ComponentName } from \"@traxion-global/design-system/react\";" },
        {
          "type": "table",
          "headers": ["Name", "Type", "Default", "Description"],
          "rows": [
            ["option", "string", "\"default\"", "Description of the option."]
          ]
        }
      ]
    }
  ]
}
```

Most simple components do **not** need `sections`. See `packages/mcp/src/metadata/components/DataTable.json` for a full example.

### 6.5 Valid Categories

| Category | When to use |
|----------|------------|
| `navigation` | Components for navigating content or menus |
| `overlay` | Dialogs, popovers, tooltips — anything that floats above the page |
| `data-display` | Showing data: tables, badges, avatars, cards with data |
| `actions` | Buttons and interactive triggers |
| `forms` | Form inputs, selectors, toggles |
| `layout` | Structural components: cards, separators, containers |
| `feedback` | Loaders, progress bars, empty states, toasts |

### 6.6 Slug Convention

The slug is the kebab-case version of the component name, used as the lookup key in MCP tools:
- `Button` → `button`
- `DataTable` → `datatable`
- `AlertDialog` → `alert-dialog`
- `NoDataMessage` → `no-data-message`

### 6.7 MCP Version Bump

**Every time the MCP registry changes** (new component metadata, updated metadata, new tools, changed tool behaviour) you must bump the MCP version in **three places in sync**:

| File | Field |
|------|-------|
| `packages/mcp/package.json` | `"version"` |
| `packages/mcp/src/index.ts` | `version:` inside `new McpServer({…})` |
| `packages/mcp/src/tools/version.ts` | `MCP_VERSION` constant |

**When to bump:**
- New component metadata JSON added → **MINOR** bump
- Existing metadata corrected or extended → **PATCH** bump
- New MCP tool added or tool signature changed → **MINOR** bump
- MCP-only bug fix → **PATCH** bump

**Relationship to the design-system version:**
- An MCP bump is almost always needed when the design-system adds components (new metadata = new registry state).
- Never skip the MCP bump when you add or modify metadata; the `version()` tool is the only signal consumers have that the registry is up to date.

---

## Phase 7: Build, Verify & Publish

### 7.1 Full Build

```bash
npm run build
```

This builds design-system, MCP, and all apps via Turborepo.

### 7.2 Verify MCP

```bash
npm run dev --workspace=@traxion-global/mcp
```

Test these queries:
- `get_component("component-slug")` — should return full metadata with stories
- `suggest_components("relevant use case")` — should appear in results
- `get_component_stories("component-slug")` — should list all stories with source

### 7.3 Verify Storybook

```bash
npm run dev --workspace=docs
```

Check localhost:6006:
- Component appears in sidebar
- All story variants render correctly
- Docs page shows description, props table, and examples
- "Área de pruebas" story has working controls

### 7.4 Publish

1. Publish the design-system package to GitHub Packages:
   ```bash
   npm publish --workspace=@traxion-global/design-system
   ```
2. If MCP metadata or tools changed (Phase 6.7), rebuild MCP before committing:
   ```bash
   npm run build --workspace=@traxion-global/mcp
   ```
   MCP is not published to a registry for now — it runs directly from source. The rebuild ensures the committed `dist/` is in sync with the version bump.

---

## Phase 8: Documentation Updates

### 8.1 Update Root README.md

If the root `README.md` lists components or component count, update it.

### 8.2 Update MCP README.md

**Path:** `packages/mcp/README.md`

Update:
- Component count (currently "36 React components" / "36 components")
- Category listing if the component belongs to a new category
- Story count (currently "35 story files" / "35 story sets")
- Architecture diagram numbers if maintained

### 8.3 Update CLAUDE.md

**Path:** `CLAUDE.md` (monorepo root)

Update the component count in the Project Overview section (currently "36 components").

---

## Editing an Existing Component

The `/new-component` skill auto-detects whether a component already exists. When editing, the process adapts.

### Edit Mode — Phase 1 Becomes Investigation

Instead of researching from scratch, read the current state:
- Component source: `packages/design-system/src/components/ComponentName.tsx`
- Stories: `apps/docs/stories/ComponentName.stories.tsx`
- MCP metadata: `packages/mcp/src/metadata/components/ComponentName.json`
- Showcase: search for the component in `apps/showcase/app/page.tsx`

Understand what exists before making changes.

### Change-Impact Matrix

| What Changed | Phases to Run |
|-------------|--------------|
| Internal logic only (no API change) | Phase 5 (version bump) → Phase 7 (build/publish) |
| Props / API changed | Phase 3 (update stories) → Phase 4 (update showcase) → Phase 5 → Phase 6 (update MCP props) → Phase 7 |
| New variant or sub-component added | Phase 3 (new story) → Phase 4 (showcase) → Phase 5 → Phase 6 (MCP metadata) → Phase 7 |
| Accessibility behavior changed | Phase 5 → Phase 6 (update MCP accessibility fields) → Phase 7 |
| Bug fix (no API change) | Phase 5 (patch bump) → Phase 7 |

All edit paths end with **Phase 7** (build/verify/publish) and **Phase 8** (documentation updates) if counts or listings changed.

---

## Reference: Real Examples in the Codebase

| What to Study | File |
|---------------|------|
| Simple component | `packages/design-system/src/components/Button.tsx` |
| Compound component | `packages/design-system/src/components/Card.tsx` |
| Complex component | `packages/design-system/src/components/DataTable.tsx` |
| Simple story | `apps/docs/stories/Button.stories.tsx` |
| Compound story with anatomy | `apps/docs/stories/Card.stories.tsx` |
| Complex story with sources | `apps/docs/stories/DataTable.stories.tsx` |
| Anatomy file | `apps/docs/stories/sources/Card.anatomy.tsx` |
| Decorator | `apps/docs/stories/decorators/ToasterDecorator.tsx` |
| Simple MCP metadata | `packages/mcp/src/metadata/components/Badge.json` |
| Complex MCP metadata | `packages/mcp/src/metadata/components/DataTable.json` |
| Showcase page | `apps/showcase/app/page.tsx` |
| Barrel exports | `packages/design-system/src/react.ts` |
| Design tokens | `packages/design-system/src/tokens/tokens.json` |
| Theme CSS | `packages/design-system/src/styles/theme.css` |
