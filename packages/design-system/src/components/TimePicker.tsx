import * as React from "react"

import { cn } from "@/lib/utils"

// ─── TimePicker ───────────────────────────────────────────────────────────────

export interface TimePickerProps
    extends Omit<React.ComponentProps<"input">, "type"> {}

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

export { TimePicker }
