import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DatePicker, Label, toast } from "@traxion-global/design-system/react";

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
                onChange={(d) => {
                    setDate(d);
                    if (d) toast.success(`Fecha: ${format(d, "PPP", { locale: es })}`);
                }}
                fromDate={today}
                toDate={inThirtyDays}
                placeholder="Selecciona una fecha disponible"
            />
        </div>
    );
}
