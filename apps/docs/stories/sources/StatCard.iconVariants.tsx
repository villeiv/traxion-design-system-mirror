import { StatCard } from "@traxion-global/design-system/react";
import { DollarSign, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";

export default function StatCardIconVariants() {
    return (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard
                label="Primary"
                value="1,200"
                icon={<Users className="h-6 w-6" />}
                iconVariant="primary"
            />
            <StatCard
                label="Secondary"
                value="$4,200"
                icon={<DollarSign className="h-6 w-6" />}
                iconVariant="secondary"
            />
            <StatCard
                label="Green"
                value="98.5%"
                icon={<TrendingUp className="h-6 w-6" />}
                iconVariant="green"
            />
            <StatCard
                label="Yellow"
                value="47"
                icon={<Package className="h-6 w-6" />}
                iconVariant="yellow"
            />
            <StatCard
                label="Red"
                value="12"
                icon={<ShoppingCart className="h-6 w-6" />}
                iconVariant="red"
            />
        </div>
    );
}
