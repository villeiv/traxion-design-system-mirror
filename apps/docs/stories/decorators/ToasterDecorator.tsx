import {Toaster} from "sonner";

export default function ToasterDecorator(Story: any) {
    return <>
        <Story/>
        <Toaster position="top-right" richColors closeButton={true} />
    </>
}