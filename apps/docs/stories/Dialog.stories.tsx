import { Dialog } from "@traxion-global/design-system/react";
import DialogBasic from "./sources/Dialog.basic";
import DialogBasicCode from "./sources/Dialog.basic?raw";
import DialogControlled from "./sources/Dialog.controlled";
import DialogControlledCode from "./sources/Dialog.controlled?raw";
import ToasterDecorator from "./decorators/ToasterDecorator";
import { DialogAnatomy } from "./sources/Dialog.anatomy";

export default {
    title: "Dialog",
    component: Dialog,
    decorators: [ToasterDecorator],
    tags: ["autodocs"],
    parameters: {
        a11y: { disable: true },
        controls: { disable: true },
        actions: { disable: true },
        docs: {
            description: {
                component:
                    "El componente **Dialog** se utiliza para mostrar un cuadro de diálogo modal con contenido como formularios, listas, avisos, etc. " +
                    "A diferencia de **AlertDialog**, no está limitado a confirmaciones críticas y puede emplearse para flujos más complejos." +
                    DialogAnatomy,
            },
        },
    },
};

export const Basic = {
    name: "Uso básico no controlado",
    render: DialogBasic,
    parameters: {
        docs: {
            source: { code: DialogBasicCode },
            description: {
                story:
                    "Ejemplo básico usando **Dialog** con disparador interno (`DialogTrigger`). " +
                    "Haz clic en 'Abrir diálogo' para mostrar el modal con título, descripción y acciones.",
            },
        },
    },
};

export const OpenStateControlledExternally = {
    name: "Controlado externamente",
    render: DialogControlled,
    parameters: {
        docs: {
            source: { code: DialogControlledCode },
            description: {
                story:
                    "En este ejemplo, el estado abierto/cerrado de **Dialog** se controla externamente mediante las props `open` y `onOpenChange`. " +
                    "Esto permite sincronizar el estado con otros componentes o resetearlo desde acciones externas. " +
                    "Observa cómo el componente recibe las props y expone botones que llaman a `onOpenChange`.",
            },
        },
    },
};
