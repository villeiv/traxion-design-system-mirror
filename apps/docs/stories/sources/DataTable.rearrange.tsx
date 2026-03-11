import { DataTable, DataTableContent, DataTablePagination, ColumnDef, useDataTable, DataTableColumnHeader } from "@traxion-global/design-system/react";
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
    { header: "ID", accessorKey: "id", size: 50 },
    {
        //El id se mostrará al usuario como "Nombre" mientras se arrastra la columna
        id: "Nombre",
        accessorKey: "firstName",
        //Todas las columnas que se puedan ordenar deben usar el componente DataTableColumnHeader en su encabezado para mostrar los indicadores de ordenamiento 
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
        enableSorting: false,
    },
    {
        id: "Correo electrónico",
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Correo electrónico" />,
        enableSorting: false,
    }
];

export default function DataTableRearrangeColumns() {
    const [data, setData] = useState<User[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);

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
            //Habilita el reordenamiento de columnas arrastrando y soltando los encabezados
            enableColumnReordering
        >
            <DataTableContent />
            <DataTablePagination />
        </DataTable>
    );
}