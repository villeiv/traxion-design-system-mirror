---
name: new-component
description: Walk through the full process of creating or editing a design system component — from research through implementation, Storybook stories, MCP registration, and publishing.
argument-hint: [ComponentName]
---

# New Component Skill

You are guiding the user through the Traxion Design System component creation/editing process.

## Setup

1. Read the full methodology document at `docs/creating-components.md`. This is your knowledge base for all phases.
2. Parse the component name from `$ARGUMENTS`. If no name was provided, ask the user for the component name.
3. **Auto-detect mode** by checking if `packages/design-system/src/components/$ARGUMENTS.tsx` exists (also try kebab-case variant for multi-word names like `AlertDialog` → `Alert-dialog.tsx`):
   - **If the file does NOT exist** → **Create mode** (run all 8 phases)
   - **If the file exists** → **Edit mode** (read current state, ask what's changing, run only relevant phases)

## Phase Gate Rule

**Execute ONE phase at a time.** After completing each phase, stop, present the result to the user, and wait for explicit confirmation before starting the next phase. Do not batch phases together. If the user says "continue", "move forward", or "proceed", treat that as approval for the **next single phase only**.

## Create Mode

Walk through each phase sequentially, applying the Phase Gate Rule at every boundary.

### Phase 1: Research & Discovery
- Search existing components for reuse/composition opportunities
- Research external libraries: check shadcn/ui first (our components follow shadcn patterns), then Radix UI primitives, then other libraries
- Determine complexity level (simple, compound, complex)
- Identify companion components for `commonlyUsedWith`
- Present findings to the user and confirm the approach before proceeding

### Phase 2: Component Implementation
- Create the component file at `packages/design-system/src/components/ComponentName.tsx`
- Follow the pattern matching the complexity level (templates are in the methodology doc)
- Apply the conventions checklist: forwardRef, displayName, cn(), CVA, HTML attribute extension
- Register the export in `packages/design-system/src/react.ts`
- Run `npm run build --workspace=@traxion-global/design-system` to verify

### Phase 3: Storybook Documentation
- Create the story file at `apps/docs/stories/ComponentName.stories.tsx`
- Follow the story structure: meta with autodocs tag, disabled controls globally, Spanish descriptions, argTypes, named story exports for each variant, Demo story ("Área de pruebas") with controls enabled
- For compound components: create anatomy file at `apps/docs/stories/sources/ComponentName.anatomy.tsx`
- **Every story must have its JSX extracted to a separate source file** at `apps/docs/stories/sources/ComponentName.variant.tsx` — this is mandatory, not optional. Each source file exports a default function component. Import it twice: once as the component (`render: ComponentNameVariant`) and once as raw string (`source: { code: ComponentNameVariantCode }`). The stories file must contain no inline JSX in render functions.
- Write high-quality code in source files — they serve as reference implementations for AI agents and are shown verbatim in Storybook docs
- The `title` in the story meta must be the component name — it is what links the stories to the MCP metadata (matched against the `slug`, normalized). Story exports may be typed (`export const X: Story = {`); prefer that form
- Verify with `npm run dev --workspace=docs`

### Phase 4: Showcase Example
- Add a `<Section>` block to `apps/showcase/app/page.tsx`
- Import the component from `@traxion-global/design-system/react`
- Show the most complete usage example with all key variants
- Place logically near related components
- Verify with `npm run dev --workspace=showcase`

### Phase 5: Package Version Bump
- Determine version: MINOR for new components and features, PATCH for bug fixes with no API change (while on `0.x.y`, breaking changes also go in a MINOR)
- Bump `packages/design-system/package.json`
- Update `packages/design-system/CHANGELOG.md` with new entry (Spanish)

### Phase 6: MCP Registration
- Create `packages/mcp/src/metadata/components/ComponentName.json`
- Fill all required fields: name, slug, packageVersion, description, tags, props, dependencies, peerDependencies, accessibility
- Add recommended fields: commonlyUsedWith, recommendations — always an array of `{ type: "do" | "dont", description, code? }`, never a `{ do: [], dont: [] }` object
- For complex components: add sections with documentation blocks (each section needs `blocks` as an array; `{ title, content }` renders nothing)
- Use the Badge.json and DataTable.json examples in the codebase as references — Badge for the baseline shape, DataTable for `sections`, which is what makes documentation rich enough for AI agents
- Add the entry to `packages/mcp/CHANGELOG.md` (Spanish)
- **Bump the MCP version in three places in sync** (adding metadata = MINOR bump):
  - `packages/mcp/package.json` → `"version"`
  - `packages/mcp/src/index.ts` → `version:` inside `new McpServer({…})`
  - `packages/mcp/src/tools/version.ts` → `MCP_VERSION` constant

### Phase 7: Build & Verify
- Run full build: `npm run build`
- Verify MCP: test `get_component("slug")` with the MCP dev server — it must include `## Usage Examples` (stories reached the registry) and `## Best Practices` (recommendations were read). Check the startup log too: `parsed 0 stories` means the story file was not readable
- Verify Storybook renders correctly
- Rebuild MCP after the version bump: `npm run build --workspace=@traxion-global/mcp`
- Do NOT publish here — publishing is the last step (Phase 9)

### Phase 8: Documentation Updates
- Update `packages/mcp/README.md` category listing only if the component is in a new functional category
- Update root `README.md` only if it lists individual components by name
- Do NOT add or update component/story counts anywhere — counts are intentionally untracked; `version()` reports them live

### Phase 9: Publish (final step)
- Single source of truth: the **"Proceso de Release"** section in the root `README.md`
- In short: commit & push everything to `main` → create a GitHub Release tagged `vX.Y.Z` → verify the `build` and `publish-gpr` jobs are green in the Actions tab
- Never publish locally with `npm publish`

## Edit Mode

1. **Investigate current state**: Read the component source, stories, MCP metadata, and search the showcase page
2. **Ask what's changing**: Present the current state and ask the user what modifications they want
3. **Apply the change-impact matrix** from the methodology doc to determine which phases need to run:
   - Internal logic only → Phase 5 + Phase 7 + Phase 9
   - Props/API changed → Phase 3 + Phase 4 + Phase 5 + Phase 6 + Phase 7 + Phase 9
   - New variant/sub-component → Phase 3 + Phase 4 + Phase 5 + Phase 6 + Phase 7 + Phase 9
   - Accessibility changed → Phase 5 + Phase 6 + Phase 7 + Phase 9
   - Bug fix → Phase 5 + Phase 7 + Phase 9
4. **Run only the relevant phases**, confirming with the user at each boundary
5. **Always end with Phase 7** (build/verify), **Phase 8** (docs updates, if listings changed), and **Phase 9** (publish via GitHub Release)

## Important Reminders

- **One phase at a time** — never start the next phase until the user explicitly confirms the current one is good
- Design-system versioning: new components/features = **MINOR** (`0.X+1.0`); bug fixes = **PATCH** (`0.x.Y+1`)
- MCP versioning: bump whenever metadata or tools change. Adding components almost always requires an MCP bump.
- Reference real examples from the codebase (listed at the bottom of the methodology doc) when building each artifact
- Stories and MCP metadata are teaching material for AI agents — quality matters
- All descriptions in stories should be in Spanish
- The `packageVersion` in MCP metadata must match the version set in Phase 5
