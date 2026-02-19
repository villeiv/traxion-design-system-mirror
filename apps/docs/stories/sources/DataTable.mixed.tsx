import { DataTable, DataTableContent, DataTablePagination, ColumnDef, useDataTable } from "@traxion-global/design-system/react";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    company: {
        title: string;
    };
    email: string;
}

interface FetchResponse {
    users: User[];
    total: number;
}

const columns: ColumnDef<User>[] = [
    { header: "ID", accessorKey: "id", size: 50 },
    { 
        header: "Nombre y cargo", 
        accessorKey: "firstName",
        cell: ({ row }) => (
            <div className="flex gap-2 items-start">
                <User className="h-5 w-5" />
                <div className="flex flex-col">
                    {/* Ejemplo de contenido mixto en una celda: nombre completo y título de la empresa */}
                    {/* puedes acceder a cualquier propiedad del objeto original para mostrar información adicional: */}
                    <span>{row.original.firstName} {row.original.lastName}</span>
                    <span className="text-xs text-muted-foreground">{row.original.company.title}</span>
                </div>
            </div>
        )
    },
    { header: "Correo electrónico", accessorKey: "email" }
];

export default function DataTableMixedCellContent() {
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
        <DataTable data={data} columns={columns} pageCount={pageCount} {...tableState}>
            <DataTableContent />
            <DataTablePagination />
        </DataTable>
    );
}