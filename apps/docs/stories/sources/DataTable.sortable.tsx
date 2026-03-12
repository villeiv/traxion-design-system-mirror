import { DataTable, DataTableContent, DataTablePagination, ColumnDef, useDataTable } from "@traxion-global/design-system/react";
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

const columns:ColumnDef<User>[] = [
    { header: "ID", accessorKey: "id", size: 50 },
    { header: "Nombre", accessorKey: "firstName" },
    //Para hacer una columna ordenable, añade enableSorting: true — la tabla renderiza automáticamente el botón de ordenamiento
    { header: "Correo electrónico", accessorKey: "email", enableSorting: true },
];

export default function DataTableSortable() {
    const [data, setData] = useState<User[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const tableState = useDataTable();

    useEffect(() => {
        const { pageIndex, pageSize } = tableState.pagination;
        //Obtén los parámetros de ordenamiento del estado de la tabla y conviértelos en cadenas para pasarlos a la API
        const sortBy = tableState.sorting.map(s => s.id).join(",");
        const order = tableState.sorting.map(s => s.desc ? "desc" : "asc").join(",");

        fetch(`https://dummyjson.com/users?limit=${pageSize}&skip=${pageIndex * pageSize}&sortBy=${sortBy}&order=${order}`)
            .then((res) => res.json())
            .then((result: FetchResponse) => {
                setData(result.users);
                setPageCount(Math.ceil(result.total / pageSize));
            });
    }, [tableState.pagination.pageIndex, tableState.pagination.pageSize, tableState.sorting]);

    return (
        <DataTable
            className="w-[700px]" 
            data={data} 
            columns={columns} 
            pageCount={pageCount} 
            {...tableState}
        >
            <DataTableContent />
            <DataTablePagination />
        </DataTable>
    );
}