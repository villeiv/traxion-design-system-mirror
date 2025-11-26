import React from "react";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@traxion-global/design-system";

export default function CommandBasic() {
    return <Command className={"border w-96 rounded-lg"}>
        <CommandInput placeholder="Buscar operaciones…"/>
        <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandItem>Rastreo de envío</CommandItem>
            <CommandItem>Crear guía</CommandItem>
            <CommandItem>Programar recolección</CommandItem>
            <CommandItem>Cotizar carga</CommandItem>
        </CommandList>
    </Command>
}