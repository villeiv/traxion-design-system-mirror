import {Button, Card, CardTitle,
    SheetContent, SheetHeader, Sheet, SheetTitle, SheetDescription, SheetTrigger
} from "@traxion-global/design-system";
import {CheckCircle, FileText, MessageCircle} from "lucide-react";

export default function SheetNotifications() {
    const notifications = [
        { id: 1, title: "Factura generada", desc: "Tu factura #1234 fue emitida.", time: "Hace 2h", icon: FileText },
        { id: 2, title: "Nuevo mensaje", desc: "Tienes un mensaje del soporte.", time: "Hace 5h", icon: MessageCircle },
        { id: 3, title: "Pago recibido", desc: "El cliente ABC completó el pago.", time: "Ayer", icon: CheckCircle },
    ]

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost">Ver notificaciones</Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>Notificaciones</SheetTitle>
                    <SheetDescription>Tus alertas más recientes.</SheetDescription>
                </SheetHeader>

                <div className="space-y-2 mt-4">
                    {notifications.map((n) => {
                        const Icon = n.icon
                        return (
                            <Card key={n.id} className="p-3 flex items-start gap-2">
                                <div className="flex h-9 w-9 items-center justify-center">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-sm font-medium">{n.title}</CardTitle>
                                        <span className="text-xs text-muted-foreground">{n.time}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}