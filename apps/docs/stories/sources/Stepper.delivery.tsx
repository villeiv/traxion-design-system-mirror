import { Badge, Stepper, StepperList, StepperItem } from "@traxion-global/design-system/react"
import { Truck } from "lucide-react"

export default function StepperDelivery() {
    return (
        <div className="w-[500px]">
            <Stepper
                value="transito"
                completedSteps={["recibido", "preparacion"]}
            >
                <StepperList>
                    <StepperItem
                        value="recibido"
                        title="Pedido recibido"
                        description="Lun 24 feb, 10:32"
                    />
                    <StepperItem
                        value="preparacion"
                        title="En preparación"
                        description="Lun 24 feb, 11:15"
                    />
                    <StepperItem
                        value="transito"
                        title="En camino"
                    />
                    <StepperItem
                        value="entregado"
                        title="Entregado"
                        description="Est. Mar 25 feb"
                    />
                </StepperList>
            </Stepper>
        </div>
    )
}
