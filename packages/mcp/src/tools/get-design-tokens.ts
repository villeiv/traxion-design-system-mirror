import { McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { z } from 'zod';
import { ComponentRegistry } from '../registry.js';

export function registerGetDesignTokens(server: McpServer, registry: ComponentRegistry): void {
  server.tool(
    'get_design_tokens',
    'Get design tokens (colors, radius, font). Omit category for all tokens.',
    {
      category: z.string().optional().describe('Specific token category: "colors", "radius", "font". Omit for all.'),
    },
    async ({ category }) => {
      const tokens = category
        ? registry.getTokenCategory(category)
        : registry.getTokens();

      if (!tokens || (typeof tokens === 'object' && Object.keys(tokens).length === 0)) {
        const allTokens = registry.getTokens();
        const availableCategories = Object.keys(allTokens);
        return {
          content: [{
            type: 'text' as const,
            text: `Token category "${category}" not found. Available categories: ${availableCategories.join(', ')}`,
          }],
        };
      }

      let response = `# Traxion Design Tokens${category ? ` — ${category}` : ''}\n\n`;
      response += `\`\`\`json\n${JSON.stringify(tokens, null, 2)}\n\`\`\`\n\n`;

      response += `## Usage Notes\n\n`;
      response += `- **Color values** use full \`hsl()\` CSS syntax (e.g., \`hsl(64 100% 44%)\`)  \n`;
      response += `- Values are valid CSS colors compatible with both **Tailwind v3** and **v4**  \n`;
      response += `- Opacity modifiers like \`bg-primary/50\` work via \`color-mix()\` in Tailwind v4  \n`;
      response += `- Import tokens from: \`@traxion-global/design-system/tokens.json\`\n\n`;

      response += `## Installation\n\n`;
      response += `\`\`\`bash\n`;
      response += `npm install @traxion-global/design-system\n`;
      response += `\`\`\`\n`;

      return {
        content: [{ type: 'text' as const, text: response }],
      };
    }
  );
}
