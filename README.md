# Monorepo – Design System 

Este monorepo contiene el **Design System**, la documentación mediante **Storybook** y un **MCP Server** que actua como una capa de documentación inteligente enfocada en IA-first development del Traxion Design System.

## Estructura del proyecto

    apps/
      ├─ docs/               # Storybook (documentación y playground de componentes)
      └─ showcase/           # App de demostración Next.js
    packages/
      ├─ design-system/      # Paquete del Design System (componentes, tokens, utils)
      └─ mcp/                # Servidor MCP (asistente AI para el Design System)

- **apps/**
  Contiene aplicaciones o herramientas internas.
  Incluye `docs/` (Storybook) y `showcase/` (demostración Next.js).

- **packages/**
  Contiene el Design System, el servidor MCP, configuraciones compartidas y cualquier paquete reutilizable futuro.

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
    npm run dev           # Levanta las apps en modo desarrollo, en el caso del design system, hace un rebuild cuando los componets cambian, para que los cambios estén disponibles inmediatamente
    npm run storybook     # Abre Storybook desde apps/docs
    npm run build         # Construye los packages y apps

## Design System

El Design System vive en:

    packages/design-system/

Cuyo contenido es:


- `tokens/` con los tokens de diseño 
- `styles/` con las variables CSS globales
- `tailwind/` con la configuración del preset de Tailwind
- `src/` con el código fuente del design system  
  - `index.ts` (entrypoint utilidades como `cn`)  
  - `react.ts` (entrypoint que exporta todos los componentes y hooks para el uso con React)
- `dist/` generado por la build (componentes, entrypoints, tokens y css procesados)
- `README.md` del paquete
- `CHANGELOG.md`
- `package.json` con la configuración del package

## Documentación (Storybook)

Storybook está en:

    apps/docs/

Para ejecutarlo:

    npm run storybook

Esto abre la documentación del Design System, incluyendo ejemplos, playgrounds y especificaciones de componentes.

## Servidor MCP (Model Context Protocol)

El servidor MCP está en:

    packages/mcp/

Este servidor actúa como una **capa de documentación inteligente** para el Design System, permitiendo que asistentes AI (como Claude Code) utilicen y ayuden a los desarrolladores a usar los componentes de manera efectiva.

### ¿Qué hace el MCP?

- **Proporciona una guía de instalación** - Ayuda a instalar el design system 
- **Descubrimiento de componentes** - Encuentra componentes relevantes por palabra clave
- **Documentación contextual** - Proporciona props, ejemplos y guías de uso
- **Scaffolding de código** - Genera código inicial con imports correctos del paquete
- **Validación de uso** - Verifica que el código siga los patrones del Design System
- **Sugerencias inteligentes** - Recomienda componentes según el caso de uso

### Configuración

Para usar el MCP con Claude Code, crea un archivo `.mcp.json` en tu proyecto:

```json
{
  "mcpServers": {
    "traxion-design-system": {
      "command": "npm",
      "args": ["run", "dev", "--workspace=@traxion-global/mcp"],
      "cwd": "/ruta/a/8-traxion-global-design-system"
    }
  }
}
```

### Arquitectura Híbrida

El Traxion Design System usa una **arquitectura híbrida** que combina distribución tradicional con asistencia AI:

```
┌─────────────────────────────────────────────────────────────┐
│                   Traxion Design System                     │
├─────────────────────────┬───────────────────────────────────┤
│   Paquete GitHub        │   Servidor MCP                    │
│   Package               │   (Capa de documentación IA)      │
│   (Fuente de verdad)    │                                   │
├─────────────────────────┼───────────────────────────────────┤
│ • Componentes React     │ • Descubrimiento de componentes   │
│ • Publicado en GitHub   │ • Scaffolding asistido por IA     │
│ • Componentes bloqueados│ • Validación de uso               │
│ • Versionado semántico  │ • Sugerencias contextuales        │
│ • Import tradicional    │ • Ejemplos personalizados         │
│ • Import tradicional    │ • Acceso a stories                │
│                         │ • Helper de instalación del DS    │
└─────────────────────────┴───────────────────────────────────┘
```

**Capas:**

1. **Paquete NPM** (`@traxion-global/design-system`)
   - Los componentes React reales (fuente de verdad)
   - Publicado en GitHub Packages para distribución
   - Componentes bloqueados para garantizar consistencia

2. **Servidor MCP** (`@traxion-global/mcp`)
   - Asistente AI que ayuda a usar el Design System
   - Lee directamente del paquete (mismo monorepo)
   - Genera código que IMPORTA del paquete
   - Siempre sincronizado (misma versión, mismo repo)

**Principio clave:** MUY IMPORTANTE: El MCP genera código que **usa** los componentes del paquete, nunca copia su código fuente.

**Para más detalles sobre el MCP, arquitectura híbrida, beneficios y workflows completos, ver [packages/mcp/README.md](./packages/mcp/README.md)**

### Scripts del MCP

```bash
npm run dev --workspace=@traxion-global/mcp   # Ejecutar servidor MCP
npm run build --workspace=@traxion-global/mcp # Construir servidor MCP
```

## Convenciones

- Versionado: SemVer
- Ramas: `main` → estable
- Design System: cambios incompatibles marcados en MINOR mientras estemos en `0.x.y`

## Licencia

UNLICENSED
