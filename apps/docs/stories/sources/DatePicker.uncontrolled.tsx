import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DatePicker, Label, toast } from "@traxion-global/design-system/react";

export default function DatePickerUncontrolled() {
    return (
        <div className="flex flex-col gap-2">
            <Label>Fecha de vencimiento</Label>
            <DatePicker
                defaultValue={new Date()}
                onChange={(date) => {
                    if (date) toast.success(`Fecha: ${format(date, "PPP", { locale: es })}`);
                }}
            />
        </div>
    );
}
