import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
    Button, Input, toast
} from "@traxion-global/design-system";
import ToasterDecorator from "./decorators/ToasterDecorator";
import {ArrowRight, Plus} from "lucide-react";
import {CardAnatomy} from "./sources/Card.anatomy";

export default {
    title: 'Card',
    component: Card,
    tags: ['autodocs'],
    parameters: {
        a11y: {disable: true},
        controls: {disable: true},
        actions: {disable: true},
        docs: {
            description: {
                component: 'El componente **Card** permite organizar contenido en una tarjeta estilizada. Incluye subcomponentes para el encabezado, contenido y pie de página.' + CardAnatomy
            }
        }
    }
}

export const Basic = {
    name: "Tarjeta Básica",
    render: args=>{
        return <Card className={"w-[30rem]"}>
            <CardHeader>
                <CardTitle>Título del Card</CardTitle>
                <CardDescription>Descripción de la Card</CardDescription>
            </CardHeader>
            <CardContent>Contenido de la Card: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</CardContent>
        </Card>
    },
    parameters: {
        docs: {
            description: {
                story: 'Ejemplo básico de una tarjeta con título, descripción y contenido.'
            }
        }
    }
}

export const InfoGrouper = {
    name: "Tarjetas de Información",
    render: args=>{
        return <Card>
            <CardHeader>
                <CardTitle>Facturación</CardTitle>
                <CardDescription>Visualiza, descarga y gestiona facturas y prefacturas de tus servicios logísticos.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Folio</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>INV-00123</TableCell>
                            <TableCell>Medilogix</TableCell>
                            <TableCell className="text-right">$4,250.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>INV-00124</TableCell>
                            <TableCell>TransMed</TableCell>
                            <TableCell className="text-right">$6,980.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>INV-00125</TableCell>
                            <TableCell>PharmaCorp</TableCell>
                            <TableCell className="text-right">$2,310.00</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className={"justify-end gap-2"}>
                <Button variant={"secondary"}>Más facturas</Button>
                <Button><Plus />Crear factura</Button>
            </CardFooter>
        </Card>
    },
    parameters: {
        docs: {
            description: {
                story: 'Ejemplo de una tarjeta que agrupa información en una tabla, con acciones en el pie de página.'
            }
        }
    }
}

export const MiniForm = {
    name: "Como contenedor de formularios",
    render: args=>{
        function submit(e){
            e.preventDefault();
            toast.success("Submit");
        }

        return <Card className="w-96">
            <CardHeader>
                <CardTitle>Ingresa a tu cuenta</CardTitle>
                <CardDescription>Para iniciar sesión ingresa tu correo y contraseña a continuación.</CardDescription>
            </CardHeader>
            <CardContent>
                <form id={"form1"} onSubmit={submit} className={"flex flex-col gap-2"}>
                    <Input placeholder="Correo electrónico" type="email"/>
                    <Input placeholder={"Contraseña"} type="password"/>
                </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button type="reset" variant={"secondary"} form="form1">Borrar</Button>
                <Button type="submit" form="form1">Iniciar sesión</Button>
            </CardFooter>
        </Card>
    },
    decorators: [ToasterDecorator],
    parameters: {
        docs: {
            description: {
                story: 'Ejemplo de una tarjeta utilizada como contenedor para un formulario de inicio de sesión.'
            }
        }
    }
}

export const WithoutPadding = {
    name: "Sin padding",
    render: args=>{
        return <Card className={"w-[30rem]"}>
            <CardHeader className="p-4">
                <CardTitle>Movilidad de carga</CardTitle>
                <CardDescription>Soluciones de movilidad de carga diseñadas para garantizar seguridad, rapidez y adaptabilidad.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <img src="https://traxion.global/hubfs/rentabilidad-img-slider.png" alt="Imagen de ejemplo" className="w-full h-auto" />
            </CardContent>
        </Card>
    },
    parameters: {
        docs: {
            description: {
                story: 'Ejemplo de una tarjeta sin padding en el contenido, ideal para imágenes o elementos que deben ocupar todo el ancho. Revisa el código y pon atención en que puedes definir el padding de cada sección por separado.'
            }
        }
    }
}

export const Nested = {
    name: "Cards anidados",
    render: args=>{
        return <Card className={"w-[50rem]"}>
            <CardHeader>
                <CardTitle>Facturación y prefacturación</CardTitle>
                <CardDescription>Gestiona y revisa tus facturas y prefacturas más recientes.</CardDescription>
            </CardHeader>
            <CardContent className={"flex gap-4"}>
                <Card className={"basis-1/2"}>
                    <CardHeader>
                        <CardTitle>Prefacturas</CardTitle>
                        <CardDescription>Prefacturas que necesitan atención.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Folio</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>INV-00123</TableCell>
                                    <TableCell>Medilogix</TableCell>
                                    <TableCell className="text-right">$4,250.00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>INV-00124</TableCell>
                                    <TableCell>TransMed</TableCell>
                                    <TableCell className="text-right">$6,980.00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>INV-00125</TableCell>
                                    <TableCell>PharmaCorp</TableCell>
                                    <TableCell className="text-right">$2,310.00</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className={"justify-end"}>
                        <Button variant={"secondary"}><ArrowRight />Más prefacturas</Button>
                    </CardFooter>
                </Card>
                <Card className={"basis-1/2"}>
                    <CardHeader>
                        <CardTitle>Facturas</CardTitle>
                        <CardDescription>Tienes 3 facturas recientemente emitidas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Folio</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>INV-00123</TableCell>
                                    <TableCell>Medilogix</TableCell>
                                    <TableCell className="text-right">$4,250.00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>INV-00124</TableCell>
                                    <TableCell>TransMed</TableCell>
                                    <TableCell className="text-right">$6,980.00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>INV-00125</TableCell>
                                    <TableCell>PharmaCorp</TableCell>
                                    <TableCell className="text-right">$2,310.00</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className={"justify-end"}>
                        <Button variant={"secondary"}><ArrowRight />Más facturas</Button>
                    </CardFooter>
                </Card>
            </CardContent>
            <CardFooter className={"justify-end"}>
                <Button size={"lg"}>Ver informe completo</Button>
            </CardFooter>
        </Card>
    },
    parameters: {
        docs: {
            description: {
                story: 'Ejemplo de tarjetas anidadas, ideal para comparar información relacionada o mostrar diferentes categorías de datos en un solo contenedor.'
            }
        }
    }
}