import {FileDropZone} from "@traxion-global/design-system";
import FileDropZoneWithPreviewCode from "./sources/FileDropZone.withPreview.tsx?raw"
import FileDropZoneWithPreview from "./sources/FileDropZone.withPreview.tsx";
import FileDropZoneInFormCode from "./sources/FileDropZone.inForm.tsx?raw"
import FileDropZoneInForm from "./sources/FileDropZone.inForm.tsx";
import ToasterDecorator from "./decorators/ToasterDecorator";

const meta = {
    component: FileDropZone,
    title: "FileDropZone",
    tags: ["autodocs"],
    parameters: {
        a11y: { disable: true },
        actions: { disable: true },
        controls: { disable: true },
        docs: {
            description: {
                component: "El componente **FileDropZone** permite a los usuarios subir archivos mediante arrastrar y soltar o haciendo clic para seleccionar archivos.",
            },
        },
    },
    args: {
        accept: "",
        multiple: false,
    },
    argTypes: {
        onFiles: {
            description:
                "Función que se llama cuando se seleccionan o arrastran archivos. Recibe una lista de archivos como argumento.",
        },
        accept: {
            description: `Define qué tipos de archivos puede subir el usuario. 
Sigue el mismo formato que el atributo HTML 'accept' de un input HTML y se aplica tanto al diálogo de selección como al drag & drop (este último mediante validación interna).

Formatos soportados:
- Categoría MIME: "image/*", "video/*", "audio/*"
- Tipo MIME específico: "image/png", "application/pdf"
- Extensión: ".png", ".jpg", ".pdf"

Puedes combinar varios valores separándolos por comas. Ejemplos:
- "image/*" → Acepta todas las imágenes
- "image/png,image/jpeg" → Solo PNG y JPG
- ".json,.yaml" → Solo archivos JSON o YAML`,
            control: { type: "text" },
        },
        multiple: {
            description:
                "Permite la selección de múltiples archivos si se establece en true.",
            control: { type: "boolean" },
        },
    }
};

export default meta;

export const Playground = {
    name: "Área de pruebas",
    tags: ['!autodocs'],
    parameters: {
        a11y: { disable: true },
        actions: { disable: true },
        controls: { disable: false }
    },
    argTypes: {
        onFiles: { table: { disable: true }},
        accept: {
            control: { type: "select" },
            options: ["Todos los archivos", "Ej.: Cualquier imagen (image/*)", "Ej.: Imagen png o jpg (image/png,image/jpeg)", "Ej.: Extensiones específicas (.json,.yaml)", "Ej.: Solo PDF (application/pdf)", "Ej.: Combinación personalizada (.json,.jpg,application/pdf)"],
            mapping: {
                "Todos los archivos": "",
                "Ej.: Cualquier imagen (image/*)": "image/*",
                "Ej.: Imagen png o jpg (image/png,image/jpeg)": "image/png,image/jpeg",
                "Ej.: Extensiones específicas (.json,.yaml)": ".json,.yaml",
                "Ej.: Solo PDF (application/pdf)": "application/pdf",
                "Ej.: Combinación personalizada (.json,.jpg,application/pdf)": ".json,.jpg,application/pdf",
            }
        }
    }
}

export const Default = {
    name: "Predeterminado",
    parameters: {
        docs: {
            description: {
                story: "El estado por defecto permite subir un solo archivo de cualquier tipo.",
            }
        }
    }
}

export const ImagesOnlyMultiple = {
    name: "Solo imágenes múltiple",
    args: {
        accept: "image/*",
        multiple: true,
    },
    parameters: {
        docs: {
            description: {
                story:
                    "Acepta solo imágenes y permite múltiples archivos.",
            },
        },
    },
};

export const PdfSingle = {
    name: "PDF único",
    args: {
        accept: "application/pdf",
        multiple: false,
    },
    parameters: {
        docs: {
            description: {
                story:
                    "Restringido a un solo PDF.",
            },
        },
    },
};

export const WithPreview = {
    name: "Con previsualización",
    render: FileDropZoneWithPreview,
    argTypes: {
        onFiles: { control: false },
        accept: { control: false },
        multiple: { control: false },
    },
    args:{
        accept: "",
        multiple: true,
    },
    parameters: {
        controls: { disable: true },
        a11y: { disable: true },
        actions: { disable: true },
        docs: {
            description: {
                story:
                    "Muestra un listado simple de archivos seleccionados para previsualización básica.",
            },
            source: {
                code: FileDropZoneWithPreviewCode,
            }
        },
    },
};

export const InAFormCard = {
    render: FileDropZoneInForm,
    decorators: [ToasterDecorator],
    parameters: {
        docs: {
            description: {
                story:
                    "Muestra el componente embebido dentro de un bloque de formulario para ver espaciados y jerarquía visual.",
            },
            source: {
                code: FileDropZoneInFormCode,
            }
        },
    },
}