import { useState } from "react";
import { DateTimePicker, Label } from "@traxion-global/design-system/react";

export default function DatePickerDateTimePicker() {
    const [datetime, setDatetime] = useState<Date | undefined>();

    return (
        <div className="flex flex-col gap-2">
            <Label>Inicio del evento</Label>
            <DateTimePicker
                value={datetime}
                onChange={setDatetime}
                placeholder="Selecciona fecha y hora"
                localeCode="es"
                captionLayout="dropdown"
            />
        </div>
    );
}
