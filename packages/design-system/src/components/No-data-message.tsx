import {Info} from "lucide-react";

type NoDataMessageProps = {
    title?: string;
    message?: string;
};

export function NoDataMessage({ title, message } : NoDataMessageProps) {
    return <div className="rounded-md p-8">
        <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
                <Info className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{message}</p>
        </div>
    </div>
}