import {
    StatCard,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@traxion-global/design-system/react";
import { Info, Users } from "lucide-react";

export default function StatCardIconTooltip() {
    return (
        <TooltipProvider delayDuration={200}>
            <div className="grid gap-4 sm:grid-cols-2">
                <StatCard
                    label="Usuarios activos"
                    value="2,350"
                    icon={<Users className="h-6 w-6" />}
                    iconVariant="primary"
                    trend={15.3}
                    trendLabel="vs mes anterior"
                    iconWrapper={(badge) => (
                        <Tooltip>
                            <TooltipTrigger asChild>{badge}</TooltipTrigger>
                            <TooltipContent>
                                Usuarios con al menos una sesión en los últimos 30 días
                            </TooltipContent>
                        </Tooltip>
                    )}
                />
                <StatCard
                    label="Margen operativo"
                    value="18.4%"
                    icon={<Info className="h-6 w-6" />}
                    iconVariant="secondary"
                    iconPosition="left"
                    iconWrapper={(badge) => (
                        <Tooltip>
                            <TooltipTrigger asChild>{badge}</TooltipTrigger>
                            <TooltipContent>
                                Utilidad operativa entre ingresos totales del periodo
                            </TooltipContent>
                        </Tooltip>
                    )}
                />
            </div>
        </TooltipProvider>
    );
}
