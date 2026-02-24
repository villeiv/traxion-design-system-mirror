import { useState } from "react";
import type { DateRange } from "@traxion-global/design-system/react";
import { DateRangePicker, Label } from "@traxion-global/design-system/react";

export default function DatePickerRangePicker() {
    const [range, setRange] = useState<DateRange | undefined>();

    return (
        <div className="flex flex-col gap-2">
            <Label>Período de servicio</Label>
            <DateRangePicker
                value={range}
                onChange={setRange}
                placeholder="Selecciona un rango"
                localeCode="es"
                numberOfMonths={2}
            />
        </div>
    );
}
