import {useState} from "react";
import {FileDropZone} from "@traxion-global/design-system/react";

export default function FileDropZoneWithPreview() {
    const [files, setFiles] = useState([]);

    return (
        <div className="space-y-4 w-[360px]">
            <FileDropZone accept="image/*" multiple onFiles={setFiles} />
            {files.length > 0 && (
                <ul className="text-sm text-muted-foreground list-disc pl-5">
                    {files.map((f) => (
                        <li key={f.name}>
                            {f.name} — {(f.size / 1024).toFixed(0)} KB
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}