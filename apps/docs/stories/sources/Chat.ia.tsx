import { useState } from "react";
import { Send, Bot } from "lucide-react";
import {
    Button,
    ChatBubble,
    ChatBubbleAvatar,
    ChatBubbleMessage,
    ChatBubbleTimestamp,
    ChatHeader,
    ChatInput,
    ChatMessages,
    ChatPanel,
    Textarea,
} from "@traxion-global/design-system/react";

export default function ChatIA() {
    const [message, setMessage] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!message.trim()) return;
        setMessage("");
    }

    return (
        <ChatPanel className="h-[480px] w-[420px]">
            <ChatHeader>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">Asistente Traxion</span>
                    <span className="text-xs text-muted-foreground">Siempre disponible</span>
                </div>
            </ChatHeader>

            <ChatMessages>
                <ChatBubble variant="system">
                    <ChatBubbleMessage variant="system">
                        Sesión iniciada · 10:00
                    </ChatBubbleMessage>
                </ChatBubble>

                <ChatBubble variant="received">
                    <ChatBubbleAvatar>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                            <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                    </ChatBubbleAvatar>
                    <ChatBubbleMessage variant="received">
                        Hola, soy el asistente de Traxion. ¿En qué puedo ayudarte hoy?
                    </ChatBubbleMessage>
                    <ChatBubbleTimestamp>10:00</ChatBubbleTimestamp>
                </ChatBubble>

                <ChatBubble variant="sent">
                    <ChatBubbleMessage variant="sent">
                        Necesito saber el estado de la unidad ECO-1142 en la ruta MTY-CDMX.
                    </ChatBubbleMessage>
                    <ChatBubbleTimestamp>10:01</ChatBubbleTimestamp>
                </ChatBubble>

                <ChatBubble variant="received">
                    <ChatBubbleAvatar>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                            <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                    </ChatBubbleAvatar>
                    <ChatBubbleMessage variant="received">
                        La unidad ECO-1142 se encuentra en tránsito. Última ubicación registrada:
                        Querétaro, QRO a las 09:48. ETA estimado a CDMX: 14:30 hrs.
                    </ChatBubbleMessage>
                    <ChatBubbleTimestamp>10:01</ChatBubbleTimestamp>
                </ChatBubble>

                <ChatBubble variant="sent">
                    <ChatBubbleMessage variant="sent">
                        ¿Tiene alguna alerta activa?
                    </ChatBubbleMessage>
                    <ChatBubbleTimestamp>10:02</ChatBubbleTimestamp>
                </ChatBubble>

                <ChatBubble variant="received">
                    <ChatBubbleAvatar>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                            <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                    </ChatBubbleAvatar>
                    <ChatBubbleMessage variant="received">
                        No hay alertas activas. La unidad opera dentro de parámetros normales.
                    </ChatBubbleMessage>
                    <ChatBubbleTimestamp>10:02</ChatBubbleTimestamp>
                </ChatBubble>
            </ChatMessages>

            <ChatInput onSubmit={handleSubmit}>
                <Textarea
                    placeholder="Pregunta algo al asistente... (Ctrl+Enter para enviar)"
                    className="min-h-0 resize-none"
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button type="submit" className="h-auto aspect-square p-0">
                    <Send />
                </Button>
            </ChatInput>
        </ChatPanel>
    );
}
