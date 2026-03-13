import * as React from "react"
import { format } from "date-fns"
import { es, enUS } from "date-fns/locale"
import { CalendarIcon, ClockIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { useDesignSystemLanguage } from "./Language-provider"
import { Button } from "./Button"
import { Calendar } from "./Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./Popover"
import { Separator } from "./Separator"
import { TimePicker } from "./TimePicker"

const localeMap = {
    es,
    en: enUS,
} as const

type LocaleCode = keyof typeof localeMap

const DATE_PICKER_TEXTS = {
    en: {
        placeholderDate: "Select a date",
        placeholderRange: "Select a date range",
        placeholderDateTime: "Select date and time",
        placeholderDateTimeRange: "Select a date and time range",
        clear: "Clear",
        apply: "Apply",
        time: "Time:",
        startTime: "Start time:",
        endTime: "End time:",
    },
    es: {
        placeholderDate: "Selecciona una fecha",
        placeholderRange: "Selecciona un rango de fechas",
        placeholderDateTime: "Selecciona fecha y hora",
        placeholderDateTimeRange: "Selecciona un rango de fechas y hora",
        clear: "Limpiar",
        apply: "Aplicar",
        time: "Hora:",
        startTime: "Hora día inicial:",
        endTime: "Hora día final:",
    },
} as const

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
            placeholder,
            disabled = false,
            localeCode,
            dateFormat = "PPP",
            fromDate,
            toDate,
            captionLayout = "label",
            className,
        },
        ref
    ) => {
        const language = useDesignSystemLanguage()
        const t = DATE_PICKER_TEXTS[language]
        const resolvedLocaleCode = localeCode ?? language
        const resolvedPlaceholder = placeholder ?? t.placeholderDate
        const [open, setOpen] = React.useState(false)
        const [internalDate, setInternalDate] = React.useState<
            Date | undefined
        >(defaultValue)

        const locale = localeMap[resolvedLocaleCode]
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
                                    : resolvedPlaceholder}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleSelect}
                            localeCode={resolvedLocaleCode}
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
            placeholder,
            disabled = false,
            localeCode,
            dateFormat = "d MMM",
            fromDate,
            toDate,
            captionLayout = "label",
            numberOfMonths = 2,
            className,
        },
        ref
    ) => {
        const language = useDesignSystemLanguage()
        const t = DATE_PICKER_TEXTS[language]
        const resolvedLocaleCode = localeCode ?? language
        const resolvedPlaceholder = placeholder ?? t.placeholderRange
        const [open, setOpen] = React.useState(false)
        const [pending, setPending] = React.useState<DateRange | undefined>(
            value
        )
        const locale = localeMap[resolvedLocaleCode]

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
                                    resolvedPlaceholder
                                )}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="range"
                            selected={pending}
                            onSelect={setPending}
                            localeCode={resolvedLocaleCode}
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
                                {t.clear}
                            </Button>
                            <Button size="sm" onClick={handleApply}>
                                {t.apply}
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
            placeholder,
            disabled = false,
            localeCode,
            dateFormat = "d MMM",
            fromDate,
            toDate,
            captionLayout = "label",
            className,
        },
        ref
    ) => {
        const language = useDesignSystemLanguage()
        const t = DATE_PICKER_TEXTS[language]
        const resolvedLocaleCode = localeCode ?? language
        const resolvedPlaceholder = placeholder ?? t.placeholderDateTime
        const [open, setOpen] = React.useState(false)
        const [pending, setPending] = React.useState<Date | undefined>(value)
        const locale = localeMap[resolvedLocaleCode]

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
                                    : resolvedPlaceholder}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={pending}
                            onSelect={handleDaySelect}
                            localeCode={resolvedLocaleCode}
                            captionLayout={captionLayout}
                            disabled={buildDisabled(fromDate, toDate)}
                            startMonth={fromDate}
                            endMonth={toDate}
                        />
                        <Separator />
                        <div className="flex items-center gap-2 p-3">
                            <ClockIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="text-sm font-medium whitespace-nowrap text-foreground">
                                {t.time}
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
                                {t.apply}
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        )
    }
)
DateTimePicker.displayName = "DateTimePicker"

// ─── DateTimeRangePicker ──────────────────────────────────────────────────────

export interface DateTimeRangePickerProps {
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

const DateTimeRangePicker = React.forwardRef<
    HTMLButtonElement,
    DateTimeRangePickerProps
>(
    (
        {
            value,
            onChange,
            placeholder,
            disabled = false,
            localeCode,
            dateFormat = "d MMM",
            fromDate,
            toDate,
            captionLayout = "label",
            numberOfMonths = 2,
            className,
        },
        ref
    ) => {
        const language = useDesignSystemLanguage()
        const t = DATE_PICKER_TEXTS[language]
        const resolvedLocaleCode = localeCode ?? language
        const resolvedPlaceholder = placeholder ?? t.placeholderDateTimeRange
        const [open, setOpen] = React.useState(false)
        const [pending, setPending] = React.useState<DateRange | undefined>(
            value
        )
        const locale = localeMap[resolvedLocaleCode]

        function handleOpenChange(nextOpen: boolean) {
            if (nextOpen) setPending(value)
            setOpen(nextOpen)
        }

        function timeStringFromDate(date: Date | undefined): string {
            if (!date) return ""
            return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
        }

        function handleRangeSelect(range: DateRange | undefined) {
            if (!range?.from) {
                setPending(undefined)
                return
            }
            const nextFrom = new Date(range.from)
            const nextTo = range.to ? new Date(range.to) : undefined

            if (pending?.from) {
                nextFrom.setHours(
                    pending.from.getHours(),
                    pending.from.getMinutes(),
                    0,
                    0
                )
            } else {
                nextFrom.setHours(0, 0, 0, 0)
            }

            if (nextTo) {
                if (pending?.to) {
                    nextTo.setHours(
                        pending.to.getHours(),
                        pending.to.getMinutes(),
                        0,
                        0
                    )
                } else {
                    nextTo.setHours(0, 0, 0, 0)
                }
            }

            setPending({ from: nextFrom, to: nextTo })
        }

        function handleFromTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
            if (!pending?.from) return
            const [h, m] = e.target.value.split(":").map(Number)
            const next = new Date(pending.from)
            next.setHours(h ?? 0, m ?? 0, 0, 0)
            setPending({ ...pending, from: next })
        }

        function handleToTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
            if (!pending?.to) return
            const [h, m] = e.target.value.split(":").map(Number)
            const next = new Date(pending.to)
            next.setHours(h ?? 0, m ?? 0, 0, 0)
            setPending({ ...pending, to: next })
        }

        function handleApply() {
            onChange?.(pending)
            setOpen(false)
        }

        function handleReset() {
            setPending(undefined)
        }

        function formatTriggerLabel(): string {
            if (!value?.from) return resolvedPlaceholder
            const fromStr = `${format(value.from, dateFormat, { locale })} ${timeStringFromDate(value.from)}`
            if (!value.to) return fromStr
            const toStr = `${format(value.to, dateFormat, { locale })} ${timeStringFromDate(value.to)}`
            return `${fromStr} – ${toStr}`
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
                                {formatTriggerLabel()}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="range"
                            selected={pending}
                            onSelect={handleRangeSelect}
                            localeCode={resolvedLocaleCode}
                            captionLayout={captionLayout}
                            numberOfMonths={numberOfMonths}
                            disabled={buildDisabled(fromDate, toDate)}
                            startMonth={fromDate}
                            endMonth={toDate}
                        />
                        <Separator />
                        <div className={cn(
                            "p-3",
                            numberOfMonths === 1
                                ? "grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2"
                                : "flex items-center justify-between gap-3"
                        )}>
                            <span className="text-sm font-medium whitespace-nowrap text-foreground">
                                {t.startTime}
                            </span>
                            <TimePicker
                                value={timeStringFromDate(pending?.from)}
                                onChange={handleFromTimeChange}
                                disabled={!pending?.from}
                                className={numberOfMonths === 1 ? "w-full" : "w-24"}
                            />
                            <span className="text-sm font-medium whitespace-nowrap text-foreground">
                                {t.endTime}
                            </span>
                            <TimePicker
                                value={timeStringFromDate(pending?.to)}
                                onChange={handleToTimeChange}
                                disabled={!pending?.to}
                                className={numberOfMonths === 1 ? "w-full" : "w-24"}
                            />
                        </div>
                        <Separator />
                        <div className="flex justify-end gap-2 p-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                            >
                                {t.clear}
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleApply}
                                disabled={!pending?.from}
                            >
                                {t.apply}
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        )
    }
)
DateTimeRangePicker.displayName = "DateTimeRangePicker"

export { DatePicker, DateRangePicker, DateTimePicker, DateTimeRangePicker }
export type { DateRange }
