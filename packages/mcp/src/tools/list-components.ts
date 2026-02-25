import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ComponentRegistry } from '../registry.js';

export function registerListComponents(server: McpServer, registry: ComponentRegistry): void {
  server.tool(
    'list_components',
    'List every component in the Traxion design system. Returns an alphabetical list with searchable tags and commonly paired components so you can pick the right pieces without extra lookups.',
    {},
    async () => {
      const components = registry.listComponents().sort((a, b) => a.name.localeCompare(b.name));

      let response = `# Traxion Design System Components\n\n`;
      response += `Found ${components.length} components:\n\n`;

      for (const comp of components) {
        const tags = comp.tags.length > 0 ? comp.tags.join(', ') : '';
        const usedWith = comp.commonlyUsedWith && comp.commonlyUsedWith.length > 0
          ? comp.commonlyUsedWith.join(', ')
          : '';

        response += `- **${comp.name}** (\`${comp.slug}\`) — ${comp.description}\n`;
        if (tags || usedWith) {
          const parts: string[] = [];
          if (tags) parts.push(`Tags: ${tags}`);
          if (usedWith) parts.push(`Used with: ${usedWith}`);
          response += `  ${parts.join(' · ')}\n`;
        }
      }

      response += `---\n\n`;
      response += `**Tip:** Use \`get_component("slug")\` to see detailed docs, props, and examples.\n\n`;
      response += `**Installation:**\n\`\`\`bash\nnpm install @traxion-global/design-system\n\`\`\`\n`;

      return {
        content: [{ type: 'text' as const, text: response }],
      };
    }
  );
}
