import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';

export interface ParsedStory {
  name: string;
  description: string;
  sourceFile: string;
  tags: string[];
  inlineSource?: string;
}

export interface ParsedStorybook {
  component: string;
  anatomy: string | null;
  stories: ParsedStory[];
}

/**
 * Parses a Storybook .stories.tsx file to extract story metadata
 * This allows us to read stories directly from the Storybook source
 * instead of maintaining duplicated copies in metadata/stories/
 */
export class StorybookParser {
  /**
   * Parse a .stories.tsx file and return structured story data
   */
  static parseStoryFile(filePath: string): ParsedStorybook | null {
    if (!existsSync(filePath)) {
      return null;
    }

    try {
      const content = readFileSync(filePath, 'utf-8');
      const storiesDir = dirname(filePath);

      // Extract component name from default export's title
      const componentName = this.extractComponentName(content);
      if (!componentName) {
        return null;
      }

      // Extract anatomy if present
      const anatomy = this.extractAnatomy(content, storiesDir);

      // Extract story exports
      const stories = this.extractStories(content, storiesDir);

      return {
        component: componentName.toLowerCase(),
        anatomy,
        stories,
      };
    } catch (err) {
      console.error(`[StorybookParser] Failed to parse ${filePath}:`, err);
      return null;
    }
  }

  /**
   * Extract component name from default export's title field
   * Example: title: "Dialog" -> "dialog"
   */
  private static extractComponentName(content: string): string | null {
    const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
    return titleMatch?.[1] ?? null;
  }

  /**
   * Extract anatomy string from anatomy import/component
   * Example: DialogAnatomy exported from Dialog.anatomy.tsx
   */
  private static extractAnatomy(content: string, storiesDir: string): string | null {
    // Look for anatomy import pattern: import { DialogAnatomy } from "./sources/Dialog.anatomy"
    const anatomyImportMatch = content.match(/import\s*{\s*(\w+Anatomy)\s*}\s*from\s*["']\.\/sources\/(\w+)\.anatomy["']/);

    if (!anatomyImportMatch?.[2]) {
      return null;
    }

    const anatomyFile = `${anatomyImportMatch[2]}.anatomy.tsx`;
    const anatomyPath = join(storiesDir, 'sources', anatomyFile);

    if (!existsSync(anatomyPath)) {
      return null;
    }

    try {
      const anatomyContent = readFileSync(anatomyPath, 'utf-8');

      // Extract the anatomy string from the export
      // Pattern: export const DialogAnatomy = `<Dialog>...</Dialog>`;
      const anatomyMatch = anatomyContent.match(/export\s+const\s+\w+Anatomy\s*=\s*`([^`]+)`/);

      return anatomyMatch?.[1]?.trim() ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Extract design-system and lucide-react import lines from the file header.
   * Handles multi-line imports.
   */
  private static extractDesignSystemImports(content: string): string {
    const importLines: string[] = [];
    // Match import statements for design-system and lucide-react
    const importRegex = /import\s+(?:{[^}]*}|[\w,\s*]+)\s+from\s+["'](@traxion-global\/design-system\/react|lucide-react)["'];?/g;

    let m;
    while ((m = importRegex.exec(content)) !== null) {
      importLines.push(m[0].trim());
    }

    return importLines.join('\n');
  }

  /**
   * Extract the JSX body from an inline render arrow function.
   * Handles: `render: args => (<JSX/>)`, `render: _ => { return <JSX/> }`,
   * and `render: (args) => <JSX/>`
   */
  private static extractInlineRenderSource(storyBody: string): string | null {
    // Find `render:` followed by an arrow function
    const renderIdx = storyBody.indexOf('render:');
    if (renderIdx === -1) return null;

    // Find the arrow `=>`
    const afterRender = storyBody.substring(renderIdx + 7);
    const arrowIdx = afterRender.indexOf('=>');
    if (arrowIdx === -1) return null;

    const afterArrow = afterRender.substring(arrowIdx + 2).trimStart();

    if (afterArrow.startsWith('(')) {
      // Parenthesized expression: render: args => ( ... )
      const extracted = this.extractBalancedBlock(afterArrow, '(', ')');
      if (extracted) {
        // Return inner content without outer parens
        return extracted.substring(1, extracted.length - 1).trim();
      }
    } else if (afterArrow.startsWith('{')) {
      // Block body: render: _ => { return ... }
      const block = this.extractBalancedBlock(afterArrow, '{', '}');
      if (block) {
        const inner = block.substring(1, block.length - 1).trim();
        // Extract the return expression
        const returnIdx = inner.indexOf('return');
        if (returnIdx !== -1) {
          return inner.substring(returnIdx + 6).trim();
        }
      }
    } else if (afterArrow.startsWith('<')) {
      // Direct JSX: render: (args) => <JSX .../>
      // Extract until the JSX tag is balanced
      return this.extractBalancedJSX(afterArrow);
    }

    return null;
  }

  /**
   * Extract a balanced block delimited by openChar/closeChar.
   * Handles nested delimiters, strings, and template literals.
   */
  private static extractBalancedBlock(content: string, openChar: string, closeChar: string): string | null {
    if (content[0] !== openChar) return null;

    let depth = 0;
    let i = 0;
    let inString: string | null = null; // tracks ' " or `

    while (i < content.length) {
      const ch = content[i]!;

      // Handle escape sequences inside strings
      if (inString && ch === '\\') {
        i += 2;
        continue;
      }

      // Toggle string mode
      if (ch === '"' || ch === "'" || ch === '`') {
        if (!inString) {
          inString = ch;
        } else if (inString === ch) {
          inString = null;
        }
        i++;
        continue;
      }

      if (!inString) {
        if (ch === openChar) depth++;
        else if (ch === closeChar) {
          depth--;
          if (depth === 0) {
            return content.substring(0, i + 1);
          }
        }
      }

      i++;
    }

    return null;
  }

  /**
   * Extract balanced JSX starting with `<Tag` until the tag closes.
   * Handles self-closing tags, nested tags, and JSX expressions.
   */
  private static extractBalancedJSX(content: string): string | null {
    // Find the end of the JSX by tracking angle brackets and braces
    // We need a simpler approach: scan until we find the story object's
    // closing context (a property at the same level or end of object)
    let depth = 0;
    let braceDepth = 0;
    let i = 0;
    let inString: string | null = null;

    while (i < content.length) {
      const ch = content[i]!;

      if (inString && ch === '\\') {
        i += 2;
        continue;
      }

      if (ch === '"' || ch === "'" || ch === '`') {
        if (!inString) inString = ch;
        else if (inString === ch) inString = null;
        i++;
        continue;
      }

      if (!inString) {
        if (ch === '{') braceDepth++;
        else if (ch === '}') {
          if (braceDepth === 0) {
            // We've hit the end of the story object
            // Backtrack to find the actual end of JSX
            let end = i;
            while (end > 0 && /\s/.test(content[end - 1]!)) end--;
            return content.substring(0, end);
          }
          braceDepth--;
        } else if (ch === '<') {
          // Check for closing tag
          if (content[i + 1] === '/') {
            depth--;
          } else if (content[i + 1] !== '!' && content[i + 1] !== ' ') {
            depth++;
          }
        } else if (ch === '/' && content[i + 1] === '>') {
          depth--;
          // Self-closing tag
        }
      }

      i++;
    }

    // Fallback: return trimmed content
    return content.trim() || null;
  }

  /**
   * Extract all story exports from the file
   */
  private static extractStories(content: string, storiesDir: string): ParsedStory[] {
    const stories: ParsedStory[] = [];

    // Pre-extract design-system imports for inline stories
    const dsImports = this.extractDesignSystemImports(content);

    // Find all named exports (stories) using brace counting for proper nesting support
    // Pattern: export const StoryName = { ... };
    const exportPattern = /export\s+const\s+(\w+)\s*=\s*{/g;

    let match;
    while ((match = exportPattern.exec(content)) !== null) {
      const exportName = match[1];

      // Skip if this is not a story (e.g., default export)
      if (!exportName || exportName === 'default') {
        continue;
      }

      // Find the matching closing brace by counting braces
      const startPos = match.index + match[0].length - 1; // Position of opening {
      let braceCount = 1;
      let endPos = startPos + 1;

      while (braceCount > 0 && endPos < content.length) {
        const char = content[endPos];
        if (char === '{') braceCount++;
        else if (char === '}') braceCount--;
        endPos++;
      }

      if (braceCount !== 0) {
        // Couldn't find matching brace
        continue;
      }

      const storyBody = content.substring(startPos + 1, endPos - 1);

      // Extract story name
      const nameMatch = storyBody.match(/name:\s*["']([^"']+)["']/);
      const storyName = nameMatch?.[1] ?? exportName;

      // Extract description from parameters.docs.description.story
      // Use [\s\S] instead of /s flag for ES2017 compatibility
      const descMatch = storyBody.match(/description:\s*{\s*story:\s*["']([^"']+)["']/);
      const description = descMatch?.[1]?.trim() ?? '';

      // Find the corresponding source file import
      // Pattern: import StoryName from "./sources/Component.variant"
      const importPattern = new RegExp(`import\\s+${exportName}\\s+from\\s+["']\\.\/sources\/([^"']+)["']`);
      const importMatch = content.match(importPattern);

      if (!importMatch?.[1]) {
        // If we can't find the import, try to infer from render field
        const renderMatch = storyBody.match(/render:\s*(\w+)/);
        if (renderMatch?.[1]) {
          const renderFuncName = renderMatch[1];
          const renderImportPattern = new RegExp(`import\\s+${renderFuncName}\\s+from\\s+["']\\.\/sources\/([^"']+)["']`);
          const renderImportMatch = content.match(renderImportPattern);

          if (renderImportMatch?.[1]) {
            const sourceFileName = renderImportMatch[1].replace(/\?raw$/, '');

            stories.push({
              name: exportName,
              description,
              sourceFile: `${sourceFileName}.tsx`,
              tags: this.inferTags(storyName, description),
            });

            continue;
          }
        }

        // No external source file found — try to extract inline render body
        const inlineJSX = this.extractInlineRenderSource(storyBody);
        if (inlineJSX) {
          const syntheticKey = `__inline_${exportName}__`;
          const inlineSource = dsImports
            ? `${dsImports}\n\nexport default function ${exportName}() {\n  return (\n    ${inlineJSX}\n  );\n}`
            : `export default function ${exportName}() {\n  return (\n    ${inlineJSX}\n  );\n}`;

          stories.push({
            name: exportName,
            description,
            sourceFile: syntheticKey,
            tags: this.inferTags(storyName, description),
            inlineSource,
          });
        }

        continue;
      }

      const sourceFileName = importMatch[1].replace(/\?raw$/, '');

      stories.push({
        name: exportName,
        description,
        sourceFile: `${sourceFileName}.tsx`,
        tags: this.inferTags(storyName, description),
      });
    }

    return stories;
  }

  /**
   * Infer tags from story name and description
   */
  private static inferTags(name: string, description: string): string[] {
    const tags: string[] = [];
    const combined = `${name} ${description}`.toLowerCase();

    // Common patterns
    if (combined.includes('básico') || combined.includes('basic')) {
      tags.push('basic');
    }
    if (combined.includes('controlado') || combined.includes('controlled')) {
      tags.push('controlled');
    }
    if (combined.includes('no controlado') || combined.includes('uncontrolled')) {
      tags.push('uncontrolled');
    }
    if (combined.includes('estado') || combined.includes('state')) {
      tags.push('state-management');
    }
    if (combined.includes('composición') || combined.includes('composition')) {
      tags.push('composition');
    }
    if (combined.includes('estilo') || combined.includes('styling')) {
      tags.push('styling');
    }
    if (combined.includes('avanzado') || combined.includes('advanced')) {
      tags.push('advanced');
    }
    if (combined.includes('formulario') || combined.includes('form')) {
      tags.push('form');
    }

    return tags.length > 0 ? tags : ['example'];
  }

  /**
   * Load source file content from the sources directory
   */
  static loadSourceFile(storiesDir: string, sourceFile: string): string | null {
    const sourcePath = join(storiesDir, 'sources', sourceFile);

    if (!existsSync(sourcePath)) {
      return null;
    }

    try {
      return readFileSync(sourcePath, 'utf-8');
    } catch (err) {
      console.error(`[StorybookParser] Failed to load source ${sourcePath}:`, err);
      return null;
    }
  }
}
