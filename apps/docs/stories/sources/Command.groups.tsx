import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut} from "@traxion-global/design-system/react";
import React from "react";

export default function CommandGroups() {
    return <Command className={"w-96"}>
        <CommandInput placeholder="Buscar acciones…"/>
        <CommandEmpty>Sin resultados.</CommandEmpty>
        <CommandList>
            <CommandGroup heading="Órdenes">
                <CommandItem>
                    Crear orden <CommandShortcut>⌘ N</CommandShortcut>
                </CommandItem>
                <CommandItem>
                    Importar órdenes <CommandShortcut>⌘ I</CommandShortcut>
                </CommandItem>
            </CommandGroup>
            <CommandSeparator/>
            <CommandGroup heading="Rutas">
                <CommandItem>
                    Planeador de rutas <CommandShortcut>Ctrl+R</CommandShortcut>
                </CommandItem>
                <CommandItem>
                    Optimizar última milla <CommandShortcut>Ctrl+ M</CommandShortcut>
                </CommandItem>
            </CommandGroup>
        </CommandList>
    </Command>
}