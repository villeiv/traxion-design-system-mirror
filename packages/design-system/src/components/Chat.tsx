import * as React from "react"
import { MessageCircle, X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ─── Context ──────────────────────────────────────────────────────────────────

interface ChatContextValue {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const ChatContext = React.createContext<ChatContextValue>({
    open: true,
    onOpenChange: () => {},
})

function useChatContext() {
    return React.useContext(ChatContext)
}

// ─── Chat (Root) ──────────────────────────────────────────────────────────────

export interface ChatProps {
    children: React.ReactNode
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

function Chat({ children, open: controlledOpen, defaultOpen = false, onOpenChange }: ChatProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
    const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen

    const handleOpenChange = React.useCallback(
        (value: boolean) => {
            if (controlledOpen === undefined) setUncontrolledOpen(value)
            onOpenChange?.(value)
        },
        [controlledOpen, onOpenChange]
    )

    return (
        <ChatContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
            {children}
        </ChatContext.Provider>
    )
}
Chat.displayName = "Chat"

// ─── ChatTrigger ──────────────────────────────────────────────────────────────

const ChatTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
    const { open, onOpenChange } = useChatContext()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onOpenChange(!open)
        onClick?.(e)
    }

    return (
        <button
            ref={ref}
            type="button"
            className={cn(
                "fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            onClick={handleClick}
            {...props}
        >
            {children ?? (open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />)}
        </button>
    )
})
ChatTrigger.displayName = "ChatTrigger"

// ─── ChatPanel ────────────────────────────────────────────────────────────────

const ChatPanel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { open } = useChatContext()

    return (
        <div
            ref={ref}
            className={cn(
                "flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all duration-200",
                open
                    ? "pointer-events-auto scale-100 opacity-100"
                    : "pointer-events-none scale-95 opacity-0",
                className
            )}
            {...props}
        />
    )
})
ChatPanel.displayName = "ChatPanel"

// ─── ChatHeader ───────────────────────────────────────────────────────────────

const ChatHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center gap-3 border-b px-4 py-3", className)}
        {...props}
    />
))
ChatHeader.displayName = "ChatHeader"

// ─── ChatMessages ─────────────────────────────────────────────────────────────

const ChatMessages = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex flex-1 flex-col gap-4 overflow-y-auto p-4",
            className
        )}
        {...props}
    />
))
ChatMessages.displayName = "ChatMessages"

// ─── ChatDateSeparator ────────────────────────────────────────────────────────

const ChatDateSeparator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center gap-3", className)}
        {...props}
    >
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">{children}</span>
        <div className="h-px flex-1 bg-border" />
    </div>
))
ChatDateSeparator.displayName = "ChatDateSeparator"

// ─── ChatBubble ───────────────────────────────────────────────────────────────

const chatBubbleVariants = cva("flex w-full items-end gap-2", {
    variants: {
        variant: {
            received: "flex-row",
            sent: "flex-row-reverse",
            system: "justify-center",
        },
    },
    defaultVariants: {
        variant: "received",
    },
})

export interface ChatBubbleProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof chatBubbleVariants> {}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
    ({ className, variant, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(chatBubbleVariants({ variant }), className)}
            {...props}
        />
    )
)
ChatBubble.displayName = "ChatBubble"

// ─── ChatBubbleAvatar ─────────────────────────────────────────────────────────

const ChatBubbleAvatar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("shrink-0", className)}
        {...props}
    />
))
ChatBubbleAvatar.displayName = "ChatBubbleAvatar"

// ─── ChatBubbleMessage ────────────────────────────────────────────────────────

const chatBubbleMessageVariants = cva("max-w-[75%] px-4 py-2.5 text-sm", {
    variants: {
        variant: {
            received: "rounded-xl rounded-bl-sm bg-muted text-foreground",
            sent: "rounded-xl rounded-br-sm bg-primary text-primary-foreground",
            system:
                "max-w-none rounded-xl bg-secondary px-3 py-1 text-center text-xs italic text-secondary-foreground",
        },
    },
    defaultVariants: {
        variant: "received",
    },
})

export interface ChatBubbleMessageProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof chatBubbleMessageVariants> {}

const ChatBubbleMessage = React.forwardRef<
    HTMLDivElement,
    ChatBubbleMessageProps
>(({ className, variant, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(chatBubbleMessageVariants({ variant }), className)}
        {...props}
    />
))
ChatBubbleMessage.displayName = "ChatBubbleMessage"

// ─── ChatBubbleTimestamp ──────────────────────────────────────────────────────

const ChatBubbleTimestamp = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
    <span
        ref={ref}
        className={cn("shrink-0 text-xs text-muted-foreground", className)}
        {...props}
    />
))
ChatBubbleTimestamp.displayName = "ChatBubbleTimestamp"

// ─── ChatInput ────────────────────────────────────────────────────────────────

const ChatInput = React.forwardRef<
    HTMLFormElement,
    React.FormHTMLAttributes<HTMLFormElement>
>(({ className, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            e.currentTarget.requestSubmit()
        }
        onKeyDown?.(e)
    }
    return (
        <form
            ref={ref}
            className={cn(
                "grid grid-cols-[1fr_auto] items-stretch gap-2 border-t p-4",
                className
            )}
            onKeyDown={handleKeyDown}
            {...props}
        />
    )
})
ChatInput.displayName = "ChatInput"

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
    Chat,
    ChatTrigger,
    ChatPanel,
    ChatHeader,
    ChatMessages,
    ChatDateSeparator,
    ChatBubble,
    chatBubbleVariants,
    ChatBubbleAvatar,
    ChatBubbleMessage,
    chatBubbleMessageVariants,
    ChatBubbleTimestamp,
    ChatInput,
}
