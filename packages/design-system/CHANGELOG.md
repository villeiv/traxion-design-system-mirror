# Changelog

### [0.17.0] - 2026-06-09

### Added
- **DataTable**: las celdas editables muestran una pista al **hover** (caja con borde en `accent`) para indicar su editabilidad cuando no todas las columnas son editables.
- **DataTable**: **navegación por teclado** entre celdas editables con las flechas (roving tabindex, acotada a la página actual). Enter/F2 inician la edición, Escape cancela/deselecciona, y un clic fuera de la tabla limpia la selección.

### Notes
- Mejoras de usabilidad sobre la edición de celdas introducida en 0.16.0. Sin cambios de API ni breaking changes.

### [0.16.0] - 2026-06-09

### Added
- **DataTable**: edición de celdas en línea, activable con la prop `enableCellEditing` (por defecto desactivada). Las columnas habilitan la edición con `enableEditing: true` a nivel de columna (al mismo nivel que `enableSorting`/`enableHiding`). Requiere `rowSelectionKey` como identidad de fila.
- **DataTable**: editor de texto por defecto (edición en la propia celda) y editor personalizado por columna con `editCell` (recibe `{ value, onChange, stage, cancel, row, column }`). El tipo `ColumnDef` re-exportado se amplió con `enableEditing` y `editCell`.
- **DataTable**: nuevo sub-componente **`DataTableEditBar`** — barra inferior fija que aparece cuando hay cambios sin guardar; muestra el conteo ("N cambios realizados") y los botones Guardar / Descartar.
- **DataTable**: nuevas props `onCellsEdited(payload)` (se llama al guardar; recibe `{ data, changes }`, soporta `Promise` para guardado transaccional), `onDiscardEdits()` (para limpiar estado del consumidor al descartar) y `cellErrors` (marca celdas inválidas desde fuera, con color destructive y tooltip).
- Nuevos tipos exportados: `EditCellContext`, `CellEdit`, `CellsEditedPayload`, `DataTableEditBarProps`.

### Notes
- Modelo de edición: Enter o salir de una celda deja el cambio pendiente (resaltado `primary` tenue); Escape cancela. Los cambios se acumulan y solo se aplican al pulsar "Guardar cambios" en `DataTableEditBar`. La edición escribe en el `accessorKey` de la columna, por lo que las columnas editables deben tener `accessorKey` (se emite un warning en desarrollo si falta). Las celdas compuestas (varios datos sin un `accessorKey` único) no son editables en este modelo.

### [0.15.0] - 2026-06-08

### Added
- **Button**: nueva variante `destructiveWarm` — versión visualmente más ligera de `destructive` (relleno cálido tenue, con texto y borde en rojo cálido). Pensada para interfaces densas donde una acción destructiva no debe acaparar la atención; `destructive` se mantiene para acciones críticas y enfocadas (p. ej. diálogos de confirmación).
- **Tokens**: nuevos tokens de color `destructive-warm` (`#FF4E22`) y `destructive-warm-foreground` (`#9F2823`), expuestos en el preset de Tailwind como `destructive-warm` y `destructive-warm-foreground`.

### Changed
- **Tokens**: el color `destructive` global se suavizó a `#C8443D` (antes el rojo intenso por defecto) para alinearlo con la paleta del design system. Afecta a todos los componentes que consumen el token (`Button`, `Badge`, `Stepper` en estado error).

### [0.14.2] - 2026-06-08

### Changed
- **Avatar**: `AvatarFallback` ahora usa `text-foreground` con `text-sm font-semibold` (antes `text-primary-foreground`), mejorando el contraste y la consistencia tipográfica del texto/ícono de respaldo sobre el fondo primario.
- **Card**: `CardHeader` reduce su espaciado vertical interno (`space-y-0.5` en lugar de `space-y-1.5`). `CardTitle` ahora usa `text-lg font-bold` (antes `font-semibold leading-none tracking-tight`) para una jerarquía visual más marcada.

### Notes
- Cambios únicamente de estilo. No hay modificaciones de API ni de props.
- Build/CI: el workflow de release ahora instala y compila desde la raíz del monorepo para evitar una doble copia de `@types/react` que rompía la generación de tipos. La versión 0.14.1 no llegó a publicarse en el registro.

### [0.14.0] - 2026-03-13

### Added
- Componente **LanguageProvider** — proveedor de contexto que establece el idioma activo (`"es"` | `"en"`) para todos los componentes del design system. Idioma predeterminado: español. Exporta `LanguageProvider`, `LanguageProviderProps`, `DesignSystemLanguage` y el hook `useDesignSystemLanguage()`.

### Changed
- **DataTable**, **DatePicker**, **DateRangePicker**, **DateTimePicker**, **DateTimeRangePicker**, **Pagination**, **Dialog**, **Sheet**, **Stepper**, **AiInsight**, **FileDropZone**, **SortableBoard**: los textos internos de UI ahora se resuelven según el idioma del `LanguageProvider` más cercano (o español por defecto si no hay proveedor). Los textos ya no están hardcodeados en un solo idioma.
- **DatePicker**, **DateRangePicker**, **DateTimePicker**, **DateTimeRangePicker**: la prop `localeCode` ahora toma como valor predeterminado el idioma del proveedor, manteniendo la posibilidad de sobreescribirla de forma explícita.

### [0.13.0] - 2026-03-12

### Breaking Changes
- **DataTable**: `DataTableColumnHeader` eliminado. Las columnas con `header` de tipo string ahora renderizan automáticamente el botón de ordenamiento y el manejador de arrastre según `enableSorting` y `enableColumnReordering`. Las columnas con `header` de tipo función pasan sin cambios.
- **DataTable**: El ordenamiento es ahora opt-in — el valor por defecto de todas las columnas es `enableSorting: false`. Añade `enableSorting: true` explícitamente en cada columna que deba ser ordenable.
- **DataTable**: Soporte de `meta: { enableReordering: false }` eliminado. Cuando `enableColumnReordering` está activo, todas las columnas con `header` string obtienen manejador de arrastre automáticamente.

### Added
- **DataTable**: Registro de títulos de columna en contexto interno — `DragOverlay` y `DataTableViewOptions` muestran el título legible en lugar del `id` de la columna.
- **DataTable**: `DataTableViewOptions` resuelve etiquetas con la siguiente prioridad: título registrado → `header` string → `column.id`.

### Changed
- **DataTable**: El botón de ordenamiento muestra únicamente el ícono chevron. El título de la columna se renderiza como `<span>` independiente fuera del botón.

### [0.12.0] - 2026-03-11

### Breaking Changes
- **DataTable**: Las props `rowSelection`, `onRowSelectionChange` y `getRowId` fueron reemplazadas por `selectedRows`, `onSelectedRowsChange` y `rowSelectionKey`.
- **useDataTable**: `rowSelection` / `setRowSelection` / `onRowSelectionChange` reemplazados por `selectedRows` / `setSelectedRows` / `onSelectedRowsChange`. El hook ahora es genérico: `useDataTable<TData>()`.
- **DataTable**: `rowSelectionKey` es obligatorio cuando `enableRowSelection` está habilitado.

### Added
- **DataTableSelectionBar**: Nuevo sub-componente que muestra una barra fija en la parte inferior con el conteo de selección, botones de acciones masivas y un botón de deseleccionar. Responsive: en móvil muestra dos filas (label + acciones con scroll horizontal).
- **DataTable**: `selectedRows` (`Record<string, TData>`) almacena los datos completos de las filas seleccionadas, persistiendo entre páginas.
- **DataTable**: `clearSelection` disponible en el contexto interno para limpiar la selección desde sub-componentes.

### Fixed
- **DataTable**: La selección de filas ya no se transfiere entre páginas al cambiar de página (antes usaba índices de array).
- **useDataTable**: Prevenido bucle de redirección infinita en sincronización con URL cuando `searchParams` no cambia.

### [0.11.1] - 2026-03-10
### Fixed
- **DataTable**: Skeleton de carga ahora respeta columnas ocultas (`getVisibleLeafColumns` en vez de `getAllLeafColumns`).
- **DataTable**: `colSpan` del estado vacío ahora usa el conteo de columnas visibles en lugar del total de columnas.
- **DataTable**: Detección de reordenamiento de columnas usa contexto interno en vez de depender de comportamiento no documentado de dnd-kit.
- **DataTablePagination**: El selector de filas por página incluye automáticamente el `pageSize` actual en las opciones.
- **useDataTable**: Corregido `searchParams` faltante en dependencias del `useEffect` de sincronización con URL.
- **useDataTable**: Parsing de filtros en URL ahora preserva valores que contienen `:` (ej: horarios `10:30`).
- **useDataTable**: Parsing de ordenamiento en URL ahora soporta IDs de columna que contienen `.`.
- **useDataTable**: La opción `pageSize` ahora funciona correctamente (antes era ignorada por un fallback hardcodeado).

### Changed
- **useDataTable**: El hook ahora maneja `rowSelection` internamente — ya no es necesario un `useState` separado. El estado se pasa automáticamente vía `{...tableState}`.

### Removed
- **useDataTable**: Eliminada la opción `debounceMs` que no tenía efecto.

### [0.11.0] - 2026-02-27
### Added
- Componente **AiInsight** — panel de insights generados por IA con cuatro variantes de importancia (`info`, `warning`, `critical`, `success`). Acepta un arreglo de mensajes con título y descripción. Con un solo mensaje el panel se muestra directamente; con dos o más aparece un control de colapso en el encabezado. El estado inicial del panel es configurable mediante `defaultOpen`.

### [0.10.0] - 2026-02-27
### Added
- Componente **DateTimeRangePicker** — selector de rango de fechas con hora para inicio y fin del período. Combina un calendario en modo rango (`react-day-picker`) con dos controles de hora nativos. Patrón de estado pendiente: la selección no se confirma hasta presionar **Aplicar**. Formato del disparador compacto (`d MMM`) configurable vía `dateFormat`. Los controles de hora se adaptan al espacio disponible: apilados verticalmente con `numberOfMonths=1`, en línea horizontal con `numberOfMonths≥2`.

### [0.9.0] - 2026-02-26
### Added
- Componente **StatCard** — KPI tile para dashboards con etiqueta, valor en negrita, ícono opcional en círculo de color y señal de tendencia opcional (sube/baja/neutral con porcentaje). Variantes de ícono: `primary`, `secondary`, `green`, `yellow`, `red`. Prop `trendSentiment` para disociar la dirección del número de su significado (e.g. una tasa de accidentes a la baja es positiva). Estado de carga (`loading`) con skeleton animado.

### Removed
- Componente **InfoCard** — reemplazado por `StatCard`, que ofrece todas las mismas capacidades más indicadores de tendencia.

### [0.8.0] - 2026-02-26
### Added
- Sub-componente **ChatSendButton** — botón de envío pre-estilizado para usar dentro de `ChatInput`. Encapsula `Button` con `type="submit"`, layout cuadrado (`aspect-square`, `max-h-9`) y el ícono `Send` por defecto. Acepta `children` para reemplazar el ícono y `className` para sobreescribir estilos.

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
