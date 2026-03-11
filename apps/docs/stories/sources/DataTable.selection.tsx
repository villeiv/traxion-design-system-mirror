import { DataTable, DataTableContent, DataTablePagination, DataTableToolbar, ColumnDef, useDataTable, Checkbox, Button } from "@traxion-global/design-system/react";
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

    // Estado para almacenar las filas seleccionadas
    const [rowSelection, setRowSelection] = useState({});

    const tableState = useDataTable();

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
            //Props para manejar la selección de filas
            enableRowSelection
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
        >
            {
                rowSelection && Object.keys(rowSelection).length > 0 &&
                // Usa DataTableToolbar para mostrar acciones relacionadas con las filas seleccionadas o controles adicionales
                <DataTableToolbar>
                    <Button variant="outline" onClick={() => {
                        // Obtener los IDs de las filas seleccionadas
                        const selectedIds = Object.keys(rowSelection).map(index => data[parseInt(index)].id);
                        alert(`IDs seleccionados: ${selectedIds.join(", ")}`);
                    }}>
                        Mostrar IDs seleccionados
                    </Button>
                </DataTableToolbar>
            }
            <DataTableContent />
            <DataTablePagination />
        </DataTable>
    );
}