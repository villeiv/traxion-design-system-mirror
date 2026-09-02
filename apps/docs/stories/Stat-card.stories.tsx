// Stat-card.stories.tsx
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "@traxion-global/design-system/react";
import { AlertTriangle, DollarSign, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";

const ICONS: Record<string, React.ReactNode> = {
    "Sin ícono": undefined,
    "DollarSign": <DollarSign className="h-6 w-6" />,
    "Users": <Users className="h-6 w-6" />,
    "Package": <Package className="h-6 w-6" />,
    "ShoppingCart": <ShoppingCart className="h-6 w-6" />,
    "TrendingUp": <TrendingUp className="h-6 w-6" />,
    "AlertTriangle": <AlertTriangle className="h-6 w-6" />,
};

import StatCardIconVariants from "./sources/StatCard.iconVariants";
import StatCardIconVariantsCode from "./sources/StatCard.iconVariants?raw";
import StatCardIconPosition from "./sources/StatCard.iconPosition";
import StatCardIconPositionCode from "./sources/StatCard.iconPosition?raw";
import StatCardTrendUp from "./sources/StatCard.trendUp";
import StatCardTrendUpCode from "./sources/StatCard.trendUp?raw";
import StatCardTrendDown from "./sources/StatCard.trendDown";
import StatCardTrendDownCode from "./sources/StatCard.trendDown?raw";
import StatCardTrendSentiment from "./sources/StatCard.trendSentiment";
import StatCardTrendSentimentCode from "./sources/StatCard.trendSentiment?raw";
import StatCardNoTrend from "./sources/StatCard.noTrend";
import StatCardNoTrendCode from "./sources/StatCard.noTrend?raw";
import StatCardLoading from "./sources/StatCard.loading";
import StatCardLoadingCode from "./sources/StatCard.loading?raw";
import StatCardDashboardGrid from "./sources/StatCard.dashboardGrid";
import StatCardDashboardGridCode from "./sources/StatCard.dashboardGrid?raw";

const meta = {
    component: StatCard,
    title: "StatCard",
    tags: ["autodocs"],
    parameters: {
        controls: { disable: true },
        actions: { disable: true },
        a11y: { disable: true },
        docs: {
            description: {
                component:
                    "El componente **StatCard** muestra un indicador clave de rendimiento (KPI) con etiqueta, valor, ícono opcional e indicador de tendencia opcional (sube/baja/neutral con porcentaje de cambio).",
            },
        },
    },
    argTypes: {
        label: {
            description: "Nombre descriptivo del indicador (e.g. 'Ingresos Totales')",
            control: { type: "text" },
        },
        value: {
            description: "Valor principal del KPI (e.g. '$12,400')",
            control: { type: "text" },
        },
        icon: {
            description: "Ícono representativo del KPI. Pasa un elemento React, normalmente de **Lucide**.",
            control: { type: "select" },
            options: Object.keys(ICONS),
        },
        iconVariant: {
            control: "radio",
            options: ["primary", "secondary", "green", "yellow", "red"],
            description: "Color del círculo de fondo del ícono.",
            table: { type: { summary: "string" } },
        },
        iconPosition: {
            control: "radio",
            options: ["left", "right"],
            description: "Posición del ícono dentro de la tarjeta. Por defecto `right`.",
            table: { type: { summary: "string" }, defaultValue: { summary: "right" } },
        },
        trend: {
            description: "Porcentaje de cambio. Positivo sube, negativo baja, cero es neutro. El color se deriva automáticamente a menos que se especifique `trendSentiment`.",
            control: { type: "number" },
        },
        trendSentiment: {
            control: "radio",
            options: ["positive", "negative", "neutral"],
            description: "Anula el color automático de la tendencia. Útil cuando la dirección del número y su significado no coinciden (e.g. una tasa de accidentes a la baja es positiva).",
        },
        trendLabel: {
            description: "Texto complementario al indicador de tendencia (e.g. 'vs mes anterior')",
            control: { type: "text" },
        },
        loading: {
            description: "Muestra el skeleton de carga en lugar del contenido.",
            control: { type: "boolean" },
        },
    },
    args: {
        label: "Ingresos Totales",
        value: "$12,400",
        iconVariant: "primary",
        iconPosition: "right",
        loading: false,
    },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Área de pruebas ──────────────────────────────────────────────────────────

export const Demo: Story = {
    name: "Área de pruebas",
    tags: ["!autodocs"],
    args: {
        label: "Ingresos Totales",
        value: "$12,400",
        icon: "DollarSign",
        iconVariant: "primary",
        trend: 12.5,
        trendLabel: "vs mes anterior",
    },
    render: (args) => {
        const { icon, ...rest } = args as typeof args & { icon?: string };
        return <StatCard {...rest} icon={icon ? ICONS[icon] : undefined} />;
    },
    parameters: {
        controls: { disable: false },
        a11y: { disable: false },
    },
};

// ─── Variantes de ícono ───────────────────────────────────────────────────────

export const IconVariants: Story = {
    name: "Variantes de ícono",
    render: StatCardIconVariants,
    parameters: {
        docs: {
            source: { code: StatCardIconVariantsCode },
            description: {
                story: "Las cinco variantes de color disponibles para el círculo del ícono: **primary**, **secondary**, **green**, **yellow** y **red**.",
            },
        },
    },
};

// ─── Posición del ícono ───────────────────────────────────────────────────────

export const IconPosition: Story = {
    name: "Posición del ícono",
    render: StatCardIconPosition,
    parameters: {
        docs: {
            source: { code: StatCardIconPositionCode },
            description: {
                story: "Con `iconPosition=\"left\"` el ícono se coloca antes del texto y el contenido se alinea a la izquierda. El valor por defecto es `right`.",
            },
        },
    },
};

// ─── Tendencia positiva ───────────────────────────────────────────────────────

export const TrendUp: Story = {
    name: "Tendencia positiva",
    render: StatCardTrendUp,
    parameters: {
        docs: {
            source: { code: StatCardTrendUpCode },
            description: {
                story: "Cuando `trend` es positivo se muestra el ícono `TrendingUp` y el porcentaje en verde.",
            },
        },
    },
};

// ─── Tendencia negativa ───────────────────────────────────────────────────────

export const TrendDown: Story = {
    name: "Tendencia negativa",
    render: StatCardTrendDown,
    parameters: {
        docs: {
            source: { code: StatCardTrendDownCode },
            description: {
                story: "Cuando `trend` es negativo se muestra el ícono `TrendingDown` y el porcentaje en rojo.",
            },
        },
    },
};

// ─── Sentimiento personalizado ────────────────────────────────────────────────

export const TrendSentiment: Story = {
    name: "Sentimiento personalizado",
    render: StatCardTrendSentiment,
    parameters: {
        docs: {
            source: { code: StatCardTrendSentimentCode },
            description: {
                story: "Usa `trendSentiment` cuando la dirección del número no implica su significado. Aquí, una tasa de accidentes a la baja (`trend={-18.5}`) es positiva — el ícono sigue apuntando hacia abajo pero el color es verde.",
            },
        },
    },
};

// ─── Sin tendencia ────────────────────────────────────────────────────────────

export const NoTrend: Story = {
    name: "Sin tendencia",
    render: StatCardNoTrend,
    parameters: {
        docs: {
            source: { code: StatCardNoTrendCode },
            description: {
                story: "Cuando la prop `trend` se omite, no se muestra ningún indicador de tendencia. Útil cuando el dato histórico no está disponible.",
            },
        },
    },
};

// ─── Cargando ─────────────────────────────────────────────────────────────────

export const Loading: Story = {
    name: "Cargando",
    render: StatCardLoading,
    parameters: {
        docs: {
            source: { code: StatCardLoadingCode },
            description: {
                story: "Con `loading={true}` el StatCard muestra un skeleton animado que mantiene las dimensiones del contenido real. Úsalo mientras los datos están en tránsito.",
            },
        },
    },
};

// ─── Cuadrícula de dashboard ──────────────────────────────────────────────────

export const DashboardGrid: Story = {
    name: "Cuadrícula de dashboard",
    render: StatCardDashboardGrid,
    parameters: {
        docs: {
            source: { code: StatCardDashboardGridCode },
            description: {
                story: "Cuatro StatCards en una cuadrícula 2×2 responsiva. Cubre los tres estados de tendencia: positiva (verde), negativa (rojo) y neutral (gris).",
            },
        },
    },
};
