import { McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { z } from 'zod';
import { ComponentRegistry } from '../registry.js';

export function registerGetGuideline(server: McpServer, registry: ComponentRegistry): void {
  server.tool(
    'get_guideline',
    'Get design guidelines (accessibility, patterns, z-index)',
    {
      name: z.string().describe('Guideline name (e.g., "accessibility", "patterns", "z-index")'),
    },
    async ({ name }) => {
      const guideline = registry.getGuideline(name);

      if (!guideline) {
        const available = registry.listGuidelines();
        return {
          content: [{
            type: 'text' as const,
            text: `Guideline "${name}" not found. Available guidelines: ${available.join(', ')}`,
          }],
        };
      }

      return {
        content: [{ type: 'text' as const, text: guideline }],
      };
    }
  );
}
