import {Button, HoverCard, HoverCardContent, HoverCardTrigger} from "@traxion-global/design-system";
import {ChevronDown} from "lucide-react";
import FacebookHoverCard from "./HoverCard.facebookCard";
import {useState} from "react";

export default function HoverCardControlled() {

    const [open, setOpen] = useState(false);

    return (
        <HoverCard open={open} onOpenChange={setOpen}>
            <HoverCardTrigger asChild>
                <Button variant={"outline"}>Síguenos en Facebook<ChevronDown />
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-96">
                <FacebookHoverCard />
            </HoverCardContent>
        </HoverCard>
    )
}