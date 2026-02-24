import { useState } from "react";
import { TimePicker, Label } from "@traxion-global/design-system/react";

export default function DatePickerTimePicker() {
    const [time, setTime] = useState("");

    return (
        <div className="flex flex-col gap-2 w-48">
            <Label htmlFor="hora">Hora de recordatorio</Label>
            <TimePicker
                id="hora"
                value={time}
                onChange={(e) => setTime(e.target.value)}
            />
        </div>
    );
}
