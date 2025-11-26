import {useEffect, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue, toast} from "@traxion-global/design-system";

export default function SelectControlled() {
    const [selectedValue, setSelectedValue] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(()=>{
        toast.success("El valor seleccionado es: " + selectedValue);
    },[selectedValue])

    return <Select open={open} onOpenChange={setOpen} value={selectedValue} onValueChange={setSelectedValue}>
        <SelectTrigger>
            <SelectValue placeholder={"Tipo de carga"} />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value={"1"}>Muestras biológicas</SelectItem>
            <SelectItem value={"2"}>Medicamentos</SelectItem>
            <SelectItem value={"3"}>Productos refrigerados</SelectItem>
        </SelectContent>
    </Select>
}