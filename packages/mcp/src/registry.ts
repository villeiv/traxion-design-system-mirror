import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { StorybookParser } from './parsers/storybook-parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ComponentProp {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface ComponentExample {
  title: string;
  code: string;
}

export interface ComponentRecommendation {
  type: 'do' | 'dont';
  description: string;
  code?: string;
}

export interface ComponentAccessibility {
  role: string;
  keyboard: string;
  aria: string;
  notes?: string;
}

export interface ComponentMeta {
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  props: ComponentProp[];
  dependencies: string[];
  peerDependencies: string[];
  accessibility: ComponentAccessibility;
  examples: ComponentExample[];
  recommendations?: ComponentRecommendation[];
}

export interface ComponentEntry {
  meta: ComponentMeta;
  source: string;
}

export interface StoryEntry {
  name: string;
  description: string;
  sourceFile: string;
  tags: string[];
}

export interface ComponentStories {
  component: string;
  anatomy: string | null;
  stories: StoryEntry[];
}

export interface ComponentStoryData {
  meta: ComponentStories;
  sources: Map<string, string>;
}

export class ComponentRegistry {
  private components: Map<string, ComponentEntry> = new Map();
  private tokens: Record<string, unknown> = {};
  private guidelines: Map<string, string> = new Map();
  private stories: Map<string, ComponentStoryData> = new Map();

  // Paths relative to packages/mcp/src/
  private readonly DESIGN_SYSTEM_PATH = join(__dirname, '../../design-system/src');
  private readonly COMPONENTS_SOURCE_PATH = join(this.DESIGN_SYSTEM_PATH, 'components');
  private readonly TOKENS_PATH = join(this.DESIGN_SYSTEM_PATH, 'tokens/tokens.json');
  private readonly METADATA_PATH = join(__dirname, 'metadata');
  private readonly COMPONENTS_METADATA_PATH = join(this.METADATA_PATH, 'components');
  private readonly GUIDELINES_PATH = join(this.METADATA_PATH, 'guidelines');
  private readonly STORYBOOK_PATH = join(__dirname, '../../../apps/docs/stories');

  constructor() {
    this.load();
  }

  private load(): void {
    // Load components (metadata + source)
    this.loadComponents();

    // Load tokens
    this.loadTokens();

    // Load guidelines
    this.loadGuidelines();

    // Load Storybook stories (if available)
    this.loadStories();

    console.error(`[MCP Registry] Loaded ${this.components.size} components, ${Object.keys(this.tokens).length} token categories, ${this.guidelines.size} guidelines, ${this.stories.size} component story sets`);
  }

  private loadComponents(): void {
    if (!existsSync(this.COMPONENTS_METADATA_PATH)) {
      console.error('[MCP Registry] Component metadata directory not found:', this.COMPONENTS_METADATA_PATH);
      return;
    }

    const jsonFiles = readdirSync(this.COMPONENTS_METADATA_PATH).filter(f => f.endsWith('.json'));

    for (const jsonFile of jsonFiles) {
      const metaPath = join(this.COMPONENTS_METADATA_PATH, jsonFile);

      try {
        const meta: ComponentMeta = JSON.parse(readFileSync(metaPath, 'utf-8'));

        // Read source from design-system package
        // Try to match the component file by name (case-insensitive)
        const componentFiles = existsSync(this.COMPONENTS_SOURCE_PATH)
          ? readdirSync(this.COMPONENTS_SOURCE_PATH).filter(f => f.endsWith('.tsx'))
          : [];

        const matchingFile = componentFiles.find(f =>
          f.replace('.tsx', '').toLowerCase() === meta.name.toLowerCase()
        );

        let source = '// Component source not available in this context\n// Import from: @traxion-global/design-system/react';

        if (matchingFile) {
          const sourcePath = join(this.COMPONENTS_SOURCE_PATH, matchingFile);
          if (existsSync(sourcePath)) {
            source = readFileSync(sourcePath, 'utf-8');
          }
        }

        this.components.set(meta.slug, { meta, source });
      } catch (err) {
        console.error(`[MCP Registry] Failed to load component ${jsonFile}:`, err);
      }
    }
  }

  private loadTokens(): void {
    if (existsSync(this.TOKENS_PATH)) {
      try {
        this.tokens = JSON.parse(readFileSync(this.TOKENS_PATH, 'utf-8'));
      } catch (err) {
        console.error('[MCP Registry] Failed to load tokens:', err);
      }
    } else {
      console.error('[MCP Registry] Tokens file not found:', this.TOKENS_PATH);
    }
  }

  private loadGuidelines(): void {
    if (!existsSync(this.GUIDELINES_PATH)) {
      console.error('[MCP Registry] Guidelines directory not found:', this.GUIDELINES_PATH);
      return;
    }

    const mdFiles = readdirSync(this.GUIDELINES_PATH).filter(f => f.endsWith('.md'));

    for (const mdFile of mdFiles) {
      const name = mdFile.replace('.md', '');
      const content = readFileSync(join(this.GUIDELINES_PATH, mdFile), 'utf-8');
      this.guidelines.set(name, content);
    }
  }

  private loadStories(): void {
    if (!existsSync(this.STORYBOOK_PATH)) {
      console.error('[MCP Registry] Storybook directory not found:', this.STORYBOOK_PATH);
      return;
    }

    // Parse .stories.tsx files directly from the Storybook directory
    // This maintains single source of truth instead of duplicating stories
    const storyFiles = readdirSync(this.STORYBOOK_PATH).filter(f => f.endsWith('.stories.tsx'));

    for (const storyFile of storyFiles) {
      try {
        const storyPath = join(this.STORYBOOK_PATH, storyFile);
        const parsed = StorybookParser.parseStoryFile(storyPath);

        if (!parsed) {
          continue;
        }

        const sources = new Map<string, string>();

        // Load each story's source file from the sources directory
        for (const story of parsed.stories) {
          const sourceContent = StorybookParser.loadSourceFile(this.STORYBOOK_PATH, story.sourceFile);
          if (sourceContent) {
            sources.set(story.sourceFile, sourceContent);
          }
        }

        // Build ComponentStories object matching expected interface
        const meta: ComponentStories = {
          component: parsed.component,
          anatomy: parsed.anatomy,
          stories: parsed.stories.map(s => ({
            name: s.name,
            description: s.description,
            sourceFile: s.sourceFile,
            tags: s.tags,
          })),
        };

        this.stories.set(parsed.component, { meta, sources });
      } catch (err) {
        console.error(`[MCP Registry] Failed to load stories from ${storyFile}:`, err);
      }
    }
  }

  // Public API methods

  getComponent(slug: string): ComponentEntry | undefined {
    return this.components.get(slug);
  }

  listComponents(): ComponentMeta[] {
    return Array.from(this.components.values()).map(c => c.meta);
  }

  searchComponents(query: string): ComponentMeta[] {
    const q = query.toLowerCase();
    return this.listComponents().filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q)) ||
      c.category.toLowerCase().includes(q)
    );
  }

  getComponentsByCategory(category: string): ComponentMeta[] {
    return this.listComponents().filter(c => c.category === category);
  }

  getCategories(): string[] {
    return [...new Set(this.listComponents().map(c => c.category))];
  }

  getTokens(): Record<string, unknown> {
    return this.tokens;
  }

  getTokenCategory(category: string): unknown {
    return this.tokens[category];
  }

  getGuideline(name: string): string | undefined {
    return this.guidelines.get(name);
  }

  listGuidelines(): string[] {
    return Array.from(this.guidelines.keys());
  }

  getStories(slug: string): ComponentStoryData | undefined {
    return this.stories.get(slug);
  }

  hasStories(slug: string): boolean {
    return this.stories.has(slug);
  }

  listComponentsWithStories(): string[] {
    return Array.from(this.stories.keys());
  }
}
