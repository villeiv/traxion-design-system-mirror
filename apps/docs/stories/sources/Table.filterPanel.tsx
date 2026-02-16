import {
    Badge, Button,
    Calendar,
    Input,
    NoDataMessage,
    Popover, PopoverContent, PopoverTrigger,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@traxion-global/design-system/react";
import {CalendarIcon, X} from "lucide-react";
import {useState} from "react";

const shipments = [
    { id: "SHP-001", origin: "CDMX", destination: "Monterrey", status: "En tránsito", type: "Carga seca", departure: "2025-07-15" },
    { id: "SHP-002", origin: "Guadalajara", destination: "Tijuana", status: "Entregado", type: "Refrigerado", departure: "2025-07-10" },
    { id: "SHP-003", origin: "Querétaro", destination: "CDMX", status: "Pendiente", type: "Carga seca", departure: "2025-07-20" },
    { id: "SHP-004", origin: "Veracruz", destination: "Puebla", status: "Cancelado", type: "Peligroso", departure: "2025-07-08" },
    { id: "SHP-005", origin: "CDMX", destination: "Guadalajara", status: "En tránsito", type: "Refrigerado", departure: "2025-07-18" },
];

const statusVariant: Record<string, "green" | "yellow" | "red" | "blue"> = {
    "Entregado": "green",
    "Pendiente": "yellow",
    "Cancelado": "red",
    "En tránsito": "blue",
};

export default function TableFilterPanel() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string>("all");
    const [cargoType, setCargoType] = useState<string>("all");
    const [departureDate, setDepartureDate] = useState<Date | undefined>();
    const [calendarOpen, setCalendarOpen] = useState(false);

    const filtered = shipments.filter((s) => {
        if (search && !s.id.toLowerCase().includes(search.toLowerCase()) && !s.origin.toLowerCase().includes(search.toLowerCase())) return false;
        if (status !== "all" && s.status !== status) return false;
        if (cargoType !== "all" && s.type !== cargoType) return false;
        if (departureDate && s.departure !== departureDate.toISOString().split("T")[0]) return false;
        return true;
    });

    return (
        <div className="space-y-4">
            {/* Filter Controls:
                - Input for free-text search (open-ended values)
                - Select for status (enumerated values)
                - Select for cargo type (enumerated values)
                - Calendar + Popover for departure date
            */}
            <div className="flex flex-wrap items-end gap-3">
                <Input
                    placeholder="Buscar por ID u origen..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-56 h-9"
                />

                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-44">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los status</SelectItem>
                        <SelectItem value="En tránsito">En tránsito</SelectItem>
                        <SelectItem value="Entregado">Entregado</SelectItem>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={cargoType} onValueChange={setCargoType}>
                    <SelectTrigger className="w-44">
                        <SelectValue placeholder="Tipo de carga" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        <SelectItem value="Carga seca">Carga seca</SelectItem>
                        <SelectItem value="Refrigerado">Refrigerado</SelectItem>
                        <SelectItem value="Peligroso">Peligroso</SelectItem>
                    </SelectContent>
                </Select>

                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-48 h-9 font-normal justify-start">
                            <CalendarIcon className="h-4 w-4" />
                            {departureDate
                                ? departureDate.toISOString().split("T")[0]
                                : "Fecha de salida"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={departureDate}
                            onSelect={(date) => {
                                setDepartureDate(date);
                                setCalendarOpen(false);
                            }}
                            localeCode="es"
                        />
                    </PopoverContent>
                </Popover>

                {(search || status !== "all" || cargoType !== "all" || departureDate) && (
                    <Button
                        variant="secondary"
                        size={"lg"}
                        onClick={() => { setSearch(""); setStatus("all"); setCargoType("all"); setDepartureDate(undefined); }}
                    >
                        <X className="h-4 w-4" /> Limpiar
                    </Button>
                )}
            </div>

            <Table className="border">
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Origen</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tipo de carga</TableHead>
                        <TableHead>Fecha de salida</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filtered.length > 0 ? (
                        filtered.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell className="font-medium">{s.id}</TableCell>
                                <TableCell>{s.origin}</TableCell>
                                <TableCell>{s.destination}</TableCell>
                                <TableCell><Badge variant={statusVariant[s.status]}>{s.status}</Badge></TableCell>
                                <TableCell>{s.type}</TableCell>
                                <TableCell>{s.departure}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                <NoDataMessage
                                    title="Sin resultados"
                                    message="No se encontraron embarques con los filtros seleccionados."
                                />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
