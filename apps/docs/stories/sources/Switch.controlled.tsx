import { useState } from "react";
import { Switch, toast } from "@traxion-global/design-system";

export default function SwitchControlled() {
    const [checked, setChecked] = useState(false);

    function handleCheckedChange(value) {
        value
            ? toast.success("Switch activado")
            : toast.info("Switch desactivado");

        setChecked(value);
    }

    return (
        <Switch
            checked={checked}
            onCheckedChange={handleCheckedChange}
        />
    );
}