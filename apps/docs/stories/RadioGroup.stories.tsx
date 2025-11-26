import {Label, RadioGroup, RadioGroupItem} from "@traxion-global/design-system";
import RadioGroupControlled from "./sources/RadioGroup.controlled";
import RadioGroupControlledCode from "./sources/RadioGroup.controlled?raw";
import {RadioGroupAnatomy} from "./sources/RadioGroup.anatomy";

export default {
    title: 'RadioGroup',
    component: RadioGroup,
    tags: ['autodocs'],
    parameters: {
        a11y: { disable:true },
        controls: { disable: true },
        actions: { disable: true },
        docs: {
            description: {
                component: 'El componente `RadioGroup` permite a los usuarios seleccionar una opción de un conjunto de opciones mutuamente excluyentes. Cada opción se representa mediante un `RadioGroupItem`. Este componente es útil cuando se desea que el usuario elija una sola opción entre varias disponibles.' + RadioGroupAnatomy
            }
        }
    }
}

export const Basic = {
    name: 'Uso básico (no controlado)',
    parameters: {
        docs: {
            description: {
                story: 'Uso básico de un RadioGroup no controlado con tres opciones. La opción 2 está seleccionada por defecto.'
            }
        }
    },
    render:args=>{
        return <RadioGroup defaultValue={"2"}>
            <Label className={"flex items-center gap-2"}>
                <RadioGroupItem value="1" />Opción 1
            </Label>
            <Label className={"flex items-center gap-2"}>
                <RadioGroupItem value="2" />Opción 2
            </Label>
            <Label className={"flex items-center gap-2"}>
                <RadioGroupItem value="3" />Opción 3
            </Label>
        </RadioGroup>
    }
}

export const Controlled = {
    name: 'Uso controlado',
    parameters: {
        docs: {
            description: {
                story: 'Uso de un RadioGroup controlado. La opción seleccionada se gestiona mediante el estado del componente padre.'
            },
            source: {
                code: RadioGroupControlledCode
            }
        }
    },
    render: RadioGroupControlled
}

export const DisabledItem = {
    name: 'Opción deshabilitada',
    parameters: {
        docs: {
            description: {
                story: 'Ejemplo de un RadioGroup con una opción deshabilitada (Opción 2).'
            }
        }
    },
    render:args=>(
        <RadioGroup >
            <Label className={"flex items-center gap-2"}>
                <RadioGroupItem value="1" />Opción 1
            </Label>
            <Label className={"flex items-center gap-2"}>
                <RadioGroupItem value="2" disabled />Opción 2
            </Label>
            <Label className={"flex items-center gap-2"}>
                <RadioGroupItem value="3" />Opción 3
            </Label>
        </RadioGroup>
    )
}