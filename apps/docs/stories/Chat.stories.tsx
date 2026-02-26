import type { Meta, StoryObj } from "@storybook/react";

import { Chat } from "@traxion-global/design-system/react";
import { ChatAnatomy } from "./sources/Chat.anatomy";

import ChatBasic from "./sources/Chat.basic";
import ChatBasicCode from "./sources/Chat.basic?raw";
import ChatIA from "./sources/Chat.ia";
import ChatIACode from "./sources/Chat.ia?raw";
import ChatVariants from "./sources/Chat.variants";
import ChatVariantsCode from "./sources/Chat.variants?raw";
import ChatFloating from "./sources/Chat.floating";
import ChatFloatingCode from "./sources/Chat.floating?raw";

const meta = {
    component: Chat,
    title: "Chat",
    tags: ["autodocs"],
    parameters: {
        controls: { disable: true },
        actions: { disable: true },
        a11y: { disable: true },
        docs: {
            description: {
                component: `
El componente **Chat** es un conjunto de subcomponentes que permite construir interfaces de conversación —
ya sea entre personas, con un agente de IA o como hilo de soporte.

Tiene dos modos de uso:
- **Embebido**: usa \`ChatPanel\` directamente, sin \`Chat\` como raíz.
- **Flotante**: usa \`Chat\` como proveedor de estado + \`ChatTrigger\` (FAB) + \`ChatPanel\` posicionado con \`fixed\`.

### Importación
\`\`\`tsx
import {
    Chat, ChatTrigger, ChatPanel,
    ChatHeader, ChatMessages, ChatDateSeparator,
    ChatBubble, ChatBubbleAvatar, ChatBubbleMessage,
    ChatBubbleTimestamp, ChatInput,
} from "@traxion-global/design-system/react";
\`\`\`
${ChatAnatomy}
### Variantes de \`ChatBubble\` y \`ChatBubbleMessage\`

| Variante | Descripción |
|----------|-------------|
| \`received\` | Mensaje entrante — alineado a la izquierda, fondo muted |
| \`sent\` | Mensaje saliente — alineado a la derecha, fondo primary |
| \`system\` | Aviso del sistema — centrado, itálico, fondo secondary |

### Envío con teclado

\`ChatInput\` renderiza un \`<form>\` e intercepta \`Ctrl+Enter\` (o \`Cmd+Enter\` en Mac) para llamar al \`onSubmit\` del formulario. El botón de envío debe ser \`type="submit"\`.

\`\`\`tsx
<ChatInput onSubmit={handleSubmit}>
    <Textarea ... />
    <Button type="submit" size="icon" className="h-auto w-auto aspect-square">
        <Send />
    </Button>
</ChatInput>
\`\`\`
                `,
            },
        },
    },
} satisfies Meta<typeof Chat>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Conversación básica ──────────────────────────────────────────────────────

export const ConversacionBasica: Story = {
    name: "Conversación básica",
    render: ChatBasic,
    parameters: {
        docs: {
            source: { code: ChatBasicCode },
            description: {
                story: "Conversación entre dos usuarios con encabezado, separadores de fecha, mensajes recibidos y enviados, y área de entrada. Presiona **Ctrl+Enter** para enviar.",
            },
        },
    },
};

// ─── Chat con IA ──────────────────────────────────────────────────────────────

export const ChatConIA: Story = {
    name: "Chat con asistente IA",
    render: ChatIA,
    parameters: {
        docs: {
            source: { code: ChatIACode },
            description: {
                story: "Patrón de chat con asistente de IA. El bot usa un ícono en lugar de avatar con foto. Los mensajes del sistema marcan el inicio de sesión.",
            },
        },
    },
};

// ─── Variantes de burbuja ─────────────────────────────────────────────────────

export const VariantesDeBurbuja: Story = {
    name: "Variantes de burbuja",
    render: ChatVariants,
    parameters: {
        docs: {
            source: { code: ChatVariantsCode },
            description: {
                story: "Las tres variantes de `ChatBubble` y `ChatBubbleMessage`: **received** (izquierda, fondo muted), **sent** (derecha, fondo primary) y **system** (centrado, fondo secondary).",
            },
        },
    },
};

// ─── Flotante con trigger ─────────────────────────────────────────────────────

export const FlotanteConTrigger: Story = {
    name: "Flotante con trigger",
    render: ChatFloating,
    parameters: {
        docs: {
            source: { code: ChatFloatingCode },
            description: {
                story: "Modo flotante: `Chat` actúa como proveedor de estado, `ChatTrigger` es el botón FAB fijo en la esquina, y `ChatPanel` se posiciona con `fixed`. El ícono del trigger alterna automáticamente entre `MessageCircle` y `X`.",
            },
        },
    },
};
