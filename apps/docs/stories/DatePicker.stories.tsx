import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "@traxion-global/design-system/react";

import { DatePickerAnatomy } from "./sources/DatePicker.anatomy";
import DatePickerUncontrolled from "./sources/DatePicker.uncontrolled";
import DatePickerUncontrolledCode from "./sources/DatePicker.uncontrolled?raw";
import DatePickerControlled from "./sources/DatePicker.controlled";
import DatePickerControlledCode from "./sources/DatePicker.controlled?raw";
import DatePickerWithDropdown from "./sources/DatePicker.withDropdown";
import DatePickerWithDropdownCode from "./sources/DatePicker.withDropdown?raw";
import DatePickerWithDateRestrictions from "./sources/DatePicker.withDateRestrictions";
import DatePickerWithDateRestrictionsCode from "./sources/DatePicker.withDateRestrictions?raw";
import DatePickerRangePicker from "./sources/DatePicker.rangePicker";
import DatePickerRangePickerCode from "./sources/DatePicker.rangePicker?raw";
import DatePickerTimePicker from "./sources/DatePicker.timePicker";
import DatePickerTimePickerCode from "./sources/DatePicker.timePicker?raw";
import DatePickerDateTimePicker from "./sources/DatePicker.dateTimePicker";
import DatePickerDateTimePickerCode from "./sources/DatePicker.dateTimePicker?raw";
import DatePickerWithForm from "./sources/DatePicker.withForm";
import DatePickerWithFormCode from "./sources/DatePicker.withForm?raw";

const meta = {
    title: "DatePicker",
    component: DatePicker,
    tags: ["autodocs"],
    parameters: {
        controls: { disable: true },
        actions: { disable: true },
        a11y: { disable: true },
        docs: {
            description: {
                component: `
El módulo **DatePicker** proporciona cuatro componentes de selección de fechas y horas para formularios y filtros.

### Importación
\`\`\`tsx
import {
    DatePicker,
    DateRangePicker,
    TimePicker,
    DateTimePicker,
} from "@traxion-global/design-system/react";

// Tipo auxiliar (no requiere instalar react-day-picker)
import type { DateRange } from "@traxion-global/design-system/react";
\`\`\`

${DatePickerAnatomy}
                `,
            },
        },
    },
    argTypes: {
        placeholder: {
            control: "text",
            description: "Texto mostrado cuando no hay fecha seleccionada.",
        },
        disabled: {
            control: "boolean",
            description: "Deshabilita el selector completo.",
        },
        localeCode: {
            control: { type: "radio" },
            options: ["es", "en"],
            description: "Idioma del calendario (`es` o `en`).",
        },
        dateFormat: {
            control: "text",
            description:
                "Formato de fecha usando tokens de `date-fns` (p. ej. `PPP`, `dd/MM/yyyy`).",
        },
        captionLayout: {
            control: { type: "select" },
            options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
            description:
                "Diseño del encabezado para navegar mes y año. `label` muestra el mes y año como texto estático. `dropdown` muestra controles desplegables para cambiar mes y año directamente — recomendado cuando el usuario probablemente quiera seleccionar una fecha lejana a la actual (p. ej. fecha de nacimiento, fechas históricas).",
        },
        fromDate: {
            control: "date",
            description: "Fecha mínima seleccionable.",
        },
        toDate: {
            control: "date",
            description: "Fecha máxima seleccionable.",
        },
        className: {
            control: "text",
            description:
                "Clases CSS adicionales aplicadas al botón disparador.",
        },
    },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Área de pruebas (first in sidebar) ──────────────────────────────────────

export const Demo: Story = {
    name: "Área de pruebas",
    tags: ["!autodocs"],
    parameters: {
        controls: { disable: false },
        actions: { disable: false },
    },
    render: (args) => {
        const [date, setDate] = React.useState<Date | undefined>();
        // Storybook date controls return Unix timestamps (numbers), not Date objects
        const fromDate = args.fromDate ? new Date(args.fromDate) : undefined;
        const toDate = args.toDate ? new Date(args.toDate) : undefined;
        return (
            <DatePicker
                {...args}
                fromDate={fromDate}
                toDate={toDate}
                value={date}
                onChange={setDate}
            />
        );
    },
};

// ─── DatePicker ───────────────────────────────────────────────────────────────

export const Uncontrolled: Story = {
    name: "Implementación no controlada",
    render: () => <DatePickerUncontrolled />,
    parameters: {
        docs: {
            description: {
                story: "El componente gestiona su propio estado interno. Usa `defaultValue` para establecer un valor inicial sin necesidad de controlar el estado externamente.",
            },
            source: { code: DatePickerUncontrolledCode },
        },
    },
};

export const Controlled: Story = {
    name: "Implementación controlada",
    render: () => <DatePickerControlled />,
    parameters: {
        docs: {
            description: {
                story: "El valor es controlado externamente con `useState`. Usa `value` y `onChange` para integrar el picker en formularios o para sincronizar la selección con otros componentes.",
            },
            source: { code: DatePickerControlledCode },
        },
    },
};

export const WithDropdown: Story = {
    name: "Con navegación por desplegables",
    render: () => <DatePickerWithDropdown />,
    parameters: {
        docs: {
            description: {
                story: "Con `captionLayout=\"dropdown\"` el encabezado muestra desplegables de mes y año para navegar rápidamente a fechas lejanas, ideal para campos como fecha de nacimiento.",
            },
            source: { code: DatePickerWithDropdownCode },
        },
    },
};

export const WithDateRestrictions: Story = {
    name: "Con restricción de fechas",
    render: () => <DatePickerWithDateRestrictions />,
    parameters: {
        docs: {
            description: {
                story: "Usando `fromDate` y `toDate` se restringen las fechas seleccionables. Las fechas fuera del rango aparecen deshabilitadas y la navegación del calendario queda limitada al período permitido.",
            },
            source: { code: DatePickerWithDateRestrictionsCode },
        },
    },
};

// ─── DateRangePicker ──────────────────────────────────────────────────────────

export const RangePicker: Story = {
    name: "Selector de rango de fechas",
    render: () => <DatePickerRangePicker />,
    parameters: {
        docs: {
            description: {
                story: "El componente `DateRangePicker` permite seleccionar un período. La selección en el calendario no se confirma hasta que el usuario presiona **Aplicar**. El botón **Limpiar** descarta la selección pendiente.",
            },
            source: { code: DatePickerRangePickerCode },
        },
    },
};

// ─── TimePicker ───────────────────────────────────────────────────────────────

export const TimePickerStory: Story = {
    name: "Selector de hora",
    render: () => <DatePickerTimePicker />,
    parameters: {
        docs: {
            description: {
                story: "El componente `TimePicker` es un `<input type=\"time\">` estilizado con el sistema de diseño. Utiliza los controles nativos del navegador (teclado, rueda del ratón, AM/PM según el sistema). Paso de 1 minuto, sin segundos.",
            },
            source: { code: DatePickerTimePickerCode },
        },
    },
};

// ─── DateTimePicker ───────────────────────────────────────────────────────────

export const DateTimePickerStory: Story = {
    name: "Selector de fecha y hora",
    render: () => <DatePickerDateTimePicker />,
    parameters: {
        docs: {
            description: {
                story: "El componente `DateTimePicker` combina el calendario y el selector de hora en un único popover. Selecciona el día en el calendario, ajusta la hora con los controles nativos y confirma con **Aplicar**. La hora se preserva al cambiar de día.",
            },
            source: { code: DatePickerDateTimePickerCode },
        },
    },
};

// ─── Uso en formulario ────────────────────────────────────────────────────────

export const InForm: Story = {
    name: "Integración en formulario",
    render: () => <DatePickerWithForm />,
    parameters: {
        docs: {
            description: {
                story: "Ejemplo de los cuatro componentes usados juntos dentro de un formulario real: `DatePicker` con fecha mínima, `DateRangePicker`, `DateTimePicker` con dropdown y `TimePicker` autónomo.",
            },
            source: { code: DatePickerWithFormCode },
        },
    },
};
