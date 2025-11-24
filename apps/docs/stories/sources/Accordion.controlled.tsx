import { useState } from "react"
import { Button, Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@traxion-global/design-system"

export default function AccordionControlledWithSidebar() {
    const [value, setValue] = useState(["item-1"])

    const openItem = (item) => {
        if (!value.includes(item)) setValue([...value, item])
    }

    const closeItem = (item) => {
        setValue(value.filter((v) => v !== item))
    }

    const toggleItem = (item) => {
        if (value.includes(item)) {
            closeItem(item)
        } else {
            openItem(item)
        }
    }

    const openAll = () => setValue(["item-1", "item-2", "item-3"])
    const closeAll = () => setValue([])

    return (
        <div className="w-[48rem]">
            <div className="flex gap-4">
                {/* Sidebar / Nav */}
                <aside className="w-48 shrink-0">
                    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Controles
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button
                            size="sm"
                            variant={value.includes("item-1") ? "secondary" : "outline"}
                            className="w-full justify-start"
                            onClick={() => toggleItem("item-1")}
                        >
                            {value.includes("item-1") ? "Cerrar" : "Abrir"} ítem 1
                        </Button>
                        <Button
                            size="sm"
                            variant={value.includes("item-2") ? "secondary" : "outline"}
                            className="w-full justify-start"
                            onClick={() => toggleItem("item-2")}
                        >
                            {value.includes("item-2") ? "Cerrar" : "Abrir"} ítem 2
                        </Button>
                        <Button
                            size="sm"
                            variant={value.includes("item-3") ? "secondary" : "outline"}
                            className="w-full justify-start"
                            onClick={() => toggleItem("item-3")}
                        >
                            {value.includes("item-3") ? "Cerrar" : "Abrir"} ítem 3
                        </Button>

                        <div className="h-px bg-border my-1" />

                        <Button size="sm" variant="default" className="w-full justify-start" onClick={openAll}>
                            Abrir todos
                        </Button>
                        <Button size="sm" variant="ghost" className="w-full justify-start" onClick={closeAll}>
                            Cerrar todos
                        </Button>
                    </div>
                </aside>

                {/* Contenido principal */}
                <main className="flex-1 space-y-4">
                    <Accordion type="multiple" value={value} onValueChange={setValue} className="w-[30rem]">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Estado controlado</AccordionTrigger>
                            <AccordionContent>
                                El estado abierto/cerrado se controla externamente mediante
                                <code> value </code> y <code> onValueChange</code>. Útil para sincronizar con URL,
                                formularios o para resetear desde acciones externas.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2">
                            <AccordionTrigger>Sincronización</AccordionTrigger>
                            <AccordionContent>
                                Cambia <code>type</code> a <code>multiple</code> en los controles para ver cómo
                                <code> value </code> pasa de string a array.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                            <AccordionTrigger>Buenas prácticas</AccordionTrigger>
                            <AccordionContent>
                                Evita combinar <code>defaultValue</code> con <code>value</code>. En controlada, solo usa <code>value</code>.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </main>
            </div>
        </div>
    )
}
