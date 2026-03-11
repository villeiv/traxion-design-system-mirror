export const DataTableAnatomy = `
### Anatomía del componente
\`\`\`jsx
<DataTable>
  <DataTableToolbar>
    //Controles y filtros
    <Input />
    <DataTableViewOptions />
  </DataTableToolbar>
  <DataTableContent />
  <DataTablePagination />
  <DataTableSelectionBar>
    // Botones de acciones masivas (solo visible con filas seleccionadas)
  </DataTableSelectionBar>
</DataTable>
\`\`\`
Puedes añadir múltiples campos de filtro dentro de DataTableToolbar según sea necesario. El componente **DataTableViewOptions** debe colocarse dentro del toolbar para mantener una estructura consistente y mejorar la experiencia de usuario. **DataTableSelectionBar** se coloca después de DataTablePagination y solo aparece cuando hay filas seleccionadas — muestra el conteo de selección, botones de acciones masivas y un botón de deseleccionar.
`;