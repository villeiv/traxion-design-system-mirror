import { DataTable, DataTableContent, DataTablePagination, DataTableSelectionBar, ColumnDef, useDataTable, Checkbox, Button } from "@traxion-global/design-system/react";
import { Trash, Download } from "lucide-react";
import { useEffect, useState } from "react";

interface User {
    id: number;
    firstName: string;
    email: string;
}

interface FetchResponse {
    users: User[];
    total: number;
}

const columns: ColumnDef<User>[] = [
    // Columna para la selección de filas
    {
        id: "select",
        header: ({ table }) => (
            // Checkbox para seleccionar/deseleccionar todas las filas de la página
            <Checkbox
                checked={
                    // Si todas las filas de la página están seleccionadas, el checkbox estará marcado.
                    table.getIsAllPageRowsSelected() ||
                    // Si algunas filas de la página están seleccionadas, el checkbox estará en estado indeterminado.
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Seleccionar todo"
            />
        ),
        cell: ({ row }) => (
            // Checkbox para seleccionar/deseleccionar la fila individual
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Seleccionar fila"
            />
        ), 
        size: 50
    },
    { header: "ID", accessorKey: "id", size: 50 },
    { header: "Nombre", accessorKey: "firstName" },
    { header: "Correo electrónico", accessorKey: "email" },
];

export default function DataTableRowSelection() {
    const [data, setData] = useState<User[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);

    const tableState = useDataTable<User>({ pageSize: 7 });

    useEffect(() => {
        const { pageIndex, pageSize } = tableState.pagination;
        fetch(`https://dummyjson.com/users?limit=${pageSize}&skip=${pageIndex * pageSize}`)
            .then((res) => res.json())
            .then((result: FetchResponse) => {
                setData(result.users);
                setPageCount(Math.ceil(result.total / pageSize));
            });
    }, [tableState.pagination.pageIndex, tableState.pagination.pageSize]);

    return (
        <DataTable
            className="w-[700px]"
            data={data}
            columns={columns}
            pageCount={pageCount}
            {...tableState}
            enableRowSelection
            rowSelectionKey={(row) => String(row.id)}
        >
            <DataTableContent />
            <DataTablePagination />
            {/* DataTableSelectionBar aparece fijo en la parte inferior cuando hay filas seleccionadas */}
            <DataTableSelectionBar>
                <Button variant="destructive" size="sm" onClick={() => {
                    const selected = Object.values(tableState.selectedRows);
                    alert(`Eliminar usuarios: ${selected.map(u => `${u.firstName} (${u.id})`).join(", ")}`);
                }}>
                    <Trash className="mr-1 h-4 w-4" />
                    Eliminar
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                    const selected = Object.values(tableState.selectedRows);
                    alert(`Exportar usuarios: ${selected.map(u => u.id).join(", ")}`);
                }}>
                    <Download className="mr-1 h-4 w-4" />
                    Exportar
                </Button>
            </DataTableSelectionBar>
        </DataTable>
    );
}