# Changelog

### [0.7.0] - 2026-02-25
### Added
- Componente **Chat** — interfaz de conversación compuesta por 11 sub-componentes.
  - `Chat` — proveedor de contexto que gestiona el estado `open`/`close`. Soporta modo controlado (`open` + `onOpenChange`) y no controlado (`defaultOpen`).
  - `ChatTrigger` — botón FAB fijo (`fixed bottom-6 right-6`) que alterna el chat. Muestra `MessageCircle` cuando cerrado y `X` cuando abierto; acepta `children` para icono personalizado.
  - `ChatPanel` — contenedor visual del chat con animación de entrada/salida. Usado directamente (sin `Chat`) siempre aparece visible.
  - `ChatHeader` — barra superior con avatar, nombre y estado del contacto.
  - `ChatMessages` — área de scroll para la lista de mensajes.
  - `ChatDateSeparator` — separador de fecha con líneas a ambos lados.
  - `ChatBubble` — fila de mensaje con variante `received` (izquierda), `sent` (derecha) y `system` (centrado).
  - `ChatBubbleAvatar` — envoltorio para `Avatar` dentro de una fila de mensaje.
  - `ChatBubbleMessage` — burbuja de texto con variantes `received` (fondo muted), `sent` (fondo primary) y `system` (fondo secondary, itálico).
  - `ChatBubbleTimestamp` — texto de hora/fecha asociado a un mensaje.
  - `ChatInput` — área de entrada que renderiza como `<form>`. Intercepta `Ctrl+Enter` / `Cmd+Enter` para llamar a `onSubmit`. Layout de grid `1fr auto` para alinear textarea y botón de envío.

### [0.6.0] - 2026-02-25
### Added
- Componente **Stepper** — indicador visual de progreso para procesos secuenciales. Soporta dos modos de uso: navegación (asistente interactivo multi-paso) y display (estado informativo como seguimiento de pedidos).
  - Sub-componentes: `Stepper`, `StepperList`, `StepperItem`.
  - Orientación `horizontal` (por defecto) y `vertical`.
  - Variante de indicador `numbered` (por defecto, con números y check al completar) y `dots` (círculos sin número).
  - Estados por paso: `pending`, `active`, `completed` y `error`.
  - Prop `clickable`: `"none"` | `"completed"` | `"all"` para controlar la navegación por clic.
  - Prop `completedSteps` explícita para control total del estado de completado.
  - Soporte controlado (`value` + `onValueChange`) y no controlado (`defaultValue`).
  - Prop `description` en `StepperItem` acepta `ReactNode` para contenido enriquecido (fechas, badges, etc.).

### [0.5.0] - 2026-02-24
### Added
- Módulo **DatePicker** con tres componentes de selección de fechas:
  - `DatePicker` — selector de fecha única con soporte controlado/no controlado (`value`/`defaultValue`).
  - `DateRangePicker` — selector de rango con estado pendiente; la selección se confirma con **Aplicar**.
  - `DateTimePicker` — combina calendario y selector de hora en un único popover, confirmado con **Aplicar**.
- Componente **TimePicker** — `<input type="time">` estilizado con controles nativos del navegador, paso de 1 minuto, sin segundos.
- Tipo auxiliar `DateRange` re-exportado desde `react-day-picker` para evitar dependencia directa del consumidor.
- Soporte de localización (`localeCode: "es" | "en"`), formato personalizable (`dateFormat`), restricción de fechas (`fromDate`/`toDate`) y navegación por desplegables (`captionLayout`).

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
