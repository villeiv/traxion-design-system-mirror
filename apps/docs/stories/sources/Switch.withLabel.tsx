import {Switch, Label} from "@traxion-global/design-system/react";
import {useState} from "react";

export default function SwitchWithLabel() {
    const [ checked, setChecked ] = useState(false);

    return <div className={"flex items-center gap-2"}>
        <Switch
            id="switch"
            checked={checked}
            onCheckedChange={setChecked}
        />
        <Label htmlFor="switch">Acepto los términos y condiciones</Label>
    </div>;
}