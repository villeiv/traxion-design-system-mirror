import { useState } from "react";
import { DatePicker, Label } from "@traxion-global/design-system/react";

export default function DatePickerWithDateRestrictions() {
    const [date, setDate] = useState<Date | undefined>();
    const today = new Date();
    const inThirtyDays = new Date();
    inThirtyDays.setDate(today.getDate() + 30);

    return (
        <div className="flex flex-col gap-2">
            <Label>Fecha de entrega (próximos 30 días)</Label>
            <DatePicker
                value={date}
                onChange={setDate}
                fromDate={today}
                toDate={inThirtyDays}
                placeholder="Selecciona una fecha disponible"
            />
        </div>
    );
}
