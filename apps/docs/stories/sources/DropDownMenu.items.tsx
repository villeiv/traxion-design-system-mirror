import { toast, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@traxion-global/design-system/react";

export default function DropDownMenuItems() {
    function handleSelect(value) {
        toast.success(`Has seleccionado el item ${value}`);
    }

    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline">Menú</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem onSelect={_=>handleSelect(1)}>Item uno</DropdownMenuItem>
            <DropdownMenuItem disabled onSelect={_=>handleSelect(2)}>Item dos</DropdownMenuItem>
            <DropdownMenuItem onSelect={_=>handleSelect(3)}>Item tres</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}