import { Button, Label, Input, Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger} from "@traxion-global/design-system";

export default function SheetForm() {
    return <Sheet>
        <SheetTrigger asChild>
            <Button>Editar perfil</Button>
        </SheetTrigger>
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Editar perfil</SheetTitle>
                <SheetDescription>Actualiza tu información personal.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" value="Juan Pérez" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email">Correo</Label>
                    <Input id="email" value="juan@example.com" className="col-span-3" />
                </div>
            </div>
            <SheetFooter>
                <Button type="submit">Guardar cambios</Button>
            </SheetFooter>
        </SheetContent>
    </Sheet>
}