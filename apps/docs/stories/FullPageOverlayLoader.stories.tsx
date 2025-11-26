import {Card, CardContent, CardDescription, CardHeader, CardTitle, FullPageOverlayLoader} from "@traxion-global/design-system";

export default {
    title: 'FullPageOverlayLoader',
    component: FullPageOverlayLoader,
    tags: ['autodocs'],
    parameters: {
        a11y: { disable: true },
        actions: { disable: true },
        controls: { disable: true },
        docs: {
            description: {
                component:"**FullPageOverlayLoader** es un componente de overlay de carga a pantalla completa. Se utiliza para indicar que una acción global (por ejemplo, carga inicial o procesamiento de datos) está en progreso."
            },
        },
    },
}

export const Default = {
    name: "Uso básico",
    render: args => {
        return <>
            <FullPageOverlayLoader />
            <Card className={"w-96"}>
                <CardHeader>
                    <CardTitle>Contenido de la página</CardTitle>
                    <CardDescription>Este es un ejemplo de cómo se ve el FullPageOverlayLoader sobre el contenido de una página.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </CardContent>
            </Card>
        </>
    },
};
