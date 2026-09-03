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

    npm run dev

Esto abre la documentación del Design System, incluyendo ejemplos, playgrounds y especificaciones de componentes.

### Publicación del Storybook

El Storybook se publica en **Vercel**, y el despliegue es **automático**: cada push a `main` lo redespliega. No hay que ejecutar nada a mano.

**Por qué hay un repo espejo.** Vercel no permite conectar directamente el repositorio `traxion-global/design-system` (la GitHub App de Vercel no está autorizada en esa organización). El proyecto de Vercel está conectado a un **mirror** en una cuenta personal:

    https://github.com/villeiv/traxion-design-system-mirror

El repositorio de la organización sigue siendo la fuente de verdad y el que publica el paquete npm. El mirror solo existe para que Vercel tenga algo que observar.

**Cómo se mantiene sincronizado.** El remoto `origin` tiene dos `pushurl`, así que un solo `git push` escribe en los dos repositorios. Esta configuración vive en `.git/config`, que **no está versionado**, de modo que cada clon nuevo tiene que aplicarla:

```bash
# El orden importa: al añadir el primer pushurl, el implícito desaparece
git remote set-url --add --push origin https://github.com/traxion-global/design-system.git
git remote set-url --add --push origin https://github.com/villeiv/traxion-design-system-mirror.git

# Remoto aparte, para operar solo sobre el mirror cuando haga falta
git remote add mirror https://github.com/villeiv/traxion-design-system-mirror.git
```

Verifica con `git remote -v`: debe haber un `origin (fetch)` y **dos** `origin (push)`. Si solo aparece uno, los pushes no están llegando al mirror y el Storybook publicado se queda atrás sin avisar.

Si algún día el mirror diverge, se recupera forzando **solo** ese lado, nunca con `--force` sobre `origin` (que escribiría también en el repo de la organización):

```bash
git push --force mirror main
```

**Configuración del proyecto en Vercel.** El monorepo obliga a construir el design system antes que el Storybook, y a instalar desde la raíz (una instalación aislada en `apps/docs` resuelve una segunda copia de `@types/react` y rompe la generación de tipos):

| Campo | Valor |
|-------|-------|
| Framework Preset | Other |
| Root Directory | *(vacío — la raíz del repositorio)* |
| Install Command | `npm install` |
| Build Command | `npm run build --workspace=@traxion-global/design-system && npm run build-storybook --workspace=docs` |
| Output Directory | `apps/docs/storybook-static` |
| Production Branch | `main` |

Opcional, para no reconstruir en cada commit del monorepo — en *Settings → Git → Ignored Build Step*:

```bash
git diff --quiet HEAD^ HEAD -- apps/docs packages/design-system
```

Vercel salta el build cuando ese comando termina con éxito, es decir cuando el commit no tocó ni las stories ni el design system.

**Ojo con `npm run build`.** El pipeline de Turborepo **no** incluye el Storybook: `turbo.json` no define una tarea `build-storybook` y `apps/docs` no tiene script `build`. Por eso el Build Command encadena los dos pasos a mano, y por eso `npm run build` en local no valida las stories. Para comprobarlas antes de subir:

```bash
npm run build-storybook --workspace=docs
```

**Relación con la publicación del paquete.** Son procesos independientes: el Storybook se despliega con cada push a `main`, mientras que el paquete npm solo se publica al crear un GitHub Release (ver [Proceso de Release](#proceso-de-release)).

## Servidor MCP (Model Context Protocol)

El servidor MCP está en:

    packages/mcp/

Este servidor actúa como una **capa de documentación inteligente** para el Design System, permitiendo que asistentes AI (como Claude Code) utilicen y ayuden a los desarrolladores a usar los componentes de manera efectiva.

### ¿Qué hace el MCP?

- **Proporciona una guía de instalación** — Ayuda a instalar el design system
- **Descubrimiento de componentes** — Lista todos los componentes con tags y relaciones
- **Documentación contextual** — Proporciona props, ejemplos reales de Storybook y guías de uso
- **Design tokens y guidelines** — Acceso a colores, tipografía, accesibilidad y patrones

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
│ • Publicado en GitHub   │ • Documentación contextual        │
│ • Componentes bloqueados│ • Ejemplos reales de Storybook    │
│ • Versionado semántico  │ • Design tokens y guidelines      │
│ • Import tradicional    │ • Helper de instalación del DS    │
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

## Agregar o editar componentes

El proceso completo para crear o modificar un componente del Design System —investigación, implementación, stories de Storybook, ejemplo en showcase, registro en el MCP y publicación— está documentado en [`docs/creating-components.md`](./docs/creating-components.md). Esa guía es la metodología oficial (la misma que usa el skill `/new-component`). El último paso de ese flujo es la publicación, descrita abajo.

## Proceso de Release

El paquete `@traxion-global/design-system` se publica en **GitHub Packages** mediante **GitHub Actions** — **nunca** de forma local con `npm publish`. Crear un GitHub Release es lo que dispara la publicación.

Flujo para promover una nueva versión:

1. **Sube la versión** en `packages/design-system/package.json` (SemVer) y añade la entrada en `packages/design-system/CHANGELOG.md`.
   - Si cambió la metadata o las tools del MCP, sube también la versión del MCP en sus tres lugares (ver `packages/mcp/`).
2. **Verifica** localmente que la build pasa: `npm run build`.
3. **Commit + push a `main`** de todos los cambios.
4. **Crea un GitHub Release** con tag `vX.Y.Z` (la nueva versión del design-system), apuntando a `main`. Esto dispara el workflow `.github/workflows/release-package.yml`.
5. **Verifica en la pestaña Actions** que los jobs `build` y `publish-gpr` terminen en verde. La nueva versión aparecerá en GitHub Packages.

> **Por qué el workflow instala desde la raíz:** el workflow instala y compila desde la **raíz del monorepo**, no desde `packages/design-system` en aislamiento. Una instalación aislada resuelve una segunda copia de `@types/react`; como Radix augmenta `CSSProperties` con `--radix-${string}`, las dos copias divergen y la generación de tipos (`.d.ts`) falla. Instalar desde la raíz replica la build local y evita el problema.

> **El Storybook no se publica aquí.** Se despliega solo en Vercel con cada push a `main`, sin esperar a una Release — ver [Publicación del Storybook](#publicación-del-storybook). Ten en cuenta que `npm run build` del paso 2 no compila el Storybook; para validar las stories usa `npm run build-storybook --workspace=docs`.

El proceso completo de creación/edición de componentes (del que la publicación es el paso final) vive en [`docs/creating-components.md`](./docs/creating-components.md).

## Convenciones

- Versionado: SemVer
- Ramas: `main` → estable
- Design System: cambios incompatibles marcados en MINOR mientras estemos en `0.x.y`

## Licencia

UNLICENSED
