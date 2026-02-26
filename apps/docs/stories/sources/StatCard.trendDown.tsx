import { StatCard } from "@traxion-global/design-system/react";
import { Package } from "lucide-react";

export default function StatCardTrendDown() {
    return (
        <StatCard
            label="Devoluciones"
            value="38"
            icon={<Package className="h-6 w-6" />}
            iconVariant="red"
            trend={-3.2}
            trendLabel="esta semana"
        />
    );
}
