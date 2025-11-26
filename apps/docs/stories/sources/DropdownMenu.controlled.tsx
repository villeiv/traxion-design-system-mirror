import {useState} from "react";
import {Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@traxion-global/design-system";

export default function DropdownMenuControlled() {
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    {open ? "Cerrar menú" : "Abrir menú"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Gestión de ruta escolar</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Ver rutas asignadas</DropdownMenuItem>
                <DropdownMenuItem>Consultar horarios</DropdownMenuItem>
                <DropdownMenuItem>Reportar retraso</DropdownMenuItem>
                <DropdownMenuItem>Solicitar cambio de parada</DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}