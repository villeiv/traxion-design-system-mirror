# Monorepo – Design System 

Este monorepo contiene el **Design System** y la documentación mediante **Storybook**.

## Estructura del proyecto

    apps/
      └─ docs/               # Storybook (documentación y playground de componentes)
    packages/
      └─ design-system/      # Paquete del Design System (componentes, tokens, utils)

- **apps/**  
  Contiene aplicaciones o herramientas internas.  
  Actualmente incluye `docs/`, que ejecuta Storybook con los componentes del Design System.

- **packages/**  
  Contiene el Design System, configuraciones compartidas y cualquier paquete reutilizable futuro.

## Tecnologías principales

- React
- Storybook 9
- npm workspaces
- Turborepo
- Tailwind CSS 3.4
- TypeScript

## Scripts principales

Los siguientes comandos se ejecutan desde el root del monorepo:

    npm install
    npm run dev           # Levanta las apps en modo desarrollo
    npm run storybook     # Abre Storybook desde apps/docs
    npm run build         # Construye los packages y apps

## Design System

El Design System vive en:

    packages/design-system/

Cuyo contenido es:

- `tokens/` con los tokens de diseño 
- `styles/` con las variables CSS globales
- `tailwind/` con la configuración de Tailwind
- `src/` con los componentes para React
- `README.md` del paquete
- `CHANGELOG.md`
- `package.json` con la configuración del package

## Documentación (Storybook)

Storybook está en:

    apps/docs/

Para ejecutarlo:

    npm run storybook

Esto abre la documentación del Design System, incluyendo ejemplos, playgrounds y especificaciones de componentes.

## Convenciones

- Versionado: SemVer
- Ramas: `main` → estable
- Design System: cambios incompatibles marcados en MINOR mientras estemos en `0.x.y`

## Licencia

UNLICENSED
