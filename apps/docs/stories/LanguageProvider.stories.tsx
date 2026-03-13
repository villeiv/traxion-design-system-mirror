import type { Meta } from "@storybook/react";
import { LanguageProvider } from "@traxion-global/design-system/react";

import LanguageProviderDemo from "./sources/LanguageProvider.demo";

const meta = {
    component: LanguageProvider,
    title: "System/LanguageProvider",
    tags: ["autodocs"],
    parameters: {
        controls: { disable: false },
        actions: { disable: true },
        a11y: { disable: true },
        docs: {
            description: {
                component: `
El componente **LanguageProvider** es un proveedor de contexto que establece el idioma de la interfaz
para todos los componentes del design system que contiene.

Actualmente soporta dos idiomas: **español** (\`"es"\`) e **inglés** (\`"en"\`).
El idioma predeterminado es español, por lo que los componentes funcionan correctamente sin necesidad de un proveedor.

### Importación
\`\`\`tsx
import { LanguageProvider } from "@traxion-global/design-system/react";
\`\`\`

### Uso básico
\`\`\`tsx
// En la raíz de tu aplicación
<LanguageProvider language="es">
    <App />
</LanguageProvider>
\`\`\`

### Componentes afectados
Los siguientes componentes leen el idioma del proveedor y adaptan sus textos internos:
**DataTable**, **DatePicker**, **DateRangePicker**, **DateTimePicker**, **DateTimeRangePicker**,
**Pagination**, **Dialog**, **Sheet**, **Stepper**, **AiInsight**, **FileDropZone**, **SortableBoard**.

### Hook \`useDesignSystemLanguage\`
Si necesitas acceder al idioma activo desde un componente personalizado:
\`\`\`tsx
import { useDesignSystemLanguage } from "@traxion-global/design-system/react";

function MyComponent() {
    const language = useDesignSystemLanguage(); // "es" | "en"
    return <span>{language === "es" ? "Hola" : "Hello"}</span>;
}
\`\`\`
                `,
            },
        },
    },
    argTypes: {
        language: {
            description: "Idioma activo para todos los componentes hijos.",
            control: { type: "select" },
            options: ["es", "en"],
        },
        children: { table: { disable: true } },
    },
    args: {
        language: "es",
    },
} satisfies Meta<typeof LanguageProvider>;

export default meta;

// ─── Área de pruebas ──────────────────────────────────────────────────────────

export const Demo = {
    name: "Área de pruebas",
    render: LanguageProviderDemo
};
