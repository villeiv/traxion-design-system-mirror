import React, {useEffect} from "react";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList, InlineLoader} from "@traxion-global/design-system/react";

export default function CommandLoading() {
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(t);
    }, []);

    return (
        <Command className={"w-96"}>
            <CommandInput placeholder="Origen, destino, incoterm…"/>
            {
                !loading && <CommandEmpty>Sin resultados.</CommandEmpty>
            }
            <CommandList>
                {loading ? (
                    <InlineLoader />
                ) : (
                    <>
                        <CommandItem>Tarifa marítima: MX → CN</CommandItem>
                        <CommandItem>Tarifa aérea: MX → US</CommandItem>
                    </>
                )}
            </CommandList>
        </Command>
    );
}