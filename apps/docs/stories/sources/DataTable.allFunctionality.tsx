import {
    DataTable,
    DataTableContent,
    DataTablePagination,
    DataTableSelectionBar,
    DataTableEditBar,
    DataTableToolbar,
    DataTableViewOptions,
    ColumnDef,
    CellsEditedPayload,
    useDataTable,
    Checkbox,
    Input,
    Button,
    useDebouncedCallback,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    Badge,
    Calendar,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@traxion-global/design-system/react";
import { useEffect, useState } from "react";
import { User, Pencil, Trash, X, MoreVertical, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface UserData {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    birthDate: string;
    company: {
        name: string;
        department: string;
    };
    address: {
        city: string;
        state: string;
        country: string;
    };
}

interface FetchResponse {
    users: UserData[];
    total: number;
}

const columns: ColumnDef<UserData>[] = [
    {
        id: "select",
        // Encabezado personalizado: cuando header es una función, DataTable la renderiza tal cual —
        // sin agregar botón de ordenamiento ni manejador de arrastre.
        // Úsalo cuando necesitas un control interactivo en el encabezado, como este checkbox de selección masiva.
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Seleccionar todo"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Seleccionar fila"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
    },
    {
        id: "ID",
        accessorKey: "id",
        header: "ID",
        enableHiding: false,
        size: 50,
    },
    {
        id: "firstName",
        accessorKey: "firstName",
        header: "Usuario",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>
                        {user.firstName} {user.lastName}
                    </span>
                </div>
            );
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        id: "email",
        accessorKey: "email",
        header: "Email",
        enableSorting: true,
        enableHiding: true,
        // Celda editable con el editor de texto por defecto (se edita en la propia celda).
        enableEditing: true,
    },
    {
        id: "role",
        accessorKey: "role",
        header: "Rol",
        enableSorting: true,
        cell: ({ row }) => {
            const role = row.original.role;
            const roleVariants: Record<string, "primary" | "green" | "blue" | "violet" | "orange"> = {
                admin: "primary",
                moderator: "blue",
                user: "green",
            };
            const variant = roleVariants[role.toLowerCase()] || "gray";
            return (
                <Badge variant={variant}>
                    {role}
                </Badge>
            );
        },
        // Celda editable con editor custom: Select estilizado para mezclarse con la celda.
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
        size:80,
        enableHiding: true,
    },
    {
        id: "Empresa",
        accessorKey: "company.name",
        header: "Empresa",
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: "Ubicación",
        accessorKey: "address.city",
        header: "Ubicación",
        cell: ({ row }) => {
            const address = row.original.address;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{address.city}</span>
                    <span className="text-xs text-muted-foreground">
                        {address.state}, {address.country}
                    </span>
                </div>
            );
        },
        enableHiding: true,
        enableSorting: false,
    },
    {
        id: "birthDate",
        accessorKey: "birthDate",
        header: "Nacimiento",
        cell: ({ row }) => {
            //use fns
            const date = row.original.birthDate;
            if (!date) return null;
            return format(new Date(date), "dd/MM/yyyy");
        },
        // Celda editable con editor custom de fecha: Popover + Calendar, con control
        // total del commit vía stage/cancel. Se abre al entrar en edición (defaultOpen);
        // al elegir una fecha hace stage(...), y si se cierra sin elegir hace cancel().
        enableEditing: true,
        editCell: ({ value, stage, cancel }) => (
            <Popover defaultOpen onOpenChange={(open) => { if (!open) cancel(); }}>
                <PopoverTrigger asChild>
                    <button type="button" className="w-full text-left text-sm outline-none">
                        {value ? format(new Date(value as string), "dd/MM/yyyy") : "Seleccionar"}
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        localeCode="es"
                        selected={value ? new Date(value as string) : undefined}
                        onSelect={(date) => {
                            if (date) stage(format(date, "yyyy-M-d"));
                        }}
                    />
                </PopoverContent>
            </Popover>
        ),
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: "actions",
        // Encabezado personalizado: función que devuelve JSX directamente.
        // Aquí se usa para alinear el texto a la derecha, coincidiendo con los botones de la celda.
        // Cualquier JSX válido puede usarse — íconos, badges, tooltips, etc.
        header: () => <div className="text-right">Acciones</div>,
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => alert(`Editar usuario ${user.id}`)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="destructiveWarm"
                        size="icon"
                        onClick={() => alert(`Eliminar usuario ${user.id}`)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => alert(`Ver detalles de ${user.firstName} ${user.lastName}`)}>
                                
                                Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => alert(`Restablecer contraseña para ${user.email}`)}>
                                
                                Restablecer contraseña
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => alert(`Exportar datos de ${user.firstName} ${user.lastName}`)}>
                                
                                Exportar datos
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
        size: 150,
    },
];

export default function DataTableAllFunctionality() {
    const [data, setData] = useState<UserData[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [idSearch, setIdSearch] = useState<string>("");
    const [cellErrors, setCellErrors] = useState<Record<string, Record<string, string>>>({});
    const tableState = useDataTable<UserData>({ pageSize: 7 });

    // Data fetching effect
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const { pageIndex, pageSize } = tableState.pagination;
            const skip = pageIndex * pageSize;

            const idFilterValue = tableState.columnFilters.find(f => f.id === "ID")?.value as string | undefined;
            const roleFilterValue = tableState.columnFilters.find(f => f.id === "role")?.value as string | undefined;
            const birthDateFilterValue = tableState.columnFilters.find(f => f.id === "birthDate")?.value as string | undefined;

            // Build URL with filters
            let url: string;

            if (idFilterValue) {
                url = `https://dummyjson.com/users/filter?limit=${pageSize}&skip=${skip}&key=id&value=${idFilterValue}`;
            } else if (roleFilterValue) {
                url = `https://dummyjson.com/users/filter?limit=${pageSize}&skip=${skip}&key=role&value=${roleFilterValue}`;
            } else if (birthDateFilterValue) {
                url = `https://dummyjson.com/users/filter?limit=${pageSize}&skip=${skip}&key=birthDate&value=${birthDateFilterValue}`;
            } else {
                url = `https://dummyjson.com/users?limit=${pageSize}&skip=${skip}`;
            }

            // Add sorting parameters if present
            if (tableState.sorting.length > 0) {
                const sort = tableState.sorting[0]!;
                url += `&sortBy=${sort.id}&order=${sort.desc ? "desc" : "asc"}`;
            }

            try {
                const response = await fetch(url);
                const result: FetchResponse = await response.json();

                setData(result.users);
                setPageCount(Math.ceil(result.total / pageSize));
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([]);
                setPageCount(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [
        tableState.pagination.pageIndex,
        tableState.pagination.pageSize,
        tableState.sorting,
        tableState.columnFilters,
    ]);

    // Reset pagination when filters change
    useEffect(() => {
        tableState.setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [tableState.columnFilters]);

    // Debounced filter function
    const debouncedSetIdFilter = useDebouncedCallback((value: string) => {
        tableState.setColumnFilters((prev) => {
            const withoutId = prev.filter(f => f.id !== "ID");
            if (value) {
                return [...withoutId, { id: "ID", value }];
            }
            return withoutId;
        });
    }, 300);

    // Edición: se llama al pulsar "Guardar cambios" en DataTableEditBar.
    const handleCellsEdited = async ({ data: nextData }: CellsEditedPayload<UserData>) => {
        // Validación (consumidor): el correo debe contener "@".
        const errors: Record<string, Record<string, string>> = {};
        for (const u of nextData) {
            if (!u.email.includes("@")) {
                errors[String(u.id)] = { email: "Correo inválido (falta @)" };
            }
        }
        if (Object.keys(errors).length > 0) {
            setCellErrors(errors);
            return Promise.reject(new Error("Hay celdas inválidas"));
        }
        // Actualización optimista del estado local (en producción persistirías a tu API).
        setData(nextData);
        setCellErrors({});
    };

    return (
        <DataTable
            data={data}
            columns={columns}
            pageCount={pageCount}
            isLoading={isLoading}
            enableRowSelection
            rowSelectionKey={(row) => String(row.id)}
            enableColumnReordering
            enableCellEditing
            onCellsEdited={handleCellsEdited}
            onDiscardEdits={() => setCellErrors({})}
            cellErrors={cellErrors}
            {...tableState}
        >
            <DataTableToolbar>
                <Input
                    placeholder="Buscar por ID"
                    value={idSearch}
                    onChange={(event) => {
                        setIdSearch(event.target.value);
                        debouncedSetIdFilter(event.target.value);
                    }}
                    className="h-8 w-[200px]"
                />

                {/* Role filter */}
                <Select
                    value={tableState.columnFilters.find(f => f.id === "role")?.value as string ?? "all"}
                    onValueChange={(value) => {
                        const newRole = value === "all" ? "" : value;
                        tableState.setColumnFilters((prev) => {
                            const without = prev.filter(f => f.id !== "role");
                            return newRole ? [...without, { id: "role", value: newRole }] : without;
                        });
                    }}
                >
                    <SelectTrigger className="h-8 w-[160px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderador</SelectItem>
                        <SelectItem value="user">Usuario</SelectItem>
                    </SelectContent>
                </Select>

                {/* Date filter — use Calendar inside Popover */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="h-8 px-2 lg:px-3">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {
                                tableState.columnFilters.find(f => f.id === "birthDate") ?
                                format(new Date(tableState.columnFilters.find(f => f.id === "birthDate")!.value as string), "dd/MM/yyyy")
                                : "Fecha de nacimiento"
                            }
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            localeCode="es"
                            onSelect={(date) => {
                                console.log("Selected date:", date, date?.toISOString());
                                tableState.setColumnFilters((prev) => {
                                    const without = prev.filter(f => f.id !== "birthDate");
                                    return date ? [...without, { id: "birthDate", value: format(date, "yyyy-M-d") }] : without;
                                });
                            }}
                        />
                    </PopoverContent>
                </Popover>

                {tableState.columnFilters.length > 0 && (
                    <Button
                        variant="outline"
                        onClick={() => {
                            tableState.setColumnFilters([]);
                            setIdSearch("");
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Limpiar filtros
                    </Button>
                )}

                <DataTableViewOptions />
            </DataTableToolbar>

            <DataTableContent />
            {!isLoading && <DataTablePagination />}

            <DataTableSelectionBar>
                <Button variant="destructive" size="sm" onClick={() => {
                    const selected = Object.values(tableState.selectedRows);
                    alert(`Eliminar usuarios: ${selected.map(u => `${u.firstName} (${u.id})`).join(", ")}`);
                }}>
                    <Trash className="mr-1 h-4 w-4" />
                    Eliminar
                </Button>
            </DataTableSelectionBar>

            {/* Barra de edición: aparece al haber celdas con cambios sin guardar. */}
            <DataTableEditBar />
        </DataTable>
    );
}
