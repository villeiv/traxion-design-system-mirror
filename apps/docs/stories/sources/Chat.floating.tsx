import { useState } from "react";
import { Bot } from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    Chat,
    ChatBubble,
    ChatBubbleAvatar,
    ChatBubbleMessage,
    ChatBubbleTimestamp,
    ChatHeader,
    ChatInput,
    ChatMessages,
    ChatPanel,
    ChatSendButton,
    ChatTrigger,
    Textarea,
} from "@traxion-global/design-system/react";

export default function ChatFloating() {
    const [message, setMessage] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!message.trim()) return;
        setMessage("");
    }

    return (
        <Chat defaultOpen={false}>
            <ChatTrigger />

            <ChatPanel className="fixed bottom-24 right-6 h-[480px] w-[380px]">
                <ChatHeader>
                    <ChatBubbleAvatar>
                        <Avatar>
                            <AvatarFallback>
                                <Bot className="h-4 w-4 text-foreground" />
                            </AvatarFallback>
                        </Avatar>
                    </ChatBubbleAvatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Asistente Traxion</span>
                        <span className="text-xs text-muted-foreground">Siempre disponible</span>
                    </div>
                </ChatHeader>

                <ChatMessages>
                    <ChatBubble variant="system">
                        <ChatBubbleMessage variant="system">
                            Sesión iniciada
                        </ChatBubbleMessage>
                    </ChatBubble>

                    <ChatBubble variant="received">
                        <ChatBubbleAvatar>
                        <Avatar>
                            <AvatarFallback>
                                <Bot className="h-4 w-4 text-foreground" />
                            </AvatarFallback>
                        </Avatar>
                    </ChatBubbleAvatar>
                        <ChatBubbleMessage variant="received">
                            Hola, soy el asistente de Traxion. ¿En qué puedo ayudarte?
                        </ChatBubbleMessage>
                        <ChatBubbleTimestamp>Ahora</ChatBubbleTimestamp>
                    </ChatBubble>
                </ChatMessages>

                <ChatInput onSubmit={handleSubmit}>
                    <Textarea
                        placeholder="Escribe un mensaje... (Ctrl+Enter para enviar)"
                        className="min-h-0 resize-none"
                        rows={1}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <ChatSendButton />
                </ChatInput>
            </ChatPanel>
        </Chat>
    );
}
