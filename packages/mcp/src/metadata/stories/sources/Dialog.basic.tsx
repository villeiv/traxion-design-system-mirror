import {
    Button, Label, Input,
    Select, SelectValue, SelectContent, SelectItem, SelectTrigger,
    Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@traxion-global/design-system/react";

export default function DialogBasic() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Abrir diálogo</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Título del diálogo</DialogTitle>
                    <DialogDescription>Puedes colocar aquí cualquier contenido: texto, formularios, listas, etc.</DialogDescription>
                </DialogHeader>

                {/* Formulario dentro del diálogo */}
                <form className="space-y-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" placeholder="Juan Pérez" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input id="email" type="email" placeholder="juan.perez@empresa.com" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="role">Rol</Label>
                        <Select>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Administrador</SelectItem>
                                <SelectItem value="user">Usuario</SelectItem>
                                <SelectItem value="viewer">Solo lectura</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cerrar</Button>
                    </DialogClose>
                    <Button>Acción primaria</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
