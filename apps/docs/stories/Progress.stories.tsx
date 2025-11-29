import {Progress} from "@traxion-global/design-system/react";

export default {
    title: "Progress",
    component: Progress,
    tags: ["autodocs"],
    parameters: {
        a11y: {disable: true},
        actions: {disable: true},
        docs: {
            description: {
                component: "El componente **Progress** sirve para indicar el avance de una tarea o proceso."
            }
        }
    },
    argTypes: {
        value: {
            control: {type: "number"},
            description: "Valor numérico que representa el progreso actual. Debe estar entre 0 y 100.",
        },
        className: {
            control: {type: "text"},
            description: "Clase CSS adicional para personalizar el estilo del componente.",
        }
    }
}

export const Playground = {
    name: "Uso básico",
    args: {
        value: 50,
        className: "w-64"
    },
    parameters: {
        docs: {
            description: {
                story: "Este es un ejemplo básico del componente **Progress** con un valor de progreso del 50%."
            }
        }
    }
}

export const WithLabel = {
    name: "Con etiqueta",
    args: {
        value: 75,
        className: "w-64"
    },
    parameters: {
        controls: { disable: true },
        docs: {
            description: {
                story: "Este ejemplo muestra el componente **Progress** acompañado de una etiqueta que indica el porcentaje completado."
            }
        }
    },
    render: (args) => (
        <div className="flex flex-col items-center">
            <Progress {...args} />
            <span className="mt-2 text-sm">{args.value}% completado</span>
        </div>
    )
}
