import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DatePicker, Label } from "@traxion-global/design-system/react";

export default function DatePickerControlled() {
    const [date, setDate] = useState<Date | undefined>();

    return (
        <div className="flex flex-col gap-2">
            <Label>Fecha de vencimiento</Label>
            <DatePicker value={date} onChange={setDate} />
            {date && (
                <p className="text-sm text-muted-foreground">
                    Seleccionado:{" "}
                    <span className="font-medium text-foreground">
                        {format(date, "PPP", { locale: es })}
                    </span>
                </p>
            )}
        </div>
    );
}
