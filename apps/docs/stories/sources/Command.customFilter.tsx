import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@traxion-global/design-system/react";
import React from "react";

export default function CommandCustomFilter() {

    const customFilter = (value, search, keywords) => {
        //Este filtro personalizado da más relevancia a los items que empiezan por el texto buscado
        const v = String(value).toLowerCase();
        const s = String(search).toLowerCase();
        if (!s) return 1;
        if (v.startsWith(s)) return 2;
        if (v.includes(s)) return 1;
        if (Array.isArray(keywords) && keywords.some(k => String(k).toLowerCase().includes(s))) return 1;
        return 0;
    };

    return (
        <Command filter={customFilter}>
            <CommandInput placeholder="Prueba con: adu…"/>
            <CommandList>
                <CommandEmpty>Sin resultados.</CommandEmpty>
                <CommandItem keywords={["customs", "clearance"]}>Aduanas</CommandItem>
                <CommandItem keywords={["insurance"]}>Seguro de carga</CommandItem>
                <CommandItem keywords={["invoice", "billing"]}>Facturación</CommandItem>
            </CommandList>
        </Command>
    );
}