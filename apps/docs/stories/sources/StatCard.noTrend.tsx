import { StatCard } from "@traxion-global/design-system/react";
import { ShoppingCart } from "lucide-react";

export default function StatCardNoTrend() {
    return (
        <StatCard
            label="Pedidos Activos"
            value="320"
            icon={<ShoppingCart className="h-6 w-6" />}
            iconVariant="primary"
        />
    );
}
