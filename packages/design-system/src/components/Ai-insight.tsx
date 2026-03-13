import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Info, AlertTriangle, AlertCircle, CheckCircle2, ChevronDown, Brain } from "lucide-react"

import { cn } from "@/lib/utils"
import { useDesignSystemLanguage } from "./Language-provider"

const AI_INSIGHT_TEXTS = {
    en: { collapse: "Collapse", expand: "Expand" },
    es: { collapse: "Colapsar", expand: "Expandir" },
} as const

export type AiInsightVariant = "info" | "warning" | "critical" | "success"

export interface AiInsightMessage {
    title: string
    description: string
    variant: AiInsightVariant
}

export interface AiInsightProps extends React.HTMLAttributes<HTMLDivElement> {
    messages: AiInsightMessage[]
    defaultOpen?: boolean
}

const messageCardVariants = cva(
    "rounded-lg border p-4",
    {
        variants: {
            variant: {
                info:     "border-border bg-card",
                warning:  "border-yellow-500/30 bg-card",
                critical: "border-red-500/30 bg-card",
                success:  "border-green-500/30 bg-card",
            },
        },
        defaultVariants: {
            variant: "info",
        },
    }
)

const variantIconMap: Record<AiInsightVariant, React.ElementType> = {
    info:     Info,
    warning:  AlertTriangle,
    critical: AlertCircle,
    success:  CheckCircle2,
}

const variantIconColorMap: Record<AiInsightVariant, string> = {
    info:     "text-muted-foreground",
    warning:  "text-yellow-500",
    critical: "text-red-500",
    success:  "text-green-500",
}

interface AiInsightMessageCardProps extends VariantProps<typeof messageCardVariants> {
    title: string
    description: string
    variant: AiInsightVariant
}

function AiInsightMessageCard({ title, description, variant }: AiInsightMessageCardProps) {
    const Icon = variantIconMap[variant]
    const iconColor = variantIconColorMap[variant]

    return (
        <div className={cn(messageCardVariants({ variant }))}>
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium leading-snug">{title}</p>
                <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", iconColor)} aria-hidden="true" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
    )
}

const AiInsight = React.forwardRef<HTMLDivElement, AiInsightProps>(
    ({ className, messages, defaultOpen = true, ...props }, ref) => {
        const [isOpen, setIsOpen] = React.useState(defaultOpen)
        const language = useDesignSystemLanguage()
        const t = AI_INSIGHT_TEXTS[language]
        const contentId = React.useId()
        const isCollapsible = messages.length > 1

        return (
            <div
                ref={ref}
                className={cn("rounded-xl border bg-card text-card-foreground shadow p-4 space-y-3", className)}
                {...props}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span aria-hidden="true"><Brain className="h-4 w-4" /></span>
                        <span className="text-sm font-semibold text-muted-foreground">Traxion Intelligence</span>
                    </div>
                    {isCollapsible && (
                        <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={contentId}
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <ChevronDown
                                className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")}
                                aria-hidden="true"
                            />
                            <span className="sr-only">{isOpen ? t.collapse : t.expand} insights</span>
                        </button>
                    )}
                </div>

                {/* Messages */}
                <div
                    id={isCollapsible ? contentId : undefined}
                    className={cn("space-y-3", isCollapsible && !isOpen && "hidden")}
                >
                    {messages.map((message, index) => (
                        <AiInsightMessageCard
                            key={index}
                            title={message.title}
                            description={message.description}
                            variant={message.variant}
                        />
                    ))}
                </div>
            </div>
        )
    }
)

AiInsight.displayName = "AiInsight"

export { AiInsight }
