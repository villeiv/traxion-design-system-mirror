# @traxion-global/mcp

**Traxion Design System MCP Server** - A Model Context Protocol server that acts as a smart documentation layer for the Traxion Design System.

## Overview

This MCP server helps developers use the `@traxion-global/design-system` npm package effectively through AI-assisted development. It provides component discovery, documentation, examples, and code generation capabilities.

## Key Features

- **Component Discovery** - Search and browse 32 React components
- **Smart Documentation** - Get props, accessibility info, and usage examples
- **Code Generation** - Scaffold features with proper npm imports
- **Design Tokens** - Access colors, typography, and spacing tokens
- **Storybook Integration** - View real-world component examples
- **Validation** - Verify correct component usage patterns

## Architecture

This MCP server follows a **Hybrid Approach**:

- **NPM Package** = Source of Truth (primary distribution)
- **MCP Server** = Smart Documentation Layer (AI assistant)

The MCP server:
- ✅ Generates code that **imports** components from npm
- ✅ Provides documentation and examples
- ✅ Helps developers use components correctly
- ❌ Does NOT copy component source code into projects
- ❌ Does NOT replace the npm package

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

## Available Tools

The MCP server provides these tools:

| Tool | Description |
|------|-------------|
| `list_components` | List all 32 components, optionally filtered by category |
| `search_components` | Search components by name, description, or tags |
| `get_component` | Get detailed component info (props, examples, accessibility) |
| `get_component_stories` | View Storybook examples for a component |
| `get_design_tokens` | Access design tokens (colors, radius, font) |
| `get_guideline` | View design guidelines (accessibility, patterns, theming) |

## Example Usage

With Claude Code and this MCP server configured:

**User:** "Create a login form with email and password inputs"

**Claude generates:**
```tsx
import { Input, Button, Label, Card, CardHeader, CardTitle, CardContent } from '@traxion-global/design-system/react';

export function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

## How It Works

1. **Single Source of Truth** - Reads components directly from `../design-system/src/`
2. **No Duplication** - Component source code stays in the design-system package
3. **Always In Sync** - Same git repository, versioned together
4. **Metadata-Driven** - Uses JSON metadata for component documentation
5. **Storybook Integration** - References existing Storybook stories

## Component Categories

- **navigation** - Accordion, Command, DropdownMenu, Pagination
- **overlay** - AlertDialog, Dialog, HoverCard, Popover, Sheet, Tooltip
- **data-display** - Avatar, Badge, InfoCard, SortableBoard, Table
- **actions** - Button
- **forms** - Calendar, Checkbox, FileDropZone, Input, Label, RadioGroup, Select, Switch, Textarea
- **layout** - Card, Separator
- **feedback** - FullPageOverlayLoader, InlineLoader, NoDataMessage, Progress, ToasterService

## Design Philosophy

### What MCP Should Do:
- ✅ Help developers **use** components from npm
- ✅ Generate code with npm imports
- ✅ Provide documentation and examples
- ✅ Scaffold complete features
- ✅ Validate usage patterns

### What MCP Should NOT Do:
- ❌ Copy component source code
- ❌ Allow modification of components
- ❌ Replace npm package distribution

## Contributing

This package is part of the Traxion Design System monorepo. To contribute:

1. Create a branch from `main`
2. Make your changes in `packages/mcp/`
3. Test with `npm run dev --workspace=@traxion-global/mcp`
4. Submit a pull request

## License

Proprietary - Traxion Global
