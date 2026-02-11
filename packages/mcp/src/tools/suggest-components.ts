import { McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { z } from 'zod';
import { ComponentRegistry } from '../registry.js';

export function registerSuggestComponents(server: McpServer, registry: ComponentRegistry): void {
  server.tool(
    'suggest_components',
    'Get component suggestions based on a use case description',
    {
      use_case: z.string().describe('Description of what you want to build (e.g., "user authentication", "data visualization", "file management")'),
      max_results: z.number().optional().describe('Maximum number of components to suggest (default: 5)'),
    },
    async ({ use_case, max_results = 5 }) => {
      const keywords = use_case.toLowerCase();

      // Keyword-based component suggestions
      const suggestions = new Map<string, number>(); // slug -> relevance score

      const allComponents = registry.listComponents();

      for (const comp of allComponents) {
        let score = 0;

        // Check if use case matches component name, description, or tags
        const searchText = `${comp.name} ${comp.description} ${comp.tags.join(' ')}`.toLowerCase();

        // Exact match in name
        if (comp.name.toLowerCase().includes(keywords)) {
          score += 10;
        }

        // Match in description
        if (comp.description.toLowerCase().includes(keywords)) {
          score += 5;
        }

        // Match in tags
        for (const tag of comp.tags) {
          if (keywords.includes(tag.toLowerCase())) {
            score += 7;
          }
        }

        // Keyword-based matching for common use cases
        const useCasePatterns = [
          { keywords: ['form', 'input', 'submit', 'field'], components: ['input', 'label', 'button', 'textarea', 'select', 'checkbox', 'radio-group', 'switch'] },
          { keywords: ['auth', 'login', 'signup', 'register', 'password'], components: ['input', 'label', 'button', 'card'] },
          { keywords: ['table', 'data', 'grid', 'list'], components: ['table', 'badge', 'pagination', 'sortable-board'] },
          { keywords: ['dialog', 'modal', 'popup', 'overlay'], components: ['dialog', 'alert-dialog', 'sheet', 'popover'] },
          { keywords: ['nav', 'menu', 'navigation', 'sidebar'], components: ['accordion', 'dropdown-menu', 'command'] },
          { keywords: ['card', 'container', 'box', 'panel'], components: ['card', 'separator'] },
          { keywords: ['dropdown', 'select', 'picker', 'choose'], components: ['dropdown-menu', 'select', 'command', 'popover'] },
          { keywords: ['tooltip', 'hint', 'help'], components: ['tooltip', 'hover-card', 'popover'] },
          { keywords: ['upload', 'file', 'drop', 'drag'], components: ['file-drop-zone', 'button'] },
          { keywords: ['date', 'calendar', 'time'], components: ['calendar', 'popover', 'input'] },
          { keywords: ['user', 'profile', 'avatar', 'photo'], components: ['avatar', 'card', 'badge'] },
          { keywords: ['loading', 'spinner', 'progress'], components: ['full-page-overlay-loader', 'inline-loader', 'progress'] },
          { keywords: ['empty', 'no-data', 'blank'], components: ['no-data-message', 'card'] },
          { keywords: ['toast', 'notification', 'alert', 'message'], components: ['toaster-service', 'alert-dialog'] },
        ];

        for (const pattern of useCasePatterns) {
          const hasKeyword = pattern.keywords.some(kw => keywords.includes(kw));
          if (hasKeyword && pattern.components.includes(comp.slug)) {
            score += 8;
          }
        }

        if (score > 0) {
          suggestions.set(comp.slug, score);
        }
      }

      // Sort by score and take top results
      const sortedSuggestions = Array.from(suggestions.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, max_results)
        .map(([slug]) => slug);

      if (sortedSuggestions.length === 0) {
        return {
          content: [{
            type: 'text' as const,
            text: `No specific component suggestions for "${use_case}". Try:\n\n1. Use \`search_components()\` with keywords\n2. Use \`list_components()\` to browse all components\n3. Rephrase your use case with more specific terms`,
          }],
        };
      }

      // Get full component details
      const componentDetails = sortedSuggestions
        .map(slug => registry.getComponent(slug))
        .filter(entry => entry !== undefined);

      let response = `# Component Suggestions for "${use_case}"\n\n`;
      response += `Found ${componentDetails.length} relevant component${componentDetails.length === 1 ? '' : 's'}:\n\n`;

      for (let i = 0; i < componentDetails.length; i++) {
        const entry = componentDetails[i]!;
        response += `## ${i + 1}. ${entry.meta.name}\n\n`;
        response += `**Slug:** \`${entry.meta.slug}\`  \n`;
        response += `**Category:** ${entry.meta.category}  \n`;
        response += `**Description:** ${entry.meta.description}\n\n`;
      }

      response += `---\n\n`;
      response += `## Next Steps\n\n`;
      response += `1. Use \`get_component("slug")\` to see detailed docs and examples\n`;
      response += `2. Use \`scaffold_feature("${use_case}")\` to generate starter code\n`;
      response += `3. Import components from \`@traxion-global/design-system/react\`\n\n`;

      response += `**Installation:**\n\`\`\`bash\nnpm install @traxion-global/design-system\n\`\`\`\n`;

      return {
        content: [{ type: 'text' as const, text: response }],
      };
    }
  );
}
