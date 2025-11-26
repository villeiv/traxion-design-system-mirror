import React, {useState} from "react";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@traxion-global/design-system";

export default function CommandControlled() {
    const [value, setValue] = useState("2");
    return (
        <div className={"w-96"}>
            <Command value={value} onValueChange={setValue}>
                <CommandInput placeholder={"Buscar"} />
                <CommandEmpty>Sin resultados.</CommandEmpty>
                <CommandList>
                    <CommandItem value={"1"} keywords={["Recepción en almacén"]}>Recepción en almacén</CommandItem>
                    <CommandItem value={"2"} keywords={["Asignar unidad"]}>Asignar unidad</CommandItem>
                    <CommandItem value={"3"} keywords={["Confirmar entrega"]}>Confirmar entrega</CommandItem>
                </CommandList>
            </Command>
            <div className={"mt-4"}>
                Valor actual: <strong>{value || "ninguno"}</strong>
            </div>
        </div>
    );
}