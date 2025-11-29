import {NoDataMessage} from "@traxion-global/design-system/react";

export default {
    title: "NoDataMessage",
    component: NoDataMessage,
    tags: ["autodocs"],
    argTypes: {
        title: { control: "text", description: "Título principal" },
        message: { control: "text", description: "Mensaje descriptivo" },
    },
    parameters: {
        //escondo accesibilidad y acciones porque no aplican
        actions: { disable: true },
        a11y: { disable: true },
        controls: { disable: true },
        docs: {
            description: {
                component: "El componente **NoDataMessage** muestra un mensaje cuando no hay datos disponibles.",
            }
        }
    }
};

export const Playground = {
    name: "Área de pruebas",
    tags: ["!autodocs"],
    args: {
        title: "Sin resultados",
        message: "No se encontraron datos para mostrar.",
    },
    parameters: {
        controls: { disable: false },
        docs: {
            codePanel: false
        }
    }
}

export const SinFacturas = {
    args: {
        title: "No hay facturas",
        message: "Todavía no se han generado facturas en este periodo.",
    },
    parameters: {
        docs: {
            description: {
                story: "Usa este componente para informar a los usuarios cuando no hay datos disponibles en una sección específica, como facturas, productos, etc.",
            }
        }
    }
};

export const SinPermisos = {
    args: {
        title: "Acceso restringido",
        message: "No tienes permisos para ver esta sección.",
    },
    parameters: {
        docs: {
            description: {
                story: "Usa este componente para informar a los usuarios cuando no tienen permisos para acceder a una sección específica.",
            }
        }
    }
};