import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';

export interface ParsedStory {
  name: string;
  description: string;
  sourceFile: string;
  tags: string[];
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
   * Extract all story exports from the file
   */
  private static extractStories(content: string, storiesDir: string): ParsedStory[] {
    const stories: ParsedStory[] = [];

    // Find all named exports (stories)
    // Pattern: export const StoryName = { ... }
    const storyPattern = /export\s+const\s+(\w+)\s*=\s*{([^}]+(?:{[^}]*}[^}]*)*?)};/g;

    let match;
    while ((match = storyPattern.exec(content)) !== null) {
      const exportName = match[1];
      const storyBody = match[2];

      // Skip if this is not a story (e.g., default export)
      if (!exportName || !storyBody || exportName === 'default') {
        continue;
      }

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
        if (!renderMatch?.[1]) {
          continue;
        }

        const renderFuncName = renderMatch[1];
        const renderImportPattern = new RegExp(`import\\s+${renderFuncName}\\s+from\\s+["']\\.\/sources\/([^"']+)["']`);
        const renderImportMatch = content.match(renderImportPattern);

        if (!renderImportMatch?.[1]) {
          continue;
        }

        const sourceFileName = renderImportMatch[1].replace(/\?raw$/, '');

        stories.push({
          name: exportName,
          description,
          sourceFile: `${sourceFileName}.tsx`,
          tags: this.inferTags(storyName, description),
        });

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
