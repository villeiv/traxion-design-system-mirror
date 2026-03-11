import { Button, DataTable, DataTableContent, DataTablePagination, ColumnDef, useDataTable } from "@traxion-global/design-system/react";
import { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";

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
    { header: "Nombre", accessorKey: "firstName" },
    { header: "Correo electrónico", accessorKey: "email" },
    // Aquí podrías agregar una columna adicional para los botones de acción
    {
        id: "actions",
        header: () => <div className="text-right">Acciones</div>,
        //Tamaño fijo para evitar que la columna se expanda demasiado, y alineación a la derecha para los botones 
        size: 100,
        cell: ({ row }) => (
            <div className="flex gap-2 justify-end">
                {/* Botones de acción para cada fila */}
                <Button size={"icon"} variant={"outline"} onClick={() => alert(`Editar usuario ${row.original.id}`)}><Pencil /></Button>
                <Button size={"icon"} variant={"destructive"} onClick={() => alert(`Eliminar usuario ${row.original.id}`)}><Trash /></Button>
            </div>
        )
    },
];

export default function DataTableActionBtns() {
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
        <DataTable className="w-[700px]" data={data} columns={columns} pageCount={pageCount} {...tableState}>
            <DataTableContent />
            <DataTablePagination />
        </DataTable>
    );
}