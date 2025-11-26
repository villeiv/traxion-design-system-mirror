import * as React from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
    Button, Label, Input
} from "@traxion-global/design-system";
import {useState} from "react";
import {Copy} from "lucide-react";

export default function DialogControlled() {

    const [open, onOpenChange] = useState(false);

    return (
        <>
            <Button onClick={() => onOpenChange(true)}>Abrir diálogo (externo)</Button>

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Dialog controlado</DialogTitle>
                        <DialogDescription> El estado <code>open</code> es manejado externamente. Este componente sólo refleja los cambios.</DialogDescription>
                    </DialogHeader>

                    <form className="space-y-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="share-url">URL</Label>
                            <div className="flex items-center gap-2">
                                <Input id="share-url" value="https://example.com/recurso/12345" readOnly className="flex-1" />
                                <Button type="button" variant="secondary" className="flex items-center gap-1"><Copy className="h-4 w-4" /> Copiar</Button>
                            </div>
                        </div>
                    </form>

                    <DialogFooter>
                        <Button onClick={() => onOpenChange(false)}>Aceptar y cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
