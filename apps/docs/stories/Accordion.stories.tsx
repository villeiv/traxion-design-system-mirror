import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@traxion-global/design-system/react";
import AccordionControlled from "./sources/Accordion.controlled";
import AccordionControlledCode from "./sources/Accordion.controlled?raw";
import {AccordionAnatomy} from "./sources/Accordion.anatomy";

export default {
    component: Accordion,
    title: "Accordion",
    tags: ['autodocs'],
    parameters: {
        a11y: {disable: true},
        actions: {disable: true},
        docs: {
            description: {
                component: "El componente **Accordion** permite organizar contenido en secciones expandibles y colapsables, mejorando la experiencia del usuario al mostrar solo la información relevante. Soporta modos de apertura única o múltiple." + AccordionAnatomy,
            }
        }
    },
    argTypes: {
        type: {
            control: {type: 'select'},
            options: ['single', 'multiple'],
            description: 'Define si solo un ítem puede estar abierto a la vez (single) o varios (multiple).',
        },
        collapsible: {
            control: {type: 'boolean'},
            description: 'Permite que un ítem abierto se pueda cerrar al hacer clic en su encabezado. Solo aplicable en modo "single".',
            if: {arg: 'type', neq: 'multiple'},
        },
        defaultValue: {
            control: {type: 'select'},
            options: ["Ninguno", "Primer item", "Items 1 y 3"],
            mapping: {
                "Ninguno": undefined,
                "Primer item": "item-1",
                "Items 1 y 3": ["item-1", "item-3"]
            },
            description: "Define qué ítem(s) está(n) abierto(s) por defecto. Recarga la página para ver el cambio."
        },
        className: {
            control: {type: 'text'},
            description: 'Permite agregar clases CSS personalizadas al wrapper del acordeón para estilos adicionales.',
        }
    },
    args: {
        className: "w-96"
    }
}

export const Default = {
    tags: ["!autodocs"],
    name: "Área de pruebas",
    args: {
        type: 'single',
        collapsible: true,
        defaultValue: "Primer item"
    },
    render: args => {
        return <Accordion {...args}>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Qué es y para qué sirve</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-3 text-balance">
                        <p>Componente para mostrar secciones plegables: cada ítem tiene un título (Trigger) y su contenido asociado.</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Útil para FAQs, especificaciones o contenido denso.</li>
                            <li>Permite abrir/cerrar secciones sin navegar de la página.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger>Props clave</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-3 text-balance">
                        <ul className="list-disc pl-5 space-y-1">
                            <li><code>type</code>: <code>"single"</code> (una sección a la vez) o <code>"multiple"</code> (varias abiertas).</li>
                            <li><code>collapsible</code>: solo aplica con <code>type="single"</code>; permite cerrar la abierta.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger>Buenas prácticas</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-3 text-balance">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Mantén los títulos claros y cortos.</li>
                            <li>Evita contenido excesivamente largo en un solo ítem; divide en varios si es necesario.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
    }
}

export const Uncontrolled = {
    name: "Componente no controlado",
    parameters: {
        actions: { disable: true },
        controls: { disable: true },
        docs: {
            description: {
                story: "Este ejemplo muestra un Accordion que maneja su propio estado interno. Es ideal para FAQs y contenido informativo donde no necesitas sincronizar con URL o estado global. Puedes definir qué panel está abierto por defecto usando la prop `defaultValue`. En modo `single`, la prop `collapsible` permite cerrar el panel activo."
            }
        }
    },
    args: {
        type: "single",
        collapsible: true,
        defaultValue: "Primer item",
    },
    render: (args) => {
        return (
            <Accordion type={"single"} defaultValue={"item-2"} collapsible={true} className={"w-[30rem] border rounded-lg px-6"}>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Introducción</AccordionTrigger>
                    <AccordionContent>
                        Este Accordion maneja su propio estado interno. Ideal para FAQs y
                        contenido informativo donde no necesitas sincronizar con URL o estado global.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger>Cuándo usarlo</AccordionTrigger>
                    <AccordionContent>
                        Úsalo cuando no necesites leer ni modificar el estado desde afuera.
                        Puedes definir paneles abiertos por defecto con <code>defaultValue</code>.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger>Notas</AccordionTrigger>
                    <AccordionContent>
                        En modo <code>single</code>, <code>collapsible</code> permite cerrar el panel activo.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        );
    },
};

export const Controlled = {
    name: "Componente controlado",
    parameters: {
        actions: { disable: true },
        controls: { disable: true},
        docs:{
            source: {
                code: AccordionControlledCode
            },
            description: {
                story: "Este ejemplo muestra un **Accordion** controlado, donde el estado abierto/cerrado de los ítems se maneja desde un componente padre. Esto es útil cuando necesitas sincronizar el estado con la URL, almacenamiento local o un estado global. Aquí, el componente padre define qué ítem(s) está(n) abierto(s) mediante la prop `value` y actualiza este estado en respuesta a eventos `onValueChange`."
            }
        }
    },
    render: AccordionControlled,
};