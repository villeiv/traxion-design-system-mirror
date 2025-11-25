import {useState} from "react";
import {Calendar} from "@traxion-global/design-system";
import {es} from "date-fns/locale";

export default function CalendarBookedDays() {
    const [date, setDate] = useState(new Date(2025, 6, 12))
    const bookedDates = Array.from(
        { length: 12 },
        (_, i) => new Date(2025, 6, 15 + i)
    )
    return (
        <Calendar
            showOutsideDays={false}
            locale={es}
            mode="single"
            defaultMonth={date}
            selected={date}
            onSelect={setDate}
            disabled={bookedDates}
            modifiers={{
                booked: bookedDates,
            }}
            modifiersClassNames={{
                booked: "line-through opacity-100",
            }}
            className="rounded-lg border shadow-sm"
        />
    )
}