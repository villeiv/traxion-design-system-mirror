import { AiInsight } from "@traxion-global/design-system/react";

export default function AiInsightCollapsedByDefault() {
    return (
        <AiInsight
           className="w-96"
            defaultOpen={false}
            messages={[
                {
                    title: "Nivel de servicio Dedicado: 85%",
                    description:
                        "La unidad de negocio Dedicado reporta un nivel de servicio del 85% para el período seleccionado.",
                    variant: "warning",
                },
                {
                    title: "Rotación de operadores en aumento",
                    description:
                        "La rotación general de operadores ha aumentado por tercer semana consecutiva.",
                    variant: "critical",
                },
            ]}
        />
    );
}
