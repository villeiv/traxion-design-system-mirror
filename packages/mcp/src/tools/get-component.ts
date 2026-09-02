import { McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { z } from 'zod';
import { ComponentRegistry, type ComponentRecommendation } from '../registry.js';

export function registerGetComponent(server: McpServer, registry: ComponentRegistry): void {
  server.tool(
    'get_component',
    'Get full details for a Traxion design system component including import guide, props, examples, and accessibility guidelines. Returns one representative story inline; use get_component_stories(slug, storyName) to retrieve additional story source code.',
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
      response += `**Tags:** ${entry.meta.tags.join(', ')}\n`;
      if (entry.meta.packageVersion) {
        response += `**Package Version:** ${entry.meta.packageVersion}\n`;
      }
      response += '\n';

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

      // Sections (generic structured documentation blocks)
      if (entry.meta.sections && entry.meta.sections.length > 0) {
        for (const section of entry.meta.sections) {
          response += `## ${section.title}\n\n`;
          if (!Array.isArray(section.blocks)) continue;
          for (const block of section.blocks) {
            switch (block.type) {
              case 'text':
                response += `${block.content}\n\n`;
                break;
              case 'code':
                response += `\`\`\`${block.language || ''}\n${block.content}\n\`\`\`\n\n`;
                break;
              case 'table':
                if (block.headers && block.rows) {
                  response += `| ${block.headers.join(' | ')} |\n`;
                  response += `|${block.headers.map(() => '---').join('|')}|\n`;
                  for (const row of block.rows) {
                    response += `| ${row.join(' | ')} |\n`;
                  }
                  response += '\n';
                }
                break;
              case 'list':
                if (block.items) {
                  for (const item of block.items) {
                    response += `- ${item}\n`;
                  }
                  response += '\n';
                }
                break;
            }
          }
        }
      }

      // Usage Examples — prefer stories with real source code over metadata examples
      const storyData = registry.getStories(slug);
      if (storyData && storyData.meta.stories.length > 0) {
        response += `## Usage Examples\n\n`;
        response += `> Import all components from \`@traxion-global/design-system/react\`\n\n`;

        if (storyData.meta.anatomy) {
          response += `### Component Anatomy\n\n`;
          response += `\`\`\`tsx\n${storyData.meta.anatomy}\n\`\`\`\n\n`;
        }

        // Render first story inline
        const firstStory = storyData.meta.stories[0];
        if (firstStory) {
          response += `### ${firstStory.name}\n\n`;
          if (firstStory.description) {
            response += `${firstStory.description}\n\n`;
          }
          const firstSource = storyData.sources.get(firstStory.sourceFile);
          if (firstSource) {
            response += `\`\`\`tsx\n${firstSource}\n\`\`\`\n\n`;
          }
        }

        // Summarize remaining stories
        const remainingStories = storyData.meta.stories.slice(1);
        if (remainingStories.length > 0) {
          response += `### More Examples\n\n`;
          for (const story of remainingStories) {
            response += `- **${story.name}**`;
            if (story.description) {
              response += ` — ${story.description}`;
            }
            response += '\n';
          }
          response += `\n> Use \`get_component_stories("${slug}", "StoryName")\` to get the full source for any example above.\n\n`;
        }
      }

      // Usage Recommendations
      if (entry.meta.recommendations && entry.meta.recommendations.length > 0) {
        const dos = entry.meta.recommendations.filter(r => r.type === 'do');
        const donts = entry.meta.recommendations.filter(r => r.type === 'dont');

        const renderGroup = (title: string, items: ComponentRecommendation[]): void => {
          if (items.length === 0) return;
          response += `### ${title}\n\n`;
          for (const item of items) {
            response += `- ${item.description}\n`;
            if (item.code) {
              response += `\n\`\`\`tsx\n${item.code}\n\`\`\`\n\n`;
            }
          }
          response += '\n';
        };

        if (dos.length > 0 || donts.length > 0) {
          response += `## Best Practices\n\n`;
          renderGroup('DO', dos);
          renderGroup("DON'T", donts);
        }
      }

      // Commonly Used With
      if (entry.meta.commonlyUsedWith && entry.meta.commonlyUsedWith.length > 0) {
        response += `## Commonly Used With\n\n`;
        for (const companion of entry.meta.commonlyUsedWith) {
          const companionEntry = registry.getComponent(companion);
          const companionName = companionEntry?.meta.name ?? companion;
          response += `- **${companionName}** — use \`get_component("${companion}")\` for details\n`;
        }
        response += '\n';
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
