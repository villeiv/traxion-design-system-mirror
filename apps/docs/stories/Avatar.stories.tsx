import {Avatar, AvatarFallback, AvatarImage} from "@traxion-global/design-system/react";
import {AvatarAnatomy} from "./sources/Avatar.anatomy";
import {User} from "lucide-react";

export default {
    title: 'Avatar',
    component: Avatar,
    tags: ['autodocs'],
    parameters: {
        a11y: {disable: true},
        controls: {disable: true},
        actions: {disable: true},
        docs: {
            description: {
                component: 'Componente para mostrar la imagen de perfil de un usuario con un contenido de respaldo cuando la imagen no está disponible. Útil en listas, encabezados y tarjetas.' + AvatarAnatomy,
            },
        },
    }
}

export const Basic = {
    name: "Uso básico",
    render: args => {
        return <Avatar>
            <AvatarImage src="https://github.com/villeiv.png"/>
            <AvatarFallback>IV</AvatarFallback>
        </Avatar>
    },
    parameters: {
        docs: {
            description: {
                story: 'Ejemplo mínimo: muestra la imagen del usuario y, si falla la carga, se visualizan las iniciales como respaldo.',
            },
        },
    },
}

export const NoImage = {
    name: "Sin imagen",
    render: args => {
        return <Avatar>
            <AvatarFallback>IV</AvatarFallback>
        </Avatar>
    },
    parameters: {
        docs: {
            description: {
                story: 'Sin `src` en `AvatarImage`. El componente renderiza directamente el `AvatarFallback` (iniciales) para mantener consistencia visual.',
            },
        },
    },
}

export const IconFallback = {
    name: "Icono como respaldo",
    render: args => {
        return <Avatar>
            <AvatarImage src={"http://url.imagen.rota"} />
            <AvatarFallback><User /></AvatarFallback>
        </Avatar>
    },
    parameters: {
        docs: {
            description: {
                story: 'En lugar de iniciales, se puede usar un icono como respaldo en `AvatarFallback`, útil cuando no se dispone del nombre del usuario.',
            }
        }
    }
}

export const WithName = {
    name: "Con nombre",
    render: args => {
        return <div className="flex items-center gap-3">
            <Avatar>
                <AvatarImage
                    src="https://github.com/villeiv.png"
                    alt="Iván Villegas"
                />
                <AvatarFallback>IV</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="font-medium text-sm text-foreground">
                  Iván Villegas
                </span>
                <span className="text-xs text-muted-foreground">
                  Líder de desarrollo
                </span>
            </div>
        </div>
    },
    parameters: {
        docs: {
            description: {
                story: 'Avatar acompañado de nombre y rol. Útil para encabezados de tarjeta, comentarios o listados de colaboradores.',
            },
        },
    },
}

export const GroupOfAvatars = {
    name: "Grupo de avatares",
    render: args => {
        return <div className="flex -space-x-2">
            <Avatar>
                <AvatarImage src="https://github.com/villeiv.png" alt="@shadcn"/>
                <AvatarFallback>IV</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarImage
                    src="https://github.com/maxleiter.png"
                    alt="@maxleiter"
                />
                <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarImage
                    src="https://github.com/evilrabbit.png"
                    alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
            </Avatar>
        </div>
    },
    parameters: {
        docs: {
            description: {
                story: 'Muestra un conjunto de avatares con superposición sutil utilizando `-space-x-2`. Ideal para indicar miembros de un equipo o participantes.',
            },
        },
    },
}
