# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Traxion Design System monorepo — a React component library with Storybook documentation, an MCP server for AI-assisted development, and a Next.js showcase app. Published via GitHub Packages as `@traxion-global/design-system`.

## Common Commands

All commands run from the monorepo root:

```bash
npm run dev            # Watch mode: rebuilds design-system on changes
npm run build          # Build all packages (turbo)
npm run lint           # Lint all packages (turbo)
npm run check-types    # TypeScript type checking (turbo)
npm run format         # Prettier formatting
```

Storybook (run from `apps/docs` or use turbo):
```bash
npm run dev --workspace=docs              # Storybook on localhost:6006
npm run build-storybook --workspace=docs  # Build static Storybook
```

Design system package only:
```bash
npm run build --workspace=@traxion-global/design-system
npm run lint --workspace=@traxion-global/design-system
```

MCP server:
```bash
npm run dev --workspace=@traxion-global/mcp
```

## Architecture

### Monorepo Structure (npm workspaces + Turborepo)

- `packages/design-system/` — The component library (source of truth). Built with tsup. Two entry points:
  - `src/index.ts` — Utilities only (`cn`)
  - `src/react.ts` — All React components and hooks (marked `"use client"`)
- `packages/mcp/` — MCP server providing 7 tools for AI agents to discover and document component usage
- `apps/docs/` — Storybook 10 (React + Vite). Stories live in `apps/docs/stories/`
- `apps/showcase/` — Next.js demo application
- `packages/eslint-config/` and `packages/typescript-config/` — Shared configs

### Component Patterns

Components follow a consistent structure:
- **Radix UI primitives** for accessibility (keyboard, ARIA, focus management)
- **CVA (class-variance-authority)** for type-safe variant props
- **`cn()` utility** (clsx + tailwind-merge) for className merging
- **`React.forwardRef`** on all components for ref forwarding
- **Compound components** pattern for complex components (Card, Sheet, Dialog, etc.)
- Props extend native HTML element attributes plus CVA `VariantProps`
- Component files use PascalCase (e.g., `Button.tsx`) but some use kebab-case (e.g., `Alert-dialog.tsx`)

### Styling & Theming

- **Tailwind CSS 3.4** with a design system preset at `src/tailwind/tailwind-preset.cjs`
- **Design tokens** in `src/tokens/tokens.json` (colors in HSL, radius, fonts)
- **CSS variables** defined in `src/styles/theme.css` — consumed by the Tailwind preset
- **Dark mode**: class-based strategy
- Apps extend the design system's Tailwind preset in their own `tailwind.config.js`

### Package Exports

```
@traxion-global/design-system
├── .             → Utilities (cn)
├── ./react       → All React components and hooks
├── ./tailwind-preset → Tailwind config preset
├── ./theme.css   → CSS variables and base styles
└── ./tokens.json → Raw design tokens
```

### MCP Server

Located in `packages/mcp/`. Provides 7 tools: `list_components`, `get_component`, `get_component_stories`, `get_design_tokens`, `get_guideline`, `install_design_system`, `version`. Component metadata JSON files live in `packages/mcp/src/metadata/components/`. **Key principle**: MCP generates code that *imports from* the package, never copies source code.

## Adding New Components

Follow the methodology in `docs/creating-components.md`.
Use `/new-component ComponentName` to walk through the process interactively.

## Key Conventions

- Versioning: SemVer. While on `0.x.y`, MINOR bumps may contain breaking changes
- MCP versioning: bump the version in **three places** in sync whenever the MCP registry or tools change — `packages/mcp/package.json` → `"version"`, `packages/mcp/src/index.ts` → `version:` in McpServer config, and `packages/mcp/src/tools/version.ts` → `MCP_VERSION` constant. **Trigger rules:** adding/changing component metadata → MINOR bump; metadata corrections or MCP bug fixes → PATCH bump. Adding components to the design-system almost always requires an MCP bump (new metadata). Never skip this when metadata changes — `version()` is the only signal consumers have that the registry is current.
- ESLint 9 flat config with `--max-warnings 0` on design-system and showcase
- TypeScript strict mode. Path alias `@/*` → `src/*` in design-system
- Peer dependencies: React 18/19, lucide-react for icons
- Build pipeline: `^build` dependency in turbo ensures packages build before apps
- Components are "locked" — consumers import them, never modify source
- Re-exports TanStack Table types (`ColumnDef`, `Row`, `Column`) so consumers don't need `@tanstack/react-table` directly
