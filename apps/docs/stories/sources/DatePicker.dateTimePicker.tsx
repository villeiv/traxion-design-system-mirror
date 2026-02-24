import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DateTimePicker, Label, toast } from "@traxion-global/design-system/react";

export default function DatePickerDateTimePicker() {
    const [datetime, setDatetime] = useState<Date | undefined>();

    return (
        <div className="flex flex-col gap-2">
            <Label>Inicio del evento</Label>
            <DateTimePicker
                value={datetime}
                onChange={(d) => {
                    setDatetime(d);
                    if (d) toast.success(`Seleccionado: ${format(d, "PPP HH:mm", { locale: es })}`);
                }}
                placeholder="Selecciona fecha y hora"
                localeCode="es"
                captionLayout="dropdown"
            />
        </div>
    );
}
