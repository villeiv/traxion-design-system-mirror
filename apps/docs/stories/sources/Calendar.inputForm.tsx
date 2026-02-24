import { DatePicker, Label } from "@traxion-global/design-system/react";
import { useState } from "react";

// Para selección de fecha en formularios y filtros, usa DatePicker en lugar de Calendar + Popover manualmente.
// DatePicker gestiona el estado del popover, el formato de la fecha, el ícono y la accesibilidad por ti.
export default function CalendarInputForm() {
    const [date, setDate] = useState<Date | undefined>();

    return (
        <div className="flex flex-col gap-2 w-56">
            <Label htmlFor="dueDate">Fecha de vencimiento</Label>
            <DatePicker
                id="dueDate"
                value={date}
                onChange={setDate}
                placeholder="Selecciona una fecha"
            />
        </div>
    );
}
