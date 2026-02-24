import { DatePicker, Label } from "@traxion-global/design-system/react";

export default function DatePickerUncontrolled() {
    return (
        <div className="flex flex-col gap-2">
            <Label>Fecha de vencimiento</Label>
            <DatePicker defaultValue={new Date()} />
        </div>
    );
}
