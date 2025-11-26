import {Button, HoverCard, HoverCardContent, HoverCardTrigger} from "@traxion-global/design-system";
import {Car, ChevronDown, Pin} from "lucide-react";
import FacebookHoverCard from "./sources/HoverCard.facebookCard";
import HoverCardControlled from "./sources/HoverCard.controlled";
import HoverCardControlledCode from "./sources/HoverCard.controlled?raw";
import {HoverCardAnatomy} from "./sources/HoverCard.anatomy";

export default {
    title: 'HoverCard',
    component: HoverCard,
    tags: ['autodocs'],
    parameters: {
        actions: {disable: true},
        a11y: {disable: true},
        docs: {
            description: {
                component: "El componente **HoverCard** es una interfaz de usuario que muestra información adicional cuando el usuario pasa el ratón sobre un elemento activador." + HoverCardAnatomy
            }
        }
    },
    argTypes: {
        openDelay: {
            control: 'number',
            description: 'Retraso en milisegundos antes de que la tarjeta de información aparezca al pasar el ratón sobre el elemento activador.'
        },
        closeDelay: {
            control: 'number',
            description: 'Retraso en milisegundos antes de que la tarjeta de información desaparezca después de que el ratón salga del elemento activador o de la tarjeta de información.'
        }
    },
    args:{
        openDelay: 100,
        closeDelay: 100
    }
}

export const Playground = {
    name: 'Área de pruebas HoverCard',
    tags: ['!autodocs'],
    render: args => (
        <HoverCard {...args}>
            <HoverCardTrigger asChild>
                <Button variant={"outline"}>Síguenos en Facebook<ChevronDown />
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-96">
                <FacebookHoverCard />
            </HoverCardContent>
        </HoverCard>
    )
}

export const HoverCardContentProps = {
    name: 'Área de pruebas HoverCardContent',
    tags: ['!autodocs'],
    parameters:{
        docs: {
            description: {
                story: 'El componente **HoverCardContent** acepta varias propiedades para personalizar su comportamiento y apariencia, como `side`, `align`, `sideOffset`, `alignOffset`, `arrow`, entre otras.'
            }
        }
    },
    argTypes: {
        openDelay: { control:false, table: {disable: true} },
        closeDelay: { control:false, table: {disable: true} },
        side: {
            control: {type: 'select'},
            options: ['top', 'right', 'bottom', 'left'],
            description: 'Define el lado en el que se muestra la tarjeta de información en relación con el elemento activador.'
        },
        align: {
            control: {type: 'select'},
            options: ['start', 'center', 'end'],
            description: 'Define la alineación de la tarjeta de información en relación con el elemento activador.'
        },
        sideOffset: {
            control: 'number',
            description: 'Define el desplazamiento en píxeles desde el lado especificado.'
        },
        alignOffset: {
            control: 'number',
            description: 'Define el desplazamiento en píxeles desde la alineación especificada.'
        }
    },
    args: {
        side: 'bottom',
        align: 'start',
        sideOffset: 10,
        alignOffset: 10,
    },
    render:args=>{
        //args without openDelay and closeDelay
        const {openDelay, closeDelay, ...rest} = args;

        return <nav>
            <HoverCard open={true}>
                <HoverCardTrigger asChild>
                    <Button variant={"outline"}>Menú<ChevronDown /></Button>
                </HoverCardTrigger>
                <HoverCardContent className={"w-[30rem] flex p-2 gap-2 rounded-lg"} {...rest}>
                    <a href={"#"} className={"flex gap-2 p-3 rounded-lg hover:bg-dark/5"}>
                        <Car className={"w-8 h-8"} />
                        <div>
                            <p className="font-medium text-base text-black mb-1">Reservar transporte</p>
                            <p className="text-xs text-muted-foreground">Reserva servicios de transporte personal para tus traslados.</p>
                        </div>
                    </a>
                    <a href={"#"} className={"flex gap-2 p-3 rounded-lg hover:bg-dark/5"}>
                        <Pin className={"w-8 h-8"} />
                        <div>
                            <p className="font-medium text-base text-black mb-1">Mis viajes</p>
                            <p className="text-xs text-muted-foreground">Consulta y gestiona tus viajes de transporte personal programados.</p>
                        </div>
                    </a>
                </HoverCardContent>
            </HoverCard>
        </nav>
    }
}

export const Uncontrolled = {
    name: 'Componente no controlado',
    parameters:{
        controls: {disable: true},
        docs: {
            description: {
                story: 'El componente **HoverCard** puede funcionar de manera no controlada automáticamente, gestionando internamente su propio estado de apertura y cierre.'
            }
        }
    },
    render:args=>{
        return (
            <HoverCard>
                <HoverCardTrigger asChild>
                    <Button variant={"outline"}>Síguenos en Facebook<ChevronDown />
                    </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-96">
                    <FacebookHoverCard />
                </HoverCardContent>
            </HoverCard>
        )
    }
}

export const Controlled = {
    name: 'Componente controlado',
    parameters:{
        controls: {disable: true},
        docs: {
            description: {
                story: 'El componente **HoverCard** también puede ser controlado externamente mediante las propiedades `open` y `onOpenChange`, permitiendo un control total sobre su estado de apertura y cierre.'
            },
            source: {
                code: HoverCardControlledCode
            }
        }
    },
    render:HoverCardControlled
}

export const HoverAsMenuDetail = {
    name: 'Navegador con detalle',
    parameters:{
        controls: {disable: true},
        docs: {
            description: {
                story: 'El componente **HoverCard** puede utilizarse para mostrar detalles adicionales al pasar el mouse sobre un elemento del menú.'
            }
        }
    },
    render:args=>{
        return <nav>
            <HoverCard>
                <HoverCardTrigger asChild>
                    <Button variant={"outline"}>Menú<ChevronDown /></Button>
                </HoverCardTrigger>
                <HoverCardContent className={"w-[30rem] flex p-2 gap-2 rounded-lg"}>
                    <a href={"#"} className={"flex gap-2 p-3 rounded-lg hover:bg-dark/5"}>
                        <Car className={"w-8 h-8"} />
                        <div>
                            <p className="font-medium text-base text-black mb-1">Reservar transporte</p>
                            <p className="text-xs text-muted-foreground">Reserva servicios de transporte personal para tus traslados.</p>
                        </div>
                    </a>
                    <a href={"#"} className={"flex gap-2 p-3 rounded-lg hover:bg-dark/5"}>
                        <Pin className={"w-8 h-8"} />
                        <div>
                            <p className="font-medium text-base text-black mb-1">Mis viajes</p>
                            <p className="text-xs text-muted-foreground">Consulta y gestiona tus viajes de transporte personal programados.</p>
                        </div>
                    </a>
                </HoverCardContent>
            </HoverCard>
        </nav>
    }
}

