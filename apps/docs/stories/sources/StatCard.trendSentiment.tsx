import { StatCard } from "@traxion-global/design-system/react";
import { AlertTriangle } from "lucide-react";

export default function StatCardTrendSentiment() {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
                label="Tasa de accidentes"
                value="3.2%"
                icon={<AlertTriangle className="h-6 w-6" />}
                iconVariant="green"
                trend={-18.5}
                trendSentiment="positive"
                trendLabel="vs mes anterior"
            />
            <StatCard
                label="Tasa de accidentes"
                value="5.8%"
                icon={<AlertTriangle className="h-6 w-6" />}
                iconVariant="red"
                trend={12.3}
                trendSentiment="negative"
                trendLabel="vs mes anterior"
            />
        </div>
    );
}
