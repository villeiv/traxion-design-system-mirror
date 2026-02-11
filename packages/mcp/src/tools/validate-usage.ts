import { McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { z } from 'zod';
import { ComponentRegistry } from '../registry.js';

export function registerValidateUsage(server: McpServer, registry: ComponentRegistry): void {
  server.tool(
    'validate_usage',
    'Validate TypeScript/TSX code for correct design system usage',
    {
      code: z.string().describe('TypeScript/TSX code to validate'),
    },
    async ({ code }) => {
      const issues: string[] = [];
      const suggestions: string[] = [];

      // Check for correct import pattern
      const designSystemImportRegex = /@traxion-global\/design-system(\/react)?/g;
      const hasCorrectImport = designSystemImportRegex.test(code);

      if (!hasCorrectImport) {
        // Check if code is trying to use components without imports
        const allComponents = registry.listComponents();
        for (const comp of allComponents) {
          const componentUsageRegex = new RegExp(`<${comp.name}[\s>]`, 'g');
          if (componentUsageRegex.test(code)) {
            issues.push(`❌ Component \`${comp.name}\` is used but not imported from @traxion-global/design-system/react`);
            suggestions.push(`Add: import { ${comp.name} } from '@traxion-global/design-system/react';`);
          }
        }
      }

      // Check for incorrect import patterns (copying source code)
      const localImportRegex = /import\s+{[^}]+}\s+from\s+['"]\.\/components\//g;
      if (localImportRegex.test(code)) {
        issues.push(`❌ Using local component imports instead of npm package`);
        suggestions.push(`Replace local imports with: import { ... } from '@traxion-global/design-system/react';`);
      }

      // Check for copied component definitions
      const componentDefinitionRegex = /export\s+(function|const)\s+([A-Z][a-zA-Z]+)\s*=/g;
      const matches = code.matchAll(componentDefinitionRegex);
      for (const match of matches) {
        const componentName = match[2];
        const existingComp = registry.listComponents().find(c => c.name === componentName);
        if (existingComp) {
          issues.push(`⚠️ Component \`${componentName}\` appears to be redefined - should be imported from package`);
          suggestions.push(`Use: import { ${componentName} } from '@traxion-global/design-system/react';`);
        }
      }

      // Check for proper className usage
      if (code.includes('className') && !code.includes('cn(')) {
        suggestions.push(`💡 Consider using the \`cn()\` utility for className merging: import { cn } from '@traxion-global/design-system';`);
      }

      // Build response
      let response = `# Validation Results\n\n`;

      if (issues.length === 0) {
        response += `✅ **No critical issues found!**\n\n`;
        response += `Your code appears to follow Traxion Design System best practices.\n\n`;
      } else {
        response += `## Issues Found (${issues.length})\n\n`;
        for (const issue of issues) {
          response += `${issue}\n`;
        }
        response += '\n';
      }

      if (suggestions.length > 0) {
        response += `## Suggestions\n\n`;
        for (const suggestion of suggestions) {
          response += `${suggestion}\n`;
        }
        response += '\n';
      }

      response += `## Best Practices\n\n`;
      response += `1. ✅ Always import components from \`@traxion-global/design-system/react\`\n`;
      response += `2. ✅ Never copy component source code into your project\n`;
      response += `3. ✅ Use the \`cn()\` utility for className merging\n`;
      response += `4. ✅ Follow component prop types and accessibility guidelines\n\n`;

      response += `**💡 Tip:** Use \`get_component("slug")\` to see proper usage examples.\n`;

      return {
        content: [{ type: 'text' as const, text: response }],
      };
    }
  );
}
