import { useState } from "react";
import { DatePicker, Label } from "@traxion-global/design-system/react";

export default function DatePickerWithDropdown() {
    const [date, setDate] = useState<Date | undefined>();

    return (
        <div className="flex flex-col gap-2">
            <Label>Fecha de nacimiento</Label>
            <DatePicker
                value={date}
                onChange={setDate}
                captionLayout="dropdown"
                placeholder="Selecciona tu fecha de nacimiento"
            />
        </div>
    );
}
