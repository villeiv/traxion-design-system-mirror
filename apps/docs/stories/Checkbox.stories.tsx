import {Checkbox} from "@traxion-global/design-system";
import {useArgs} from "storybook/preview-api";
import CheckboxWithLabel from "./sources/Checkbox.withLabel";
import CheckboxWithLabelCode from "./sources/Checkbox.withLabel?raw";
import CheckboxControlled from "./sources/Checkbox.controlled";
import CheckboxControlledCode from "./sources/Checkbox.controlled?raw";
import CheckboxBoxed from "./sources/Checkbox.boxed";
import CheckboxBoxedCode from "./sources/Checkbox.boxed?raw";
import ToasterDecorator from "./decorators/ToasterDecorator";
import CheckboxUncontrolled from "./sources/Checkbox.uncontrolled";
import CheckboxUncontrolledCode from "./sources/Checkbox.uncontrolled?raw";

export default {
    title: 'Checkbox',
    component: Checkbox,
    tags: ["autodocs"],
    parameters: {
        a11y: { disable:true },
        actions: { disable:true },
        docs: {
            codePanel: false,
            description: {
                component: "El componente **Checkbox** es un elemento de formulario que permite a los usuarios seleccionar o deseleccionar una opción. Es ideal para opciones binarias y puede ser controlado o no controlado."
            }
        }
    },
    argTypes: {
        checked: {
            control: "boolean",
            description: "Estado actual del checkbox.",
        },
        disabled: {
            control: "boolean",
            description: "Desactiva la interacción del checkbox.",
        }
    },
}

export const Playground = {
    name: "Área de prueba",
    tags: ["!autodocs"],
    args:{
        checked: true,
        disabled: false,
    },
    render: (args) => {
        const [{ checked, disabled }, updateArgs] = useArgs();
        return (
            <Checkbox
                checked={checked}
                disabled={disabled}
                onCheckedChange={(value) => updateArgs({ checked: value })}
            />
        );
    },
}

export const Controlled = {
    name: "Componente controlado",
    tags: ["autodocs"],
    render: CheckboxControlled,
    decorators: [ToasterDecorator],
    parameters: {
        controls: { disable: true },
        docs: {
            codePanel: true,
            source: {
                code: CheckboxControlledCode
            },
            description: {
                story: "En un componente controlado, el estado del checkbox (marcado o desmarcado) se gestiona externamente a través de props. Esto permite una mayor sincronización con otros componentes o estados de la aplicación."
            }
        }
    }
}

export const Uncontrolled = {
    name: "Componente no controlado",
    tags: ["autodocs"],
    decorators: [ToasterDecorator],
    render: CheckboxUncontrolled,
    parameters: {
        controls: { disable: true },
        docs: {
            codePanel: true,
            source: {
                code: CheckboxUncontrolledCode
            },
            description: {
                story: "En un componente no controlado, el estado del checkbox se gestiona internamente. Solo en este caso se puede usar el atributo `defaultChecked` para establecer su estado inicial."
            }
        }
    }
}

export const WithLabel = {
    name: "Con etiqueta",
    tags: ["autodocs"],
    render: CheckboxWithLabel,
    parameters: {
        controls: { disable: true },
        docs: {
            codePanel: true,
            source: {
                code: CheckboxWithLabelCode
            },
            description: {
                story: "El componente **Checkbox** puede ir acompañado de una etiqueta descriptiva para mejorar la accesibilidad y la usabilidad. La etiqueta debe estar claramente asociada al checkbox."
            }
        }
    }
}

export const BoxedCheckbox = {
    name: "Checkbox en caja",
    tags: ["autodocs"],
    decorators: [ToasterDecorator],
    parameters: {
        controls: { disable: true },
        docs: {
            codePanel: true,
            source: {
                code: CheckboxBoxedCode
            },
            description: {
                story: "En esta variante el checkbox se presenta dentro de un contenedor visual."
            }
        }
    },
    render: CheckboxBoxed
}