import { Textarea } from "@traxion-global/design-system";

export default {
    title: 'Textarea',
    component: Textarea,
    tags: ['autodocs'],
    parameters: {
        a11y: { disable: true },
        actions: { disable: true },
        controls: { disable: true },
        docs: {
            description: {
                component: 'El componente **Textarea** permite a los usuarios ingresar texto en múltiples líneas, ideal para comentarios, descripciones u observaciones.'
            }
        }
    },
    argTypes:{
        placeholder: {
            control: 'text',
            description: 'Texto que se muestra cuando el campo está vacío'
        },
        disabled: {
            control: 'boolean',
            description: 'Indica si el campo está deshabilitado'
        },
        readOnly: {
            control: 'boolean',
            description: 'Indica si el campo es de solo lectura'
        },
        rows: {
            control: 'number',
            description: 'Cantidad de líneas visibles por defecto'
        },
        className: {
            control: 'text',
            description: 'Clases adicionales para personalizar el estilo del textarea'
        }
    },
    args: {
        className: 'w-96'
    }
}

export const Playground = {
    name: "Área de pruebas",
    tags: ['!autodocs'],
    parameters: {
        a11y: { disable: false },
        controls: { disable: false },
        docs: {
            description: {
                story: 'Este es un área de pruebas para el componente **Textarea**. Puedes modificar las propiedades en el panel de controles para ver cómo afecta al componente.'
            }
        }
    },
    args:{
        placeholder: 'Escribe tu comentario...',
        disabled: false,
        readOnly: false,
        rows: 4
    }
}

export const WithLabel = {
    name: "Con etiqueta",
    parameters: {
        docs: {
            description: {
                story: 'Es recomendable que el componente **Textarea** vaya acompañado de una etiqueta para describir su propósito.'
            }
        }
    },
    render: (args) => (
        <div className="flex flex-col gap-1">
            <label htmlFor="textarea-with-label" className="text-sm font-medium">Descripción</label>
            <Textarea className={"w-96"} id="textarea-with-label" placeholder="Escribe los detalles..." rows={4} />
        </div>
    ),
}

export const WithError = {
    name: "Con error",
    parameters: {
        docs: {
            description: {
                story: 'Resalta el borde del **Textarea** en rojo y muestra un mensaje de error cuando hay un problema con la entrada del usuario.'
            }
        }
    },
    render: (args) => (
        <div className="flex flex-col gap-1">
            <label htmlFor="textarea-with-error" className="text-sm font-medium">Descripción</label>
            <Textarea id="textarea-with-error" placeholder="Escribe los detalles..." className="w-96 border-red-500" rows={4} />
            <p className="text-sm text-red-500">Este campo es obligatorio.</p>
        </div>
    ),
}

export const Disabled = {
    name: "Deshabilitado",
    parameters: {
        docs: {
            description: {
                story: 'El **Textarea** puede deshabilitarse para evitar la edición del contenido.'
            }
        }
    },
    render: (args) => (
        <Textarea className={"w-96"} placeholder="Campo deshabilitado" disabled rows={4} />
    ),
}

export const ReadOnly = {
    name: "Solo lectura",
    parameters: {
        docs: {
            description: {
                story: 'Puedes usar la propiedad **readOnly** para mostrar texto que no se pueda modificar pero sí seleccionar o copiar.'
            }
        }
    },
    render: (args) => (
        <Textarea className={"w-96"} placeholder="Texto de solo lectura" readOnly defaultValue="Este texto no puede editarse." rows={4} />
    ),
}
