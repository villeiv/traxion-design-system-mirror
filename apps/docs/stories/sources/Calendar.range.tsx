import {useState} from "react";
import {Calendar} from "@traxion-global/design-system";
import {es} from "date-fns/locale";

export default function CalendarRange() {
    const [selectedRange, setSelectedRange] = useState(null);

    return <Calendar
        locale={es}
        mode="range"
        selected={selectedRange}
        onSelect={setSelectedRange}
        numberOfMonths={2}
    />

}