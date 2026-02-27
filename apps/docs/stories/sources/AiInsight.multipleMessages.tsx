import { AiInsight } from "@traxion-global/design-system/react";

export default function AiInsightMultipleMessages() {
    return (
        <AiInsight
            className="w-96"
            messages={[
                {
                    title: "Nivel de servicio Dedicado: 85%",
                    description:
                        "La unidad de negocio Dedicado reporta un nivel de servicio del 85% para el período seleccionado. Se recomienda revisar la asignación de recursos para el siguiente ciclo.",
                    variant: "warning",
                },
                {
                    title: "Rotación de operadores en aumento",
                    description:
                        "La rotación general de operadores ha aumentado por tercer semana consecutiva. Este patrón puede afectar la continuidad operativa si no se atiende a tiempo.",
                    variant: "critical",
                },
                {
                    title: "Eficiencia de rutas mejorada",
                    description:
                        "La optimización de rutas aplicada en el último ciclo redujo el tiempo promedio de entrega en un 12%, superando el objetivo mensual.",
                    variant: "success",
                },
            ]}
        />
    );
}
