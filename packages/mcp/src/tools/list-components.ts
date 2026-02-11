import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ComponentRegistry } from '../registry.js';

export function registerListComponents(server: McpServer, registry: ComponentRegistry): void {
  server.tool(
    'list_components',
    'List all available components in the Traxion design system, optionally filtered by category.',
    {
      category: z.string().optional()
        .describe('Filter by category (e.g., "actions", "forms", "layout", "feedback", "overlay", "navigation", "data-display")'),
    },
    async ({ category }) => {
      const components = category
        ? registry.getComponentsByCategory(category)
        : registry.listComponents();

      if (components.length === 0) {
        const categories = registry.getCategories();
        return {
          content: [{
            type: 'text' as const,
            text: `No components found${category ? ` in category "${category}"` : ''}. Available categories: ${categories.join(', ')}`,
          }],
        };
      }

      let response = `# Traxion Design System Components${category ? ` — ${category}` : ''}\n\n`;
      response += `Found ${components.length} component${components.length === 1 ? '' : 's'}:\n\n`;

      // Group by category
      const grouped = new Map<string, typeof components>();
      for (const comp of components) {
        const cat = comp.category;
        if (!grouped.has(cat)) grouped.set(cat, []);
        grouped.get(cat)!.push(comp);
      }

      // Display components grouped by category
      for (const [cat, comps] of grouped) {
        response += `## ${cat}\n\n`;
        for (const comp of comps) {
          response += `- **${comp.name}** (\`${comp.slug}\`) — ${comp.description}\n`;
        }
        response += '\n';
      }

      response += `---\n\n`;
      response += `**💡 Tip:** Use \`get_component("slug")\` to see detailed docs, props, and examples.\n\n`;
      response += `**📦 Installation:**\n\`\`\`bash\nnpm install @traxion-global/design-system\n\`\`\`\n`;

      return {
        content: [{ type: 'text' as const, text: response }],
      };
    }
  );
}
