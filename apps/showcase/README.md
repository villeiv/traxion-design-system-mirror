# Showcase – Visualización de Componentes

Este workspace contiene una aplicación mínima cuyo único propósito es **mostrar visualmente los componentes disponibles en el Design System**. 
No debe tomarse el código como ejemplo a seguir de buenas prácticas, el único objetivo del showcase es brindar una página en que se puedan explorar rapidamente los componentes disponibles, no es una guía de implementación.
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

El script `npm run dev` del root hace watch sobre el Design System y ejecuta el build automáticamente al detectar cambios. Sin esto, el showcase podría mostrar componentes desactualizados ya que consume el output del build, no los archivos fuente directamente.

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
