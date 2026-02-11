import React from "react";
import {Plus} from "lucide-react";
import {CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList, Button, toast} from "@traxion-global/design-system/react";

export default function CommandInDialog() {
    const [open, setOpen] = React.useState(false);

    function addClient(clientName){
        toast.success("Cliente añadido: " + clientName);
        setOpen(false);
    }

    return (
        <div>
            <Button onClick={setOpen}><Plus/>Añadir cliente</Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Buscar cliente"/>
                <CommandList>
                    <CommandEmpty>Sin resultados.</CommandEmpty>
                    <CommandItem onSelect={_=>addClient("Medistik")}>Medistik</CommandItem>
                    <CommandItem onSelect={_=>addClient("FAST")}>FAST</CommandItem>
                    <CommandItem onSelect={_=>addClient("Roche Instruments S.A.")}>Roche Instruments S.A.</CommandItem>
                    <CommandItem onSelect={_=>addClient("RedNova Systems")}>RedNova Systems</CommandItem>
                </CommandList>
            </CommandDialog>
        </div>
    );
}