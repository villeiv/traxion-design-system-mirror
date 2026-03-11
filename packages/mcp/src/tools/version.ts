import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ComponentRegistry } from '../registry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MCP_VERSION = '0.11.1';

export function registerVersion(server: McpServer, registry: ComponentRegistry): void {
  server.tool(
    'version',
    'ALWAYS call this tool first at the start of any session that uses the Traxion design system, before calling list_components or any other tool. Returns the MCP server version, design system registry version, and component stats.',
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
      response += `| **Design system version (registry)** | \`${dsVersion}\` |\n`;
      response += `| **Components loaded** | ${components.length} |\n`;
      response += `| **Components with stories** | ${storyCount} |\n`;

      response += `\n---\n\n`;
      response += `## Required Next Steps\n\n`;
      response += `Complete these steps before calling \`list_components\` or writing any code:\n\n`;
      response += `**1. Check installed version in the user's project:**\n`;
      response += `\`\`\`bash\nnpm list @traxion-global/design-system --depth=0\n\`\`\`\n\n`;
      response += `**2. Compare with the registry version above (\`${dsVersion}\`).**\n\n`;
      response += `**3. If versions differ — STOP. You must ask the user before doing anything else.**\n`;
      response += `Do NOT decide on your own to proceed with either version. Do NOT auto-update. `;
      response += `Tell the user exactly which version is installed and which is in the registry, then ask: `;
      response += `*"Would you like to update to X.Y.Z, or continue working against A.B.C?"* `;
      response += `Wait for their answer. This package is on \`0.x.y\` — minor bumps may contain breaking changes, so the user must decide.\n`;
      response += `- If they say **update**: call \`install_design_system({ projectPath: "<path>" })\`.\n`;
      response += `- If they say **keep current**: note which version you are working against and continue.\n\n`;
      response += `**4. Proceed:** Call \`list_components()\` only after the user has explicitly chosen which version to work against.\n\n`;
      response += `> For the full session protocol, call \`get_guideline("workflow")\`.\n`;

      return {
        content: [{ type: 'text' as const, text: response }],
      };
    }
  );
}
