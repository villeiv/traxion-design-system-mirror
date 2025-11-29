# Changelog

### [0.3.0] - 2025-11-29
### Changed
- **BREAKING CHANGE**: Los componentes React ahora se importan desde  
  `@traxion-global/design-system/react`  
  en lugar de `@traxion-global/design-system`.
- Reestructuración del paquete con dos entrypoints:
  - `@traxion-global/design-system/react` (componentes React, client-only).
  - `@traxion-global-design-system` (utilidades como `cn`).
- Actualización del `package.json` para asegurar compatibilidad con entornos modernos
  (React 18/19, Next.js App Router, RSC).
- Ajustes en el bundle para corregir errores de hooks en contextos server-side.

### Fixed
- Error causado por `useEffect` en módulos que eran tratados como server components por Next.

###[0.2.0] - 2025-11-27
### Added
- 32 componentes base del design system:
    - Accordion
    - Alert-dialog
    - Avatar
    - Badge
    - Button
    - Calendar
    - Card
    - Checkbox
    - Command
    - Dialog
    - Dropdown-menu
    - File drop zone
    - Full page loader
    - Hover card
    - Info card
    - Inline loader
    - Input
    - Label
    - No data message
    - Pagination
    - Popover
    - Progress
    - Radio group
    - Select
    - Separator
    - Sheet
    - Sortable board
    - Switch
    - Table
    - Text area
    - Toaster Service
    - Tooltip
- Sistema de tokens de color, spacing y typography.
- Configuración inicial para consumo vía GitHub Packages.

### Notes
- Esta versión es estable para uso interno, pero aún bajo la serie `0.x`:
  pueden ocurrir cambios incompatibles en versiones `0.MINOR.0` futuras.
