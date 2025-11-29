import {Label, RadioGroup, RadioGroupItem} from "@traxion-global/design-system/react";
import {useState} from "react";

export default function RadioGroupControlled() {

    const [selectedValue, setSelectedValue] = useState("2");

    const styles = {
        label: "flex items-center gap-2"
    };

    return <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
        <Label className={styles.label}>
            <RadioGroupItem value="1" />Opción 1
        </Label>
        <Label className={styles.label}>
            <RadioGroupItem value="2" />Opción 2
        </Label>
        <Label className={styles.label}>
            <RadioGroupItem value="3" />Opción 3
        </Label>
    </RadioGroup>
}