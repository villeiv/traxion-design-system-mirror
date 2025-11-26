import {Separator} from "@traxion-global/design-system";
import {Activity, Car, Users} from "lucide-react";

export default {
    title: "Separator",
    component: Separator,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
        a11y: {disable: true},
        actions: {disable: true},
        controls: {disable: true},
        docs: {
            description: {
                component: 'El componente **Separator** se utiliza para dividir visualmente contenido en la interfaz de usuario. Puede ser horizontal o vertical, dependiendo de la orientación especificada.'
            }
        }
    },
    argTypes: {
        orientation: {
            control: false,
        },
        decorative: {
            control: false,
        }
    }
}

export const Basic = {
    name: "Uso básico",
    render: (args) => (
        <div>
            <div className="space-y-1">
                <h4 className="text-sm font-medium leading-none">Indicadores de movilidad</h4>
                <p className="text-muted-foreground text-sm">
                    Métricas en tiempo real sobre la operación de transporte de personas.
                </p>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center space-x-6 text-sm h-7">
                <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Usuarios activos: <span className="font-medium text-foreground">1,245</span></span>
                </div>
                <Separator orientation="vertical" />
                <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span>Viajes en curso: <span className="font-medium text-foreground">87</span></span>
                </div>
                <Separator orientation="vertical" />
                <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-primary" />
                    <span>Unidades disponibles: <span className="font-medium text-foreground">312</span></span>
                </div>
            </div>
        </div>
    )
}