import {
    DataTable, DataTableContent, DataTablePagination, DataTableToolbar,
    ColumnDef, useDataTable, Input, useDebouncedCallback, Button
} from "@traxion-global/design-system/react";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

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
    { header: "Correo electrónico", accessorKey: "email" }
];

export default function DataTableFiltering() {
    const [data, setData] = useState<User[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    // Estado local para el valor del campo de búsqueda, que se actualiza instantáneamente
    const [idSearch, setIdSearch] = useState<string>("");

    const tableState = useDataTable({ pageSize: 10 });

    useEffect(() => {
        const { pageIndex, pageSize } = tableState.pagination;
        // Extraemos los filtros activos de tableState.columnFilters y los convertimos en un formato que nuestro backend pueda entender.
        // En este caso en formato key="param" value="value", pero esto dependerá de cómo tu backend espera recibir los filtros
        const filters = tableState.columnFilters.map(filter => `key=${filter.id}&value=${filter.value}`).join('&');

        // Construimos la URL de la API incluyendo los parámetros de paginación y los filtros activos
        let serviceURL;

        if (filters) {
            serviceURL = `https://dummyjson.com/users/filter?limit=${pageSize}&skip=${pageIndex * pageSize}&${filters}`;
        } else {
            serviceURL = `https://dummyjson.com/users?limit=${pageSize}&skip=${pageIndex * pageSize}`;
        }

        fetch(serviceURL)
            .then((res) => res.json())
            .then((result: FetchResponse) => {
                setData(result.users);
                setPageCount(Math.ceil(result.total / pageSize));
            });
        // Añadimos tableState.columnFilters a las dependencias para que se vuelva a ejecutar el efecto cada vez que cambien los filtros
    }, [tableState.pagination.pageIndex, tableState.pagination.pageSize, tableState.columnFilters]);

    // Cuando los filtros cambian, reseteamos el índice de página a 0 para mostrar los resultados filtrados desde la primera página
    useEffect(() => {
        tableState.setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [tableState.columnFilters])

    // Puedes utilizar el hook useDebouncedCallback para crear una función de actualización de filtro que se ejecute después de un retraso,
    // o usar una implementación personalizada de debounce
    const debouncedSetIdFilter = useDebouncedCallback((value: string) => {
        tableState.setColumnFilters((prev) => {
            const withoutId = prev.filter(f => f.id !== "id")
            if (value) {
                return [...withoutId, { id: "id", value }]
            }
            return withoutId
        })
    }, 300)

    return (
        <DataTable data={data} columns={columns} pageCount={pageCount} {...tableState}>
            {/* Recuerda usar <DataTableToolbar> para agregar herramientas de filtrado y controles */}
            <DataTableToolbar>
                <Input
                    placeholder="Buscar por ID"
                    value={idSearch}
                    onChange={(event) => {
                        const value = event.target.value
                        // Actualiza el estado local inmediatamente para reflejar el valor del campo de búsqueda
                        setIdSearch(value)
                        // Actualiza el filtro de la tabla de forma debounced para evitar llamadas excesivas al filtrar mientras el usuario escribe
                        debouncedSetIdFilter(value)
                    }}
                    className="h-8 w-[200px]"
                />
                {
                    // Cuando hay filtros activos, mostramos un botón para limpiar todos los filtros
                    tableState.columnFilters.length > 0 && (
                        <Button
                            size={"lg"}
                            variant="outline" 
                            onClick={() => {
                                tableState.setColumnFilters([]);
                                setIdSearch("");    
                            }}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Limpiar filtros
                        </Button>
                    )
                }
            </DataTableToolbar>
            <DataTableContent />
            <DataTablePagination />
        </DataTable>
    );
}