import { Loader2 } from "lucide-react";

export function InlineLoader() {
    return (
        <div className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="h-9 w-9 animate-spin text-primary" />
        </div>
    );
}