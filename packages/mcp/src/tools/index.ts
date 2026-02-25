import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ComponentRegistry } from '../registry.js';
import { registerListComponents } from './list-components.js';
import { registerGetComponent } from './get-component.js';
import { registerGetComponentStories } from './get-component-stories.js';
import { registerGetDesignTokens } from './get-design-tokens.js';
import { registerGetGuideline } from './get-guideline.js';
import { registerInstallDesignSystem } from './install-design-system.js';
import { registerVersion } from './version.js';

export function registerTools(server: McpServer, registry: ComponentRegistry): void {
  registerListComponents(server, registry);
  registerGetComponent(server, registry);
  registerGetComponentStories(server, registry);
  registerGetDesignTokens(server, registry);
  registerGetGuideline(server, registry);
  registerInstallDesignSystem(server, registry);
  registerVersion(server, registry);
}
