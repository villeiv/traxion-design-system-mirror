import {Button, Label, Input, Popover, PopoverContent, PopoverTrigger} from "@traxion-global/design-system/react";
import {PopoverAnatomy} from "./sources/Popover.anatomy";
import PopoverControlled from "./sources/Popover.controlled";
import PopoverControlledCode from "./sources/Popover.controlled?raw";
import CalendarInputForm from "./sources/Calendar.inputForm";
import CalendarInputFormCode from "./sources/Calendar.inputForm?raw";
import CommandComboBox from "./sources/Command.comboBox";
import CommandComboBoxCode from "./sources/Command.comboBox?raw";

export default {
    title: "Popover",
    component: Popover,
    tags: ["autodocs"],
    parameters: {
        a11y: { disable: true },
        actions: { disable: true },
        controls: { disable: true },
        docs: {
            description: {
                component: "El componente **Popover** muestra contenido emergente al interactuar con un elemento disparador." + PopoverAnatomy,
            }
        }
    }
}

export const Basic = {
    name: "Uso básico no controlado",
    parameters: {
        docs: {
            description: {
                story: "Este es un ejemplo básico de un Popover no controlado que se abre al hacer clic en el botón.",
            }
        }
    },
    render: args=>{
        return <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Ver detalles de envío</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Detalles del contenedor</h4>
                        <p className="text-sm text-muted-foreground">
                            Ajusta las dimensiones o peso estimado para la carga.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="length">Largo</Label>
                            <Input id="length" defaultValue="120 cm" className="col-span-2 h-8" />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="width">Ancho</Label>
                            <Input id="width" defaultValue="80 cm" className="col-span-2 h-8" />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="height">Alto</Label>
                            <Input id="height" defaultValue="100 cm" className="col-span-2 h-8" />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="weight">Peso</Label>
                            <Input id="weight" defaultValue="200 kg" className="col-span-2 h-8" />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    }
}

export const Controlled = {
    name: "Uso controlado",
    parameters: {
        docs: {
            description: {
                story: "Este es un ejemplo de un Popover controlado donde el estado de apertura se maneja en el padre. A pesar de ser controlado, es necesario el uso de `PopoverTrigger` porque se usa para posicionar el contenido emergente.",
            },
            source: {
                code: PopoverControlledCode
            }
        }
    },
    render: PopoverControlled
}

export const ContentProps = {
    name: "Props en PopoverContent",
    parameters: {
        controls: { disable: false },
        docs: {
            description: {
                story: "El componente **PopoverContent** acepta varias props para controlar su posición y alineación en relación al disparador."
            }
        }
    },
    argTypes: {
        side: {
            control: {type: "select"},
            options: ["top", "right", "bottom", "left"],
            description: "Define el lado donde se muestra el contenido emergente en relación al disparador.",
        },
        sideOffset: {
            control: {type: "number",},
            description: "Define la distancia en píxeles entre el contenido emergente y el disparador.",
        },
        align: {
            control: {type: "select"},
            options: ["start", "center", "end", "stretch"],
            description: "Define la alineación del contenido emergente en relación al disparador.",
        },
        alignOffset: {
            control: {type: "number",},
            description: "Define el desplazamiento en píxeles del contenido emergente respecto a su alineación.",

        }
    },
    args:{
        side: "bottom",
        sideOffset: 4,
        align: "center",
        alignOffset: 0,
    },
    render: args=>{
        return <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Ver detalles de envío</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" {...args}>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Detalles del contenedor</h4>
                        <p className="text-sm text-muted-foreground">
                            Ajusta las dimensiones o peso estimado para la carga.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="length">Largo</Label>
                            <Input id="length" defaultValue="120 cm" className="col-span-2 h-8" />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="width">Ancho</Label>
                            <Input id="width" defaultValue="80 cm" className="col-span-2 h-8" />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="height">Alto</Label>
                            <Input id="height" defaultValue="100 cm" className="col-span-2 h-8" />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="weight">Peso</Label>
                            <Input id="weight" defaultValue="200 kg" className="col-span-2 h-8" />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    }
}

export const CalendarPopover = {
    name: "Popover con calendario",
    parameters: {
        docs: {
            description: {
                story: "El Popover es ideal para mostrar un calendario emergente al seleccionar una fecha.",
            },
            source: {
                code: CalendarInputFormCode
            }
        }
    },
    render: CalendarInputForm
}

export const ComboBoxPopover = {
    name: "Popover como ComboBox",
    parameters: {
        docs: {
            description: {
                story: "El Popover puede usarse para crear un ComboBox personalizado, mostrando una lista de opciones al interactuar con el campo de entrada.",
            },
            source: {
                code: CommandComboBoxCode
            }
        }
    },
    render: CommandComboBox
}