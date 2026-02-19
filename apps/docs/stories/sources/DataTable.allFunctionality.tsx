import {
    DataTable,
    DataTableContent,
    DataTablePagination,
    DataTableToolbar,
    DataTableViewOptions,
    DataTableColumnHeader,
    ColumnDef,
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
    Badge
} from "@traxion-global/design-system/react";
import { useEffect, useState } from "react";
import { User, Pencil, Trash, X, MoreVertical, Eye, Key, Download } from "lucide-react";

interface UserData {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
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
        enableSorting: false,
        enableHiding: false,
        size: 50,
    },
    {
        id: "Usuario",
        accessorKey: "firstName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Usuario" />
        ),
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
        enableHiding: true,
    },
    {
        id: "Email",
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        enableHiding: true,
    },
    {
        id: "Rol",
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Rol" />
        ),
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
        size:80,
        enableHiding: true,
    },
    {
        id: "Empresa",
        accessorKey: "company.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Empresa" />
        ),
        enableHiding: true,
        enableSorting: false,
    },
    {
        id: "Ubicación",
        accessorKey: "address.city",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ubicación" />
        ),
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
        id: "actions",
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
                        variant="destructive"
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
    const [rowSelection, setRowSelection] = useState({});
    const [idSearch, setIdSearch] = useState<string>("");
    const tableState = useDataTable({ pageSize: 10 });

    // Data fetching effect
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const { pageIndex, pageSize } = tableState.pagination;
            const skip = pageIndex * pageSize;

            // Build URL with filters
            let url: string;
            const idFilter = tableState.columnFilters.find(f => f.id === "ID");

            if (idFilter && idFilter.value) {
                url = `https://dummyjson.com/users/filter?limit=${pageSize}&skip=${skip}&key=id&value=${idFilter.value}`;
            } else {
                url = `https://dummyjson.com/users?limit=${pageSize}&skip=${skip}`;
            }

            // Add sorting parameters if present
            if (tableState.sorting.length > 0) {
                const sort = tableState.sorting[0];
                // Map column IDs to API field names
                const sortField = sort.id === "Usuario" ? "firstName" :
                                  sort.id === "Email" ? "email" :
                                  sort.id === "Rol" ? "role" :
                                  sort.id;
                url += `&sortBy=${sortField}&order=${sort.desc ? "desc" : "asc"}`;
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

    return (
        <DataTable
            data={data}
            columns={columns}
            pageCount={pageCount}
            isLoading={isLoading}
            enableRowSelection
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            enableColumnReordering
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

                {Object.keys(rowSelection).length > 0 && (
                    <Button
                        variant="destructive"
                        onClick={() => {
                            const selectedUsers = data
                                .filter((_, index) => rowSelection[index])
                                .map(user => `${user.firstName} ${user.lastName}`)
                                .join(", ");
                            alert(`Eliminar usuarios: ${selectedUsers}`);
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Eliminar usuarios ({Object.keys(rowSelection).length})
                    </Button>
                )}

                <DataTableViewOptions />
            </DataTableToolbar>

            <DataTableContent />
            {!isLoading && <DataTablePagination />}
        </DataTable>
    );
}
