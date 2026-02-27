import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DatePicker, toast } from "@traxion-global/design-system/react";
import ToasterDecorator from "./decorators/ToasterDecorator";

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
import DatePickerDateTimePicker from "./sources/DatePicker.dateTimePicker";
import DatePickerDateTimePickerCode from "./sources/DatePicker.dateTimePicker?raw";
import DatePickerWithForm from "./sources/DatePicker.withForm";
import DatePickerWithFormCode from "./sources/DatePicker.withForm?raw";
import DatePickerDateTimeRangePickerDashboard from "./sources/DatePicker.dateTimeRangePickerDashboard";
import DatePickerDateTimeRangePickerDashboardCode from "./sources/DatePicker.dateTimeRangePickerDashboard?raw";

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
El módulo **DatePicker** proporciona tres componentes de selección de fechas para formularios y filtros.

### Importación
\`\`\`tsx
import {
    DatePicker,
    DateRangePicker,
    DateTimePicker,
    DateTimeRangePicker,
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
                "Clases CSS adicionales aplicadas al contenedor externo.",
        },
    },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Área de pruebas (first in sidebar) ──────────────────────────────────────

export const Demo: Story = {
    name: "Área de pruebas",
    tags: ["!autodocs"],
    decorators: [ToasterDecorator],
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
                onChange={(d) => {
                    setDate(d);
                    if (d) toast.success(`Fecha: ${format(d, "PPP", { locale: es })}`);
                }}
            />
        );
    },
};

// ─── DatePicker ───────────────────────────────────────────────────────────────

export const Uncontrolled: Story = {
    name: "Implementación no controlada",
    decorators: [ToasterDecorator],
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
    decorators: [ToasterDecorator],
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
    decorators: [ToasterDecorator],
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
    decorators: [ToasterDecorator],
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
    decorators: [ToasterDecorator],
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

// ─── DateTimePicker ───────────────────────────────────────────────────────────

export const DateTimePickerStory: Story = {
    name: "Selector de fecha y hora",
    decorators: [ToasterDecorator],
    render: () => <DatePickerDateTimePicker />,
    parameters: {
        docs: {
            description: {
                story: "El componente `DateTimePicker` combina el calendario y el selector de hora en un único popover. Selecciona el día en el calendario, ajusta la hora con los controles nativos y confirma con **Aplicar**. La hora se preserva al cambiar de día. Si solo necesitas seleccionar una hora sin fecha, usa el componente [`TimePicker`](?path=/docs/timepicker--docs).",
            },
            source: { code: DatePickerDateTimePickerCode },
        },
    },
};

// ─── DateTimeRangePicker ──────────────────────────────────────────────────────

export const DateTimeRangePickerDashboard: Story = {
    name: "Selector de rango de fechas y hora",
    render: DatePickerDateTimeRangePickerDashboard,
    parameters: {
        docs: {
            description: {
                story: "El componente `DateTimeRangePicker` combina la selección de rango de fechas con controles de hora para el inicio y el fin del período. Selecciona las fechas en el calendario, ajusta las horas con los selectores nativos y confirma con **Aplicar**. Al aplicar, las tarjetas de métricas se actualizan simulando la carga de datos del período seleccionado.",
            },
            source: { code: DatePickerDateTimeRangePickerDashboardCode },
        },
    },
};

// ─── Uso en formulario ────────────────────────────────────────────────────────

export const InForm: Story = {
    name: "Ejemplo con todos los selectores",
    decorators: [ToasterDecorator],
    render: DatePickerWithForm,
    parameters: {
        docs: {
            description: {
                story: "Ejemplo de los cuatro componentes de fecha usados junto con `TimePicker` dentro de un formulario real: `DatePicker` con fecha mínima, `DateRangePicker`, `DateTimePicker` con dropdown, `DateTimeRangePicker` para una ventana de recolección y `TimePicker` autónomo.",
            },
            source: { code: DatePickerWithFormCode },
        },
    },
};
