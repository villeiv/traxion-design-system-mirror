import { StatCard } from "@traxion-global/design-system/react";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

export default function StatCardDashboardGrid() {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
                label="Ingresos Totales"
                value="$45,231.89"
                icon={<DollarSign className="h-6 w-6" />}
                iconVariant="green"
                trend={20.1}
                trendLabel="vs mes anterior"
            />
            <StatCard
                label="Usuarios Activos"
                value="2,350"
                icon={<Users className="h-6 w-6" />}
                iconVariant="primary"
                trend={15.3}
                trendLabel="vs mes anterior"
            />
            <StatCard
                label="Pedidos"
                value="1,247"
                icon={<ShoppingCart className="h-6 w-6" />}
                iconVariant="yellow"
                trend={-4.5}
                trendLabel="vs semana anterior"
            />
            <StatCard
                label="Inventario"
                value="573"
                icon={<Package className="h-6 w-6" />}
                iconVariant="secondary"
                trend={0}
                trendLabel="sin cambios"
            />
        </div>
    );
}
