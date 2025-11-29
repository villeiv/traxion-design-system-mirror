# Showcase – Visualización de Componentes

Este workspace contiene una aplicación mínima cuyo único propósito es **mostrar visualmente los componentes disponibles en el Design System**.  
Sirve como referencia rápida para revisar el aspecto actual de la UI y comprobar su estado en cada versión del paquete.

---

## Scripts

    npm run dev     # Inicia el showcase en modo desarrollo
    npm run build   # Genera el build de producción
    npm run start   # Ejecuta la versión compilada
    npm run lint    # Ejecuta ESLint

---

## Uso del Design System

El showcase consume el Design System vía workspaces:

    "dependencies": {
      "@traxion-global/design-system": "*"
    }

Los componentes se importan desde:

    import { Button } from "@traxion-global/design-system/react";

El tema global se importa en `app/globals.css`:

    @import "@traxion-global/design-system/theme.css";

---

## Propósito del Showcase

- Permitir ver rápidamente todos los componentes del Design System.
- Actuar como una “galería visual”.
- Facilitar verificaciones rápidas del aspecto y estado de cada componente.
- Servir como referencia básica al navegar en el monorepo.

---

## Notas

- Esta aplicación **no es un ejemplo de integración**.
- No está pensada para producción.
- Puede cambiar con frecuencia según evoluciona el Design System.
