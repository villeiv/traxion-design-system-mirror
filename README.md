# Monorepo – Design System 

Este monorepo contiene el **Design System** y la documentación mediante **Storybook**.

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
    npm run dev           # Levanta las apps en modo desarrollo
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
  - `react.ts` (entrypoint client-only que exporta todos los componentes)
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

Este servidor actúa como una **capa de documentación inteligente** para el Design System, permitiendo que asistentes AI (como Claude Code) ayuden a los desarrolladores a usar los componentes de manera efectiva.

### ¿Qué hace el MCP?

- ✅ **Descubrimiento de componentes** - Encuentra componentes relevantes por palabra clave
- ✅ **Documentación contextual** - Proporciona props, ejemplos y guías de uso
- ✅ **Scaffolding de código** - Genera código inicial con imports correctos del paquete npm
- ✅ **Validación de uso** - Verifica que el código siga los patrones del Design System
- ✅ **Sugerencias inteligentes** - Recomienda componentes según el caso de uso

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

El Traxion Design System usa una **arquitectura híbrida**:

- **Paquete NPM** (`@traxion-global/design-system`) - Fuente de verdad (componentes reales)
- **Servidor MCP** (`@traxion-global/mcp`) - Asistente AI (documentación inteligente)

Ver [VISION.md](./VISION.md) para más detalles sobre la arquitectura.

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
