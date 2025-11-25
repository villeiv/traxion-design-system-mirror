import * as React from "react"
import {
    Toaster as SonnerToaster,
    toast as sonnerToast,
    type ToasterProps as SonnerToasterProps,
} from "sonner";
import {CheckCircle, Info, Loader2, OctagonX, TriangleAlert} from "lucide-react";

export type ToastPosition =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"

export interface ToasterProps {
    position?: ToastPosition
    closeButton?: boolean
}

/**
 * ToastService.Toaster
 * Monta la infraestructura de toasts en la app.
 */
export function Toaster({ position = "top-right", closeButton = true }: ToasterProps) {
    return (
        <SonnerToaster
            position={position as SonnerToasterProps["position"]}
            closeButton={closeButton}
            icons={{
                success: <CheckCircle className="size-4" />,
                error: <OctagonX className="size-4" />,
                warning: <TriangleAlert className="size-4" />,
                info: <Info className="size-4" />,
                loading: <Loader2 className="size-4 animate-spin" />,
            }}
        />
    )
}

// --- toast API ---

/**
 * ToastService.toast
 * Dispara toasts
 * message: texto principal
 * description (opcional): texto secundario
 */
type ToastFn = (message: string, description?: string) => void

export const toast: { success: ToastFn, error: ToastFn, info: ToastFn, warning: ToastFn } = {
    success: (message, description) =>
        sonnerToast.success(message, { description }),

    error: (message, description) =>
        sonnerToast.error(message, { description }),

    info: (message, description) =>
        sonnerToast.info(message, { description }),

    warning: (message, description) =>
        sonnerToast.warning(message, { description }),
}
