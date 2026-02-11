import {useState} from "react";
import {Label, Checkbox} from "@traxion-global/design-system/react";

export default function CheckboxWithLabel() {
    const [ checked, setChecked ] = useState(false);

    return <div className={"flex items-center gap-2"}>
        <Checkbox
            id="checkbox"
            checked={checked}
            onCheckedChange={setChecked}
        />
        <Label htmlFor="checkbox">Suscribirme al boletín</Label>
    </div>;
}