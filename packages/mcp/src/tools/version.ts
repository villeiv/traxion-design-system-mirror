import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ComponentRegistry } from '../registry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MCP_VERSION = '0.5.0';

export function registerVersion(server: McpServer, registry: ComponentRegistry): void {
  server.tool(
    'version',
    'Returns the current version of the Traxion MCP server, the design system package version, and registry stats (component count, story sets). Use this to confirm you are running the expected build.',
    {},
    async () => {
      // Read design-system version from its package.json
      const dsPackagePath = join(__dirname, '../../../design-system/package.json');
      let dsVersion = 'unknown';
      if (existsSync(dsPackagePath)) {
        try {
          const pkg = JSON.parse(readFileSync(dsPackagePath, 'utf-8')) as { version?: string };
          dsVersion = pkg.version ?? 'unknown';
        } catch {
          // leave as 'unknown'
        }
      }

      const components = registry.listComponents();
      const storyCount = registry.listComponentsWithStories().length;

      let response = `# Traxion MCP — Version Info\n\n`;
      response += `| | |\n`;
      response += `|---|---|\n`;
      response += `| **MCP server version** | \`${MCP_VERSION}\` |\n`;
      response += `| **Design system version** | \`${dsVersion}\` |\n`;
      response += `| **Components loaded** | ${components.length} |\n`;
      response += `| **Components with stories** | ${storyCount} |\n`;

      return {
        content: [{ type: 'text' as const, text: response }],
      };
    }
  );
}
