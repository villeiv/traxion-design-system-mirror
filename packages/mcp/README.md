# @traxion-global/mcp

**Traxion Design System MCP Server** — A Model Context Protocol server that acts as a smart documentation layer for the Traxion Design System.

## Overview

This MCP server helps developers and AI agents use the `@traxion-global/design-system` package effectively through AI-assisted development. It provides component discovery, documentation, and real-world Storybook examples.

## Hybrid Architecture

The Traxion Design System uses a **Hybrid Approach** that combines traditional package distribution with AI-assisted development:

```
+------------------------------------------------------------------+
|                   Traxion Design System                          |
+-----------------------------+------------------------------------+
|   GitHub Package            |   MCP Server                       |
|   (Source of Truth)         |   (Smart Documentation Layer)      |
+-----------------------------+------------------------------------+
| - 37 React components       | - Component discovery              |
| - Published to GitHub       | - Context-aware documentation      |
| - Locked (no edits)         | - Real Storybook examples          |
| - Versioned releases        | - Design tokens & guidelines       |
| - Traditional import        | - Design system installation guide |
+-----------------------------+------------------------------------+
```

### The Two Layers

#### Layer 1: GitHub Package (Traditional Distribution)

**Location:** `packages/design-system/`

The actual React hooks and components (37 components), design tokens, utilities, and styles. Published to GitHub Packages as `@traxion-global/design-system`.

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

---

## Architecture Diagram

```
+-----------------------+     +---------------------------+
| metadata/             |     | apps/docs/stories/        |
|   components/*.json   |     |   *.stories.tsx   (36)    |
|   guidelines/*.md     |     |   sources/*.tsx   (94)    |
|                       |     +---------------------------+
| design-system/        |
|   components/*.tsx    |     ComponentRegistry.load()
|   tokens/tokens.json  |            |
+-----------------------+            v
                          +---------------------+
                          | ComponentRegistry   |
                          | (In-Memory Cache)   |
                          |                     |
                          | 37 components       |
                          | 36 story sets       |
                          | 3 token categories  |
                          | 3 guidelines        |
                          +----------+----------+
                                     |
                              registerTools()
                                     |
         +-------+--------+--------+--------+
         |       |        |        |        |
    list_    get_      get_     get_    install_
    components component tokens  guideline design_system
             get_stories              version
                                     |
                               stdio transport
                                     |
                                Claude / AI
```

### Typical AI Workflow

```
1. list_components()
   -> Alphabetical list with tags and commonlyUsedWith

2. get_component("table")
   -> Package version, props, accessibility, anatomy
   -> Inline stories with Badge inside TableCell
   -> Documentation sections (for complex components)
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

### Discovery & Documentation

| Tool | Parameters | Purpose |
|------|-----------|---------|
| **`list_components`** | _(none)_ | Entry point. Lists all components alphabetically with tags and commonly paired components |
| **`get_component`** | `slug: string`, `include_source?: bool` | Complete docs: import, props, accessibility, **stories with real source code**, best practices, commonly used with, dependencies, package version, and documentation sections (for complex components) |
| **`get_component_stories`** | `slug: string`, `story_name?: string` | All stories for a component with full source code. Useful for filtering a specific story |
| **`get_design_tokens`** | `category?: string` | Design tokens: colors, radius, font. HSL format, Tailwind-compatible |
| **`get_guideline`** | `name: string` | Design guidelines in markdown: `accessibility`, `patterns`, `z-index` |

### Utility Tools

| Tool | Parameters | Purpose |
|------|-----------|---------|
| **`version`** | _(none)_ | Returns the MCP server version, the design system package version, and registry stats (component count, story sets). Use this to confirm you are running the expected build. |

---

## How to Register a New Component

Before registering a component in the MCP server, the following design system tasks must be completed first:

### Prerequisites (Design System)

1. **Create the component** in `packages/design-system/src/components/MyComponent.tsx` and export it in `packages/design-system/src/index.ts`
2. **Create Storybook stories** in `apps/docs/stories/MyComponent.stories.tsx` with usage examples (inline renders or external source files in `apps/docs/stories/sources/`)
3. **(Optional) Create an anatomy file** in `apps/docs/stories/sources/MyComponent.anatomy.tsx` showing the component's structure
4. **Build and publish a new version** of the `@traxion-global/design-system` package so the component is available to consumers

Once the component is published and has stories, follow these steps to make it visible to the MCP server.

### Step 1: Create the metadata JSON

File: `packages/mcp/src/metadata/components/MyComponent.json`

```json
{
  "name": "MyComponent",
  "slug": "my-component",
  "packageVersion": "0.1.0",
  "description": "Clear description of what it does and when to use it.",
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
  "commonlyUsedWith": ["card", "button"],
  "sections": [
    {
      "title": "Section Title",
      "blocks": [
        { "type": "text", "content": "Markdown text block." },
        { "type": "code", "language": "tsx", "content": "<MyComponent />" },
        { "type": "table", "headers": ["Name", "Type"], "rows": [["foo", "string"]] }
      ]
    }
  ]
}
```

**Key fields for AI code quality:**
- `packageVersion` — must match the published version of the design system package where this component is available
- `recommendations` — shown as "Best Practices" (do/don't patterns)
- `commonlyUsedWith` — the AI will see links to companion components and suggest them together
- `sections` — generic documentation blocks for complex components that need additional documentation beyond props and examples (e.g., hook APIs, sub-component guides, column definition patterns). Most simple components don't need this field. See `DataTable.json` for a full example

### Step 2: Bump the MCP version (if applicable)

When making significant changes to the MCP (new tools, changed behavior, updated metadata), bump the version in **three places** in sync:

| File | Field |
|------|-------|
| `packages/mcp/package.json` | `"version"` |
| `packages/mcp/src/index.ts` | `version:` inside `new McpServer({...})` |
| `packages/mcp/src/tools/version.ts` | `MCP_VERSION` constant |

This ensures the `version()` tool always reflects the running build and consumers can verify they are on the expected version.

### Step 3: Build and verify

```bash
cd packages/mcp && npm run build
```

The registry auto-discovers everything:
- JSON in `metadata/components/` -> loaded as `ComponentMeta`
- Source in `design-system/src/components/` -> loaded as `source`
- `.stories.tsx` in `apps/docs/stories/` -> parsed by `StorybookParser`

**Verification:**
- `version()` -> confirm component count increased by 1
- `get_component("my-component")` -> should show stories inline with real code
- `get_component_stories("my-component")` -> should list all stories with source

### Checklist

**Design system (prerequisites):**
- [ ] Component TSX in `design-system/src/components/`
- [ ] Export in `design-system/src/index.ts`
- [ ] Stories in `apps/docs/stories/` (inline or with source files)
- [ ] Design system package built and published with a new version

**MCP registration:**
- [ ] JSON metadata in `mcp/src/metadata/components/`
- [ ] `packageVersion` set to the published design system version
- [ ] `commonlyUsedWith` with companion components
- [ ] (Optional) `sections` for complex components that need additional documentation (hooks, sub-components, etc.)
- [ ] Version bumped in `package.json`, `src/index.ts`, and `src/tools/version.ts`
- [ ] `npm run build` in `packages/mcp`

---

## Monorepo Structure

```
8-traxion-global-design-system/           (Monorepo root)
+-- packages/
|   +-- design-system/                    <- Source of Truth
|   |   +-- src/
|   |   |   +-- components/               (37 .tsx files)
|   |   |   +-- tokens/tokens.json        (Design tokens)
|   |   |   +-- styles/theme.css
|   |   |   +-- lib/utils.ts
|   |   +-- package.json                  (@traxion-global/design-system)
|   |
|   +-- mcp/                              <- Smart Documentation Layer
|       +-- src/
|       |   +-- index.ts                  (MCP server entry point)
|       |   +-- registry.ts               (Loads components, stories & metadata)
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
        |   +-- *.stories.tsx             (36 story files)
        |   +-- sources/                  (71 source files + anatomy)
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
| (AI Assistant)       |  <- Helps developers and AI agents
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

1. Configure the MCP server in your project's `.mcp.json`:
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

2. Ask your AI assistant to install the design system. It will use the `install_design_system` tool to automatically configure `.npmrc`, install packages, set up CSS, and configure Tailwind in your project.

3. Start building with AI-assisted component discovery, documentation, and code generation!

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

## Design Philosophy

This MCP server follows an **AI-first development philosophy**. Rather than relying solely on traditional documentation or manual browsing, the design system is built to be consumed primarily through AI agents. The MCP server is the primary interface for developers to discover, learn, and use components — making AI the first-class citizen in the development workflow.

### What MCP Should Do:
- Help developers **discover** and **use** components from the package
- Provide documentation, props, accessibility, and real Storybook examples
- Surface companion components via `commonlyUsedWith`
- Expose design tokens and guidelines

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
