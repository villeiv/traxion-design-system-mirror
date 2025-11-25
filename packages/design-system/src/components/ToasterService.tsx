import * as React from "react"
import {
    Toaster as SonnerToaster,
    toast as sonnerToast,
    type ToasterProps as SonnerToasterProps,
} from "sonner";

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
        sonnerToast(message, { description }),

    warning: (message, description) =>
        sonnerToast(message, { description }),
}
