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

const columns: ColumnDef<User>[] = [
    { header: "ID", accessorKey: "id", size: 50 },
    {
        id: "firstName",
        accessorKey: "firstName",
        header: "Nombre"
    },
    {
        id: "email",
        accessorKey: "email",
        header: "Correo electrónico"
    }
];

export default function DataTableRearrangeColumns() {
    const [data, setData] = useState<User[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);

    const tableState = useDataTable<User>();

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