import { DataTable, DataTableContent, DataTablePagination, ColumnDef, useDataTable, DataTableViewOptions } from "@traxion-global/design-system/react";
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
    //Puedes definir qué columnas no se pueden ocultar añadiendo la propiedad enableHiding: false
    { header: "ID", accessorKey: "id", enableHiding: false, size: 50 },
    //El id se usará para mostrar el nombre de la columna en el control de visibilidad de columnas
    { id:"Nombre", header: "Nombre", accessorKey: "firstName" },
    { id:"Correo electrónico",  header: "Correo electrónico", accessorKey: "email" },
];

export default function DataTableToggle() {
    const [data, setData] = useState<User[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const tableState = useDataTable({ pageSize: 10 });

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
        <DataTable className="w-[700px]" data={data} columns={columns} pageCount={pageCount} {...tableState}>
            {/* Añade el componente DataTableViewOptions para mostrar el control de visibilidad de columnas */}
            <DataTableViewOptions />
            <DataTableContent />
            <DataTablePagination />
        </DataTable>
    );
}