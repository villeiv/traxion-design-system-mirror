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
</DataTable>
\`\`\`
Puedes añadir múltiples campos de filtro dentro de DataTableToolbar según sea necesario. El componente **DataTableViewOptions** debe colocarse dentro del toolbar para mantener una estructura consistente y mejorar la experiencia de usuario.
`;