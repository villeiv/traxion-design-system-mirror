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

//Define las columnas de la tabla, especificando el encabezado y la clave de acceso para cada columna. Esta es la configuración más básica.
//accesorKey se usa para acceder a los datos correspondientes en cada fila
const columns:ColumnDef<User>[] = [
    //Puedes especificar un tamaño fijo para una columna usando la propiedad size, o dejar que se ajuste automáticamente al contenido
    { header: "ID", accessorKey: "id", size: 50 },
    { header: "Nombre", accessorKey: "firstName" },
    { header: "Correo electrónico", accessorKey: "email" },
];

export default function DataTableBasic() {
    const [data, setData] = useState<User[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);

    //Inicializa el estado de la tabla con useDataTable, useDataTable se encarga de manejar la paginación, ordenamiento y otras funcionalidades de la tabla. Al usar este hook, obtenemos acceso al estado actual de la tabla, como el índice de página y el tamaño de página.
    const tableState = useDataTable();

    //UseEffect se vuelve a ejecutar cada vez que cambian pageIndex o pageSize, lo que ocurre al cambiar de página
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
        // Pasa el estado de la tabla y los datos al componente DataTable
        <DataTable 
           data={data} 
           columns={columns} 
           pageCount={pageCount} 
           {...tableState}
           // Puedes pasar estilos para personalizar la tabla
           className="w-[700px]"
        >
            <DataTableContent />
            <DataTablePagination />
        </DataTable>
    );
}