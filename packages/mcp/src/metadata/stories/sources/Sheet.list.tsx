import {
    Button, Badge,
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
    SheetContent, SheetHeader, Sheet, SheetTitle, SheetDescription, SheetTrigger
} from "@traxion-global/design-system/react";

export default function SheetList() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Ver registros</Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>Registros recientes</SheetTitle>
                    <SheetDescription>Últimas operaciones realizadas.</SheetDescription>
                </SheetHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4].map((id) => (
                            <TableRow key={id}>
                                <TableCell>{id}</TableCell>
                                <TableCell>Cliente {id}</TableCell>
                                <TableCell><Badge variant="secondary">Completado</Badge></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </SheetContent>
        </Sheet>
    )
}