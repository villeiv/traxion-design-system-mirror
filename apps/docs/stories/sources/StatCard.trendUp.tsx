import { StatCard } from "@traxion-global/design-system/react";
import { DollarSign } from "lucide-react";

export default function StatCardTrendUp() {
    return (
        <StatCard
            label="Ingresos Totales"
            value="$12,400"
            icon={<DollarSign className="h-6 w-6" />}
            iconVariant="green"
            trend={12.5}
            trendLabel="vs mes anterior"
        />
    );
}
