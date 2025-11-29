# Storybook – Documentation Workspace

Este workspace contiene la instancia de Storybook utilizada para documentar y visualizar los componentes del Design System del monorepo. Su propósito es ofrecer un entorno aislado para desarrollar, revisar y documentar UI sin depender de aplicaciones de producción.

---

## Scripts

```bash
npm run storybook      # Inicia Storybook en modo desarrollo
npm run build-storybook # Genera la versión estática en /storybook-static
npm run lint            # Ejecuta ESLint
```

---

## Estructura

```
apps/docs/
 ├─ .storybook/        # Configuración de Storybook
 ├─ src/stories/       # Historias y documentación en MDX
 ├─ tsconfig.json      # Configuración TypeScript integrada con el monorepo
 ├─ eslint.config.mjs  # Extiende la configuración ESLint del monorepo
 └─ package.json
```

---

## Integración con el Design System

Este workspace consume el paquete del Design System vía workspaces:

```json
"dependencies": {
  "@traxion-global/design-system": "*"
}
```

Los componentes pueden importarse desde las historias, por ejemplo:

```tsx
import { Button } from "@traxion-global/design-system/react";
```

---

## TypeScript

El archivo `tsconfig.json` extiende la configuración compartida:

```json
"extends": "@repo/typescript-config/react-library.json"
```

Incluye los ajustes necesarios para Vite y Storybook, así como compatibilidad con entornos de navegador y Node.

---

## ESLint

La configuración (`eslint.config.mjs`) extiende la configuración interna del monorepo y añade reglas específicas de Storybook para archivos `.stories.*` y `.storybook/**`.

---

## Notas

- Este workspace no es una aplicación de producción.
- No utiliza Vite como aplicación; únicamente como builder interno de Storybook.