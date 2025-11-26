import {useState} from "react";
import {Button, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@traxion-global/design-system";

export default function SheetControlled() {
    const [open, setOpen] = useState(false);

    return <div className={"flex flex-col gap-2 items-center"}>
        <Button onClick={() => setOpen(true)} className="btn mb-4" variant={"secondary"}>Abrir Sheet desde fuera</Button>
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
                <Button className="btn">Abrir desde SheetTrigger</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Título</SheetTitle>
                    <SheetDescription>Descripción</SheetDescription>
                    <div>
                        Contenido principal del Sheet.
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    </div>
}