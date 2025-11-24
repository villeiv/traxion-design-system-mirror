# Uso del Design System de Traxion

Este documento describe los pasos mínimos para consumir el Design System en un proyecto nuevo.

---

## Contenidos del paquete

El paquete `@traxion-global/design-system` expone los siguientes artefactos principales:

### Componentes React
**Ruta:** `@traxion-global/design-system`  
Conjunto de componentes UI implementados en React, diseñados según los lineamientos visuales y de interacción de Traxion. Incluye elementos básicos y patrones reutilizables listos para integrarse en proyectos React o Next.js.

### Tema global (CSS)
**Ruta:** `@traxion-global/design-system/theme.css`  
Archivo que define las variables CSS del sistema de diseño (colores, tipografías, espaciados, radios, etc.) y estilos base necesarios para mantener la consistencia visual en todos los proyectos.

### Tokens JSON
**Ruta:** `@traxion-global/design-system/tokens.json`  
Representación estructurada de los tokens del sistema en formato JSON. Útil para integraciones programáticas, automatización o consumo en stacks que no utilicen React.

### Tailwind Preset
**Ruta:** `@traxion-global/design-system/tailwind-preset`  
Preset de Tailwind que mapea las variables del tema a la configuración de Tailwind, permitiendo que las utilidades (`bg-primary`, `text-foreground`, `border`, etc.) se basen en los tokens oficiales del sistema de diseño.

## 0. Acceso al paquete privado (.npmrc)

El Design System se distribuye mediante GitHub Packages. Antes de instalarlo, configure su `.npmrc` en la raíz del proyecto:

    @traxion-global:registry=https://npm.pkg.github.com
    //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}

Donde:

- `NODE_AUTH_TOKEN` es una **variable de entorno** que debe contener un token classic de GitHub con permisos para leer paquetes.
- No debe hardcodear el token en el `.npmrc` ni en el código fuente por motivos de seguridad.
- Para generar el token, consulte la documentación oficial de GitHub:  
  https://github.com/settings/tokens

---

## 1. Requisitos previos

### Escenario A: Proyecto con React (Next.js o React standalone)

El proyecto debe cumplir:

- Tener React `^18` o `^19`.
- Tener Tailwind CSS `^3.4` correctamente configurado según la documentación oficial.
- Tener instalado `tailwindcss-animate`.
- Tener un archivo de estilos global (por ejemplo `app/globals.css` en Next.js o `src/index.css` en React).
- Tener instalada la librería de iconos `lucide-react`. Algunos componentes del Design System dependen de estos iconos y se recomienda su uso generalizado.

Nota sobre PostCSS y Autoprefixer:
- El Design System en sí no depende directamente de PostCSS ni Autoprefixer.
- Si el proyecto ya sigue la configuración estándar de Tailwind (por ejemplo, proyectos creados con plantillas oficiales de Tailwind o Next.js), estos elementos suelen venir configurados automáticamente.
- El punto clave es que el proyecto sea capaz de procesar las directivas de Tailwind (`@tailwind base; @tailwind components; @tailwind utilities;`), independientemente de si lo hace vía PostCSS o mediante otra configuración equivalente.

### Escenario B: Proyecto sin React (solo tokens)

Si el proyecto no usa React y solo necesita tokens de diseño:

- No es obligatorio Tailwind.
- No es obligatorio React.
- El proyecto debe poder importar JSON y/o CSS desde `node_modules`.

En este caso se trabajará principalmente con:

- `@traxion-global/design-system/tokens.json`
- `@traxion-global/design-system/theme.css`

---

## 2. Instalación del paquete

En el proyecto donde se utilizará el Design System:

    npm install @traxion-global/design-system

(Adaptar a yarn/pnpm en caso de usar otro gestor de paquetes.)

---

## 3. Importar el tema global

### 3.1. Next.js (App Router)

En `app/globals.css`:

    @import "@traxion-global/design-system/theme.css";

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

Asegúrese de que `globals.css` se importe en `app/layout.tsx`.

### 3.2. React standalone (Vite, CRA u otro bundler)

En el archivo global de estilos (por ejemplo `src/index.css`):

    @import "@traxion-global/design-system/theme.css";

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

Asegúrese de que dicho archivo se importe en el entry point de la aplicación (por ejemplo `src/main.tsx` o `src/index.tsx`).

En ambos casos, `theme.css` expone las variables CSS (tokens) y estilos base del Design System.

---

## 4. Configuración de Tailwind (preset del Design System)

En el archivo `tailwind.config.(js|ts|mjs|cjs)` del proyecto:

    import traxionPreset from "@traxion-global/design-system/tailwind-preset";

    /** @type {import('tailwindcss').Config} */
    export default {
      presets: [traxionPreset],
      content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",

        // IMPORTANTE:
        // Esta ruta debe apuntar a donde se instalaron los componentes del Design System.
        // En la mayoría de los casos será dentro de node_modules:
        "./node_modules/@traxion-global/design-system/dist/**/*.{js,ts,jsx,tsx}"
      ]
    };

Notas:

- Si la instalación del paquete se realiza en otra ubicación (por ejemplo, entornos con resolución no estándar de node_modules), se debe ajustar la ruta en `content` para que Tailwind pueda escanear los archivos del Design System.
- Incluir el `dist` del Design System en `content` es necesario para que Tailwind genere las clases utilizadas dentro de los componentes del propio Design System.

---

## 5. Uso de componentes (escenario React)

Ejemplo básico de uso en un componente React:

    import { Button } from "@traxion-global/design-system";

    export function Example() {
      return (
        <div className="p-4">
          <Button>Botón primario</Button>
        </div>
      );
    }

Con los pasos anteriores:

- Los componentes del Design System se renderizan con los colores, tipografías y radius definidos por Traxion.
- El proyecto puede seguir usando Tailwind normalmente para estilos adicionales propios.

---

## 6. Uso de tokens sin React (escenario solo tokens)

Si el proyecto solo necesita los tokens (por ejemplo para integraciones con otros stacks):

Consumo de tokens en JSON:

    import tokens from "@traxion-global/design-system/tokens.json";

    console.log(tokens.colors.primary);

Importar únicamente el tema CSS:

    @import "@traxion-global/design-system/theme.css";

Esto expone:

- Variables CSS para colores, tipografía, radios, etc.
- Estilos base mínimos del Design System.

No es necesario Tailwind para este escenario si no se desean usar utilidades ni componentes React.

---

## 7. Documentación y Storybook

La documentación completa del Design System (componentes, patrones y ejemplos) está disponible en una instancia de Storybook.

La URL de acceso puede variar según el entorno y aún no está incluida en esta guía.  
Para obtener la URL actual de Storybook, contacte al equipo responsable del Design System o al administrador del proyecto.

---
