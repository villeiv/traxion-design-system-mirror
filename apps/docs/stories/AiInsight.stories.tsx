import type { Meta, StoryObj } from "@storybook/react";
import { AiInsight } from "@traxion-global/design-system/react";

import AiInsightSingleMessage from "./sources/AiInsight.singleMessage";
import AiInsightSingleMessageCode from "./sources/AiInsight.singleMessage?raw";
import AiInsightMultipleMessages from "./sources/AiInsight.multipleMessages";
import AiInsightMultipleMessagesCode from "./sources/AiInsight.multipleMessages?raw";
import AiInsightAllVariants from "./sources/AiInsight.allVariants";
import AiInsightAllVariantsCode from "./sources/AiInsight.allVariants?raw";
import AiInsightCollapsedByDefault from "./sources/AiInsight.collapsedByDefault";
import AiInsightCollapsedByDefaultCode from "./sources/AiInsight.collapsedByDefault?raw";

const meta = {
    component: AiInsight,
    title: "AiInsight",
    tags: ["autodocs"],
    parameters: {
        controls: { disable: true },
        actions: { disable: true },
        a11y: { disable: true },
        docs: {
            description: {
                component: `
El componente **AiInsight** presenta insights generados por inteligencia artificial a partir de datos operativos, KPIs o estadísticas. Cada mensaje incluye un título, una descripción y una variante visual que comunica su nivel de importancia.

Cuando se pasa un único mensaje, el componente lo muestra directamente dentro del panel. Cuando se pasan múltiples mensajes, el panel se vuelve colapsable mediante un botón de chevron en el encabezado.

### Importación
\`\`\`tsx
import { AiInsight } from "@traxion-global/design-system/react";
\`\`\`

### Estructura del mensaje
\`\`\`tsx
interface AiInsightMessage {
    title: string;
    description: string;
    variant: "info" | "warning" | "critical" | "success";
}
\`\`\`
                `,
            },
        },
    },
    argTypes: {
        messages: {
            description: "Lista de mensajes a mostrar. Con un solo mensaje el panel no es colapsable; con dos o más aparece el control de expansión.",
            control: false,
        },
        defaultOpen: {
            description: "Estado inicial del panel cuando hay múltiples mensajes. `true` lo muestra expandido, `false` colapsado.",
            control: { type: "boolean" },
        },
    },
} satisfies Meta<typeof AiInsight>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Mensaje único ────────────────────────────────────────────────────────────

export const SingleMessage: Story = {
    name: "Mensaje único",
    render: AiInsightSingleMessage,
    parameters: {
        docs: {
            source: { code: AiInsightSingleMessageCode },
            description: {
                story:
                    "Con un único mensaje en el arreglo, el panel muestra el contenido directamente sin control de colapso. Ideal para destacar un solo hallazgo relevante.",
            },
        },
    },
};

// ─── Múltiples mensajes ───────────────────────────────────────────────────────

export const MultipleMessages: Story = {
    name: "Múltiples mensajes",
    render: AiInsightMultipleMessages,
    parameters: {
        docs: {
            source: { code: AiInsightMultipleMessagesCode },
            description: {
                story:
                    "Cuando el arreglo contiene dos o más mensajes, aparece un botón de chevron en el encabezado que permite colapsar y expandir el panel completo. Por defecto el panel inicia expandido (`defaultOpen={true}`).",
            },
        },
    },
};

// ─── Todas las variantes ──────────────────────────────────────────────────────

export const AllVariants: Story = {
    name: "Todas las variantes",
    render: AiInsightAllVariants,
    parameters: {
        docs: {
            source: { code: AiInsightAllVariantsCode },
            description: {
                story:
                    "Las cuatro variantes disponibles: **info** (gris) para información general, **warning** (amarillo) para alertas moderadas, **critical** (rojo) para situaciones que requieren atención inmediata, y **success** (verde) para logros y métricas positivas.",
            },
        },
    },
};

// ─── Colapsado por defecto ────────────────────────────────────────────────────

export const CollapsedByDefault: Story = {
    name: "Colapsado por defecto",
    render: AiInsightCollapsedByDefault,
    parameters: {
        docs: {
            source: { code: AiInsightCollapsedByDefaultCode },
            description: {
                story:
                    "Con `defaultOpen={false}`, el panel inicia colapsado mostrando únicamente el encabezado. Útil cuando los insights son secundarios dentro de un dashboard y no deben ocupar espacio visual de forma predeterminada.",
            },
        },
    },
};
