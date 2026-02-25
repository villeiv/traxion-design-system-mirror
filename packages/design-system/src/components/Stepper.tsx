import * as React from "react"
import { Check, X } from "lucide-react"

import { cn } from "@/lib/utils"

// ─── Context ──────────────────────────────────────────────────────────────────

interface StepperContextValue {
    value: string | undefined
    completedSteps: string[]
    orientation: "horizontal" | "vertical"
    variant: "numbered" | "dots"
    clickable: "none" | "completed" | "all"
    steps: string[]
    onStepClick: (value: string) => void
    registerStep: (value: string) => void
    unregisterStep: (value: string) => void
}

const StepperContext = React.createContext<StepperContextValue | null>(null)

function useStepperContext(): StepperContextValue {
    const ctx = React.useContext(StepperContext)
    if (!ctx) {
        throw new Error(
            "StepperList and StepperItem must be rendered inside a <Stepper>."
        )
    }
    return ctx
}

// ─── Stepper (Root) ───────────────────────────────────────────────────────────

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Currently active step value (controlled). */
    value?: string
    /** Initial active step value (uncontrolled). */
    defaultValue?: string
    /** Called when a step is clicked and navigation occurs. */
    onValueChange?: (value: string) => void
    /** Step values explicitly marked as completed. */
    completedSteps?: string[]
    /**
     * Layout direction.
     * @default "horizontal"
     */
    orientation?: "horizontal" | "vertical"
    /**
     * Indicator style.
     * - "numbered": shows step numbers; completed steps show a check icon.
     * - "dots": shows filled circles with no number; completed steps show a check icon.
     * @default "numbered"
     */
    variant?: "numbered" | "dots"
    /**
     * Controls which steps respond to clicks.
     * - "none": no steps are clickable — suitable for display/status mode.
     * - "completed": only completed steps can be clicked (go back).
     * - "all": all non-disabled steps can be clicked (free navigation).
     * @default "none"
     */
    clickable?: "none" | "completed" | "all"
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
    (
        {
            className,
            value: controlledValue,
            defaultValue,
            onValueChange,
            completedSteps = [],
            orientation = "horizontal",
            variant = "numbered",
            clickable = "none",
            ...props
        },
        ref
    ) => {
        const [internalValue, setInternalValue] = React.useState<
            string | undefined
        >(defaultValue)
        const isControlled = controlledValue !== undefined
        const currentValue = isControlled ? controlledValue : internalValue

        const [steps, setSteps] = React.useState<string[]>([])

        const registerStep = React.useCallback((stepValue: string) => {
            setSteps((prev) =>
                prev.includes(stepValue) ? prev : [...prev, stepValue]
            )
        }, [])

        const unregisterStep = React.useCallback((stepValue: string) => {
            setSteps((prev) => prev.filter((s) => s !== stepValue))
        }, [])

        const onStepClick = React.useCallback(
            (stepValue: string) => {
                if (!isControlled) setInternalValue(stepValue)
                onValueChange?.(stepValue)
            },
            [isControlled, onValueChange]
        )

        return (
            <StepperContext.Provider
                value={{
                    value: currentValue,
                    completedSteps,
                    orientation,
                    variant,
                    clickable,
                    steps,
                    onStepClick,
                    registerStep,
                    unregisterStep,
                }}
            >
                <div ref={ref} className={cn("w-full", className)} {...props} />
            </StepperContext.Provider>
        )
    }
)
Stepper.displayName = "Stepper"

// ─── StepperList ──────────────────────────────────────────────────────────────

export interface StepperListProps
    extends React.HTMLAttributes<HTMLOListElement> {}

const StepperList = React.forwardRef<HTMLOListElement, StepperListProps>(
    ({ className, ...props }, ref) => {
        const { orientation } = useStepperContext()

        return (
            <ol
                ref={ref}
                className={cn(
                    "flex",
                    orientation === "horizontal"
                        ? "flex-row items-start"
                        : "flex-col",
                    className
                )}
                {...props}
            />
        )
    }
)
StepperList.displayName = "StepperList"

// ─── StepperItem ──────────────────────────────────────────────────────────────

export interface StepperItemProps
    extends React.HTMLAttributes<HTMLLIElement> {
    /** Unique identifier for this step — used as the value in Stepper's value/completedSteps props. */
    value: string
    /** Step label. */
    title: string
    /**
     * Optional secondary content below the title.
     * Accepts ReactNode so consumers can render rich content like timestamps or badges.
     */
    description?: React.ReactNode
    /** When true, renders the step in an error state (takes priority over all other states). */
    error?: boolean
    /** When true, prevents this step from being clicked even when the Stepper is set to clickable. */
    disabled?: boolean
}

const StepperItem = React.forwardRef<HTMLLIElement, StepperItemProps>(
    (
        {
            className,
            value,
            title,
            description,
            error = false,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const {
            value: activeValue,
            completedSteps,
            orientation,
            variant,
            clickable,
            steps,
            onStepClick,
            registerStep,
            unregisterStep,
        } = useStepperContext()

        // Register on mount so Stepper knows the step order for numbering
        React.useLayoutEffect(() => {
            registerStep(value)
            return () => unregisterStep(value)
        }, [value, registerStep, unregisterStep])

        const index = steps.indexOf(value)
        const stepNumber = index + 1 // 1-based; 0 when not yet registered
        const isFirst = index === 0
        const isLast = index === steps.length - 1

        const isActive = activeValue === value
        const isCompleted = completedSteps.includes(value)

        // State priority: error > active > completed > pending
        const state: "pending" | "active" | "completed" | "error" = error
            ? "error"
            : isActive
              ? "active"
              : isCompleted
                ? "completed"
                : "pending"

        // Connector lighting (driven by completedSteps, independent of error)
        const prevStepValue = index > 0 ? steps[index - 1] : null
        const prevIsCompleted = prevStepValue
            ? completedSteps.includes(prevStepValue)
            : false
        const leftConnectorLit = prevIsCompleted
        const rightConnectorLit = isCompleted && !error

        // Click eligibility
        const isClickable =
            !disabled &&
            !isActive &&
            clickable !== "none" &&
            (clickable === "all" ||
                (clickable === "completed" && isCompleted && !error))

        // ── Indicator ──
        const indicatorBaseClass = cn(
            "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm transition-all",
            state === "pending" &&
                "border-2 border-muted-foreground/30 bg-background text-muted-foreground",
            (state === "active" || state === "completed") &&
                "bg-primary text-primary-foreground",
            state === "error" && "bg-destructive text-destructive-foreground"
        )

        const indicatorContent = (() => {
            if (state === "completed")
                return <Check className="h-4 w-4" strokeWidth={2.5} />
            if (state === "error")
                return <X className="h-4 w-4" strokeWidth={2.5} />
            if (variant === "numbered" && stepNumber > 0) {
                return (
                    <span className={cn("text-sm font-semibold", state === "active" && "text-foreground")}>{stepNumber}</span>
                )
            }
            // dots variant — pending or active: render a small inner circle
            return (
                <span
                    className={cn(
                        "block rounded-full transition-all",
                        state === "active"
                            ? "h-2.5 w-2.5 bg-primary-foreground"
                            : "h-2 w-2 bg-muted-foreground/40"
                    )}
                />
            )
        })()

        // Render a <button> when clickable, a <div> otherwise (avoids disabled-button styling issues)
        const indicator = isClickable ? (
            <button
                type="button"
                className={cn(
                    indicatorBaseClass,
                    "cursor-pointer hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
                onClick={() => onStepClick(value)}
                aria-label={`Paso ${stepNumber > 0 ? stepNumber : ""}: ${title}`}
            >
                {indicatorContent}
            </button>
        ) : (
            <div
                className={cn(indicatorBaseClass, "cursor-default")}
                aria-label={`Paso ${stepNumber > 0 ? stepNumber : ""}: ${title}`}
            >
                {indicatorContent}
            </div>
        )

        // ── Text styling ──
        const titleClass = cn(
            "text-sm font-bold leading-tight transition-colors",
            state === "active" && "text-foreground",
            state === "error" && "text-destructive",
            (state === "pending" || state === "completed") &&
                "text-muted-foreground"
        )
        const descriptionClass = cn(
            "mt-0.5 text-xs leading-snug",
            state === "error" ? "text-destructive/70" : "text-muted-foreground"
        )

        // ── Horizontal layout ──
        if (orientation === "horizontal") {
            return (
                <li
                    ref={ref}
                    className={cn(
                        "relative flex min-w-0 flex-1 flex-col items-center",
                        className
                    )}
                    aria-current={isActive ? "step" : undefined}
                    {...props}
                >
                    {/* Left half-connector: from left edge to center of this cell */}
                    {!isFirst && (
                        <div
                            className={cn(
                                "absolute left-0 right-1/2 top-4 h-px transition-colors",
                                leftConnectorLit ? "bg-primary" : "bg-border"
                            )}
                        />
                    )}
                    {/* Right half-connector: from center of this cell to right edge */}
                    {!isLast && (
                        <div
                            className={cn(
                                "absolute left-1/2 right-0 top-4 h-px transition-colors",
                                rightConnectorLit ? "bg-primary" : "bg-border"
                            )}
                        />
                    )}

                    {indicator}

                    {/* Label */}
                    <div className="mt-2 flex flex-col items-center px-1 text-center">
                        <span className={titleClass}>{title}</span>
                        {description && (
                            <div className={descriptionClass}>
                                {description}
                            </div>
                        )}
                    </div>
                </li>
            )
        }

        // ── Vertical layout ──
        return (
            <li
                ref={ref}
                className={cn("flex", className)}
                aria-current={isActive ? "step" : undefined}
                {...props}
            >
                {/* Left column: indicator + vertical connector */}
                <div className="flex flex-col items-center">
                    {indicator}
                    {!isLast && (
                        <div
                            className={cn(
                                "w-px flex-1 transition-colors",
                                rightConnectorLit ? "bg-primary" : "bg-border"
                            )}
                            style={{ minHeight: "1.5rem" }}
                        />
                    )}
                </div>

                {/* Right column: label */}
                <div
                    className={cn(
                        "ml-3 flex flex-col",
                        !isLast && "pb-6"
                    )}
                >
                    <span className={titleClass}>{title}</span>
                    {description && (
                        <div className={descriptionClass}>{description}</div>
                    )}
                </div>
            </li>
        )
    }
)
StepperItem.displayName = "StepperItem"

export { Stepper, StepperList, StepperItem }
