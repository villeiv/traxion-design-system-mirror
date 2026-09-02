# Changelog

### [0.22.0] - 2026-09-02

### Changed
- **Formato de `recommendations` estandarizado** al array documentado `[{ type, description, code? }]`. Migrados los cinco archivos que usaban la forma `{ do: [], dont: [] }` (Calendar, DataTable, Date-picker, StatCard, TimePicker); los 13 componentes con recomendaciones comparten ahora un único formato.
- `get_component` vuelve a agrupar DO/DON'T desde el array y renderiza el bloque `code` opcional de cada recomendación, como describe el esquema documentado.

### Fixed
- **Las recomendaciones de 8 componentes no llegaban a la IA**: el renderer solo entendía la forma objeto, así que "Best Practices" se emitía para 4 de 13 componentes. Ahora se emite para los 13 (Ai-insight, Badge, Button, Chat, Input, Language-provider, Stepper y Textarea estaban silenciados).
- **`get_component("language-provider")` fallaba entero** con `section.blocks is not iterable` — sus `sections` usaban `{ title, content }` en vez de `{ title, blocks: [...] }`. Normalizado, y el renderer ahora ignora una sección malformada en vez de tumbar la respuesta completa.
- **Los ejemplos de 14 componentes eran inalcanzables**: las stories se indexaban por el `title` de Storybook (`statcard`) y las tools se consultan por el slug de metadata (`stat-card`). Ambos lados se normalizan ahora a la misma clave alfanumérica.
- **5 archivos de stories parseaban 0 stories**: el parser exigía `export const X = {` y los ignoraba al llevar anotación de tipo (`export const X: Story = {`). Recuperadas 29 stories en AiInsight, Chat, DatePicker, Stat-card y TimePicker.
- **6 descripciones de stories llegaban truncadas** al cortarse en el primer apóstrofe o comilla escapada del texto. La extracción respeta ahora las secuencias de escape.

### Added
- **StatCard.json**: sección "Tooltip or popover on the icon (recommended pattern)" y prop `iconWrapper` — el patrón recomendado cuando el ícono necesita un tooltip, junto con lo que no se debe hacer (envolver `icon`, o pedir props de tooltip en el componente). `tooltip` añadido a `commonlyUsedWith`.
- El registry avisa por consola cuando un archivo de stories parsea 0 stories, para que este tipo de fallo silencioso se vea en el arranque.

### Removed
- Campo `usage` de `StatCard.json` — único archivo que lo tenía y ninguna tool lo ha leído nunca. Los ejemplos viven en las stories.

### [0.21.0] - 2026-09-02

### Changed
- **StatCard.json**: documentada la prop `iconWrapper`. `packageVersion` actualizado a `0.21.0`.

### [0.20.0] - 2026-09-02

### Changed
- **StatCard.json**: documentada la prop `iconPosition` (`"left" | "right"`, por defecto `"right"`) y precisada la descripción de `iconVariant` — la variante `primary` usa el token `primary-dark` para el glifo. `packageVersion` actualizado a `0.20.0`.

### [0.19.0] - 2026-06-23

### Changed
- **DataTable.json**: documentado el **fijado de columnas (pinning)** — nueva sección "Column Pinning" (propiedad de columna `pin: "left" | "right"`, agrupación consecutiva en los bordes, sombra de costura, `min-width` + `table-layout: fixed`, y truncación por columna), tags `column-pinning`/`sticky-columns`/`frozen-columns`, recomendaciones do/dont, y descripción ampliada. `packageVersion` actualizado a `0.19.0`.

### [0.17.0] - 2026-06-09

### Changed
- **DataTable.json**: documentada la navegación por teclado de la edición de celdas — el modelo de interacción ahora describe selección con click/Tab, movimiento con flechas (roving tabindex, acotado a la página) y Enter/F2/Escape; el campo `accessibility.keyboard` refleja lo mismo. `packageVersion` actualizado a `0.17.0`.

### [0.16.0] - 2026-06-09

### Changed
- **DataTable.json**: documentada la edición de celdas en línea. Nuevas props `enableCellEditing`, `onCellsEdited`, `onDiscardEdits` y `cellErrors`; nuevo sub-componente `DataTableEditBar`; tipos `EditCellContext`/`CellEdit`/`CellsEditedPayload`. Añadida la sección **Cell Editing** (cómo activar, flags por columna `enableEditing`/`editCell`, modelo de interacción, tabla del contexto de `editCell`, validación con `cellErrors`, ejemplo completo y restricciones: un campo por columna, `accessorKey` requerido con warning en dev, y celdas compuestas no editables). Añadido `DataTableEditBar` a la anatomía/sub-componentes y recomendaciones do/don't. `packageVersion` actualizado a `0.16.0`.

### [0.15.0] - 2026-06-08

### Changed
- **Button.json**: documentada la nueva variante `destructiveWarm` en la prop `variant` (cuándo usarla frente a `destructive`). Añadidas recomendaciones do/don't para elegir entre `destructive` (acciones críticas/enfocadas) y `destructiveWarm` (interfaces densas). `packageVersion` actualizado a `0.15.0`.

### Notes
- Los nuevos tokens de color `destructive-warm` y `destructive-warm-foreground` se exponen automáticamente vía `get_design_tokens` (lee `tokens.json`), sin metadata adicional.

### [0.14.0] - 2026-03-13

### Added
- **Language-provider.json**: Nuevo registro para el componente `LanguageProvider` — proveedor de contexto de idioma (`"es"` | `"en"`). Incluye props, accesibilidad, recomendaciones do/don't, `commonlyUsedWith` y tres secciones de documentación: componentes afectados, hook `useDesignSystemLanguage`, e interacción con `localeCode` en DatePicker.

### Changed
- **DataTable.json**, **Date-picker.json**, **Pagination.json**, **Dialog.json**, **Sheet.json**, **Stepper.json**, **Ai-insight.json**, **File-drop-zone.json**, **Sortable-board.json**: `packageVersion` actualizado a `0.14.0` — todos estos componentes recibieron soporte de internacionalización en esa versión.

### [0.13.0] - 2026-03-12

### Changed
- **DataTable.json**: `DataTableColumnHeader` eliminado del patrón de importación y marcado como removido en la sección de sub-componentes.
- **DataTable.json**: Patrones de definición de columnas actualizados — `header` string con `enableSorting: true` es el patrón primario para columnas ordenables.
- **DataTable.json**: Descripción de `enableColumnReordering` actualizada — el manejador de arrastre se renderiza automáticamente en columnas con `header` string.
- **DataTable.json**: Reglas do/don't actualizadas para reflejar la nueva API de columnas.
- **DataTable.json**: `packageVersion` actualizado a `0.13.0`.

### [0.12.1] - 2026-03-11
### Fixed
- **DataTable.json**: Regla de estado de filtros clarificada — solo los inputs de texto necesitan `useState` local (para debounce). `Select`, `DateRangePicker` y `TimePicker` deben derivar su valor directamente de `tableState.columnFilters`.

### [0.12.0] - 2026-03-11
### Changed
- **DataTable.json**: `packageVersion` actualizado a `0.12.0`.
- **DataTable.json**: Props `rowSelection`, `onRowSelectionChange` y `getRowId` reemplazados por `selectedRows`, `onSelectedRowsChange` y `rowSelectionKey`.
- **DataTable.json**: Estado `rowSelection` del hook renombrado a `selectedRows: Record<string, TData>` — ahora almacena datos completos de las filas seleccionadas.
- **DataTable.json**: Retornos del hook actualizados: `setRowSelection / onRowSelectionChange` → `setSelectedRows / onSelectedRowsChange`.
- **DataTable.json**: Ejemplos de código actualizados para reflejar la nueva API de selección.
- **DataTable.json**: Recomendaciones actualizadas para referenciar `selectedRows` y `rowSelectionKey`.

### Added
- **DataTable.json**: Documentación del sub-componente `DataTableSelectionBar` — barra fija inferior con conteo de selección, botones de acciones masivas y botón de deseleccionar. Incluye ejemplo de uso.
- **DataTable.json**: `DataTableSelectionBar` agregado al patrón de importación.
- **DataTable.json**: Recomendación de uso de `DataTableSelectionBar` para acciones masivas.

### [0.11.1] - 2026-03-10
### Changed
- **DataTable.json**: Documentación del hook `useDataTable` reescrita — ahora incluye sección "What the hook manages" que lista explícitamente los 6 estados que maneja (pagination, sorting, columnFilters, columnVisibility, columnOrder, rowSelection).
- **DataTable.json**: Agregados `rowSelection`, `setRowSelection` y `onRowSelectionChange` a la tabla de retornos del hook.
- **DataTable.json**: Agregados ejemplos de código para selección de filas y sincronización con URL.
- **DataTable.json**: Actualizada descripción de `DataTablePagination` — el selector de filas por página ahora incluye automáticamente el `pageSize` actual.
- **DataTable.json**: Descripciones de props de estado ahora indican que son proporcionados por `useDataTable` vía `{...tableState}`.
- **DataTable.json**: Recomendación "Don't" actualizada — ya no prohíbe `useState`, sino que recomienda el hook y deja abierta la opción de handlers custom.

### Removed
- **DataTable.json**: Eliminada opción `debounceMs` de la tabla de opciones del hook (fue removida del código).
