import {AlertDialog} from "@traxion-global/design-system/react";
import AlertDialogBasic from "./sources/AlertDialog.basic";
import AlertDialogBasicCode from "./sources/AlertDialog.basic?raw";
import AlertDialogControlled from "./sources/AlertDialog.controlled";
import AlertDialogControlledCode from "./sources/AlertDialog.controlled?raw";
import ToasterDecorator from "./decorators/ToasterDecorator";
import {AlertDialogAnatomy} from "./sources/AlertDialog.anatomy";

export default {
    title: "AlertDialog",
    component: AlertDialog,
    decorators: [ToasterDecorator],
    tags: ["autodocs"],
    parameters: {
        a11y: { disable: true },
        controls: { disable: true },
        actions: { disable: true },
        docs:{
            description: {
                component: "El componente **AlertDialog** se utiliza para mostrar un cuadro de diálogo modal que requiere la atención del usuario antes de continuar. Es ideal para confirmar acciones críticas, como eliminar datos o cerrar una sesión." + AlertDialogAnatomy
            }
        }
    }
}

export const Basic = {
    name: "Uso básico no controlado",
    render:AlertDialogBasic,
    parameters: {
        docs: {
            source: {
                code: AlertDialogBasicCode,
            },
            description: {
                story: "En este ejemplo básico, el **AlertDialog** se utiliza para confirmar una acción. Al hacer clic en el botón 'Abrir diálogo', se abre el cuadro de diálogo modal que solicita al usuario que confirme o cancele la acción. Observa el código para entender cómo se estructura el componente y sus subcomponentes."
            }
        }
    }
}

export const OpenStateControlledExternally = {
    name: "Controlado externamente",
    render: AlertDialogControlled,
    parameters: {
        docs: {
            source: {
                code: AlertDialogControlledCode,
            },
            description: {
                story: "En este ejemplo, el estado abierto/cerrado del **AlertDialog** se controla externamente mediante las props `open` y `onOpenChange`. Esto es útil para sincronizar el estado del diálogo con otros componentes o para resetear su estado desde acciones externas. Observa cómo se manejan estas props en el código."
            }
        }
    }
}