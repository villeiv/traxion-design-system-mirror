// Switch.stories.jsx
import { useArgs } from "storybook/preview-api";
import { Switch } from "@traxion-global/design-system";
import SwitchWithLabel from "./sources/Switch.withLabel";
import SwitchWithLabelCode from "./sources/Switch.withLabel?raw";
import SwitchControlled from "./sources/Switch.controlled";
import SwitchControlledCode from "./sources/Switch.controlled?raw";
import ToasterDecorator from "./decorators/ToasterDecorator";
import SwitchUncontrolled from "./sources/Switch.uncontrolled";
import SwitchUncontrolledCode from "./sources/Switch.uncontrolled?raw";
import SwitchBoxed from "./sources/Switch.boxed";
import SwitchBoxedCode from "./sources/Switch.boxed?raw";

const meta = {
    title: "Switch",
    component: Switch,
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component:
                    "El componente **Switch** permite alternar entre dos estados (activado o desactivado) de forma clara y accesible, ideal para configuraciones binarias como sí/no o encendido/apagado.",
            },
        },
    },
    argTypes: {
        checked: {
            control: "boolean",
            description: "Estado actual del switch.",
        },
        disabled: {
            control: "boolean",
            description: "Desactiva la interacción del switch.",
        },
    },
};

export default meta;

export const Playground = {
    name: "Área de pruebas",
    tags: ["!autodocs"],
    args: {
        checked: false,
        disabled: false,
    },
    parameters: {
        //escondo accesibilidad
        a11y: { disable: true },
        actions: { disable: true },
        docs: {
            codePanel: false,
        }
    },
    render: (args) => {
        const [{ checked, disabled }, updateArgs] = useArgs();
        return (
            <Switch
                checked={checked}
                disabled={disabled}
                onCheckedChange={(value) => updateArgs({ checked: value })}
            />
        );
    },
}

export const Controlled = {
    name: "Componente controlado",
    decorators: [ToasterDecorator],
    args: {
        checked: false,
        disabled: false,
    },
    parameters: {
        a11y: { disable: true },
        actions: { disable: true },
        controls: { disable: true },
        docs: {
            description: {
                story:"Un switch controlado mediante estado en el componente padre, usando las props <code>checked</code> y <code>onCheckedChange</code>."
            },
            source: {
                code: SwitchControlledCode,
            }
        },
    },
    render: SwitchControlled,
};

export const Uncontrolled = {
    name: "Componente no controlado",
    decorators: [ToasterDecorator],
    render: SwitchUncontrolled,
    parameters: {
        a11y: { disable: true },
        actions: { disable: true },
        controls: { disable: true },
        docs: {
            description: {
                story: "Un switch no controlado que maneja su propio estado interno. En este caso podemos especificar un estado inicial con la prop <code>defaultChecked</code>.",
            },
            source: {
                code: SwitchUncontrolledCode
            }
        }
    }
}

export const WithLabel = {
    name: "Con etiqueta",
    args: {
        checked: false,
        disabled: false,
    },
    parameters: {
        a11y: { disable: true },
        actions: { disable: true },
        controls: { disable: true },
        docs: {
            description: {
                story:
                    "Un switch acompañado de una etiqueta de texto. Se recomienda este patrón para mejorar la accesibilidad y comprensión de la acción.",
            },
            source: {
                code: SwitchWithLabelCode
            }
        },
    },
    render: SwitchWithLabel
};

export const BoxedSwitch = {
    name: "Caja con switch",
    tags: ["autodocs"],
    decorators: [ToasterDecorator],
    parameters: {
        controls: { disable: true },
        actions: { disable: true },
        a11y: { disable: true },
        docs: {
            codePanel: true,
            description: {
                story:"Un switch integrado dentro de una caja que incluye título, descripción y un ícono."
            },
            source: {
                code: SwitchBoxedCode
            }
        }
    },
    render: SwitchBoxed
}