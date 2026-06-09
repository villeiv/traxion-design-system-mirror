import {
    DataTable,
    DataTableContent,
    DataTablePagination,
    DataTableEditBar,
    ColumnDef,
    CellsEditedPayload,
    useDataTable,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@traxion-global/design-system/react";
import { useEffect, useState } from "react";

interface User {
    id: number;
    firstName: string;
    email: string;
    role: string;
}

interface FetchResponse {
    users: User[];
    total: number;
}

// Validación de la página: devuelve los errores keyed por rowId / columnId.
// El consumidor decide la validación; el DataTable solo pinta lo que reciba en cellErrors.
function validate(rows: User[]): Record<string, Record<string, string>> {
    const errors: Record<string, Record<string, string>> = {};
    for (const u of rows) {
        const rowErrors: Record<string, string> = {};
        if (!u.email.includes("@")) rowErrors.email = "Correo inválido (falta @)";
        if (!u.firstName.trim()) rowErrors.firstName = "El nombre es obligatorio";
        if (Object.keys(rowErrors).length > 0) errors[String(u.id)] = rowErrors;
    }
    return errors;
}

export default function DataTableEditable() {
    const [data, setData] = useState<User[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [cellErrors, setCellErrors] = useState<Record<string, Record<string, string>>>({});

    const tableState = useDataTable<User>({ pageSize: 5 });

    useEffect(() => {
        const { pageIndex, pageSize } = tableState.pagination;
        fetch(
            `https://dummyjson.com/users?limit=${pageSize}&skip=${pageIndex * pageSize}&select=firstName,email,role`
        )
            .then((res) => res.json())
            .then((result: FetchResponse) => {
                setData(result.users);
                setPageCount(Math.ceil(result.total / pageSize));
            });
    }, [tableState.pagination.pageIndex, tableState.pagination.pageSize]);

    // enableEditing habilita la edición por columna, al mismo nivel que enableSorting / enableHiding.
    // La edición escribe en el accessorKey de la columna, así que toda columna editable debe tener accessorKey.
    const columns: ColumnDef<User>[] = [
        { header: "ID", accessorKey: "id", size: 60 },
        // Editor de texto por defecto: se edita en la propia celda (sin chrome de formulario).
        { header: "Nombre", accessorKey: "firstName", enableEditing: true },
        { header: "Correo electrónico", accessorKey: "email", enableEditing: true },
        // Editor custom con editCell. El consumidor estiliza el control para que se mezcle
        // con la celda (receta inline en el className del SelectTrigger). stage(v) deja la
        // celda pendiente; cancel() al cerrar sin elegir.
        {
            header: "Rol",
            accessorKey: "role",
            enableEditing: true,
            editCell: ({ value, stage, cancel }) => (
                <Select
                    defaultOpen
                    value={value as string}
                    onValueChange={(v) => stage(v)}
                    onOpenChange={(open) => {
                        if (!open) cancel();
                    }}
                >
                    <SelectTrigger className="h-auto border-0 px-0 py-0 shadow-none focus:ring-0">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">admin</SelectItem>
                        <SelectItem value="moderator">moderator</SelectItem>
                        <SelectItem value="user">user</SelectItem>
                    </SelectContent>
                </Select>
            ),
        },
    ];

    // Se llama SOLO al pulsar "Guardar cambios" en DataTableEditBar.
    const handleCellsEdited = async ({ data: nextData, changes }: CellsEditedPayload<User>) => {
        const errors = validate(nextData);
        if (Object.keys(errors).length > 0) {
            // Validación falló: marcamos las celdas inválidas y rechazamos para conservar
            // los cambios pendientes (guardado transaccional).
            setCellErrors(errors);
            return Promise.reject(new Error("Hay celdas inválidas"));
        }
        // Actualización optimista del estado local. En una app real, aquí persistirías
        // `changes` a tu API (un PATCH solo de lo que cambió).
        setData(nextData);
        setCellErrors({});
    };

    return (
        <DataTable
            className="w-[760px]"
            data={data}
            columns={columns}
            pageCount={pageCount}
            {...tableState}
            // Activa la edición de celdas. Requiere rowSelectionKey (identidad de fila).
            enableCellEditing
            rowSelectionKey={(row) => String(row.id)}
            // Se dispara al guardar: recibe la página con los cambios aplicados y el diff.
            onCellsEdited={handleCellsEdited}
            // Al descartar, limpiamos los errores que hubiéramos marcado en un guardado fallido.
            onDiscardEdits={() => setCellErrors({})}
            // Marca celdas inválidas desde fuera (color destructive + tooltip).
            cellErrors={cellErrors}
        >
            <DataTableContent />
            <DataTablePagination />
            {/* Barra inferior con "N cambios realizados" + Guardar / Descartar. Aparece al haber pendientes. */}
            <DataTableEditBar />
        </DataTable>
    );
}
