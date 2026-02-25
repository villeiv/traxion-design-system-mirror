import { useState } from "react"
import {
    Button,
    Stepper,
    StepperList,
    StepperItem,
} from "@traxion-global/design-system/react"

const STEPS = [
    { value: "cuenta", title: "Cuenta", description: "Datos de acceso" },
    { value: "perfil", title: "Perfil", description: "Información personal" },
    { value: "empresa", title: "Empresa", description: "Datos de la empresa" },
    { value: "confirmacion", title: "Confirmación", description: "Revisión final" },
]

const STEP_CONTENT: Record<string, string> = {
    cuenta: "Ingresa tu correo electrónico y contraseña para crear tu cuenta.",
    perfil: "Completa tu nombre completo, teléfono y foto de perfil.",
    empresa: "Proporciona el nombre, RFC y giro de tu empresa.",
    confirmacion: "Revisa los datos capturados antes de enviar el registro.",
}

export default function StepperNavigation() {
    const [currentStep, setCurrentStep] = useState("cuenta")
    const [completedSteps, setCompletedSteps] = useState<string[]>([])

    const currentIndex = STEPS.findIndex((s) => s.value === currentStep)
    const isFirst = currentIndex === 0
    const isLast = currentIndex === STEPS.length - 1

    const navigateTo = (stepValue: string) => {
        const newIndex = STEPS.findIndex((s) => s.value === stepValue)
        setCompletedSteps(STEPS.slice(0, newIndex).map((s) => s.value))
        setCurrentStep(stepValue)
    }

    const goNext = () => { if (!isLast) navigateTo(STEPS[currentIndex + 1].value) }
    const goBack = () => { if (!isFirst) navigateTo(STEPS[currentIndex - 1].value) }

    return (
        <div className="flex w-[500px] flex-col gap-8">
            <Stepper
                value={currentStep}
                onValueChange={navigateTo}
                completedSteps={completedSteps}
                clickable="all"
            >
                <StepperList>
                    {STEPS.map((step) => (
                        <StepperItem
                            key={step.value}
                            value={step.value}
                            title={step.title}
                            description={step.description}
                        />
                    ))}
                </StepperList>
            </Stepper>

            <div className="min-h-28 rounded-lg border bg-card p-6">
                <p className="text-sm text-muted-foreground">
                    {STEP_CONTENT[currentStep]}
                </p>
            </div>

            <div className="flex justify-between">
                <Button variant="outline" onClick={goBack} disabled={isFirst}>
                    Anterior
                </Button>
                <Button onClick={goNext} disabled={isLast}>
                    {isLast ? "Finalizar" : "Siguiente"}
                </Button>
            </div>
        </div>
    )
}
