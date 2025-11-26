import {useState} from "react";
import {Checkbox, toast} from "@traxion-global/design-system";

export default function CheckboxControlled() {
    const [checked, setChecked] = useState(false);

    function handleCheckedChange(value) {
        value ?
            toast.success("Checkbox activado")
            :
            toast.info("Checkbox desactivado");

        setChecked(value);
    }

    return (
        <Checkbox
            checked={checked}
            onCheckedChange={handleCheckedChange}
        />
    );
}