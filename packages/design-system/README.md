# Design System de Traxion

## Contenidos del paquete

### Utilidades
**Ruta:** `@traxion-global/design-system`  
Entry point pensado para utilidades que pueden importarse (por ejemplo, `cn`).

### Componentes React
**Ruta:** `@traxion-global/design-system/react`  
Conjunto de hooks y componentes UI implementados en React, diseñados según los lineamientos visuales de Traxion.

### Tema global (CSS)
**Ruta:** `@traxion-global/design-system/theme.css`  
Archivo que define las variables CSS del sistema de diseño (colores, tipografías, espaciados, radios, etc.) y estilos base necesarios para mantener la consistencia visual en todos los proyectos.

### Tokens JSON
**Ruta:** `@traxion-global/design-system/tokens.json`  
Representación estructurada de los tokens del sistema en formato JSON.

### Tailwind Preset
**Ruta:** `@traxion-global/design-system/tailwind-preset`  
Preset de Tailwind que mapea las variables del tema a la configuración de Tailwind.

---

## Versionado

Este design system sigue Semantic Versioning y, mientras estemos en la serie `0.x.y`, aplicamos estas reglas:

### PATCH (`0.1.x`)
Cambios no incompatibles:
- Fixes de estilos
- Corrección de bugs
- Refactors internos sin modificar la API pública
- Mejoras de performance

### MINOR (`0.x.0`)
Cambios funcionales o potencialmente incompatibles:
- Nuevos componentes
- Nuevas variantes o props compatibles
- Cambios visuales o estructurales que no afectan la API
- Cualquier cambio incompatible mientras estemos en `0.x`

---

## Uso del design system

### 1. Requisitos previos

#### Acceso al paquete privado (.npmrc)

El Design System se distribuye mediante GitHub Packages y es un paquete privado, para instalarlo necesitas ser parte de la organización de Traxion en GitHub, generar un token de acceso en: https://github.com/settings/tokens y configurar un archivo `.npmrc` en el root de la aplicación de la siguiente manera:

    @traxion-global:registry=https://npm.pkg.github.com
    //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}

#### Instalación base del proyecto

- React `^18` o `^19` ya sea con NextJS, Vite, CRA o cualquier otro bundler
- Tailwind CSS `^3.4`
- `tailwindcss-animate`
- `lucide-react`

### 2. Instalación del paquete

    npm install @traxion-global/design-system

---

### 3. Importar el tema global

#### Next.js (App Router)

En `app/globals.css`:

    @import "@traxion-global/design-system/theme.css";

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

#### Vite, CRA, otros bundlers

En `src/index.css`:

    @import "@traxion-global/design-system/theme.css";

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

---

### 4. Configuración de Tailwind (preset del Design System)

    import traxionPreset from "@traxion-global/design-system/tailwind-preset";

    /** @type {import('tailwindcss').Config} */
    export default {
      presets: [traxionPreset],
      content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",

        "./node_modules/@traxion-global/design-system/dist/**/*.{js,ts,jsx,tsx}"
      ]
    };

---

### 5. Uso de componentes (escenario React)

    import { Button } from "@traxion-global/design-system/react";

    export function Example() {
      return (
        <div className="p-4">
          <Button>Botón primario</Button>
        </div>
      );
    }

---

## Uso de tokens en proyectos sin React

El uso del design system por ahora está enfocado en React, sin embargo si tu proyecto usa otro framework o librería puedes utilizar los tokens y el theme.css de la siguiente manera:

Tokens:

    import tokens from "@traxion-global/design-system/tokens.json";
    console.log(tokens.colors.primary);

Tema:

    @import "@traxion-global/design-system/theme.css";

---

## Documentación y Storybook

La documentación completa del DS se encuentra en una instancia de Storybook.  
Para obtener la URL actual, contacte al equipo correspondiente.