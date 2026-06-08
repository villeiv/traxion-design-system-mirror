import { useState } from "react";
import {
    Avatar,
    AvatarFallback,
    ChatBubble,
    ChatBubbleAvatar,
    ChatBubbleMessage,
    ChatBubbleTimestamp,
    ChatDateSeparator,
    ChatHeader,
    ChatInput,
    ChatMessages,
    ChatPanel,
    ChatSendButton,
    Textarea,
} from "@traxion-global/design-system/react";

export default function ChatBasic() {
    const [message, setMessage] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!message.trim()) return;
        setMessage("");
    }

    return (
        <ChatPanel className="h-[480px] w-[420px]">
            <ChatHeader>
                <Avatar>
                    <AvatarFallback>MG</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">María García</span>
                    <span className="text-xs text-muted-foreground">En línea</span>
                </div>
            </ChatHeader>

            <ChatMessages>
                <ChatDateSeparator>Ayer</ChatDateSeparator>

                <ChatBubble variant="received">
                    <ChatBubbleAvatar>
                        <Avatar>
                            <AvatarFallback>MG</AvatarFallback>
                        </Avatar>
                    </ChatBubbleAvatar>
                    <ChatBubbleMessage variant="received">
                        ¿Ya revisaste el manifiesto del embarque TRX-4821?
                    </ChatBubbleMessage>
                    <ChatBubbleTimestamp>16:42</ChatBubbleTimestamp>
                </ChatBubble>

                <ChatBubble variant="sent">
                    <ChatBubbleMessage variant="sent">
                        Sí, lo estoy revisando ahora mismo. Hay un problema con el peso declarado.
                    </ChatBubbleMessage>
                    <ChatBubbleTimestamp>16:45</ChatBubbleTimestamp>
                </ChatBubble>

                <ChatBubble variant="received">
                    <ChatBubbleAvatar>
                        <Avatar>
                            <AvatarFallback>MG</AvatarFallback>
                        </Avatar>
                    </ChatBubbleAvatar>
                    <ChatBubbleMessage variant="received">
                        ¿Cuánta diferencia hay? Necesito actualizarlo antes de las 18:00.
                    </ChatBubbleMessage>
                    <ChatBubbleTimestamp>16:46</ChatBubbleTimestamp>
                </ChatBubble>

                <ChatDateSeparator>Hoy</ChatDateSeparator>

                <ChatBubble variant="sent">
                    <ChatBubbleMessage variant="sent">
                        Aproximadamente 120 kg de diferencia. Ya lo ajusté en el sistema.
                    </ChatBubbleMessage>
                    <ChatBubbleTimestamp>09:03</ChatBubbleTimestamp>
                </ChatBubble>

                <ChatBubble variant="received">
                    <ChatBubbleAvatar>
                        <Avatar>
                            <AvatarFallback>MG</AvatarFallback>
                        </Avatar>
                    </ChatBubbleAvatar>
                    <ChatBubbleMessage variant="received">
                        Perfecto, gracias. Te confirmo cuando genere la nueva guía.
                    </ChatBubbleMessage>
                    <ChatBubbleTimestamp>09:07</ChatBubbleTimestamp>
                </ChatBubble>
            </ChatMessages>

            <ChatInput onSubmit={handleSubmit}>
                <Textarea
                    placeholder="Escribe un mensaje... (Ctrl+Enter para enviar)"
                    className="min-h-0 resize-none"
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <ChatSendButton />
            </ChatInput>
        </ChatPanel>
    );
}
