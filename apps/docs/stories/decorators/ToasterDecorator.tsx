import {Toaster} from "@traxion-global/design-system";

export default function ToasterDecorator(Story: any) {
    return <>
        <Story/>
        <Toaster position="top-right" closeButton={true} />
    </>
}