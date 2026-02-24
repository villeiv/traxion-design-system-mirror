import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { DateRange } from "@traxion-global/design-system/react";
import { DateRangePicker, Label, toast } from "@traxion-global/design-system/react";

export default function DatePickerRangePicker() {
    const [range, setRange] = useState<DateRange | undefined>();

    return (
        <div className="flex flex-col gap-2">
            <Label>Período de servicio</Label>
            <DateRangePicker
                value={range}
                onChange={(r) => {
                    setRange(r);
                    if (r?.from) {
                        const to = r.to ? format(r.to, "PP", { locale: es }) : "...";
                        toast.success(`Rango: ${format(r.from, "PP", { locale: es })} – ${to}`);
                    } else {
                        toast.info("Selección limpiada");
                    }
                }}
                placeholder="Selecciona un rango"
                localeCode="es"
                numberOfMonths={2}
            />
        </div>
    );
}
