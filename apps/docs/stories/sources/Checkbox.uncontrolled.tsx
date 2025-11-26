import {Checkbox, toast} from "@traxion-global/design-system";

export default function CheckboxUncontrolled() {
    function onCheckedChange(value) {
        value ?
            toast.success("Checkbox activado") :
            toast.info("Checkbox desactivado");
    }

    return <Checkbox defaultChecked={true} onCheckedChange={onCheckedChange}/>
}