import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TimePicker, Label, toast } from "@traxion-global/design-system/react";
import ToasterDecorator from "./decorators/ToasterDecorator";

const meta = {
    title: "TimePicker",
    component: TimePicker,
    tags: ["autodocs"],
    parameters: {
        controls: { disable: true },
        actions: { disable: true },
        a11y: { disable: true },
        docs: {
            description: {
                component: `
Un \`<input type="time">\` estilizado con el sistema de diseño. Utiliza los controles nativos del navegador (teclado, rueda del ratón, AM/PM según el sistema operativo). Paso de 1 minuto, sin segundos.

> **¿Necesitas seleccionar fecha y hora al mismo tiempo?** Usa el componente [\`DateTimePicker\`](?path=/docs/datepicker--docs) que combina calendario y selector de hora en un único popover.

### Importación
\`\`\`tsx
import { TimePicker } from "@traxion-global/design-system/react";
\`\`\`
                `,
            },
        },
    },
    argTypes: {
        disabled: {
            control: "boolean",
            description: "Deshabilita el input.",
        },
        className: {
            control: "text",
            description: "Clases CSS adicionales aplicadas al input.",
        },
    },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Uso básico ───────────────────────────────────────────────────────────────

export const Basic: Story = {
    name: "Uso básico",
    render: () => {
        const [time, setTime] = React.useState("");
        return (
            <div className="flex flex-col gap-2 w-48">
                <Label htmlFor="time-basic">Hora de recordatorio</Label>
                <TimePicker
                    id="time-basic"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story:
                    "Uso básico del selector de hora con una etiqueta. Si necesitas seleccionar fecha y hora en conjunto, usa `DateTimePicker`.",
            },
        },
    },
};

// ─── Área de pruebas ──────────────────────────────────────────────────────────

export const Demo: Story = {
    name: "Área de pruebas",
    tags: ["!autodocs"],
    parameters: {
        controls: { disable: false },
    },
    decorators: [ToasterDecorator],
    render: (args) => {
        const [time, setTime] = React.useState("");
        return (
            <div className="flex flex-col gap-2 w-48">
                <Label htmlFor="time-demo">Hora</Label>
                <TimePicker
                    {...args}
                    id="time-demo"
                    value={time}
                    onChange={(e) => {
                        setTime(e.target.value);
                        toast.success(`Hora seleccionada: ${e.target.value}`);
                    }}
                />
            </div>
        );
    },
};
