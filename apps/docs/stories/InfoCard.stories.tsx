//InfoCard.stories.tsx
import React from "react";
import {InfoCard} from "@traxion-global/design-system/react";
import {Calendar, CreditCard, DollarSign, Package, Truck, Users} from "lucide-react";

const ICONS = {
    "Ej.: Calendar": <Calendar className="h-6 w-6"/>,
    "Ej.: DollarSign": <DollarSign className="h-6 w-6"/>,
    "Ej.: Package": <Package className="h-6 w-6"/>,
    "Ej.: Truck": <Truck className="h-6 w-6"/>,
    "Ej.: CreditCard": <CreditCard className="h-6 w-6"/>,
    "Ej.: Users": <Users className="h-6 w-6"/>,
} as const;

const meta = {
    component: InfoCard,
    title: "InfoCard",
    tags: ["autodocs"],
    parameters: {
        controls: {disable: true},
        actions: {disable: true},
        a11y: {disable: true},
        docs: {
            description: {
                component:
                    "El componente **InfoCard** se utiliza para resaltar datos importantes en formato de tarjeta, mostrando un título, un valor destacado y un ícono representativo.",
            }
        }
    },
    argTypes: {
        title: {
            description: "Título descriptivo de la tarjeta",
            control: {type: "text"},
        },
        value: {
            description: "Valor destacado que se muestra en la tarjeta",
            control: {type: "text"},
            type: {required: false},
        },
        icon: {
            name: "icon",
            description: `Ícono representativo del contenido de la tarjeta.  
Se recomienda usar íconos de **Lucide**.  
Debe pasarse como un elemento React.  

**Ejemplo:**  
\`\`\`tsx
<Calendar className="h-6 w-6 text-yellow-500" />
\`\`\`
`,
            control: {type: "select"},
            options: Object.keys(ICONS),
        },
        iconColor: {
            control: "radio",
            options: ["primary", "green", "yellow", "red", "gray"],
            description: "Color del ícono de la tarjeta.",
            table: {type: {summary: "string"}},
        },
    },
    args: {
        iconColor: "primary",
    },
    render: (args) => {
        const {icon, ...rest} = args;
        const IconComponent = icon ? ICONS[icon as keyof typeof ICONS] : null;
        return <InfoCard {...rest} icon={IconComponent}/>;
    }
};

export default meta;

export const Demo = {
    name: "Área de pruebas",
    tags: ['!autodocs'],
    args: {
        title: "Clientes",
        value: "1,200",
        icon: "Ej.: Users",
    },
    parameters: {
        controls: {disable: false},
        a11y: {disable: false},
    }
}

export const Status = {
    name: "Úsalo con palabras",
    args: {
        title: "Estatus",
        value: "En tránsito",
        icon: "Ej.: Truck",
    },
};

export const PaymentDate = {
    name: "Úsalo con fechas",
    args: {
        title: "Fecha de pago",
        value: "14/6/2025",
        icon: "Ej.: Calendar",
    },
};

export const Total = {
    name: "Úsalo con cantidades",
    args: {
        title: "Total",
        value: "$357,971.86",
        icon: "Ej.: DollarSign",
    },
};

export const DashboardExample = {
    name: "Ejemplo de uso en un dashboard",
    argTypes: {
        title: { table: { disable: true } },
        value: { table: { disable: true } },
        icon: { table: { disable: true } },
        iconColor: { table: { disable: true } },
    },
    render: args => (
        <div className="grid gap-4 sm:grid-cols-3">
            <InfoCard
                title="Estatus"
                value="En tránsito"
                icon={<Truck className="h-6 w-6"/>}
            />
            <InfoCard
                title="Fecha de llegada"
                value="14/6/2025"
                icon={<Calendar className="h-6 w-6"/>}
            />
            <InfoCard
                title="Total"
                value="$357,971.86"
                icon={<DollarSign className="h-6 w-6"/>}
            />
        </div>
    )
};

export const DifferentColors = {
    name: "Diferentes colores de ícono",
    argTypes: {
        title: { table: { disable: true } },
        value: { table: { disable: true } },
        icon: { table: { disable: true } },
        iconColor: { table: { disable: true } },
    },
    render: args => (
        <div className="grid gap-4 sm:grid-cols-3">
            <InfoCard
                title="Estatus"
                value="En tránsito"
                icon={<Truck className="h-6 w-6"/>}
                iconColor={"red"}
            />
            <InfoCard
                title="Fecha de llegada"
                value="14/6/2025"
                icon={<Calendar className="h-6 w-6"/>}
                iconColor={"yellow"}
            />
            <InfoCard
                title="Total"
                value="$357,971.86"
                icon={<DollarSign className="h-6 w-6"/>}
                iconColor={"green"}
            />
        </div>
    )
};