import {Toaster} from "@traxion-global/design-system/react";

export default function ToasterDecorator(Story: any) {
    return <>
        <Story/>
        <Toaster position="top-right" closeButton={true} />
    </>
}