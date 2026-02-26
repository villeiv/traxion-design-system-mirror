import { StatCard } from "@traxion-global/design-system/react";

export default function StatCardLoading() {
    return (
        <StatCard
            label="Usuarios"
            value="0"
            loading
        />
    );
}
