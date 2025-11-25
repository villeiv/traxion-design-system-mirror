import {useState} from "react";
import {Button, Calendar, Card, CardContent, CardDescription, CardHeader, CardTitle} from "@traxion-global/design-system";
import {es} from "date-fns/locale";

export default function CalendarWithTodayButton() {
    const [date, setDate] = useState(new Date(1986, 5, 12))
    const [month, setMonth] = useState(new Date())

    return (
        <Card>
            <CardHeader>
                <CardTitle>Programar entrega</CardTitle>
                <CardDescription>Selecciona una fecha</CardDescription>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                        setMonth(new Date())
                        setDate(new Date())
                    }}
                >
                    Hoy
                </Button>
            </CardHeader>
            <CardContent>
                <Calendar
                    locale={es}
                    mode="single"
                    month={month}
                    onMonthChange={setMonth}
                    selected={date}
                    onSelect={setDate}
                    className="bg-transparent p-0"
                />
            </CardContent>
        </Card>
    )
}