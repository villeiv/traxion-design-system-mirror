import {Popover, PopoverTrigger, Button, PopoverContent, Calendar, Label} from "@traxion-global/design-system";
import {CalendarIcon} from "lucide-react";
import {useState} from "react";

export default function CalendarInputForm() {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState();

    function onSelect(date) {
        if (date) {
            setValue(date);
        } else {
            setValue(undefined);
        }
        setOpen(false);
    }

    return <Popover open={open} onOpenChange={setOpen}>
        <div className={"flex flex-col gap-2"}>
            <Label htmlFor={"dueDate"}>
                Fecha de vencimiento
            </Label>
            <PopoverTrigger asChild>
                <Button id={"dueDate"} variant="outline" className={"w-48 h-10 font-normal"}>
                    <CalendarIcon className="h-4 w-4" />
                    {value
                        ? value.toISOString().split("T")[0]
                        : "Selecciona una fecha"}
                </Button>
            </PopoverTrigger>
        </div>

        <PopoverContent align="start">
            <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={onSelect}
                localeCode={"en"}
            />
        </PopoverContent>
    </Popover>
}