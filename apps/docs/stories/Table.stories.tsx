import {
    Badge, NoDataMessage,
    Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@traxion-global/design-system";
import TableMobileDesktopCode from "./sources/Table.mobileDesktop?raw";
import TableMobileDesktop from "./sources/Table.mobileDesktop";
import {TableAnatomy} from "./sources/Table.anatomy";
import {CheckCircle, XCircle} from "lucide-react";

export default {
    title: 'Table',
    component: Table,
    tags: ['autodocs'],
    parameters: {
        a11y: { disable: true },
        actions: { disable: true },
        controls: { disable: true },
        docs: {
            description: {
                component: 'El componente **Table** se utiliza para mostrar datos en un formato tabular, facilitando la organización y visualización de información estructurada.' + TableAnatomy
            }
        }
    }
}

export const Basic = {
    name: "Básica",
    parameters: {
        docs: {
            description: {
                story: 'Este es un ejemplo básico del componente **Table**.'
            }
        }
    },
    render: args => (
        <Table className={"w-96 border"}>
            <TableCaption>Listado de facturas.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Factura</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Forma de pago</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">F001</TableCell>
                    <TableCell><Badge variant={"green"}>Pagado</Badge></TableCell>
                    <TableCell>TDC</TableCell>
                    <TableCell className="text-right">$250,000.00</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">F002</TableCell>
                    <TableCell><Badge variant={"yellow"}>Pendiente</Badge></TableCell>
                    <TableCell>TDD</TableCell>
                    <TableCell className="text-right">$450,000.00</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">F003</TableCell>
                    <TableCell><Badge variant={"red"}>Vencido</Badge></TableCell>
                    <TableCell>EFECTIVO</TableCell>
                    <TableCell className="text-right">$325,000.00</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

export const NoResults = {
    name: "Tabla sin resultados",
    parameters: {
        docs: {
            description: {
                story: 'Utiliza el componente ´NoDataMessage´ para mostrar un mensaje cuando no hay datos disponibles en la tabla.'
            }
        }
    },
    render: args => (
        <Table className={"w-96 border"}>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Factura</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Forma de pago</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        <NoDataMessage
                            title="No hay datos"
                            message="No se encontraron registros para mostrar."
                        />
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

export const CardsForMobile = {
    name: "Tablas en móvil",
    parameters: {
        docs: {
            source: {
                code: TableMobileDesktopCode
            }
        }
    },
    render: _=>{
        return <Card className={"w-[50rem]"}>
            <CardHeader>
                <CardTitle>Apilamiento vertical en móvil </CardTitle>
                <CardDescription>En pantallas pequeñas, es preferible mostrar la información en bloques apilados en lugar de filas. Esto mejora la lectura y evita el desplazamiento horizontal.</CardDescription>
            </CardHeader>
            <CardContent className={"grid grid-cols-2 gap-6"}>
                <Card>
                    <CardHeader>
                        <CardTitle className={"flex items-center gap-2"}><XCircle className={"text-red-500"} /> Evita el scroll horizontal en móvil...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table className={"w-[40rem] border"}>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Factura</TableHead>
                                    <TableHead>Concepto</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Forma de pago</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    [
                                        { invoiceId: 'F001', concept:"Facturación Roche julio 2025", status: "Pagado", paymentMethod: 'TDC', total: '$250,000.00' },
                                        { invoiceId: 'F002', concept:"Facturación mayo 2025", status: "Pendiente", paymentMethod: 'TDD', total: '$450,000.00' },
                                        { invoiceId: 'F003', concept:"Facturación almacenamiento y distribución abril 2025", status: "Vencido", paymentMethod: 'EFECTIVO', total: '$325,000.00' },
                                    ].map(({invoiceId, concept, status, paymentMethod, total})=>{
                                        return <TableRow className={"hidden sm:table-row"}>
                                            <TableCell className="font-medium">{invoiceId}</TableCell>
                                            <TableCell>{concept}</TableCell>
                                            <TableCell><Badge variant={"gray"}>{status}</Badge></TableCell>
                                            <TableCell>{paymentMethod}</TableCell>
                                            <TableCell className="text-right">{total}</TableCell>
                                        </TableRow>
                                    })
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className={"flex items-center gap-2"}><CheckCircle className={"text-green-500"} />disponiendo la información así:</CardTitle>
                    </CardHeader>
                    <CardContent><TableMobileDesktop /></CardContent>
                </Card>
            </CardContent>
        </Card>
    }
}