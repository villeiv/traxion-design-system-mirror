import {Select, SelectContent, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue, SelectGroup} from "@traxion-global/design-system";
import {SelectAnatomy} from "./sources/Select.anatomy";
import ToasterDecorator from "./decorators/ToasterDecorator";
import SelectControlled from "./sources/Select.controlled";
import SelectControlledCode from "./sources/Select.controlled.tsx?raw"

export default {
    title: 'Select',
    component: Select,
    tags: ['autodocs'],
    parameters: {
        a11y: {disable: true},
        actions: {disable: true},
        controls: {disable: true},
        docs: {
            description: {
                component: 'El componente **Select** permite a los usuarios seleccionar una opción de una lista desplegable.' + SelectAnatomy
            }
        }
    }
}

export const Playground = {
    name: 'Uso básico (no controlado)',
    parameters: {
        docs: {
            description: {
                story: 'En este ejemplo, el componente **Select** no está controlado, lo que significa que maneja su propio estado interno para el valor seleccionado y el estado de apertura del menú desplegable.'
            }
        }
    },
    render:args=>{
        return <Select {...args}>
            <SelectTrigger>
                <SelectValue placeholder={"Tipo de carga"} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={"1"}>Muestras biológicas</SelectItem>
                <SelectItem value={"2"}>Medicamentos</SelectItem>
                <SelectItem value={"3"}>Productos refrigerados</SelectItem>
            </SelectContent>
        </Select>
    }
}

export const Controlled = {
    name: 'Uso controlado',
    decorators: [ToasterDecorator],
    parameters: {
        docs: {
            description: {
                story: 'En este ejemplo, el componente **Select** está controlado mediante el estado del padre. Tanto el valor seleccionado como el estado de apertura del menú desplegable.'
            },
            source: {
                code: SelectControlledCode
            }
        }
    },
    render: SelectControlled
}

export const WithFixedWidthTrigger = {
    name: 'Con ancho fijo en el trigger',
    parameters: {
        docs: {
            description: {
                story: 'El componente **Select** admite la prop className para personalizar estilos. En este caso, se establece un ancho fijo en el trigger para evitar que cambie de tamaño según el contenido seleccionado.'
            }
        }
    },
    render:args=>{
        return <Select {...args}>
            <SelectTrigger className={"w-48"}>
                <SelectValue placeholder={"Tipo de carga"} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={"1"}>Muestras biológicas</SelectItem>
                <SelectItem value={"2"}>Medicamentos</SelectItem>
                <SelectItem value={"3"}>Productos refrigerados</SelectItem>
            </SelectContent>
        </Select>
    }
}

export const Disabled = {
    name: 'Deshabilitado',
    parameters: {
        docs: {
            description: {
                story: 'El componente **Select** puede deshabilitarse para evitar la interacción del usuario.'
            }
        }
    },
    render:args=>{
        return <Select {...args} disabled>
            <SelectTrigger>
                <SelectValue placeholder={"Tipo de carga"} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={"1"}>Muestras biológicas</SelectItem>
                <SelectItem value={"2"}>Medicamentos</SelectItem>
                <SelectItem value={"3"}>Productos refrigerados</SelectItem>
            </SelectContent>
        </Select>
    }
}

export const DisabledItem = {
    name: 'Ítem deshabilitado',
    parameters: {
        docs: {
            description: {
                story: 'El componente **Select** permite deshabilitar ítems individuales dentro de la lista desplegable.'
            }
        }
    },
    render:args=>{
        return <Select {...args}>
            <SelectTrigger>
                <SelectValue placeholder={"Tipo de carga"} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={"1"}>Muestras biológicas</SelectItem>
                <SelectItem value={"2"} disabled>Medicamentos (no disponible)</SelectItem>
                <SelectItem value={"3"}>Productos refrigerados</SelectItem>
            </SelectContent>
        </Select>
    }
}

export const GroupedItems = {
    name: 'Con grupos de ítems',
    parameters: {
        docs: {
            description: {
                story: 'El componente **Select** puede organizar sus ítems en grupos para mejorar la navegación y la selección.'
            }
        }
    },
    render:args=>{
        return <Select {...args}>
            <SelectTrigger>
                <SelectValue placeholder={"Tipo de carga"} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Carga controlada</SelectLabel>
                    <SelectItem value={"1"}>Muestras biológicas</SelectItem>
                    <SelectItem value={"2"}>Medicamentos</SelectItem>
                    <SelectItem value={"3"}>Productos refrigerados</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                    <SelectLabel>Carga no controlada</SelectLabel>
                    <SelectItem value={"4"}>Documentos</SelectItem>
                    <SelectItem value={"5"}>Ropa</SelectItem>
                    <SelectItem value={"6"}>Electrónicos</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    }
}

export const SelectContentProps = {
    name: 'Props en SelectContent',
    parameters: {
        controls: {disable: false},
        docs: {
            description: {
                story: 'El componente **SelectContent** acepta varias props para personalizar su comportamiento y apariencia. En este ejemplo, se utilizan algunas de estas props para modificar la posición y el tamaño del contenido desplegable.'
            }
        }
    },
    argTypes:{
        side: {
            control: {type: "select"},
            options: ["top", "right", "bottom", "left"],
            description: "Determina el lado del trigger donde se mostrará el contenido desplegable.",

        },
        align: {
            control: {type: "select"},
            options: ["start", "center", "end", "stretch"],
            description: "Determina la alineación del contenido desplegable en relación con el trigger.",

        },
        sideOffset: {
            control: {type: "number"},
            description: "Define el desplazamiento en píxeles desde el lado especificado del trigger.",

        },
        alignOffset: {
            control: {type: "number"},
            description: "Define el desplazamiento en píxeles desde la alineación especificada del trigger.",

        }
    },
    args:{
        side: "bottom",
        align: "start",
        sideOffset: 4,
        alignOffset: 0
    },
    render:args=>{
        return <Select>
            <SelectTrigger>
                <SelectValue placeholder={"Tipo de carga"} />
            </SelectTrigger>
            <SelectContent {...args}>
                <SelectItem value={"1"}>Muestras biológicas</SelectItem>
                <SelectItem value={"2"}>Medicamentos</SelectItem>
                <SelectItem value={"3"}>Productos refrigerados</SelectItem>
            </SelectContent>
        </Select>
    }
}