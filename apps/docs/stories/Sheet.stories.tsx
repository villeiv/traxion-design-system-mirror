import {Button, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@traxion-global/design-system";
import {SheetAnatomy} from "./sources/Sheet.anatomy";
import SheetControlled from "./sources/Sheet.controlled";
import SheetControlledCode from "./sources/Sheet.controlled?raw";
import SheetForm from "./sources/Sheet.form";
import SheetFormCode from "./sources/Sheet.form?raw";
import SheetList from "./sources/Sheet.list";
import SheetListCode from "./sources/Sheet.list?raw";
import SheetNotifications from "./sources/Sheet.notifications";
import SheetNotificationsCode from "./sources/Sheet.notifications?raw";

export default {
    title: "Sheet",
    component: Sheet,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
        a11y: {disable: true},
        actions: {disable: true},
        controls: {disable: true},
        docs: {
            description: {
                component: 'El componente **Sheet** se utiliza para mostrar contenido en un panel deslizante desde un borde de la pantalla. Es útil para mostrar menús, formularios o información adicional sin cambiar de página.' + SheetAnatomy
            }
        }
    }
}

export const Basic = {
    name: "Uso básico (no controlado)",
    parameters: {
        docs: {
            description: {
                story: 'El componente **Sheet** puede ser utilizado de manera no controlada, donde el estado de apertura y cierre se maneja internamente.'
            }
        }
    },
    render: args => (
        <Sheet>
            <SheetTrigger>
                <Button>Abrir Sheet</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Título</SheetTitle>
                    <SheetDescription>Descripción</SheetDescription>
                    <div>
                        Contenido principal del Sheet.
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export const Controlled = {
    name: "Uso controlado",
    parameters: {
        docs: {
            description: {
                story: 'El componente **Sheet** también puede ser controlado externamente mediante las propiedades `open` y `onOpenChange`. Esto permite abrir o cerrar el Sheet desde fuera del componente, proporcionando mayor flexibilidad en su uso.'
            },
            source: {
                code: SheetControlledCode
            }
        }
    },
    render: SheetControlled
}

export const Sides = {
    name: "Diferentes lados",
    argTypes: {
        side: {
            control: {type: 'select'},
            options: ['top', 'right', 'bottom', 'left'],
            description: 'Define desde qué lado de la pantalla se desliza el Sheet.',
        }
    },
    args:{
        side: 'left'
    },
    parameters: {
        controls: { disable:false },
        docs: {
            description: {
                story: 'El componente **Sheet** puede deslizarse desde diferentes lados de la pantalla utilizando la propiedad `side`. Los valores posibles son `top`, `right`, `bottom` y `left`.'
            }
        }
    },
    render: args => (
        <Sheet>
            <SheetTrigger>
                <Button>Abrir Sheet</Button>
            </SheetTrigger>
            <SheetContent {...args}>
                <SheetHeader>
                    <SheetTitle>Título</SheetTitle>
                    <SheetDescription>Descripción</SheetDescription>
                    <div>Contenido principal del Sheet.</div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export const FormExample = {
    name: "Ejemplo con formulario",
    parameters: {
        docs: {
            description: {
                story: 'El componente **Sheet** es ideal para contener formularios, permitiendo a los usuarios ingresar datos sin salir de la página actual.'
            },
            source: {
                code: SheetFormCode
            }
        }
    },
    render: SheetForm
}

export const ListExample = {
    name: "Ejemplo con listado",
    parameters: {
        docs: {
            description: {
                story: 'El componente **Sheet** puede utilizarse para mostrar listados o tablas.'
            },
            source: {
                code: SheetListCode
            }
        }
    },
    render: SheetList
}

export const NotificationExample = {
    name: "Ejemplo como panel de notificaciones",
    parameters: {
        docs: {
            description: {
                story: 'El componente **Sheet** puede funcionar como un panel de notificaciones.'
            },
            source: {
                code: SheetNotificationsCode
            }
        }
    },
    render:SheetNotifications
}