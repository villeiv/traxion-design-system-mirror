import { Button, Input } from "@traxion-global/design-system";
import { Search } from "lucide-react";

export default {
    title: 'Input',
    component: Input,
    tags: ['autodocs'],
    parameters: {
        a11y: { disable: true },
        actions: { disable: true },
        controls: { disable: true },
        docs: {
            description: {
                component: 'El componente **Input** es un campo de entrada de texto que permite a los usuarios ingresar y editar datos.'
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
        type: {
            control: { type:"select" },
            description: 'Tipo de dato que el campo acepta',
            options: ['text', 'password', 'email', 'number', 'file' ]
        },
        readOnly: {
            control: 'boolean',
            description: 'Indica si el campo es de solo lectura'
        }
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
                story: 'Este es un área de pruebas para el componente **Input**. Puedes modificar las propiedades en el panel de controles para ver cómo afecta al componente.'
            }
        }
    },
    args:{
        placeholder: 'Escribe algo...',
        disabled: false,
        type: 'text',
        readOnly: false
    }
}

export const WithLabel = {
    name: "Con etiqueta",
    parameters: {
        docs: {
            description: {
                story: 'Es recomendable que el componente **Input** vaya acompañado de una etiqueta para describir su propósito.'
            }
        }
    },
    render: (args) => (
        <div className="flex flex-col gap-1">
            <label htmlFor="input-with-label" className="text-sm font-medium">Etiqueta</label>
            <Input id="input-with-label" placeholder="Escribe algo..." />
        </div>
    ),
}

export const WithButton = {
    name: "Con botón",
    parameters: {
        docs: {
            description: {
                story: 'El componente **Input** puede combinarse con botones para acciones relacionadas, como enviar una búsqueda.'
            }
        }
    },
    render: (args) => (
        <div className="flex flex-row gap-2">
            <Input placeholder="Buscar CFDI" />
            <Button variant={"outline"} size={"lg"}>Enviar</Button>
        </div>
    ),
}

export const WithError = {
    name: "Con error",
    parameters: {
        docs: {
            description: {
                story: 'Resalta el borde del **Input** en rojo y muestra un mensaje de error cuando hay un problema con la entrada del usuario.'
            }
        }
    },
    render: (args) => (
        <div className="flex flex-col gap-1">
            <label htmlFor="input-with-error" className="text-sm font-medium">Etiqueta</label>
            <Input id="input-with-error" placeholder="Escribe algo..." className={"border-red-500"}/>
            <p className="text-sm text-red-500">Este campo es obligatorio.</p>
        </div>
    ),
}

export const WithIconLeft = {
    name: "Con ícono a la izquierda",
    parameters: {
        docs: {
            description: {
                story: 'Puedes agregar un ícono dentro del **Input** para mejorar la experiencia del usuario. Evitalo si el ícono no aporta valor significativo o en formularios donde hay demasiados campos.'
            }
        }
    },
    render: (args) => (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none" />
            <Input {...args} placeholder="Buscar" className="pl-10" />
        </div>
    ),
};

export const WithIconRight = {
    name: "Con ícono a la derecha",
    parameters: {
        docs: {
            description: {
                story: 'Puedes agregar un ícono dentro del **Input** para mejorar la experiencia del usuario. Evitalo si el ícono no aporta valor significativo o en formularios donde hay demasiados campos.'
            }
        }
    },
    render: (args) => (
        <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none" />
            <Input {...args} placeholder="Buscar" className="pr-10" />
        </div>
    ),
};