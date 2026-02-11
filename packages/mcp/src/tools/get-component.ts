import { McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { z } from 'zod';
import { ComponentRegistry } from '../registry.js';

export function registerGetComponent(server: McpServer, registry: ComponentRegistry): void {
  server.tool(
    'get_component',
    'Get full details for a Traxion design system component including import guide, props, examples, and accessibility guidelines.',
    {
      slug: z.string().describe('Component slug (e.g., "button", "input", "card", "dialog")'),
      include_source: z.boolean().optional().describe('Whether to include the full TSX source code (default: false)'),
    },
    async ({ slug, include_source }) => {
      const entry = registry.getComponent(slug);

      if (!entry) {
        return {
          content: [{
            type: 'text' as const,
            text: `Component "${slug}" not found. Available components: ${registry.listComponents().map(c => c.slug).join(', ')}`,
          }],
        };
      }

      // Build response with npm import guide (NOT source code by default)
      let response = `# ${entry.meta.name}\n\n`;
      response += `${entry.meta.description}\n\n`;
      response += `**Category:** ${entry.meta.category}\n`;
      response += `**Tags:** ${entry.meta.tags.join(', ')}\n\n`;

      // Installation & Import (NEW - emphasize npm package usage)
      response += `## Installation\n\n`;
      response += `\`\`\`bash\n`;
      response += `npm install @traxion-global/design-system\n`;
      response += `\`\`\`\n\n`;

      response += `## Import\n\n`;
      response += `\`\`\`tsx\n`;
      response += `import { ${entry.meta.name} } from '@traxion-global/design-system/react';\n`;
      response += `\`\`\`\n\n`;

      // Props table
      response += `## Props\n\n`;
      if (entry.meta.props.length > 0) {
        response += `| Prop | Type | Default | Description |\n`;
        response += `|------|------|---------|-------------|\n`;
        for (const prop of entry.meta.props) {
          response += `| \`${prop.name}\` | \`${prop.type}\` | \`${prop.default}\` | ${prop.description} |\n`;
        }
      } else {
        response += `*This component has no custom props beyond standard HTML attributes.*\n`;
      }
      response += '\n';

      // Accessibility
      response += `## Accessibility\n\n`;
      response += `- **Role:** ${entry.meta.accessibility.role}\n`;
      response += `- **Keyboard:** ${entry.meta.accessibility.keyboard}\n`;
      response += `- **ARIA:** ${entry.meta.accessibility.aria}\n`;
      if (entry.meta.accessibility.notes) {
        response += `- **Notes:** ${entry.meta.accessibility.notes}\n`;
      }
      response += '\n';

      // Usage Examples
      response += `## Usage Examples\n\n`;
      for (const example of entry.meta.examples) {
        response += `### ${example.title}\n\n`;
        response += `\`\`\`tsx\n${example.code}\n\`\`\`\n\n`;
      }

      // Usage Recommendations
      if (entry.meta.recommendations && entry.meta.recommendations.length > 0) {
        response += `## Best Practices\n\n`;
        for (const rec of entry.meta.recommendations) {
          const label = rec.type === 'do' ? '✅ DO' : "❌ DON'T";
          response += `### ${label}\n\n`;
          response += `${rec.description}\n\n`;
          if (rec.code) {
            response += `\`\`\`tsx\n${rec.code}\n\`\`\`\n\n`;
          }
        }
      }

      // Dependencies
      if (entry.meta.dependencies.length > 0 || entry.meta.peerDependencies.length > 0) {
        response += `## Dependencies\n\n`;
        if (entry.meta.dependencies.length > 0) {
          response += `**Dependencies:** ${entry.meta.dependencies.join(', ')}\n\n`;
        }
        if (entry.meta.peerDependencies.length > 0) {
          response += `**Peer Dependencies:** ${entry.meta.peerDependencies.join(', ')}\n\n`;
        }
      }

      // Storybook examples summary
      const storyData = registry.getStories(slug);
      if (storyData) {
        response += `## Storybook Examples\n\n`;
        if (storyData.meta.anatomy) {
          response += `### Component Anatomy\n\n`;
          response += `\`\`\`tsx\n${storyData.meta.anatomy}\n\`\`\`\n\n`;
        }
        response += `${storyData.meta.stories.length} usage example${storyData.meta.stories.length === 1 ? '' : 's'} available. Use \`get_component_stories("${slug}")\` for full source code.\n\n`;
        for (const story of storyData.meta.stories) {
          response += `- **${story.name}**: ${story.description}\n`;
        }
        response += '\n';
      }

      // Source code (only if explicitly requested)
      if (include_source) {
        response += `## Source Code\n\n`;
        response += `> **Note:** This is for reference only. Always import from the npm package, not copy this code.\n\n`;
        response += `\`\`\`tsx\n${entry.source}\n\`\`\`\n`;
      }

      return {
        content: [{ type: 'text' as const, text: response }],
      };
    }
  );
}
