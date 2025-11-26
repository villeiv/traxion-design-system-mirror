import { Card, CardContent } from "./Card";
import { ReactNode } from "react";

interface InfoCardProps {
    title?: string;
    value?: string;
    icon?: ReactNode;
    iconColor?: "primary" | "green" | "yellow" | "red" | "gray";
}

const colorClasses = {
    primary: {
        bg: "bg-primary/10",
        text: "text-primary",
    },
    green: {
        bg: "bg-green-500/10",
        text: "text-green-500",
    },
    yellow: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-500",
    },
    red: {
        bg: "bg-red-500/10",
        text: "text-red-500",
    },
    gray: {
        bg: "bg-gray-500/10",
        text: "text-gray-500",
    },
};

export function InfoCard({ title, value, icon, iconColor }: InfoCardProps) {
    const classes = iconColor ? colorClasses[iconColor] : colorClasses.primary;

    return (
        <Card>
            <CardContent className="p-2 sm:px-4 sm:py-3">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[0.65rem] sm:text-sm text-muted-foreground">{title}</p>
                        <p className="text-base sm:text-2xl font-bold">{value}</p>
                    </div>
                    <div className={`h-12 w-12 ${classes.bg} ${classes.text} rounded-full flex items-center justify-center hidden sm:flex`}>
                        {icon}
                    </div>
                    <div className={`sm:hidden ${classes.text}`}>{icon}</div>
                </div>
            </CardContent>
        </Card>
    );
}
