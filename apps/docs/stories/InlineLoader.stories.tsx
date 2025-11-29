import { InlineLoader, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@traxion-global/design-system/react";

export default {
    title: 'InlineLoader',
    component: InlineLoader,
    tags: ['autodocs'],
    parameters: {
        a11y: { disable: true },
        actions: { disable: true },
        controls: { disable: true },
        docs: {
            description: {
                component: "**InlineLoader** es un componente de cargador en línea que muestra una animación de carga dentro del flujo del contenido. Ideal para indicar que una acción localizada (por ejemplo, la carga de una sección o elemento) está en progreso.",
            },
        },
    },
};

export const Default = {
    name: "Uso básico",
    render: args => {
        return (
            <>
                <Card className="w-96">
                    <CardHeader>
                        <CardTitle>Ejemplo de InlineLoader</CardTitle>
                        <CardDescription>
                            Este cargador se muestra dentro del contenido, sin cubrir toda la pantalla.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        El siguiente cargador se utiliza para mostrar que el contenido está cargando:
                        <InlineLoader />
                        Una vez que la carga finaliza, este loader puede ser reemplazado por el contenido real.
                    </CardContent>
                </Card>
            </>
        );
    },
};
