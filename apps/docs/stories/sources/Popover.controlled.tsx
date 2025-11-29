import {Button, PopoverContent,Popover } from "@traxion-global/design-system/react";
import {useState} from "react";
import {PopoverTrigger} from "@radix-ui/react-popover";

export default function PopoverControlled() {

    const [open, setOpen] = useState(false);

    return <div>

        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="secondary">Abrir Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Detalles del contenedor</h4>
                        <p className="text-sm text-muted-foreground">Contenido del popover.</p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    </div>
}