# Changelog

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
