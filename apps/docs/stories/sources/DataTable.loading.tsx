import { DataTable, DataTableContent, DataTablePagination, ColumnDef, useDataTable } from "@traxion-global/design-system/react";
import { useState } from "react";

interface User {
    id: number;
    firstName: string;
    email: string;
}

const columns: ColumnDef<User>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Nombre", accessorKey: "firstName" },
    { header: "Correo electrónico", accessorKey: "email" },
];

export default function DataTableBasic() {
    const [data, setData] = useState<User[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const tableState = useDataTable();

    return (
        <DataTable
            className="w-[700px]"
            data={data}
            columns={columns}
            pageCount={pageCount}
            {...tableState}
            // Para mostrar el estado de carga, se puede usar la propiedad isLoading
            isLoading={true}
        >
            <DataTableContent />
            {
                // Solo mostrar la paginación si no estamos en estado de carga
                !isLoading && <DataTablePagination />
            }

        </DataTable>
    );
}