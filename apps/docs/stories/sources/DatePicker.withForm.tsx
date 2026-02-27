import { useState } from "react";
import type { DateRange } from "@traxion-global/design-system/react";
import {
    DatePicker,
    DateRangePicker,
    DateTimePicker,
    DateTimeRangePicker,
    TimePicker,
    Label,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
    Button,
    Input,
    toast,
} from "@traxion-global/design-system/react";

export default function DatePickerWithForm() {
    const [name, setName] = useState("");
    const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
    const [period, setPeriod] = useState<DateRange | undefined>();
    const [eventStart, setEventStart] = useState<Date | undefined>();
    const [pickupWindow, setPickupWindow] = useState<DateRange | undefined>();
    const [reminderTime, setReminderTime] = useState("");

    return (
        <Card className="w-[420px]">
            <CardHeader>
                <CardTitle>Programar entrega</CardTitle>
                <CardDescription>
                    Configura los tiempos y fechas de tu próxima entrega.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name">Nombre del envío</Label>
                    <Input
                        id="name"
                        placeholder="Ej. Envío Guadalajara #47"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label>Fecha de entrega</Label>
                    <DatePicker
                        value={deliveryDate}
                        onChange={setDeliveryDate}
                        fromDate={new Date()}
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label>Período de disponibilidad</Label>
                    <DateRangePicker
                        value={period}
                        onChange={setPeriod}
                        fromDate={new Date()}
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label>Inicio del turno</Label>
                    <DateTimePicker
                        value={eventStart}
                        onChange={setEventStart}
                        captionLayout="dropdown"
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label>Ventana de recolección</Label>
                    <DateTimeRangePicker
                        value={pickupWindow}
                        onChange={setPickupWindow}
                        numberOfMonths={1}
                        fromDate={new Date()}
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="reminder">Hora de recordatorio</Label>
                    <TimePicker
                        id="reminder"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                    />
                </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
                <Button variant="outline">Cancelar</Button>
                <Button
                    onClick={() => toast.success("Entrega programada correctamente")}
                >
                    Guardar
                </Button>
            </CardFooter>
        </Card>
    );
}
