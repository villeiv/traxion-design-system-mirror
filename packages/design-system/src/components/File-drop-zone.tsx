import {useRef, useState} from "react"
import {FileUp} from "lucide-react"
import {useDesignSystemLanguage} from "./Language-provider"

const FILE_DROP_ZONE_TEXTS = {
    en: {
        ariaLabel: "Upload file: drag or click",
        instruction: "Drag or click to upload files",
    },
    es: {
        ariaLabel: "Subir archivo: arrastra o haz clic",
        instruction: "Arrastra o haz clic para subir archivos",
    },
} as const

const baseClasses = [
    "w-full rounded-lg border border-dashed",
    "transition-colors cursor-pointer",
    "px-4 py-6 sm:py-8",
    "flex items-center justify-center text-sm",
]

const normalClasses = [
    "bg-background border-muted-foreground/30 hover:border-muted-foreground/50 text-muted-foreground",
    "hover:bg-primary/10 hover:border-primary hover:text-primary"
]

const overClasses = [
    "bg-primary/10 border-primary text-primary",
]

export function FileDropZone({onFiles, accept, multiple = true}: {
    onFiles: (files: File[]) => void
    accept?: string
    multiple?: boolean
}) {
    const [isOver, setIsOver] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const language = useDesignSystemLanguage()
    const t = FILE_DROP_ZONE_TEXTS[language]

    function matchesAccept(file: File, accept?: string) {
        if (!accept) return true
        const tokens = accept.split(",").map(t => t.trim()).filter(Boolean)
        const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."))
        const type = file.type // p.ej. "image/png" (a veces puede venir "")

        return tokens.some(t => {
            if (t.startsWith(".")) {
                // Coincidir por extensión, útil cuando file.type viene vacío
                return ext && ext.toLowerCase() === t.toLowerCase()
            }
            if (t.endsWith("/*")) {
                // Coincidir por tipo mayor: "image/*"
                const major = t.slice(0, -2).toLowerCase()
                return type.toLowerCase().startsWith(major + "/")
            }
            // Coincidencia MIME exacta: "image/png", "application/pdf", etc.
            return type.toLowerCase() === t.toLowerCase()
        })
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsOver(false)

        let files = Array.from(e.dataTransfer.files || [])
        if (accept) {
            files = files.filter(f => matchesAccept(f, accept))
        }
        if (!multiple && files.length > 1) {
            files = files.slice(0, 1)
        }

        if (files.length) onFiles(files)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length) onFiles(files)
    }

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
            onDragEnter={(e) => {
                e.preventDefault()
                setIsOver(true)
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={() => setIsOver(false)}
            onDrop={handleDrop}
            className={[...baseClasses, ...(isOver ? overClasses : normalClasses)].join(" ")}
            aria-label={t.ariaLabel}
        >
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                multiple={multiple}
                accept={accept}
                onChange={handleChange}
            />
            <div className="flex items-center gap-2 pointer-events-none">
                <FileUp className="h-4 w-4"/>
                <span>{t.instruction}</span>
            </div>
        </div>
    )
}
