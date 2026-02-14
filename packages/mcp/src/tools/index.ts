import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ComponentRegistry } from '../registry.js';
import { registerListComponents } from './list-components.js';
import { registerGetComponent } from './get-component.js';
import { registerSearchComponents } from './search-components.js';
import { registerGetComponentStories } from './get-component-stories.js';
import { registerGetDesignTokens } from './get-design-tokens.js';
import { registerGetGuideline } from './get-guideline.js';
import { registerScaffoldFeature } from './scaffold-feature.js';
import { registerValidateUsage } from './validate-usage.js';
import { registerSuggestComponents } from './suggest-components.js';
import { registerInstallDesignSystem } from './install-design-system.js';

export function registerTools(server: McpServer, registry: ComponentRegistry): void {
  // Existing tools (from POC)
  registerListComponents(server, registry);
  registerGetComponent(server, registry);
  registerSearchComponents(server, registry);
  registerGetComponentStories(server, registry);
  registerGetDesignTokens(server, registry);
  registerGetGuideline(server, registry);

  // New smart tools (monorepo additions)
  registerScaffoldFeature(server, registry);
  registerValidateUsage(server, registry);
  registerSuggestComponents(server, registry);
  registerInstallDesignSystem(server, registry);
}
