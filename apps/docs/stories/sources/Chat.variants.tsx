import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    ChatBubble,
    ChatBubbleAvatar,
    ChatBubbleMessage,
    ChatBubbleTimestamp,
    ChatMessages,
    ChatPanel,
} from "@traxion-global/design-system/react";

export default function ChatVariants() {
    return (
        <ChatPanel className="w-[420px]">
            <ChatMessages>
                <ChatBubble variant="received">
                    <ChatBubbleAvatar>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </ChatBubbleAvatar>
                    <ChatBubbleMessage variant="received">
                        Mensaje recibido — fondo muted, alineado a la izquierda.
                    </ChatBubbleMessage>
                    <ChatBubbleTimestamp>08:00</ChatBubbleTimestamp>
                </ChatBubble>

                <ChatBubble variant="sent">
                    <ChatBubbleMessage variant="sent">
                        Mensaje enviado — fondo primary, alineado a la derecha.
                    </ChatBubbleMessage>
                    <ChatBubbleTimestamp>08:01</ChatBubbleTimestamp>
                </ChatBubble>

                <ChatBubble variant="system">
                    <ChatBubbleMessage variant="system">
                        Mensaje del sistema — centrado, itálico, fondo secondary.
                    </ChatBubbleMessage>
                </ChatBubble>
            </ChatMessages>
        </ChatPanel>
    );
}
