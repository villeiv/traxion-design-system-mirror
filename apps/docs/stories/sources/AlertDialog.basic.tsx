import {Button, AlertDialogTrigger, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from "@traxion-global/design-system";
import {toast} from "sonner";

export default function AlertDialogBasic() {
    return (
        <AlertDialog>
            {/* AlertDialogTrigger: se muestra cuando el diálogo está cerrado; al hacer clic abre el contenido. */}
            <AlertDialogTrigger asChild>
                <Button variant="outline">Abrir diálogo</Button>
            </AlertDialogTrigger>

            {/* AlertDialogContent: se monta y muestra únicamente cuando el diálogo está abierto. Envuelve el contenido visible del diálogo. Se renderiza dentro de un portal con su overlay y animaciones. */}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Confirmar acción?</AlertDialogTitle>
                    <AlertDialogDescription> Este diálogo usa subcomponentes (Trigger, Content, Header, Title, Description, Footer, Cancel, Action). Revisa la pestaña <strong>Code</strong> para ver cómo se componen y qué rol cumple cada uno.</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={_=>toast.error("Cancelar")}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={_=>toast.success("Confirmar")}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}