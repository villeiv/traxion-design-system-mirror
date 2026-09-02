import { StatCard } from "@traxion-global/design-system/react";
import { DollarSign, Users } from "lucide-react";

export default function StatCardIconPosition() {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
                label="Ícono a la derecha"
                value="$45,231"
                icon={<DollarSign className="h-6 w-6" />}
                iconVariant="green"
                trend={20.1}
                trendLabel="vs mes anterior"
            />
            <StatCard
                label="Ícono a la izquierda"
                value="2,350"
                icon={<Users className="h-6 w-6" />}
                iconVariant="primary"
                iconPosition="left"
                trend={15.3}
                trendLabel="vs mes anterior"
            />
        </div>
    );
}
