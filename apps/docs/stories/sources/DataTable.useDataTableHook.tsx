export const UseDataTableHookDocs = `
### Hook \`useDataTable\`

El hook \`useDataTable\` centraliza **todo** el estado de la tabla en un solo lugar. Maneja internamente:

| Estado | Tipo | Descripción |
|--------|------|-------------|
| \`pagination\` | \`{ pageIndex, pageSize }\` | Página actual y filas por página |
| \`sorting\` | \`[{ id, desc }]\` | Columnas ordenadas y su dirección |
| \`columnFilters\` | \`[{ id, value }]\` | Filtros activos por columna |
| \`columnVisibility\` | \`{ [columnId]: boolean }\` | Columnas visibles/ocultas |
| \`columnOrder\` | \`string[]\` | Orden de las columnas |
| \`rowSelection\` | \`{ [rowIndex]: boolean }\` | Filas seleccionadas |

Cada estado incluye su setter (ej: \`setPagination\`) y un alias \`onXxxChange\` (ej: \`onPaginationChange\`) que permite usar \`{...tableState}\` directamente como props del componente \`DataTable\`.

**Uso básico:**
\`\`\`tsx
const tableState = useDataTable();

<DataTable columns={columns} data={data} pageCount={pageCount} {...tableState}>
  <DataTableContent />
  <DataTablePagination />
</DataTable>
\`\`\`

**Opciones:**

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| \`pageSize\` | \`number\` | \`10\` | Tamaño de página inicial |
| \`namespace\` | \`string\` | — | Prefijo para params de URL (múltiples tablas en la misma página) |
| \`router\` | \`{ push: (url) => void }\` | — | Router de Next.js. Si se proporciona, el estado se sincroniza con la URL automáticamente |
| \`searchParams\` | \`URLSearchParams\` | — | Para leer el estado inicial desde la URL |

**Acceder al estado para lógica de negocio:**
\`\`\`tsx
const tableState = useDataTable();

// Filas seleccionadas
const selectedIds = Object.keys(tableState.rowSelection);

// Filtros activos (para llamadas a API)
const activeFilters = tableState.columnFilters;

// Paginación actual (para fetch)
const { pageIndex, pageSize } = tableState.pagination;
\`\`\`

> **Nota:** Recomendamos usar \`useDataTable\` para manejar el estado, pero si lo prefieres puedes crear tus propios handlers con \`useState\` y pasarlos como props individuales al componente.
`;
