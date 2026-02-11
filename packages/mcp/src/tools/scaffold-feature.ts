import { McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { z } from 'zod';
import { ComponentRegistry } from '../registry.js';

export function registerScaffoldFeature(server: McpServer, registry: ComponentRegistry): void {
  server.tool(
    'scaffold_feature',
    'Generate starter code for a feature using suggested components',
    {
      description: z.string().describe('Description of the feature to scaffold (e.g., "login form", "user profile card", "data table with filtering")'),
      components: z.array(z.string()).optional().describe('Specific component slugs to use (optional - will auto-suggest if not provided)'),
    },
    async ({ description, components: requestedComponents }) => {
      // Simple keyword matching to suggest components
      const keywords = description.toLowerCase();
      let suggestedComponents: string[] = [];

      if (requestedComponents && requestedComponents.length > 0) {
        suggestedComponents = requestedComponents;
      } else {
        // Auto-suggest based on keywords
        const allComponents = registry.listComponents();

        // Map common feature types to components
        if (keywords.includes('form') || keywords.includes('login') || keywords.includes('signup') || keywords.includes('register')) {
          suggestedComponents.push('input', 'label', 'button', 'card');
        }
        if (keywords.includes('table') || keywords.includes('data') || keywords.includes('list')) {
          suggestedComponents.push('table', 'badge');
        }
        if (keywords.includes('modal') || keywords.includes('dialog') || keywords.includes('popup')) {
          suggestedComponents.push('dialog', 'button');
        }
        if (keywords.includes('dropdown') || keywords.includes('menu')) {
          suggestedComponents.push('dropdown-menu', 'button');
        }
        if (keywords.includes('nav') || keywords.includes('navigation')) {
          suggestedComponents.push('accordion', 'dropdown-menu');
        }
        if (keywords.includes('card') || keywords.includes('profile')) {
          suggestedComponents.push('card', 'avatar', 'badge');
        }
        if (keywords.includes('tooltip') || keywords.includes('hint')) {
          suggestedComponents.push('tooltip');
        }
        if (keywords.includes('select') || keywords.includes('picker') || keywords.includes('choose')) {
          suggestedComponents.push('select', 'radio-group', 'checkbox');
        }
        if (keywords.includes('upload') || keywords.includes('file')) {
          suggestedComponents.push('file-drop-zone', 'button');
        }
        if (keywords.includes('calendar') || keywords.includes('date') || keywords.includes('picker')) {
          suggestedComponents.push('calendar', 'popover');
        }

        // Remove duplicates
        suggestedComponents = [...new Set(suggestedComponents)];

        // If no suggestions, provide a helpful message
        if (suggestedComponents.length === 0) {
          return {
            content: [{
              type: 'text' as const,
              text: `I couldn't auto-suggest components for "${description}". Please provide specific component slugs or use \`search_components()\` to find relevant components.`,
            }],
          };
        }
      }

      // Get component details
      const componentDetails = suggestedComponents
        .map(slug => registry.getComponent(slug))
        .filter(entry => entry !== undefined);

      if (componentDetails.length === 0) {
        return {
          content: [{
            type: 'text' as const,
            text: `None of the requested components were found. Available components: ${registry.listComponents().map(c => c.slug).join(', ')}`,
          }],
        };
      }

      // Build scaffold
      let response = `# Scaffold: ${description}\n\n`;
      response += `## Recommended Components\n\n`;

      const imports = componentDetails.map(c => c!.meta.name);
      response += `\`\`\`tsx\nimport { ${imports.join(', ')} } from '@traxion-global/design-system/react';\n\`\`\`\n\n`;

      response += `## Component Overview\n\n`;
      for (const entry of componentDetails) {
        response += `- **${entry!.meta.name}**: ${entry!.meta.description}\n`;
      }
      response += '\n';

      response += `## Example Implementation\n\n`;
      response += `\`\`\`tsx\nimport { ${imports.join(', ')} } from '@traxion-global/design-system/react';\n\n`;
      response += `export function ${toPascalCase(description)}() {\n`;
      response += `  return (\n`;
      response += `    <div className="p-4">\n`;
      response += `      {/* TODO: Implement your feature here using the components above */}\n`;
      response += `      {/* Use get_component("slug") for detailed props and examples */}\n`;
      response += `    </div>\n`;
      response += `  );\n`;
      response += `}\n\`\`\`\n\n`;

      response += `## Next Steps\n\n`;
      response += `1. Use \`get_component("slug")\` to see props and examples for each component\n`;
      response += `2. Compose the components together to build your feature\n`;
      response += `3. Remember to import from \`@traxion-global/design-system/react\`\n`;

      return {
        content: [{ type: 'text' as const, text: response }],
      };
    }
  );
}

function toPascalCase(str: string): string {
  return str
    .split(/[\s-_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
