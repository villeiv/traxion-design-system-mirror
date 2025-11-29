import {
    Button,
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@traxion-global/design-system/react";
import {DropdownMenuAnatomy} from "./sources/DropdownMenu.anatomy";
import DropdownMenuControlled from "./sources/DropdownMenu.controlled";
import DropdownMenuControlledCode from "./sources/DropdownMenu.controlled?raw";
import ToasterDecorator from "./decorators/ToasterDecorator";
import DropDownMenuItems from "./sources/DropDownMenu.items";
import DropDownMenuItemsCode from "./sources/DropDownMenu.items?raw";
import DropdownMenuRich from "./sources/DropdownMenu.rich";
import DropdownMenuRichCode from "./sources/DropdownMenu.rich?raw";

export default {
    title: "DropDownMenu",
    component: DropdownMenu,
    tags: ["autodocs"],
    parameters: {
        a11y: {disable: true},
        controls: {disable: true},
        actions: {disable: true},
        docs: {
            description: {
                component: "El componente **DropdownMenu** sirve para mostrar un menú desplegable con opciones." + DropdownMenuAnatomy,
            }
        }
    }
}

export const Basic = {
    name: "Uso básico (no controlado)",
    parameters: {
        docs: {
            description: {
                story: "Uso básico del componente **DropdownMenu**. La apertura y cierre del menú se maneja de forma interna."
            }
        }
    },
    render: args => {
        return <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Opciones del transporte</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Gestión de ruta escolar</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Ver rutas asignadas</DropdownMenuItem>
                <DropdownMenuItem>Consultar horarios</DropdownMenuItem>
                <DropdownMenuItem>Reportar retraso</DropdownMenuItem>
                <DropdownMenuItem>Solicitar cambio de parada</DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    }
}

export const Controlled = {
    name: "Controlado",
    parameters: {
        docs: {
            description: {
                story: "El estado de apertura y cierre del menú se maneja externamente en el padre."
            },
            source: {
                code: DropdownMenuControlledCode
            }
        }
    },
    render: DropdownMenuControlled
}

export const RichItems = {
    name: "Submenú, checkbox y radio",
    parameters: {
        docs: {
            description: {
                story:
                    "Demuestra submenús, opciones con estado (checkbox/radio) y un ítem destructivo con icono y atajo.",
            },
            source: {
                code: DropdownMenuRichCode
            }
        },
    },
    render: DropdownMenuRich
};

export const ContentProps = {
    name: "Props en DropdownMenuContent",
    parameters: {
        controls: {disable: false},
        docs: {
            description: {
                story: "El componente **DropdownMenuContent** acepta las props `side`, `align`, `sideOffset` y `alignOffset` para controlar la posición del contenido respecto al trigger."
            }
        }
    },
    argTypes: {
        side: {
            control: {type: "select"},
            options: ["top", "right", "bottom", "left"],
            description: "Lado del trigger donde se posiciona el contenido."
        },
        align: {
            control: {type: "select"},
            options: ["start", "center", "end"],
            description: "Alineación del contenido respecto al trigger."

        },
        sideOffset: {
            control: {type: "number"},
            description: "Desplazamiento en píxeles desde el lado especificado por la prop `side`."
        },
        alignOffset: {
            control: {type: "number"},
            description: "Desplazamiento en píxeles desde la alineación especificada por la prop `align`."

        },
        className:{
            control: {type: "text"},
            description: "Permite añadir clases personalizadas para estilizar el contenido del menú."
        }
    },
    args: {
        side: "bottom",
        align: "start",
        sideOffset: 10,
        alignOffset: 0,
        className: "w-56"
    },
    render: args => {
        return <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Opciones del transporte</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent {...args}>
                <DropdownMenuLabel>Gestión de ruta escolar</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Ver rutas asignadas</DropdownMenuItem>
                <DropdownMenuItem>Consultar horarios</DropdownMenuItem>
                <DropdownMenuItem>Reportar retraso</DropdownMenuItem>
                <DropdownMenuItem>Solicitar cambio de parada</DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    }
}

export const ItemProps = {
    name: "Items deshabilitados y con acción",
    parameters: {
        docs: {
            description: {
                story: "El componente **DropdownMenuItem** acepta las props `disabled` y `onSelect` para controlar su estado y comportamiento."
            },
            source: {
                code: DropDownMenuItemsCode
            }
        }
    },
    decorators: [ToasterDecorator],
    argTypes: {
        disabled: {
            control: {type: "boolean"},
            description: "Deshabilita la opción del menú si es true."

        },
        onSelect: {
            control: {type: "none"},
            description: "Función que se ejecuta al seleccionar la opción del menú."
        }
    },
    render: DropDownMenuItems
}