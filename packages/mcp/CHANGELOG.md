# Changelog

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
