import {toast, Switch} from "@traxion-global/design-system";

export default function SwitchUncontrolled() {
    function onCheckedChange(value) {
        value ?
            toast.success("Switch activado") :
            toast.info("Switch desactivado");
    }

    return <Switch defaultChecked={true} onCheckedChange={onCheckedChange}/>
}