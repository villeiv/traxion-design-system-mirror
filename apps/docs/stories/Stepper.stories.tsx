import { Stepper, StepperList, StepperItem } from "@traxion-global/design-system/react"
import { StepperAnatomy } from "./sources/Stepper.anatomy"
import StepperNavigation from "./sources/Stepper.navigation"
import StepperNavigationSource from "./sources/Stepper.navigation.tsx?raw"
import StepperDelivery from "./sources/Stepper.delivery"
import StepperDeliverySource from "./sources/Stepper.delivery.tsx?raw"

const meta = {
    component: Stepper,
    title: "Stepper",
    tags: ["autodocs"],
    parameters: {
        controls: { disable: true },
        actions: { disable: true },
        a11y: { disable: true },
        docs: {
            description: {
                component: `
El componente **Stepper** es un indicador visual de progreso para procesos secuenciales. Puede utilizarse de dos formas:

- **Modo navegación** — guía al usuario a través de un asistente o formulario de varios pasos, con botones de Siguiente / Anterior gestionados por el consumidor.
- **Modo display** — muestra el estado de un proceso de forma informativa y sin interacción, como el seguimiento de un pedido.

### Importación
\`\`\`tsx
import { Stepper, StepperList, StepperItem } from "@traxion-global/design-system/react"
\`\`\`

${StepperAnatomy}
                `,
            },
        },
    },
    argTypes: {
        orientation: {
            control: { type: "select" },
            options: ["horizontal", "vertical"],
            description: "Dirección del layout del stepper.",
        },
        variant: {
            control: { type: "select" },
            options: ["numbered", "dots"],
            description:
                'Estilo del indicador. `"numbered"` muestra el número del paso; `"dots"` muestra un círculo sin número.',
        },
        clickable: {
            control: { type: "select" },
            options: ["none", "completed", "all"],
            description:
                'Controla qué pasos responden a clic. `"none"` deshabilita la navegación por clic (ideal para modo display); `"completed"` permite volver a pasos completados; `"all"` habilita navegación libre.',
        },
        value: {
            control: { type: "select" },
            options: ["info", "direccion", "pago", "confirmacion"],
            description: "Valor del paso activo.",
        },
        completedSteps: {
            control: { type: "select" },
            options: ["Ninguno", "Paso 1", "Pasos 1 y 2", "Pasos 1, 2 y 3"],
            mapping: {
                "Ninguno": [],
                "Paso 1": ["info"],
                "Pasos 1 y 2": ["info", "direccion"],
                "Pasos 1, 2 y 3": ["info", "direccion", "pago"],
            },
            description: "Pasos marcados explícitamente como completados.",
        },
    },
    args: {
        value: "pago",
        completedSteps: ["info", "direccion"],
        orientation: "horizontal",
        variant: "numbered",
        clickable: "none",
    },
}

export default meta

// ─── Demo ─────────────────────────────────────────────────────────────────────

export const Demo = {
    name: "Área de pruebas",
    tags: ["!autodocs"],
    parameters: {
        controls: { disable: false },
    },
    render: (args) => (
        <div className="w-full max-w-2xl p-4">
            <Stepper {...args}>
                <StepperList>
                    <StepperItem value="info" title="Información" description="Datos básicos" />
                    <StepperItem value="direccion" title="Dirección" description="Datos de envío" />
                    <StepperItem value="pago" title="Pago" description="Método de pago" />
                    <StepperItem value="confirmacion" title="Confirmación" />
                </StepperList>
            </Stepper>
        </div>
    ),
}

// ─── Horizontal ───────────────────────────────────────────────────────────────

export const Horizontal = {
    name: "Orientación horizontal",
    parameters: {
        docs: {
            description: {
                story:
                    "Disposición por defecto. Los pasos se muestran de izquierda a derecha con líneas conectoras horizontales. Los pasos completados muestran un ícono de check; el paso activo se resalta con color primario.",
            },
        },
    },
    render: () => (
        <div className="w-full max-w-2xl">
            <Stepper value="pago" completedSteps={["info", "direccion"]}>
                <StepperList>
                    <StepperItem value="info" title="Información" description="Datos básicos" />
                    <StepperItem value="direccion" title="Dirección" description="Datos de envío" />
                    <StepperItem value="pago" title="Pago" description="Método de pago" />
                    <StepperItem value="confirmacion" title="Confirmación" />
                </StepperList>
            </Stepper>
        </div>
    ),
}

// ─── Vertical ─────────────────────────────────────────────────────────────────

export const Vertical = {
    name: "Orientación vertical",
    parameters: {
        docs: {
            description: {
                story:
                    "Los pasos se apilan verticalmente con una línea conectora lateral. Útil para barras laterales, paneles de configuración o interfaces móviles donde el espacio horizontal es limitado.",
            },
        },
    },
    render: () => (
        <Stepper value="pago" completedSteps={["info", "direccion"]} orientation="vertical">
            <StepperList>
                <StepperItem value="info" title="Información" description="Datos básicos" />
                <StepperItem value="direccion" title="Dirección" description="Datos de envío" />
                <StepperItem value="pago" title="Pago" description="Método de pago" />
                <StepperItem value="confirmacion" title="Confirmación" />
            </StepperList>
        </Stepper>
    ),
}

// ─── Dots ─────────────────────────────────────────────────────────────────────

export const Dots = {
    name: "Variante dots",
    parameters: {
        docs: {
            description: {
                story:
                    'Variante minimalista sin numeración: `variant="dots"`. Los pasos muestran círculos rellenos. Al completarse aparece un check; en error, una X. Adecuada para flujos cortos y simples donde el número de paso no aporta contexto adicional.',
            },
        },
    },
    render: () => (
        <div className="w-full max-w-2xl">
            <Stepper value="pago" completedSteps={["info", "direccion"]} variant="dots">
                <StepperList>
                    <StepperItem value="info" title="Información" description="Datos básicos" />
                    <StepperItem value="direccion" title="Dirección" description="Datos de envío" />
                    <StepperItem value="pago" title="Pago" description="Método de pago" />
                    <StepperItem value="confirmacion" title="Confirmación" />
                </StepperList>
            </Stepper>
        </div>
    ),
}

// ─── Error ────────────────────────────────────────────────────────────────────

export const WithError = {
    name: "Con error",
    parameters: {
        docs: {
            description: {
                story:
                    "La prop `error` en `StepperItem` activa el estado de error: el indicador cambia a color destructivo con un ícono de X. El error tiene prioridad sobre todos los demás estados, incluyendo `completedSteps`. Úsalo cuando un paso falla la validación.",
            },
        },
    },
    render: () => (
        <div className="flex w-full max-w-2xl flex-col gap-8">
            <div>
                <p className="mb-4 text-xs text-muted-foreground">
                    Horizontal — error en el paso 2
                </p>
                <Stepper value="pago" completedSteps={["info"]}>
                    <StepperList>
                        <StepperItem value="info" title="Información" description="Datos básicos" />
                        <StepperItem value="direccion" title="Dirección" description="Verificar datos" error />
                        <StepperItem value="pago" title="Pago" description="Método de pago" />
                        <StepperItem value="confirmacion" title="Confirmación" />
                    </StepperList>
                </Stepper>
            </div>

            <div>
                <p className="mb-4 text-xs text-muted-foreground">
                    Vertical — error en el paso 2
                </p>
                <Stepper value="pago" completedSteps={["info"]} orientation="vertical">
                    <StepperList>
                        <StepperItem value="info" title="Información" description="Datos básicos" />
                        <StepperItem value="direccion" title="Dirección" description="Verificar datos" error />
                        <StepperItem value="pago" title="Pago" description="Método de pago" />
                        <StepperItem value="confirmacion" title="Confirmación" />
                    </StepperList>
                </Stepper>
            </div>
        </div>
    ),
}

// ─── Navigation mode ──────────────────────────────────────────────────────────

export const NavigationMode = {
    name: "Modo navegación",
    parameters: {
        docs: {
            description: {
                story:
                    "Asistente interactivo controlado. Los botones Anterior y Siguiente gestionan el avance, pero también es posible hacer clic en cualquier paso para navegar directamente (`clickable=\"all\"`). Al saltar a un paso, todos los anteriores se marcan automáticamente como completados.",
            },
            source: { code: StepperNavigationSource },
        },
    },
    render: () => <StepperNavigation />,
}

// ─── Display mode ─────────────────────────────────────────────────────────────

export const DisplayMode = {
    name: "Modo display",
    parameters: {
        docs: {
            description: {
                story:
                    "Uso informativo puro sin interacción (`clickable=\"none\"` por defecto). Ideal para mostrar el estado de un proceso como el seguimiento de un pedido. La prop `description` de `StepperItem` acepta `ReactNode`, lo que permite incluir fechas, badges u otro contenido enriquecido.",
            },
            source: { code: StepperDeliverySource },
        },
    },
    render: () => <StepperDelivery />,
}
