import {Input, Checkbox, Label} from "@traxion-global/design-system";

export default {
    title: 'Label',
    component: Label,
    tags: ['autodocs'],
    argTypes:{
        htmlFor: {
            control: 'text',
            description: 'Asocia el label con un input mediante su id'
        },
        children: {
            control: 'text',
            description: 'Texto que se muestra dentro del label'
        }
    },
    parameters: {
        a11y: { disable: true },
        controls: { disable: true },
        actions: { disable: true },
        docs: {
            description: {
                component: 'Etiqueta base del sistema. Usada junto a inputs y selectores.'
            }
        }
    }
}

export const WithInput = {
    name: "Con input",
    parameters: {
        docs: {
            description: {
                story: 'El componente **Label** se utiliza para asociar texto descriptivo con un campo de entrada, mejorando la accesibilidad y usabilidad del formulario. Asegurate de asignar el atributo `htmlFor` al mismo valor que el `id` del input correspondiente.'
            }
        }
    },
    render: (args) => (
        <div className="flex flex-col gap-2">
            <Label
                htmlFor = 'input-example'
                children = 'Etiqueta de ejemplo'
            />
            <Input id="input-example" placeholder="Escribe algo..." />
        </div>
    )
}

export const WithCheckboxesOrRadios = {
    name: "Con checkboxes o radios",
    parameters: {
        docs: {
            description: {
                story: 'El componente **Label** también puede usarse junto a checkboxes y botones de opción (radios) para describir su propósito y mejorar la accesibilidad del formulario. Asegurate de asignar el atributo `htmlFor` al mismo valor que el `id` del checkbox o radio correspondiente.'
            }
        }
    },
    render: (args) => (
        <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Acepto términos y condiciones.</Label>
        </div>
    )
}