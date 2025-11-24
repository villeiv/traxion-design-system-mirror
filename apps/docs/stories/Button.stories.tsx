// Button.stories.jsx
import React from "react";
import { Button, Card, CardDescription, CardHeader } from "@traxion-global/design-system";
import {Plus, Mail} from "lucide-react";

function WithIconAndTextDecorator(Story, context){

    const preCode = `<Button><Plus/>${context.args.children}</Button>`;

    return <div className={"flex flex-col items-center"}>
        <Story />
        <Card className={"mt-6"}>
            <CardHeader>
                <CardDescription>
                    <span>Para usar un ícono en el botón, inclúyelo directamente como hijo (children). Recomendamos usar íconos de Lucide, colocados antes del texto del botón. Ejemplo:</span>
                    <pre className={"mt-4 text-blue-500"}>{preCode}</pre>
                </CardDescription>
            </CardHeader>
        </Card>
    </div>
}

function WithIconDecorator(Story){

    const preCode = `<Button><Plus/></Button>`;

    return <div className={"flex flex-col items-center"}>
        <Story />
        <Card className={"mt-6"}>
            <CardHeader>
                <CardDescription>
                    <span>Para usar un ícono en el botón, inclúyelo directamente como hijo (children). Recomendamos usar íconos de Lucide. Ejemplo:</span>
                    <pre className={"mt-4 text-blue-500"}>{preCode}</pre>
                </CardDescription>
            </CardHeader>
        </Card>
    </div>
}

const meta = {
    component: Button,
    title: "Button",
    tags: ["autodocs"],
    decorators: [],
    parameters: {
        controls: { disable: true },
        a11y: { disable: true },
        actions: { disable: true },
        docs: {
            description: {
                component:
                    "El componente **Button** soporta variantes, tamaños, deshabilitación, y opción `asChild` para renderizar como otro elemento.",
            }
        }
    },
    argTypes: {
        type: {
            control: { type: "radio" },
            options: ["button", "submit", "reset"],
            description: "Atributo type del botón nativo.",
        },
        variant: {
            description: "Variante visual del botón",
            control: { type: "select" },
            options: ["default", "secondary", "outline", "ghost", "link", "destructive"],
        },
        asChild:{
            description: "Renderiza el contenido dentro de otro componente en lugar de un button. Útil para combinar con Link:",
            control: { type: "boolean"},
            //table: { disable: true }
        },
        size: {
            description: "Tamaño del botón",
            control: { type: "select" },
            options: ["icon", "sm", "default", "lg"],
        },
        children: {
            description: `Contenido interno del botón, normalmente un texto o un texto y un icono.`,
        },
        disabled: {
            description: "Deshabilita interacción",
            control: "boolean",
        }
    },
    /**
     * Args por defecto globales (todas las stories heredan)
     */
    args: {
        type: "button",
        children: "Texto de botón",
        size: "default",
        disabled: false,
        asChild: false
    }
};

export default meta;

export const Demo = {
    name: "Área de pruebas",
    tags: ['!autodocs'],
    parameters: {
        controls: { disable: false },
        a11y: { disable: false },
    },
    argTypes: {
        type: { table: { disable: true } },
        asChild: { table: { disable: true }  },
        onClick: { table: { disable: true }  },
    }
}

export const Default = {
    name: "Predeterminado",
    args: { variant: "default" },
    parameters: {
        docs: {
            description: {
                story:
                    "Botón por defecto.",
            },
        },
    }
};

export const Secondary = {
    name: "Secundario",
    args: { variant: "secondary" },
    parameters: {
        docs: {
            description: { story: "Variante **secondary**." },
        },
    },
};

export const Outline = {
    name: "Variante outline",
    args: { variant: "outline" },
    parameters: {
        docs: {
            description: { story: "Variante **outline**." },
        },
    },
};

export const Ghost = {
    name: "Variante ghost",
    args: { variant: "ghost" },
    parameters: {
        docs: {
            description: { story: "Variante **ghost**." },
        },
    },
};

export const Destructive = {
    name: "Variante destructive",
    args: { variant: "destructive" },
    parameters: {
        docs: {
            description: { story: "Variante **destructive** (para acciones peligrosas)." },
        },
    },
};

export const Link = {
    name: "Variante link",
    args: { variant: "link" },
    parameters: {
        docs: {
            description: {
                story: "Variante **link** (parece texto enlazado). Ideal con `asChild` si querés un `<a>`.",
            },
        },
    },
};

export const Icon = {
    name: "Ícono",
    args: {
        variant: "default",
        children: <Plus />,
        size: "icon"
    },
    argTypes: {
        children: { table: { disable: true } }
    },
    parameters: {
        docs: {
            description: {
                story: "Variante **icon**. Muestra solo un ícono.",
            },
        },
    },
    decorators: [WithIconDecorator],
};

export const WithIconAndText = {
    name: "Ícono y texto",
    args: {
        variant: "default"
    },
    parameters: {
        docs: {
            description: { story: "Botón con ícono a la izquierda." },
        },
    },
    decorators: [WithIconAndTextDecorator],
    render: (args) => <Button {...args}><Plus/>{args.children}</Button>
};

export const AsChild = {
    name: "asChild",
    render: (args) => (
        <Button {...args}>
            <a href="mailto:s.villegas@traxion.global" target="_blank" rel="noreferrer">
                <Mail style={{ marginRight: 2 }} />
                Mailto: s.villegas@traxion.global
            </a>
        </Button>
    ),
    argTypes: {
        children: { table: { disable: true } },
        disabled: { table: { disable: true } },
        asChild: {
            control: { type: "radio" },
            options: [true],
            table: { disable: false }
        },
    },
    args: {
        variant: "outline",
        asChild: true
    },
    parameters: {
        docs: {
            description: {
                story:
                    "Ejemplo usando `asChild` para renderizar un `<a>`. Útil cuando querés semántica de enlace pero estilo de botón.",
            },
        }
    }
};