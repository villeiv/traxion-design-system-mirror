import { AiInsight } from "@traxion-global/design-system/react";

export default function AiInsightSingleMessage() {
    return (
        <AiInsight
            className="w-96"
            messages={[
                {
                    title: "Cuellos de botella identificados",
                    description:
                        "Los cuellos de botella se concentran principalmente en sistemas específicos del flujo de trabajo, permitiendo identificar puntos de fricción recurrentes y enfocar las mejoras operativas.",
                    variant: "info",
                },
            ]}
        />
    );
}
