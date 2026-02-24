import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DatePicker, Label, toast } from "@traxion-global/design-system/react";

export default function DatePickerWithDropdown() {
    const [date, setDate] = useState<Date | undefined>();

    return (
        <div className="flex flex-col gap-2">
            <Label>Fecha de nacimiento</Label>
            <DatePicker
                value={date}
                onChange={(d) => {
                    setDate(d);
                    if (d) toast.success(`Fecha: ${format(d, "PPP", { locale: es })}`);
                }}
                captionLayout="dropdown"
                placeholder="Selecciona tu fecha de nacimiento"
            />
        </div>
    );
}
