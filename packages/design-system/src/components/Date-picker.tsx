import * as React from "react"
import { format } from "date-fns"
import { es, enUS } from "date-fns/locale"
import { CalendarIcon, ClockIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "./Button"
import { Calendar } from "./Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./Popover"
import { Separator } from "./Separator"

const localeMap = {
    es,
    en: enUS,
} as const

type LocaleCode = keyof typeof localeMap

type CalendarDisabled = React.ComponentProps<typeof Calendar>["disabled"]

function buildDisabled(
    fromDate?: Date,
    toDate?: Date
): CalendarDisabled {
    if (!fromDate && !toDate) return undefined
    return [
        ...(fromDate ? [{ before: fromDate }] : []),
        ...(toDate ? [{ after: toDate }] : []),
    ] as CalendarDisabled
}

// ─── TimePicker ───────────────────────────────────────────────────────────────

export interface TimePickerProps
    extends Omit<React.ComponentProps<"input">, "type"> { }

const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
    ({ className, ...props }, ref) => (
        <input
            type="time"
            step="60"
            ref={ref}
            className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
                className
            )}
            {...props}
        />
    )
)
TimePicker.displayName = "TimePicker"

// ─── DatePicker ───────────────────────────────────────────────────────────────

export interface DatePickerProps {
    value?: Date
    defaultValue?: Date
    onChange?: (date: Date | undefined) => void
    placeholder?: string
    disabled?: boolean
    localeCode?: LocaleCode
    dateFormat?: string
    fromDate?: Date
    toDate?: Date
    captionLayout?: React.ComponentProps<typeof Calendar>["captionLayout"]
    className?: string
}

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
    (
        {
            value,
            defaultValue,
            onChange,
            placeholder = "Selecciona una fecha",
            disabled = false,
            localeCode = "es",
            dateFormat = "PPP",
            fromDate,
            toDate,
            captionLayout = "label",
            className,
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)
        const [internalDate, setInternalDate] = React.useState<
            Date | undefined
        >(defaultValue)

        const locale = localeMap[localeCode]
        const selectedDate = value ?? internalDate

        function handleSelect(date: Date | undefined) {
            setInternalDate(date)
            onChange?.(date)
            setOpen(false)
        }

        return (
            <div className={cn("w-full min-w-0", className)}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={ref}
                            variant="outline"
                            disabled={disabled}
                            className={cn(
                                "w-full min-w-0 justify-start text-left font-normal overflow-hidden",
                                !selectedDate && "text-muted-foreground",
                            )}
                        >
                            <CalendarIcon className="shrink-0" />
                            <span className="truncate min-w-0 flex-1">
                                {selectedDate
                                    ? format(selectedDate, dateFormat, { locale })
                                    : placeholder}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleSelect}
                            localeCode={localeCode}
                            captionLayout={captionLayout}
                            disabled={buildDisabled(fromDate, toDate)}
                            startMonth={fromDate}
                            endMonth={toDate}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        )
    }
)
DatePicker.displayName = "DatePicker"

// ─── DateRangePicker ──────────────────────────────────────────────────────────

export interface DateRangePickerProps {
    value?: DateRange
    onChange?: (range: DateRange | undefined) => void
    placeholder?: string
    disabled?: boolean
    localeCode?: LocaleCode
    dateFormat?: string
    fromDate?: Date
    toDate?: Date
    captionLayout?: React.ComponentProps<typeof Calendar>["captionLayout"]
    numberOfMonths?: number
    className?: string
}

const DateRangePicker = React.forwardRef<
    HTMLButtonElement,
    DateRangePickerProps
>(
    (
        {
            value,
            onChange,
            placeholder = "Selecciona un rango de fechas",
            disabled = false,
            localeCode = "es",
            dateFormat = "PPP",
            fromDate,
            toDate,
            captionLayout = "label",
            numberOfMonths = 2,
            className,
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)
        const [pending, setPending] = React.useState<DateRange | undefined>(
            value
        )
        const locale = localeMap[localeCode]

        function handleOpenChange(nextOpen: boolean) {
            if (nextOpen) setPending(value)
            setOpen(nextOpen)
        }

        function handleApply() {
            onChange?.(pending)
            setOpen(false)
        }

        function handleReset() {
            setPending(undefined)
        }

        return (
            <div className={cn("w-full min-w-0", className)}>
                <Popover open={open} onOpenChange={handleOpenChange}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={ref}
                            variant="outline"
                            disabled={disabled}
                            className={cn(
                                "w-full min-w-0 justify-start text-left font-normal overflow-hidden",
                                !value?.from && "text-muted-foreground",
                            )}
                        >
                            <CalendarIcon className="shrink-0" />
                            <span className="truncate min-w-0 flex-1">
                                {value?.from ? (
                                    value.to ? (
                                        `${format(value.from, dateFormat, { locale })} – ${format(value.to, dateFormat, { locale })}`
                                    ) : (
                                        format(value.from, dateFormat, { locale })
                                    )
                                ) : (
                                    placeholder
                                )}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="range"
                            selected={pending}
                            onSelect={setPending}
                            localeCode={localeCode}
                            captionLayout={captionLayout}
                            numberOfMonths={numberOfMonths}
                            disabled={buildDisabled(fromDate, toDate)}
                            startMonth={fromDate}
                            endMonth={toDate}
                        />
                        <Separator />
                        <div className="flex justify-end gap-2 p-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                            >
                                Limpiar
                            </Button>
                            <Button size="sm" onClick={handleApply}>
                                Aplicar
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        )
    }
)
DateRangePicker.displayName = "DateRangePicker"

// ─── DateTimePicker ───────────────────────────────────────────────────────────

export interface DateTimePickerProps {
    value?: Date
    onChange?: (date: Date | undefined) => void
    placeholder?: string
    disabled?: boolean
    localeCode?: LocaleCode
    dateFormat?: string
    fromDate?: Date
    toDate?: Date
    captionLayout?: React.ComponentProps<typeof Calendar>["captionLayout"]
    className?: string
}

const DateTimePicker = React.forwardRef<HTMLButtonElement, DateTimePickerProps>(
    (
        {
            value,
            onChange,
            placeholder = "Selecciona fecha y hora",
            disabled = false,
            localeCode = "es",
            dateFormat = "PPP",
            fromDate,
            toDate,
            captionLayout = "label",
            className,
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)
        const [pending, setPending] = React.useState<Date | undefined>(value)
        const locale = localeMap[localeCode]

        function handleOpenChange(nextOpen: boolean) {
            if (nextOpen) setPending(value)
            setOpen(nextOpen)
        }

        const pendingTimeValue = pending
            ? `${String(pending.getHours()).padStart(2, "0")}:${String(pending.getMinutes()).padStart(2, "0")}`
            : ""

        const displayTimeValue = value
            ? `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`
            : ""

        function handleDaySelect(day: Date | undefined) {
            if (!day) {
                setPending(undefined)
                return
            }
            const next = new Date(day)
            if (pending) {
                next.setHours(pending.getHours(), pending.getMinutes(), 0, 0)
            } else {
                next.setHours(0, 0, 0, 0)
            }
            setPending(next)
        }

        function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
            const [h, m] = e.target.value.split(":").map(Number)
            const next = pending ? new Date(pending) : new Date()
            next.setHours(h ?? 0, m ?? 0, 0, 0)
            setPending(next)
        }

        function handleApply() {
            onChange?.(pending)
            setOpen(false)
        }

        return (
            <div className={cn("w-full min-w-0", className)}>
                <Popover open={open} onOpenChange={handleOpenChange}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={ref}
                            variant="outline"
                            disabled={disabled}
                            className={cn(
                                "w-full min-w-0 justify-start text-left font-normal overflow-hidden",
                                !value && "text-muted-foreground",
                            )}
                        >
                            <CalendarIcon className="shrink-0" />
                            <span className="truncate min-w-0 flex-1">
                                {value
                                    ? `${format(value, dateFormat, { locale })} ${displayTimeValue}`
                                    : placeholder}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={pending}
                            onSelect={handleDaySelect}
                            localeCode={localeCode}
                            captionLayout={captionLayout}
                            disabled={buildDisabled(fromDate, toDate)}
                            startMonth={fromDate}
                            endMonth={toDate}
                        />
                        <Separator />
                        <div className="flex items-center gap-2 p-3">
                            <ClockIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="text-sm font-medium whitespace-nowrap text-foreground">
                                Hora:
                            </span>
                            <TimePicker
                                value={pendingTimeValue}
                                onChange={handleTimeChange}
                                disabled={!pending}
                                className="flex-1"
                            />
                            <Button
                                size="sm"
                                onClick={handleApply}
                                disabled={!pending}
                                className="shrink-0"
                            >
                                Aplicar
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        )
    }
)
DateTimePicker.displayName = "DateTimePicker"

export { TimePicker, DatePicker, DateRangePicker, DateTimePicker }
export type { DateRange }
