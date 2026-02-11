import { McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { z } from 'zod';
import { ComponentRegistry } from '../registry.js';

export function registerGetComponentStories(server: McpServer, registry: ComponentRegistry): void {
  server.tool(
    'get_component_stories',
    'Get Storybook examples for a component with full source code',
    {
      slug: z.string().describe('Component slug (e.g., "checkbox", "dialog", "command")'),
      story_name: z.string().optional().describe('Filter to a specific story by name (e.g., "Controlled", "Basic")'),
    },
    async ({ slug, story_name }) => {
      const storyData = registry.getStories(slug);

      if (!storyData) {
        const available = registry.listComponentsWithStories();
        return {
          content: [{
            type: 'text' as const,
            text: `No stories found for "${slug}". Components with stories: ${available.join(', ')}`,
          }],
        };
      }

      let response = `# Storybook Examples — ${storyData.meta.component}\n\n`;

      // Component anatomy
      if (storyData.meta.anatomy) {
        response += `## Component Anatomy\n\n`;
        response += `\`\`\`tsx\n${storyData.meta.anatomy}\n\`\`\`\n\n`;
      }

      // Filter stories if story_name is provided
      const stories = story_name
        ? storyData.meta.stories.filter(s => s.name.toLowerCase() === story_name.toLowerCase())
        : storyData.meta.stories;

      if (stories.length === 0 && story_name) {
        const available = storyData.meta.stories.map(s => s.name);
        return {
          content: [{
            type: 'text' as const,
            text: `Story "${story_name}" not found for ${slug}. Available stories: ${available.join(', ')}`,
          }],
        };
      }

      response += `## Usage Examples\n\n`;
      response += `> **Note:** All examples use components imported from \`@traxion-global/design-system/react\`\n\n`;

      for (const story of stories) {
        response += `### ${story.name}\n\n`;
        response += `${story.description}\n\n`;

        if (story.tags.length > 0) {
          response += `**Tags:** ${story.tags.join(', ')}\n\n`;
        }

        const source = storyData.sources.get(story.sourceFile);
        if (source) {
          response += `\`\`\`tsx\n${source}\n\`\`\`\n\n`;
        } else {
          response += `*Source file not found: ${story.sourceFile}*\n\n`;
        }
      }

      response += `---\n\n`;
      response += `**💡 Remember:** Import components from the npm package:\n\n`;
      response += `\`\`\`tsx\n`;
      response += `import { ${storyData.meta.component} } from '@traxion-global/design-system/react';\n`;
      response += `\`\`\`\n`;

      return {
        content: [{ type: 'text' as const, text: response }],
      };
    }
  );
}
