import { useState } from "react"
import { Trash } from "lucide-react"
import { Badge, Button, Table,TableHeader,TableRow,TableHead,TableBody,TableCell, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, toast } from "@traxion-global/design-system/react";

export default function UsersTableWithDeleteDialog() {
    const [open, setOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    const users = [
        { id: "u1", name: "Raquel", email: "raquel@example.com", role: "admin" },
        { id: "u2", name: "Jorge", email: "jorge@example.com", role: "user" },
        { id: "u3", name: "Lucía", email: "lucia@example.com", role: "user" },
    ]

    const handleOpen = (user) => {
        setSelectedUser(user)
        setOpen(true)
    }

    const handleClose = () => {
        toast.info("Acción cancelada");
        setSelectedUser(null)
        setOpen(false)
    }

    const handleConfirmDelete = () => {
        toast.success("Usuario eliminado: " + selectedUser.name);
        setOpen(false)
    }

    return (
        <div>
            {/* AlertDialog */}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {selectedUser ? `¿Eliminar a ${selectedUser.name}?` : "¿Eliminar usuario?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará el acceso del usuario y sus datos asociados:
                            {selectedUser && (
                                <span className="mt-3 space-y-1 text-sm">
                                    <span className="font-medium"> Email:</span> {selectedUser.email}
                                    <span className="font-medium"> Rol:</span> {selectedUser.role}
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={handleClose}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>
                            <Trash className="mr-2 h-4 w-4" /> Eliminar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* Tabla de usuarios */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((u) => (
                        <TableRow key={u.id}>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell><Badge variant={"gray"}>{u.role}</Badge></TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label={`Eliminar ${u.name}`}
                                    onClick={() => handleOpen(u)}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
