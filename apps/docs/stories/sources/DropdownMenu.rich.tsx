import {useState} from "react";
import {Button, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuSub, DropdownMenu,
    DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem,
    DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger
} from "@traxion-global/design-system";
import {ChevronDown, Ellipsis, Mail, Smartphone} from "lucide-react";

export default function DropdownMenuRich() {
    const [showShortcuts, setShowShortcuts] = useState(true);
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [smsNotifs, setSmsNotifs] = useState(false);
    const [theme, setTheme] = useState("system");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Abrir <ChevronDown/></Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>

                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        Perfil
                        <DropdownMenuShortcut>Ctrl+P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Facturación
                        <DropdownMenuShortcut>Ctrl+B</DropdownMenuShortcut>
                    </DropdownMenuItem>

                    <DropdownMenuCheckboxItem
                        checked={showShortcuts}
                        onCheckedChange={setShowShortcuts}
                    >
                        Mostrar atajos
                        <DropdownMenuShortcut>Ctrl+K</DropdownMenuShortcut>
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuItem>
                        Configuración
                        <DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator/>

                <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuCheckboxItem
                        checked={emailNotifs}
                        onCheckedChange={setEmailNotifs}
                    >
                        Correo electrónico
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={smsNotifs}
                        onCheckedChange={setSmsNotifs}
                    >
                        SMS
                    </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator/>

                <DropdownMenuLabel>Tema</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                    <DropdownMenuRadioItem value="system">Sistema</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="light">Claro</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">Oscuro</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator/>

                <DropdownMenuGroup>
                    <DropdownMenuItem>Equipo</DropdownMenuItem>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Invitar usuarios</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem><Mail/>Correo electrónico</DropdownMenuItem>
                                <DropdownMenuItem><Smartphone/>Mensaje</DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem><Ellipsis/>Más opciones...</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuItem>
                        Nuevo equipo
                        <DropdownMenuShortcut>Ctrl+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator/>

                <DropdownMenuItem>GitHub</DropdownMenuItem>
                <DropdownMenuItem>Soporte</DropdownMenuItem>
                <DropdownMenuItem disabled>API</DropdownMenuItem>

                <DropdownMenuSeparator/>

                <DropdownMenuItem>
                    Cerrar sesión
                    <DropdownMenuShortcut>Ctrl+Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}