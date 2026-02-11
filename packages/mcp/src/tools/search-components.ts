import { McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { z } from 'zod';
import { ComponentRegistry } from '../registry.js';

export function registerSearchComponents(server: McpServer, registry: ComponentRegistry): void {
  server.tool(
    'search_components',
    'Search components by name, description, or tags',
    {
      query: z.string().describe('Search query (e.g., "form", "navigation", "modal", "dropdown")'),
    },
    async ({ query }) => {
      const results = registry.searchComponents(query);

      if (results.length === 0) {
        return {
          content: [{
            type: 'text' as const,
            text: `No components match "${query}". Try broader terms or use \`list_components()\` to see all available components.`,
          }],
        };
      }

      let response = `# Search Results for "${query}"\n\n`;
      response += `Found ${results.length} matching component${results.length === 1 ? '' : 's'}:\n\n`;

      for (const comp of results) {
        response += `### ${comp.name} (\`${comp.slug}\`)\n\n`;
        response += `**Category:** ${comp.category}  \n`;
        response += `**Tags:** ${comp.tags.join(', ')}  \n`;
        response += `**Description:** ${comp.description}\n\n`;
      }

      response += `---\n\n`;
      response += `**💡 Next steps:** Use \`get_component("slug")\` for full documentation and examples.\n`;

      return {
        content: [{ type: 'text' as const, text: response }],
      };
    }
  );
}
