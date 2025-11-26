import {useState} from "react";
import {Button, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
    Popover, PopoverTrigger, PopoverContent
} from "@traxion-global/design-system";
import {ChevronsUpDown} from "lucide-react";

const states = [
    { value: "aguascalientes", label: "Aguascalientes" },
    { value: "baja-california", label: "Baja California" },
    { value: "baja-california-sur", label: "Baja California Sur" },
    { value: "campeche", label: "Campeche" },
    { value: "chiapas", label: "Chiapas" },
    { value: "chihuahua", label: "Chihuahua" },
    { value: "cdmx", label: "Ciudad de México" },
    { value: "coahuila", label: "Coahuila" },
    { value: "colima", label: "Colima" },
    { value: "durango", label: "Durango" },
    { value: "guanajuato", label: "Guanajuato" },
    { value: "guerrero", label: "Guerrero" },
    { value: "hidalgo", label: "Hidalgo" },
    { value: "jalisco", label: "Jalisco" },
    { value: "mexico", label: "Estado de México" },
    { value: "michoacan", label: "Michoacán" },
    { value: "morelos", label: "Morelos" },
    { value: "nayarit", label: "Nayarit" },
    { value: "nuevo-leon", label: "Nuevo León" },
    { value: "oaxaca", label: "Oaxaca" },
    { value: "puebla", label: "Puebla" },
    { value: "queretaro", label: "Querétaro" },
    { value: "quintana-roo", label: "Quintana Roo" },
    { value: "san-luis-potosi", label: "San Luis Potosí" },
    { value: "sinaloa", label: "Sinaloa" },
    { value: "sonora", label: "Sonora" },
    { value: "tabasco", label: "Tabasco" },
    { value: "tamaulipas", label: "Tamaulipas" },
    { value: "tlaxcala", label: "Tlaxcala" },
    { value: "veracruz", label: "Veracruz" },
    { value: "yucatan", label: "Yucatán" },
    { value: "zacatecas", label: "Zacatecas" },
]

export default function CommandComboBox() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[240px] justify-between"
                >
                    {value
                        ? states.find((estado) => estado.value === value)?.label
                        : "Selecciona un estado..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-0">
                <Command className={"max-h-[200px]"}>
                    <CommandInput placeholder="Buscar estado..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No se encontró el estado.</CommandEmpty>
                        <CommandGroup>
                            {states.map((estado) => (
                                <CommandItem
                                    key={estado.value}
                                    value={estado.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {estado.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}