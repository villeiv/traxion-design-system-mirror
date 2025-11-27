import {Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Table, TableBody, TableCell, TableHeader, TableRow} from "@traxion-global/design-system";
import {Pen, Trash} from "lucide-react";
import {TooltipAnatomy} from "./sources/Tooltip.anatomy";

export default {
    title: 'Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
    parameters: {
        a11y: {disable: true},
        actions: {disable: true},
        controls: {disable: true},
        docs: {
            description: {
                component: `
El componente **Tooltip** permite mostrar información contextual al interactuar con un elemento.  
Cada instancia de **Tooltip** debe estar contenida dentro de un **TooltipProvider** para su correcto funcionamiento. Este proveedor puede declararse una sola vez a nivel de aplicación o incluirse localmente según la estructura y necesidades del proyecto.
`+TooltipAnatomy
            }
        }
    },
    argTypes: {
        defaultOpen: {
            control: 'boolean',
            description: 'Indica si el tooltip está abierto por defecto. Recarga la página para ver el cambio.'
        },
        delayDuration: {
            control: 'number',
            description: 'Duración del retraso en milisegundos antes de que el tooltip aparezca.'
        }
    }
}

export const Playground = {
    name: "Área de pruebas Tooltip",
    tags: ['!autodocs'],
    parameters: {
        controls: {disable: false},
        docs: {
            description: {
                story: 'Este es un área de pruebas para el componente **Tooltip**. Puedes modificar las propiedades en el panel de controles para ver cómo afecta al componente.'
            }
        }
    },
    args: {
        defaultOpen: false,
        delayDuration: 200,
    },
    render: args => {
        return (
            <TooltipProvider>
                <Tooltip {...args}>
                    <TooltipTrigger>
                        <Button size={"icon"}><Trash/></Button>
                    </TooltipTrigger>
                    <TooltipContent>Borrar</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }
}

export const PropsContent = {
    name: "Área de pruebas TooltipContent",
    tags: ['!autodocs'],
    parameters: {
        controls: {disable: false},
        docs: {
            description: {
                story: "El componente **TooltipContent** acepta varias props para personalizar su comportamiento y apariencia. A continuación se describen las principales props disponibles:"
            }
        }
    },
    argTypes: {
        defaultOpen: { control:false, table: {disable: true} },
        delayDuration: { control:false, table: {disable: true} },
        side: {
            control: 'select',
            options: ['top', 'right', 'bottom', 'left'],
            description: 'Define el lado en el que se muestra el tooltip en relación con el elemento activador.'
        },
        align: {
            control: 'select',
            options: ['start', 'center', 'end'],
            description: 'Define la alineación del tooltip en relación con el elemento activador.'
        },
        sideOffset: {
            control: 'number',
            description: 'Define el desplazamiento en píxeles desde el lado especificado.'
        },
        alignOffset: {
            control: 'number',
            description: 'Define el desplazamiento en píxeles desde la alineación especificada.'
        },
        sticky: {
            control: 'boolean',
            description: 'Si es true, el tooltip intentará mantenerse visible dentro de la ventana gráfica.'
        }
    },
    args:{
        side: 'top',
        align: 'center',
        sideOffset: 4,
        alignOffset: 0,
        sticky: false
    },
    render: args => {
        const {defaultOpen, delayDuration, ...rest} = args;
        return (
            <TooltipProvider>
                <Tooltip open={true}>
                    <TooltipTrigger>
                        <Button size={"icon"}><Trash/></Button>
                    </TooltipTrigger>
                    <TooltipContent {...rest}>Borrar</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }
}

export const MultipleTooltipsInOneProvider = {
    name: "Múltiples Tooltips en un solo Provider",
    tags: ['autodocs'],
    parameters: {
        controls: {disable: true},
        docs: {
            description: {
                story: 'Es posible utilizar múltiples instancias de **Tooltip** dentro de un solo **TooltipProvider**. Esto es útil para agrupar tooltips relacionados y optimizar el rendimiento al reducir la cantidad de proveedores necesarios en la aplicación.'
            }
        }
    },
    render: args => {
        return <TooltipProvider>
            <Table className={"w-96"}>
                <TableHeader>
                    <TableRow>
                        <TableCell>Concepto</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Facturación febrero - mayo</TableCell>
                        <TableCell>Medistik</TableCell>
                        <TableCell className={"flex gap-2"}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button size={"icon"} variant={"outline"}><Pen/></Button>
                                </TooltipTrigger>
                                <TooltipContent>Editar</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button size={"icon"} variant={"destructive"}><Trash/></Button>
                                </TooltipTrigger>
                                <TooltipContent>Borrar</TooltipContent>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                </TableBody>

            </Table>
        </TooltipProvider>
    }
}

