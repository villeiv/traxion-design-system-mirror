import * as React from "react"
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-normal select-none transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                // shadcn legacy
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
                // Traxion
                primary: "text-primary-dark border-primary-dark bg-primary/10",
                green: "text-green-500 border-green-500 bg-green-500/10",
                yellow: "text-yellow-500 border-yellow-500 bg-yellow-500/10",
                red: "text-red-500 border-red-500 bg-red-500/10",
                gray: "text-gray-700 border-gray-300 bg-gray-200/50",
                cyan: "text-cyan-500 border-cyan-500 bg-cyan-500/10",
                violet: "text-violet-500 border-violet-500 bg-violet-500/10",
                blue: "text-blue-500 border-blue-500 bg-blue-500/10",
                teal: "text-teal-500 border-teal-500 bg-teal-500/10",
                orange: "text-orange-500 border-orange-500 bg-orange-500/10",
                pink: "text-pink-500 border-pink-500 bg-pink-500/10",
                fuchsia: "text-fuchsia-500 border-fuchsia-500 bg-fuchsia-500/10",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {
}

function Badge({className, variant, ...props}: BadgeProps) {
    return (
        <div className={cn(badgeVariants({variant}), className)} {...props} />
    )
}

export {Badge, badgeVariants}
