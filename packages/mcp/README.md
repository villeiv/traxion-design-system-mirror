# @traxion-global/mcp

**Traxion Design System MCP Server** — A Model Context Protocol server that acts as a smart documentation layer for the Traxion Design System.

## Overview

This MCP server helps developers use the `@traxion-global/design-system` package effectively through AI-assisted development. It provides component discovery, documentation, real-world Storybook examples, and code generation capabilities.

## Hybrid Architecture

The Traxion Design System uses a **Hybrid Approach** that combines traditional package distribution with AI-assisted development:

```
+-------------------------------------------------------------+
|                   Traxion Design System                       |
+-----------------------------+-------------------------------+
|   GitHub Package            |   MCP Server                   |
|   (Source of Truth)         |   (Smart Documentation Layer)  |
+-----------------------------+-------------------------------+
| - 32 React components       | - Component discovery          |
| - Published to GitHub        | - AI-assisted scaffolding      |
| - Locked (no edits)         | - Usage validation             |
| - Versioned releases        | - Smart suggestions            |
| - Traditional import        | - Context-aware examples       |
+-----------------------------+-------------------------------+
```

### The Two Layers

#### Layer 1: GitHub Package (Traditional Distribution)

**Location:** `packages/design-system/`

The actual React components (32 components), design tokens, utilities, and styles. Published to GitHub Packages as `@traxion-global/design-system`.

```bash
npm install @traxion-global/design-system
```

```tsx
import { Button, Input, Card } from '@traxion-global/design-system/react';

export function LoginForm() {
  return (
    <Card>
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Button>Login</Button>
    </Card>
  );
}
```

**Key principle:** Components are **locked** — teams cannot modify them. This ensures consistency across all company applications.

#### Layer 2: MCP Server (AI Assistant)

**Location:** `packages/mcp/`

A Model Context Protocol server that provides intelligent documentation and scaffolding, helping AI assistants (like Claude) work with the design system as a "smart companion".

**How it works:**
1. **Installation** — Run `install_design_system()` to automatically install and configure the design system
2. **Discovery** — "What components are available?"
3. **Documentation** — "How do I use the Button component?"
4. **Scaffolding** — "Generate a login form for me"
5. **Validation** — "Is my code using components correctly?"
6. **Suggestions** — "What components should I use for X?"

---

## Architecture Diagram

```
+-----------------------------------------------------------+
|                   FILESYSTEM (Source of Truth)             |
+------------------------+----------------------------------+
| metadata/              | apps/docs/stories/               |
|  components/*.json     |  *.stories.tsx  (31 files)       |
|  guidelines/*.md       |  sources/*.tsx  (59 files)       |
|                        |  sources/*.anatomy.tsx           |
| design-system/         |                                  |
|  components/*.tsx      |                                  |
|  tokens/tokens.json    |                                  |
+----------+-------------+--------------+-------------------+
           |                            |
           |   new ComponentRegistry()  |
           |   ------- load() -------   |
           v                            v
+-----------------------------------------------------------+
|          ComponentRegistry (In-Memory Cache)               |
+-----------------------------------------------------------+
|                                                           |
|  components: Map<slug, {meta, source}>    (32 entries)    |
|  tokens: Record<category, data>           (3 categories)  |
|  guidelines: Map<name, markdown>          (4 entries)     |
|  stories: Map<slug, {meta, sources}>      (31 entries)    |
|                                                           |
|  Public API:                                              |
|  +-- getComponent(slug)  listComponents()                 |
|  +-- searchComponents(query)  getComponentsByCategory()   |
|  +-- getStories(slug)  hasStories()                       |
|  +-- getTokens()  getTokenCategory()                      |
|  +-- getGuideline(name)  listGuidelines()                 |
+------------------------+----------------------------------+
                         |
                  registerTools()
                         |
     +-----------+-------+-------+--------------+
     v           v       v       v              v
+---------++---------++------++----------++----------+
|Discovery|| Details ||Tokens||  Smart   || Install  |
|         ||         ||Guide ||  Tools   ||          |
| list_   || get_    ||lines ||          || install_ |
|component|| component|      ||scaffold_ ||design_   |
|s        ||         ||get_  ||feature   ||system    |
|         ||get_comp ||design||          ||          |
|search_  ||_stories ||_token||suggest_  ||          |
|component||         ||s     ||components||          |
|s        ||         ||      ||          ||          |
|         ||         ||get_  ||validate_ ||          |
|         ||         ||guide ||usage     ||          |
|         ||         ||line  ||          ||          |
+---------++---------++------++----------++----------+
     |           |       |       |              |
     +-----------+-------+-------+--------------+
                         |
                   stdio transport
                         |
                         v
                  +-----------+
                  | Claude /  |
                  | any AI    |
                  +-----------+
```

### Typical AI Workflow

```
1. suggest_components("invoice table")
   -> Table (paired with: badge, card, no-data-message)
   -> Badge, Pagination

2. get_component("table")
   -> Props, accessibility, anatomy
   -> Inline stories with Badge inside TableCell
   -> "Commonly Used With: Badge, Card, NoDataMessage"

3. get_component("badge")
   -> Variants: green, yellow, red, gray...
   -> Common status examples

4. (optional) get_design_tokens("colors")
   -> HSL palette for theming

5. AI generates code that already includes Badge in cells
```

---

## Available Tools

### Installation & Setup

> **CRITICAL FOR AI ASSISTANTS:**
> When a user asks to install, set up, or configure the Traxion Design System, you MUST use the `install_design_system` tool.
> **DO NOT** attempt manual installation using npm commands, file edits, or bash scripts.

| Tool | Parameters | Purpose |
|------|-----------|---------|
| **`install_design_system`** | `projectPath?`, `skipTokenCheck?`, `confirmBackup?` | Interactive installer: configures `.npmrc`, installs packages, sets up CSS and Tailwind |

### Discovery Tools

| Tool | Parameters | Purpose |
|------|-----------|---------|
| **`list_components`** | `category?: string` | Entry point. Lists all components, optionally filtered by category (actions, forms, layout, feedback, overlay, navigation, data-display) |
| **`search_components`** | `query: string` | Full-text search across component name, description, tags, and category |

### Detail Tools

| Tool | Parameters | Purpose |
|------|-----------|---------|
| **`get_component`** | `slug: string`, `include_source?: bool` | Complete docs: import, props, accessibility, **stories with real source code**, best practices, commonly used with, dependencies |
| **`get_component_stories`** | `slug: string`, `story_name?: string` | All stories for a component with full source code. Useful for filtering a specific story |
| **`get_design_tokens`** | `category?: string` | Design tokens: colors, radius, font. HSL format, Tailwind-compatible |
| **`get_guideline`** | `name: string` | Design guidelines in markdown: `accessibility`, `patterns`, `tables`, `z-index` |

### Smart Tools

| Tool | Parameters | Purpose |
|------|-----------|---------|
| **`suggest_components`** | `use_case: string`, `max_results?: number` | Given a use case ("login form", "data table"), suggests components ranked by relevance + companion boost |
| **`scaffold_feature`** | `description: string`, `components?: string[]` | Generates starter code with imports, components, and TODOs |
| **`validate_usage`** | `code: string` | Validates correct imports from `@traxion-global/design-system/react`, no source copying, no component redefinition |

---

## How to Register a New Component

Follow these 5 steps to add a new component so it is fully visible to the MCP server and generates high-quality code.

### Step 1: Create the component in the design system

File: `packages/design-system/src/components/MyComponent.tsx`

```tsx
import * as React from "react";
import { cn } from "../lib/utils";

export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "accent";
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div ref={ref} className={cn("...", className)} {...props} />
  )
);
MyComponent.displayName = "MyComponent";

export { MyComponent };
```

Export it in `packages/design-system/src/index.ts`:
```tsx
export { MyComponent } from "./components/MyComponent";
```

### Step 2: Create the metadata JSON

File: `packages/mcp/src/metadata/components/MyComponent.json`

```json
{
  "name": "MyComponent",
  "slug": "my-component",
  "description": "Clear description of what it does and when to use it.",
  "category": "layout",
  "tags": ["my-component", "layout", "container"],
  "props": [
    {
      "name": "variant",
      "type": "\"default\" | \"accent\"",
      "default": "\"default\"",
      "description": "Visual variant of the component."
    },
    {
      "name": "className",
      "type": "string",
      "default": "undefined",
      "description": "Additional CSS classes."
    }
  ],
  "dependencies": [],
  "peerDependencies": ["react", "react-dom"],
  "accessibility": {
    "role": "Describe the semantic role",
    "keyboard": "Describe keyboard interaction",
    "aria": "Describe required ARIA attributes"
  },
  "examples": [
    {
      "title": "Basic usage",
      "code": "<MyComponent>Content</MyComponent>"
    }
  ],
  "recommendations": [
    {
      "type": "do",
      "description": "Use MyComponent for X.",
      "code": "<MyComponent variant=\"accent\">...</MyComponent>"
    },
    {
      "type": "dont",
      "description": "Do not use MyComponent for Y."
    }
  ],
  "commonlyUsedWith": ["card", "button"]
}
```

**Key fields for AI code quality:**
- `examples` — fallback when no stories exist (only used if stories are absent)
- `recommendations` — shown as "Best Practices" (do/don't patterns)
- `commonlyUsedWith` — the AI will see links to companion components and suggest them together

### Step 3: Create Storybook stories

File: `apps/docs/stories/MyComponent.stories.tsx`

**Option A — Inline render (simpler, captured automatically by the parser):**
```tsx
import { MyComponent, Button } from "@traxion-global/design-system/react";

export default {
  title: "MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
};

export const Basic = {
  name: "Basic usage",
  parameters: {
    docs: {
      description: {
        story: "Basic example of **MyComponent**.",
      },
    },
  },
  render: args => (
    <MyComponent>
      <Button>Action</Button>
    </MyComponent>
  ),
};
```

The parser will extract the JSX from the render function + the design-system imports automatically.

**Option B — External source file (for more complex examples):**

1. Create `apps/docs/stories/sources/MyComponent.basic.tsx`:
```tsx
import { MyComponent, Button } from "@traxion-global/design-system/react";

export default function MyComponentBasic() {
  return (
    <MyComponent>
      <Button>Action</Button>
    </MyComponent>
  );
}
```

2. In the story file, import with `?raw`:
```tsx
import MyComponentBasic from "./sources/MyComponent.basic";
import MyComponentBasicCode from "./sources/MyComponent.basic?raw";

export const Basic = {
  name: "Basic usage",
  render: MyComponentBasic,
  parameters: {
    docs: {
      source: { code: MyComponentBasicCode },
      description: { story: "Basic example." },
    },
  },
};
```

### Step 4: (Optional) Create anatomy

File: `apps/docs/stories/sources/MyComponent.anatomy.tsx`
```tsx
export const MyComponentAnatomy = `
<MyComponent>
  <MyComponentHeader />
  <MyComponentBody />
  <MyComponentFooter />
</MyComponent>
`;
```

Import in the story file:
```tsx
import { MyComponentAnatomy } from "./sources/MyComponent.anatomy";
// Use in the default export's description
```

### Step 5: Build and verify

```bash
cd packages/mcp && npm run build
```

The registry auto-discovers everything:
- JSON in `metadata/components/` -> loaded as `ComponentMeta`
- Source in `design-system/src/components/` -> loaded as `source`
- `.stories.tsx` in `apps/docs/stories/` -> parsed by `StorybookParser`

**Verification:**
- `get_component("my-component")` -> should show stories inline with real code
- `suggest_components("my use case")` -> should appear if tags/keywords match
- `get_component_stories("my-component")` -> should list all stories with source

### Checklist

- [ ] Component TSX in `design-system/src/components/`
- [ ] Export in `design-system/src/index.ts`
- [ ] JSON metadata in `mcp/src/metadata/components/`
- [ ] `commonlyUsedWith` with companion components
- [ ] Stories in `apps/docs/stories/` (inline or with source files)
- [ ] `npm run build` in `packages/mcp`

---

## Monorepo Structure

```
8-traxion-global-design-system/           (Monorepo root)
+-- packages/
|   +-- design-system/                    <- Source of Truth
|   |   +-- src/
|   |   |   +-- components/               (32 .tsx files)
|   |   |   +-- tokens/tokens.json        (Design tokens)
|   |   |   +-- styles/theme.css
|   |   |   +-- lib/utils.ts
|   |   +-- package.json                  (@traxion-global/design-system)
|   |
|   +-- mcp/                              <- Smart Documentation Layer
|       +-- src/
|       |   +-- index.ts                  (MCP server entry point)
|       |   +-- registry.ts               (Reads from ../design-system/)
|       |   +-- parsers/
|       |   |   +-- storybook-parser.ts   (Parses .stories.tsx files)
|       |   +-- tools/                    (MCP tools)
|       |   +-- metadata/                 (Component docs + guidelines)
|       +-- package.json                  (@traxion-global/mcp)
|
+-- apps/
    +-- showcase/                         (Next.js demo app)
    +-- docs/                             (Storybook)
        +-- stories/
        |   +-- *.stories.tsx             (31 story files)
        |   +-- sources/                  (59 source files + anatomy)
```

### Data Flow

```
+----------------------+       +----------------------+
| packages/            |       | apps/docs/           |
|   design-system/     |       |   stories/           |
|     src/components/  |       |     *.stories.tsx    |  <- Usage examples
+----------+-----------+       +----------+-----------+
           |                              |
           | reads from                   | parses
           v                              v
+--------------------------------------------------+
| packages/mcp/                                    |
|   registry.ts + storybook-parser.ts              |  <- Loads component data
|   tools/                                         |  <- Generates import guides
+----------+---------------------------------------+
           |
           | used by
           v
+----------------------+
| Claude Code          |
| (AI Assistant)       |  <- Helps developers
+----------+-----------+
           |
           | generates
           v
+----------------------+
| Developer's project  |
|   LoginForm.tsx      |  <- Imports from package
+----------------------+
```

---

## Installation

### For End Users (In Your Project)

1. Install the design system package:
```bash
npm install @traxion-global/design-system
```

2. Configure the MCP server in your `.mcp.json`:
```json
{
  "mcpServers": {
    "traxion-design-system": {
      "command": "npm",
      "args": ["run", "dev", "--workspace=@traxion-global/mcp"],
      "cwd": "/path/to/8-traxion-global-design-system"
    }
  }
}
```

3. Use with Claude Code to get AI-assisted component usage!

### For Development (In This Monorepo)

```bash
# Install dependencies
npm install

# Run MCP server in development mode
npm run dev --workspace=@traxion-global/mcp

# Build MCP server
npm run build --workspace=@traxion-global/mcp
```

---

## Key Principle: MCP Generates Code That USES Components

### CORRECT (What MCP Does)

```tsx
// Generated by MCP - imports from the design system package
import { Input, Button, Label, Card } from '@traxion-global/design-system/react';

export function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <form className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </Card>
  );
}
```

### WRONG (What MCP Should Never Do)

```tsx
// BAD - Copying component source code
export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button className={cn("px-4 py-2 rounded", className)} {...props}>
      {children}
    </button>
  );
}

// This defeats the purpose of having a design system!
```

---

## Component Categories

- **navigation** — Accordion, Command, DropdownMenu, Pagination
- **overlay** — AlertDialog, Dialog, HoverCard, Popover, Sheet, Tooltip
- **data-display** — Avatar, Badge, InfoCard, SortableBoard, Table
- **actions** — Button
- **forms** — Calendar, Checkbox, FileDropZone, Input, Label, RadioGroup, Select, Switch, Textarea
- **layout** — Card, Separator
- **feedback** — FullPageOverlayLoader, InlineLoader, NoDataMessage, Progress, ToasterService

---

## Design Philosophy

### What MCP Should Do:
- Help developers **use** components from the package
- Generate code with proper imports
- Provide documentation and real Storybook examples
- Scaffold complete features
- Validate usage patterns
- Suggest companion components via `commonlyUsedWith`

### What MCP Should NOT Do:
- Copy component source code
- Allow modification of components
- Replace package distribution

---

## Contributing

This package is part of the Traxion Design System monorepo. To contribute:

1. Create a branch from `main`
2. Make your changes in `packages/mcp/`
3. Test with `npm run dev --workspace=@traxion-global/mcp`
4. Submit a pull request

## License

Proprietary — Traxion Global
