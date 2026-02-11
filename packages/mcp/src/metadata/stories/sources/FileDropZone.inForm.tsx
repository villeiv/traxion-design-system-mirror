import React, {useState} from "react";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
    toast, Button, FileDropZone
} from "@traxion-global/design-system/react";
import {X} from "lucide-react";

export default function FileDropZoneInForm() {
    const [files, setFiles] = useState([]);

    const handleFiles = (newFiles) => {
        setFiles(newFiles);
    }

    const removeFileByName = (name) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== name));
    }

    const sendFiles = () => {
        toast.success("Archivos enviados");
        setFiles([]);
    }

    return <Card>
        <CardHeader>
            <CardTitle>Documentos</CardTitle>
            <CardDescription>Carga los documentos para continuar:</CardDescription>
        </CardHeader>
        <CardContent>
            {
                files.length > 0 ?
                    <div className="border border-dashed p-2 w-full rounded-lg">
                        <ul className="text-sm text-gray-700 space-y-2">
                            {files.map((file, index) => (
                                <li key={index} className={"flex justify-between items-center p-0 gap-4"}>
                                    <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                                    <Button variant={"destructive"} size={"icon"} onClick={_=>removeFileByName(file.name)}><X/></Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    :
                    <FileDropZone onFiles={handleFiles} multiple={true} />
            }
        </CardContent>
        {
            files.length > 0 &&
            <CardFooter>
                <Button onClick={sendFiles}>Enviar documentos</Button>
            </CardFooter>
        }
    </Card>
}