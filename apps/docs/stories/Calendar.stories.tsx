import * as React from "react";
import {Calendar} from "@traxion-global/design-system/react";
import CalendarRange from "./sources/Calendar.range";
import CalendarRangeCode from "./sources/Calendar.range?raw";
import CalendarWithTodayButton from "./sources/Calendar.withTodayButton";
import CalendarWithTodayButtonCode from "./sources/Calendar.withTodayButton?raw";
import CalendarInputForm from "./sources/Calendar.inputForm";
import CalendarInputFormCode from "./sources/Calendar.inputForm?raw";
import CalendarBookedDays from "./sources/Calendar.bookedDays";
import CalendarBookedDaysCode from "./sources/Calendar.bookedDays?raw";

const meta = {
    title: "Calendar",
    component: Calendar,
    tags: ["autodocs"],
    parameters: {
        docs:{
            description: {
                component: "Primitivo de calendario construido sobre react-day-picker. Úsalo directamente cuando necesites control total sobre el UI: modificadores personalizados (días reservados, destacados o bloqueados con estilos propios), selección múltiple, o un calendario embebido sin botón disparador. Para selección de fecha estándar en formularios, filtros o DataTableToolbar, usa **DatePicker**, **DateRangePicker** o **DateTimePicker** en su lugar — ya incluyen el botón disparador, el popover, la lógica de Aplicar/Limpiar y accesibilidad completa."
            }
        }
    },
    argTypes: {
        //escondemos locale
        locale: {
            table: {disable: true}
        },
        buttonVariant: {
            control: {type: "select"},
            options: ["default", "ghost", "link", "outline", "secondary", "destructive"],
            table: {category: "Customization"},
            description: "Variante visual de los botones de navegación del calendario."
        },
        mode: {
            control: {type: "radio"},
            options: ["single", "multiple", "range"],
            description: "Modo de selección.",
            table: {category: "Selection"},
        },
        startMonth: {control: "date", description: "Primer mes navegable.", table: {category: "Navigation"}},
        endMonth: {control: "date", description: "Último mes navegable.", table: {category: "Navigation"}},
        numberOfMonths: {
            control: {type: "number", min: 1, max: 12},
            table: {category: "Navigation"},
            description: "Cantidad de meses visibles simultáneamente."
        },
        weekStartsOn: {
            control: {type: "select"},
            options: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            mapping: {"Domingo": 0, "Lunes": 1, "Martes": 2, "Miércoles": 3, "Jueves": 4, "Viernes": 5, "Sábado": 6},
            table: {category: "Localization"},
            description: "Día en que inicia la semana."
        },
        showOutsideDays: {
            control: "boolean",
            table: {category: "Customization"},
            description: "Muestra días del mes anterior/siguiente dentro de la cuadrícula."
        },
        hideNavigation: {
            control: "boolean",
            table: {category: "Navigation"},
            description: "Oculta los controles de navegación (prev/next/selector)."
        },
        captionLayout: {
            control: {type: "select"},
            options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
            table: {category: "Navigation"},
            description: "Diseño del encabezado para mostrar/navegar mes y año."
        },
        disabled: {
            control: {type: "select"},
            options: [
                "No deshabilitar ninguna fecha",
                "Ej.: Deshabilitar todas las fechas anteriores a hoy y posteriores a 10 días desde hoy",
                "Ej.: Deshabilitar el rango desde hoy hasta dentro de 3 días (inclusive)",
                "Ej.: Deshabilitar todos los domingos y martes"
            ],
            mapping: {
                "No deshabilitar ninguna fecha": undefined,
                "Ej.: Deshabilitar todas las fechas anteriores a hoy y posteriores a 10 días desde hoy": {before: new Date(), after: new Date().setDate(new Date().getDate() + 10)},
                "Ej.: Deshabilitar el rango desde hoy hasta dentro de 3 días (inclusive)": {from: new Date(), to: new Date().setDate(new Date().getDate() + 3)},
                "Ej.: Deshabilitar todos los domingos y martes": {dayOfWeek: [0, 2]}
            },
            description: "Matchers para deshabilitar fechas: { before, after } para límites (e.g., { before: new Date() }), { from, to } para rangos (e.g., { from: d1, to: d2 }), { dayOfWeek } para días específicos (e.g., { dayOfWeek: [0,6] }), o una función (date) => boolean (e.g., date.getDay() === 2).",
            table: {category: "Selection"},
        },
        localeCode: {
            control: {type: "select"},
            options: ["es", "en"],
            description: "El prop localeCode acepta 'es' y 'en' (locales internos del componente). Si necesitas otro idioma, puedes importar cualquier locale de date-fns/locale y pasarlo directamente al prop locale, ignorando localeCode.",
            table: {category: "Localization"},
        },
        hidden: {
            control: {type: "select"},
            options: [
                "No esconder ninguna fecha",
                "Ej.: Esconder todas las fechas anteriores a hoy y posteriores a 10 días desde hoy",
                "Ej.: Esconder el rango desde hoy hasta dentro de 3 días (inclusive)",
                "Ej.: Esconder todos los domingos y martes"
            ],
            mapping: {
                "No esconder ninguna fecha": undefined,
                "Ej.: Esconder todas las fechas anteriores a hoy y posteriores a 10 días desde hoy": {before: new Date(), after: new Date().setDate(new Date().getDate() + 10)},
                "Ej.: Esconder el rango desde hoy hasta dentro de 3 días (inclusive)": {from: new Date(), to: new Date().setDate(new Date().getDate() + 3)},
                "Ej.: Esconder todos los domingos y martes": {dayOfWeek: [0, 2]}
            },
            description: "Matcher(es) para ocultar fechas (e.g., [{ before }, { after }]).",
            table: {category: "Selection"},
        },
        className: {
            control: "text",
            table: {category: "Customization"},
            description: "Clases CSS adicionales para el contenedor del componente."
        }
    }
};

export default meta;

export const Playground = {
    name: "Área de pruebas",
    tags: ["!autodocs"],
    parameters: {
        actions: {disable: true},
        a11y: {disable: true},
        docs: {
            codePanel: true
        }
    },
    args: {
        mode: "single",
        className: "rounded-md border shadow bg-background p-2",
        showOutsideDays: true,
        hideNavigation: false,
        numberOfMonths: 1,
    },
};

export const RangeWithTwoMonths = {
    name: "Selección rango con dos meses",
    parameters: {
        actions: {disable: true},
        a11y: {disable: true},
        controls:{disable: true},
        docs: {
            description: {
                story: "Ejemplo de calendario con selección de rango y mostrando dos meses simultáneamente."
            },
            source: {
                code: CalendarRangeCode
            }
        }
    },
    render:CalendarRange
}

export const CalendarWithTodayBtn = {
    name: "Calendario con botón 'Hoy'",
    parameters: {
        actions: {disable: true},
        a11y: {disable: true},
        controls:{disable: true},
        docs: {
            description: {
                story: "Ejemplo de calendario con botón 'Hoy' para navegar rápidamente al mes actual."
            },
            source: {
                code: CalendarWithTodayButtonCode
            }
        }
    },
    render:CalendarWithTodayButton
}

export const InputWithCalendar = {
    name: "Selección de fecha en formulario — usa DatePicker",
    parameters: {
        actions: {disable: true},
        a11y: {disable: true},
        controls:{disable: true},
        docs: {
            description: {
                story: "Para selección de fecha en formularios usa **DatePicker** en lugar de Calendar+Popover manualmente. DatePicker gestiona el estado del popover, el formato de la fecha, el ícono y la accesibilidad por ti con una sola línea de código."
            },
            source: {
                code: CalendarInputFormCode
            }
        }
    },
    render:CalendarInputForm
}

export const BookedDaysWithModifiers = {
    name: "Días reservados con modificadores",
    parameters: {
        actions: {disable: true},
        a11y: {disable: true},
        controls:{disable: true},
        docs: {
            description: {
                story: "Ejemplo de calendario que muestra días reservados usando modificadores para estilos personalizados."
            },
            source: {
                code: CalendarBookedDaysCode
            }
        }
    },
    render:CalendarBookedDays
}