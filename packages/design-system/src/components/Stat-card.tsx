import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./Card";

const iconVariants = cva(
    "h-12 w-12 rounded-full flex items-center justify-center",
    {
        variants: {
            iconVariant: {
                primary: "bg-primary/10 text-primary",
                secondary: "bg-gray-500/10 text-gray-500",
                green: "bg-green-500/10 text-green-500",
                yellow: "bg-yellow-500/10 text-yellow-500",
                red: "bg-red-500/10 text-red-500",
            },
        },
        defaultVariants: { iconVariant: "primary" },
    }
);

export interface StatCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof iconVariants> {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: number;
    trendSentiment?: "positive" | "negative" | "neutral";
    trendLabel?: string;
    loading?: boolean;
}

const sentimentColor = {
    positive: "text-green-500",
    negative: "text-red-500",
    neutral: "text-muted-foreground",
} as const;

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
    ({ className, label, value, icon, trend, trendSentiment, trendLabel, loading, iconVariant, ...props }, ref) => {
        const renderTrend = () => {
            if (trend === undefined) return null;

            const autoSentiment = trend > 0 ? "positive" : trend < 0 ? "negative" : "neutral";
            const sentiment = trendSentiment ?? autoSentiment;
            const color = sentimentColor[sentiment];
            const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
            const formatted = trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : "0%";

            return (
                <div className={cn("flex items-center gap-1", color)}>
                    <TrendIcon className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">{formatted}</span>
                    {trendLabel && (
                        <span className="text-xs text-muted-foreground">{trendLabel}</span>
                    )}
                </div>
            );
        };

        if (loading) {
            return (
                <Card ref={ref} className={className} {...props}>
                    <CardContent className="p-2 sm:px-4 sm:py-3">
                        <div className="flex items-center justify-between gap-4 animate-pulse">
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-24 rounded bg-muted" />
                                <div className="h-7 w-32 rounded bg-muted" />
                                <div className="h-3 w-20 rounded bg-muted" />
                            </div>
                            <div className="hidden sm:block h-12 w-12 rounded-full bg-muted shrink-0" />
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return (
            <Card ref={ref} className={className} {...props}>
                <CardContent className="p-2 sm:px-4 sm:py-3">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[0.65rem] sm:text-sm text-muted-foreground">{label}</p>
                            <p className="text-base sm:text-2xl font-bold">{value}</p>
                            {renderTrend()}
                        </div>
                        {icon && (
                            <>
                                <div className={cn(iconVariants({ iconVariant }), "hidden sm:flex shrink-0")}>
                                    {icon}
                                </div>
                                <div className={cn(iconVariants({ iconVariant }), "sm:hidden h-auto w-auto rounded-none bg-transparent p-0")}>
                                    {icon}
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }
);

StatCard.displayName = "StatCard";

export { StatCard };
