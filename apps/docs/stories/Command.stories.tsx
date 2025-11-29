import {Command} from "@traxion-global/design-system/react";
import {CommandAnatomy} from "./sources/Command.anatomy";
import ToasterDecorator from "./decorators/ToasterDecorator";
import CommandInDialog from "./sources/Command.InDialog";
import CommandInDialogCode from "./sources/Command.InDialog?raw";
import CommandBasic from "./sources/Command.basic";
import CommandBasicCode from "./sources/Command.basic?raw";
import CommandControlled from "./sources/Command.controlled";
import CommandControlledCode from "./sources/Command.controlled?raw";
import CommandCustomFilter from "./sources/Command.customFilter";
import CommandCustomFilterCode from "./sources/Command.customFilter?raw";
import CommandGroups from "./sources/Command.groups";
import CommandGroupsCode from "./sources/Command.groups?raw";
import CommandKeywords from "./sources/Command.keywords";
import CommandKeywordsCode from "./sources/Command.keywords?raw";
import CommandLoading from "./sources/CommandLoading";
import CommandLoadingCode from "./sources/CommandLoading?raw";
import CommandComboBox from "./sources/Command.comboBox";
import CommandComboBoxCode from "./sources/Command.comboBox?raw";

export default {
    title: 'Command',
    component: Command,
    tags: ['autodocs'],
    parameters: {
        a11y: { disable: true },
        actions: { disable: true },
        controls: { disable: true },
        docs: {
            description: {
                component: 'El componente **Command** ofrece una interfaz flexible para buscar, filtrar y ejecutar acciones dentro de la aplicación. Se puede adaptar fácilmente como paleta de comandos, cuadro de búsqueda o menú interactivo, manteniendo accesibilidad y soporte completo para teclado.' + CommandAnatomy
            }
        }
    },
    argTypes: {
        className: {control: "text"},
        value: {control: "text"},
        onValueChange: {action: "value changed"}
    }
}

export const Basic = {
    name: "Uso básico",
    parameters: {
        docs: {
            description: {
                story: "Ejemplo de un menú de comandos básico que permite filtrar y seleccionar opciones dentro del mismo contenedor."
            },
            source: {
                code: CommandBasicCode
            }
        }
    },
    render: CommandBasic
};

export const InDialog = {
    name: "Dentro de un diálogo",
    parameters: {
        docs: {
            description: {
                story: "Ejemplo de un menú de comandos desplegado dentro de un cuadro de diálogo, ideal para búsquedas o accesos globales."
            },
            source: {
                code: CommandInDialogCode
            }
        },

    },
    decorators: [ToasterDecorator],
    render: CommandInDialog
};

export const ControlledValue = {
    name:"Componente controlado",
    parameters: {
        docs: {
            description: {
                story: "Ejemplo de un menú de comandos controlado mediante estado, donde el valor de búsqueda se actualiza desde el componente padre."
            },
            source: {
                code: CommandControlledCode
            }
        }
    },
    render: CommandControlled
};

export const CustomFilter = {
    name: "Filtro personalizado",
    parameters: {
        docs: {
            description: {
                story: "Ejemplo de un filtro personalizado que modifica la lógica de coincidencia de resultados dentro del menú de comandos."
            },
            source: {
                code: CommandCustomFilterCode
            }
        }
    },
    render: CommandCustomFilter
};

export const GroupsAndSeparator = {
    name: "Grupos y separadores",
    parameters: {
        docs: {
            description: {
                story: "Ejemplo de un menú de comandos que agrupa opciones por categorías e incluye separadores y atajos de teclado. El sub componente CommandShortcut solo se encarga de la distinción visual, no habilita la funcionalidad."
            },
            source: {
                code: CommandGroupsCode
            }
        }
    },
    render: CommandGroups
};

export const KeywordsAndOnSelect = {
    name: "Palabras clave y onSelect",
    decorators: [ToasterDecorator],
    parameters: {
        docs: {
            description: {
                story: "Ejemplo de comandos que usan palabras clave adicionales (keywords) y ejecutan acciones al seleccionarse con onSelect."
            },
            source: {
                code: CommandKeywordsCode
            }
        }
    },
    render: CommandKeywords
};

export const Loading = {
    name: "Con estado de carga",
    parameters: {
        docs: {
            description: {
                story: "Ejemplo de manejo de estado de carga dentro del menú de comandos antes de mostrar los resultados."
            },
            source: {
                code: CommandLoadingCode
            }
        }
    },
    render: CommandLoading
};

export const ComboBox = {
    name: "Como ComboBox con Popover",
    parameters: {
        docs: {
            description: {
                story: "Ejemplo de uso del menú de comandos como un ComboBox desplegable usando Popover."
            },
            source: {
                code: CommandComboBoxCode
            }
        }
    },
    render: CommandComboBox

}