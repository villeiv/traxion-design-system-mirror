import {Command, CommandEmpty, CommandInput, CommandItem, CommandList, toast} from "@traxion-global/design-system";
import React from "react";

export default function CommandKeywords() {
    return <Command className={"w-96"}>
        <CommandInput placeholder="Prueba: costeo, precio, tracking…"/>
        <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandItem
                keywords={["quote", "price", "costeo", "Ir a Cotizar carga"]}
                onSelect={() => toast.success("Ir a Cotizar carga")}
            >
                Cotizar carga
            </CommandItem>
            <CommandItem
                keywords={["tracking", "Abrir Rastreo de envío"]}
                onSelect={() => toast.success("Abrir Rastreo de envío")}
            >
                Rastreo de envío
            </CommandItem>
        </CommandList>
    </Command>
}