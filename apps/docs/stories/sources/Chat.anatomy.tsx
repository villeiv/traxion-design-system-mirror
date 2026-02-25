export const ChatAnatomy = `
### Anatomía del componente
\`\`\`jsx
{/* Modo embebido (sin trigger) */}
<ChatPanel className="h-[480px] w-[420px]">
    <ChatHeader>
        {/* Título, avatar, acciones opcionales */}
    </ChatHeader>
    <ChatMessages>
        <ChatDateSeparator>Hoy</ChatDateSeparator>

        <ChatBubble variant="received">
            <ChatBubbleAvatar>
                <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
            </ChatBubbleAvatar>
            <ChatBubbleMessage variant="received">Texto del mensaje</ChatBubbleMessage>
            <ChatBubbleTimestamp>10:30</ChatBubbleTimestamp>
        </ChatBubble>

        <ChatBubble variant="sent">
            <ChatBubbleMessage variant="sent">Tu respuesta</ChatBubbleMessage>
            <ChatBubbleTimestamp>10:31</ChatBubbleTimestamp>
        </ChatBubble>

        <ChatBubble variant="system">
            <ChatBubbleMessage variant="system">Chat iniciado</ChatBubbleMessage>
        </ChatBubble>
    </ChatMessages>
    <ChatInput onSubmit={handleSubmit}>
        <Textarea placeholder="Escribe un mensaje..." />
        <Button type="submit" size="icon" className="h-auto w-auto aspect-square">
            <Send />
        </Button>
    </ChatInput>
</ChatPanel>

{/* Modo flotante (con trigger) */}
<Chat defaultOpen={false}>
    <ChatTrigger />
    <ChatPanel className="fixed bottom-24 right-6 h-[480px] w-[380px]">
        {/* mismo contenido */}
    </ChatPanel>
</Chat>
\`\`\`
`;
