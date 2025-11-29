// Badge.stories.tsx
import React from "react";
import {Badge, Card, CardDescription, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@traxion-global/design-system/react";
import {Plus} from "lucide-react";

const VARIANT_OPTIONS = [
    // shadcn legacy
    "default",
    "secondary",
    "destructive",
    "outline",
    // Traxion
    "primary",
    "green",
    "yellow",
    "red",
    "gray",
    "cyan",
    "violet",
    "blue",
    "teal",
    "orange",
    "pink",
    "fuchsia",
] as const;

type VariantOption = (typeof VARIANT_OPTIONS)[number];

const meta = {
    component: Badge,
    title: "Badge",
    tags: ["autodocs"],
    parameters: {
        controls: { disable: true },
        actions: { disable: true },
        a11y: { disable: true },
        docs: {
            description: {
                component:
                    "El componente **Badge** muestra un pequeño indicador o etiqueta con diferentes variantes de color. Úsalo para estados, categorías o etiquetas compactas.\n\n**Nota:** Un badge debe ser pequeño y discreto. No debe contener íconos ni parecer un botón.",
            },
        },
    },
    argTypes: {
        variant: {
            description: "Variante visual del badge",
            control: {type: "select"},
            options: VARIANT_OPTIONS as unknown as string[],
        },
        children: {
            description: "Contenido interno del badge. Normalmente es una palabra o frase corta.",
            control: {type: "text"},
        },
    },
    args: {
        children: "Etiqueta",
        variant: "default" as VariantOption,
    },
};

export default meta;

// —————————————————————————————————————————————
// Variantes base (shadcn legacy)
// —————————————————————————————————————————————

export const Demo = {
    name: "Área de pruebas",
    tags: ['!autodocs'],
    parameters: {
        controls: {disable: false}
    },
}

export const Default = {
    name: "Predeterminado",
    args: {variant: "default" as VariantOption},
};

export const Secondary = {
    name: "Secundario",
    args: {variant: "secondary" as VariantOption},
};

export const Destructive = {
    name: "Destructive",
    args: {variant: "destructive" as VariantOption},
};

export const Outline = {
    name: "Outline",
    args: {variant: "outline" as VariantOption},
};

// —————————————————————————————————————————————
// Paleta Traxion
// —————————————————————————————————————————————

export const Primary = {
    name: "Primary",
    args: {variant: "primary" as VariantOption, children: "Primary"},
};

export const Green = {
    name: "Green",
    args: {variant: "green" as VariantOption, children: "Green"},
};

export const Yellow = {
    name: "Yellow",
    args: {variant: "yellow" as VariantOption, children: "Yellow"},
};

export const Red = {
    name: "Red",
    args: {variant: "red" as VariantOption, children: "Red"},
};

export const Gray = {
    name: "Gray",
    args: {variant: "gray" as VariantOption, children: "Gray"},
};

export const Cyan = {
    name: "Cyan",
    args: {variant: "cyan" as VariantOption, children: "Cyan"},
};

export const Violet = {
    name: "Violet",
    args: {variant: "violet" as VariantOption, children: "Violet"},
};

export const Blue = {
    name: "Blue",
    args: {variant: "blue" as VariantOption, children: "Blue"},
};

export const Teal = {
    name: "Teal",
    args: {variant: "teal" as VariantOption, children: "Teal"},
};

export const Orange = {
    name: "Orange",
    args: {variant: "orange" as VariantOption, children: "Orange"},
};

export const Pink = {
    name: "Pink",
    args: {variant: "pink" as VariantOption, children: "Pink"},
};

export const Fuchsia = {
    name: "Fuchsia",
    args: {variant: "fuchsia" as VariantOption, children: "Fuchsia"},
};

// —————————————————————————————————————————————
// Ejemplos de uso correcto
// —————————————————————————————————————————————

export const StatusExamples = {
    name: "Estados comunes",
    argTypes: {
        children: {table: {disable: true}},
        variant: {table: {disable: true}},
    },
    render: args => (
        <div className="flex flex-wrap items-center gap-2">
            <Badge variant="green">Entregado</Badge>
            <Badge variant="gray">En tránsito</Badge>
            <Badge variant="yellow">Retrasado</Badge>
            <Badge variant="red">Cancelado</Badge>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Ejemplo de badges para estados operativos típicos de la operación de Traxión.",
            },
        },
    },
};

export const Palette = {
    name: "Paleta categorizada",
    argTypes: {
        children: {table: {disable: true}},
        variant: {table: {disable: true}},
    },
    render: args => (
        <Table className="w-full max-w-2xl">
            <TableBody>
                {/* Primarias */}
                <TableRow>
                    <TableCell rowSpan={5} className="align-top font-medium">
                        Primarias
                    </TableCell>
                    <TableCell>Default</TableCell>
                    <TableCell><Badge variant="default">Default</Badge></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Primary</TableCell>
                    <TableCell><Badge variant="primary">Primary</Badge></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Secondary</TableCell>
                    <TableCell><Badge variant="secondary">Secondary</Badge></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Destructive</TableCell>
                    <TableCell><Badge variant="destructive">Destructive</Badge></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Outline</TableCell>
                    <TableCell><Badge variant="outline">Outline</Badge></TableCell>
                </TableRow>

                {/* Estados */}
                <TableRow>
                    <TableCell rowSpan={4} className="align-top font-medium">
                        Estados
                    </TableCell>
                    <TableCell>Verde: éxito</TableCell>
                    <TableCell><Badge variant="green">Entregado</Badge></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Amarillo: pendiente</TableCell>
                    <TableCell><Badge variant="yellow">Pendiente</Badge></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Rojo: cancelado</TableCell>
                    <TableCell><Badge variant="red">Cancelado</Badge></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Gris: neutro</TableCell>
                    <TableCell><Badge variant="gray">Neutro</Badge></TableCell>
                </TableRow>

                {/* Auxiliares */}
                <TableRow>
                    <TableCell rowSpan={7} className="align-top font-medium">
                        Auxiliares
                    </TableCell>
                    <TableCell>Cyan</TableCell>
                    <TableCell><Badge variant="cyan">Cyan</Badge></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Violeta</TableCell>
                    <TableCell><Badge variant="violet">Violet</Badge></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Azul</TableCell>
                    <TableCell><Badge variant="blue">Blue</Badge></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Teal</TableCell>
                    <TableCell><Badge variant="teal">Teal</Badge></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Naranja</TableCell>
                    <TableCell><Badge variant="orange">Orange</Badge></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Rosa</TableCell>
                    <TableCell><Badge variant="pink">Pink</Badge></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Fucsia</TableCell>
                    <TableCell><Badge variant="fuchsia">Fuchsia</Badge></TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
    parameters: {
        docs: {
            description: {
                story:
                    "La paleta de variantes del componente **Badge** organizada en tres categorías: primarias, estados comunes (facturas, viajes, etc.) y auxiliares.",
            },
        },
    },
};

// —————————————————————————————————————————————
// Anti-patrón (lo que NO debe hacerse)
// —————————————————————————————————————————————

function WithIconDecorator(Story) {

    const preCode = `<Badge><Plus/>En Tránsito</Badge>`;

    return <div className={"flex flex-col items-center"}>
        <Story/>
        <Card className={"mt-6"}>
            <CardHeader>
                <CardTitle>
                    NO SE RECOMIENDA colocar íconos dentro de un badge.
                </CardTitle>
                <CardDescription>
                    <span> El badge debe ser pequeño y simple. Incluir íconos puede hacerlo parecer un botón o un componente de acción.</span>
                </CardDescription>
            </CardHeader>
        </Card>
    </div>
}

export const WithIconNotRecommended = {
    name: "Con ícono (no recomendado)",
    render: args => (
        <Badge>
            <Plus/>En tránsito
        </Badge>
    ),
    parameters: {
        docs: {
            description: {
                story:
                    "No se recomienda colocar íconos dentro de un badge. El badge debe ser pequeño y simple. Incluir íconos puede hacerlo parecer un botón o un componente de acción.",
            },
        },
    },
    argTypes: {
        children: {table: {disable: true}},
        variant: {table: {disable: true}},
    },
    decorators: [WithIconDecorator],
};