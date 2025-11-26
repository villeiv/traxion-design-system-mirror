import {Loader2} from "lucide-react";

export function FullPageOverlayLoader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
            <div className="flex items-center space-x-2">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        </div>
    )
}