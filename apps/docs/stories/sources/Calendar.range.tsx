import {useState} from "react";
import {Calendar} from "@traxion-global/design-system";

export default function CalendarRange() {
    const [selectedRange, setSelectedRange] = useState(null);

    return <Calendar
        mode="range"
        selected={selectedRange}
        onSelect={setSelectedRange}
        numberOfMonths={2}
    />

}