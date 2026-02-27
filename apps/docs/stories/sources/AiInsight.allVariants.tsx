import { AiInsight } from "@traxion-global/design-system/react";

export default function AiInsightAllVariants() {
    return (
        <div className="flex flex-col gap-4 max-w-xl w-96">
            <AiInsight
                messages={[
                    {
                        title: "Análisis de datos disponible",
                        description:
                            "Se completó el procesamiento del período seleccionado. Los resultados reflejan el comportamiento operativo de las últimas cuatro semanas.",
                        variant: "info",
                    },
                ]}
            />
            <AiInsight
                messages={[
                    {
                        title: "Nivel de servicio por debajo del objetivo",
                        description:
                            "El nivel de servicio actual (85%) se encuentra por debajo del umbral esperado (95%). Se recomienda revisar la asignación de recursos.",
                        variant: "warning",
                    },
                ]}
            />
            <AiInsight
                messages={[
                    {
                        title: "Incumplimiento crítico detectado",
                        description:
                            "Tres rutas registraron entregas fuera de ventana de tiempo por más de 60 minutos. Se requiere intervención inmediata.",
                        variant: "critical",
                    },
                ]}
            />
            <AiInsight
                messages={[
                    {
                        title: "Objetivo de eficiencia alcanzado",
                        description:
                            "La eficiencia operativa superó el objetivo mensual por segundo mes consecutivo, alcanzando un 97.3%.",
                        variant: "success",
                    },
                ]}
            />
        </div>
    );
}
