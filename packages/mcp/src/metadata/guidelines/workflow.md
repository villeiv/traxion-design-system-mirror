# Traxion Design System — Session Workflow

## Why This Matters

The MCP server serves component docs, props, and code examples from a **registry snapshot** that corresponds to a specific version of `@traxion-global/design-system`. If the version installed in the user's project is different from the registry version, the AI may generate:

- Imports for components that don't exist in the installed version
- Props that were added or removed in a later/earlier release
- Code examples that produce build errors or runtime failures

**This package is on `0.x.y` semver.** Per the project's versioning policy, **MINOR bumps may contain breaking changes** while on `0.x.y`. Auto-updating without user consent could silently break a working codebase. The agent must surface the version gap and let the **user decide** whether to update.

---

## Mandatory Session Protocol

Follow these steps at the start of every session that involves the Traxion Design System.

### Step 1 — Call `version()`

```
version()
```

This returns:
- **MCP server version** — identifies the registry build
- **Design system version (registry)** — the version the MCP docs are written against
- **Component and story counts** — sanity check that the registry loaded correctly

### Step 2 — Check the installed version in the user's project

Run one of the following in the user's project directory:

```bash
# npm
npm list @traxion-global/design-system --depth=0

# pnpm
pnpm list @traxion-global/design-system --depth=0

# yarn
yarn list --pattern @traxion-global/design-system
```

### Step 3 — Compare versions

| Scenario | Action |
|----------|--------|
| Installed version **matches** registry version | Proceed to Step 4 |
| Installed version **differs** from registry version | **STOP — ask the user before doing anything else (see below)** |
| Package **not installed** | Offer to install it using `install_design_system` |

### Step 4 — If versions differ, STOP and ask the user

**Do NOT decide on your own which version to work against. Do NOT auto-update. Do NOT silently proceed with either version.**

Tell the user exactly what you found and ask them to choose:

> "The Traxion Design System registry is at version **X.Y.Z**, but your project has **A.B.C** installed.
> Because this package is on `0.x.y`, minor version bumps may contain breaking changes — I can't safely assume which version you want to work against.
> **Would you like to update to X.Y.Z, or continue working with A.B.C?**"

Then **wait for their answer** before doing anything else.

- If the user says **update**: call `install_design_system({ projectPath: "<absolute path to user's project>" })`
- If the user says **keep current**: note which version you are working against, then continue

The user must make this call — not you.

### Step 5 — Proceed with `list_components()`

Only after confirming which version to work against, call:
```
list_components()
```

---

## Version Mismatch Indicators

Watch for these signs that the installed version may be out of sync:

- A component returned by `list_components` throws a "module not found" error on import
- A prop documented in `get_component` doesn't exist at runtime (TypeScript error)
- `get_component_stories` shows a usage pattern that causes a build error
- The user mentions they recently installed the package but see outdated docs

In any of these cases, re-run the version check (Steps 1–3) before continuing.

---

## `0.x.y` Semver Caveat

While `@traxion-global/design-system` is below `1.0.0`:

- **PATCH** bumps (`0.x.Y`) — bug fixes and non-breaking additions
- **MINOR** bumps (`0.X.y`) — **may contain breaking changes** (renamed props, removed components, changed APIs)
- **MAJOR** bump to `1.0.0` — stable public API; standard semver applies from that point

Always treat a MINOR version difference as potentially breaking and ask the user before upgrading.
