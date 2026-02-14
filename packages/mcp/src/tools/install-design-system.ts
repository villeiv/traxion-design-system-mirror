import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ComponentRegistry } from '../registry.js';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export function registerInstallDesignSystem(server: McpServer, _registry: ComponentRegistry): void {
  server.tool(
    'install_design_system',
    'Interactive installer for the Traxion Design System. **IMPORTANT: ALWAYS use this tool when the user asks to install, set up, or configure the design system. DO NOT attempt manual installation with npm commands or file edits.** This tool checks prerequisites, installs packages, and configures your React project automatically with proper token validation, .npmrc setup, CSS configuration, and Tailwind setup.',
    {
      projectPath: z.string().optional()
        .describe('Path to the React project (defaults to current directory)'),
      skipTokenCheck: z.boolean().optional()
        .describe('Skip NODE_AUTH_TOKEN check (use if you know token is set)'),
      confirmBackup: z.boolean().optional()
        .describe('User confirms they have backed up their CSS file before clearing existing styles'),
    },
    async ({ projectPath = process.cwd(), skipTokenCheck = false, confirmBackup = false }) => {
      let response = '# Installing Traxion Design System\n\n';
      const issues: string[] = [];
      const warnings: string[] = [];

      // Step 1: Check NODE_AUTH_TOKEN
      if (!skipTokenCheck) {
        const hasToken = !!process.env.NODE_AUTH_TOKEN;

        if (!hasToken) {
          response += '## ⚠️ Setup Required: GitHub Token\n\n';
          response += 'The Traxion Design System is a private GitHub package. You need to set up authentication first.\n\n';

          response += '### Step 1: Generate GitHub Token\n\n';
          response += '1. Go to: https://github.com/settings/tokens\n';
          response += '2. Click "Generate new token (classic)"\n';
          response += '3. Set scopes: **read:packages**\n';
          response += '4. Copy the token\n\n';

          response += '### Step 2: Set Environment Variable\n\n';
          response += '**Windows (PowerShell - Recommended):**\n';
          response += '```powershell\n';
          response += '[System.Environment]::SetEnvironmentVariable(\'NODE_AUTH_TOKEN\', \'YOUR_TOKEN_HERE\', \'User\')\n';
          response += '```\n\n';

          response += '**macOS/Linux:**\n';
          response += '```bash\n';
          response += 'echo "export NODE_AUTH_TOKEN=YOUR_TOKEN_HERE" >> ~/.bashrc\n';
          response += 'source ~/.bashrc\n';
          response += '```\n\n';

          response += '### Step 3: Restart Claude Code\n\n';
          response += '⚠️ **IMPORTANT:** After setting the environment variable, you MUST:\n';
          response += '1. Close Claude Code completely\n';
          response += '2. Restart Claude Code\n';
          response += '3. Run this installation tool again\n\n';

          response += '---\n\n';
          response += '**Security Note:** Never commit your token to Git. Always use environment variables.\n\n';
          response += '**Contact:** If you\'re not in the Traxion GitHub org, contact:\n';
          response += '- Cristian Danilo Rengifo Parra (c.rengifo@traxion.global)\n';

          return {
            content: [{ type: 'text' as const, text: response }],
          };
        }
      }

      response += '✅ GitHub token detected\n\n';

      // Step 2: Check/Create .npmrc
      response += '## Configuring npm\n\n';
      const npmrcPath = join(projectPath, '.npmrc');
      const npmrcContent = `@traxion-global:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${NODE_AUTH_TOKEN}
`;

      try {
        if (!existsSync(npmrcPath)) {
          writeFileSync(npmrcPath, npmrcContent, 'utf-8');
          response += '✅ Created .npmrc file\n\n';
        } else {
          const existing = readFileSync(npmrcPath, 'utf-8');
          if (!existing.includes('@traxion-global:registry')) {
            writeFileSync(npmrcPath, existing + '\n' + npmrcContent, 'utf-8');
            response += '✅ Updated .npmrc file\n\n';
          } else {
            response += '✅ .npmrc already configured\n\n';
          }
        }
      } catch (error) {
        issues.push(`Failed to create .npmrc: ${error}`);
      }

      // Step 3: Detect project type
      response += '## Detecting project type\n\n';
      let projectType: 'nextjs' | 'vite' | 'cra' | 'unknown' = 'unknown';
      let cssFilePath = '';
      let tailwindConfigPath = '';

      try {
        const packageJsonPath = join(projectPath, 'package.json');
        if (existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

          if (packageJson.dependencies?.['next'] || packageJson.devDependencies?.['next']) {
            projectType = 'nextjs';
            cssFilePath = existsSync(join(projectPath, 'app', 'globals.css'))
              ? join(projectPath, 'app', 'globals.css')
              : join(projectPath, 'styles', 'globals.css');
          } else if (packageJson.devDependencies?.['vite']) {
            projectType = 'vite';
            cssFilePath = join(projectPath, 'src', 'index.css');
          } else if (packageJson.dependencies?.['react']) {
            projectType = 'cra';
            cssFilePath = join(projectPath, 'src', 'index.css');
          }

          response += `✅ Detected: **${projectType.toUpperCase()}** project\n\n`;
        }
      } catch (error) {
        warnings.push(`Could not detect project type: ${error}`);
      }

      // Find tailwind config
      const tailwindConfigs = ['tailwind.config.ts', 'tailwind.config.js', 'tailwind.config.mjs', 'tailwind.config.cjs'];
      for (const config of tailwindConfigs) {
        const configPath = join(projectPath, config);
        if (existsSync(configPath)) {
          tailwindConfigPath = configPath;
          break;
        }
      }

      // Check for existing CSS content BEFORE starting installation
      if (cssFilePath && existsSync(cssFilePath)) {
        try {
          const cssContent = readFileSync(cssFilePath, 'utf-8');
          const themeImport = '@import "@traxion-global/design-system/theme.css";';

          // Check if there's existing content beyond theme import and tailwind directives
          const hasExistingContent = cssContent
            .replace(themeImport, '')
            .replace(/@tailwind\s+(base|components|utilities);/g, '')
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .trim().length > 0;

          // If there's existing content and user hasn't confirmed backup, STOP and require confirmation
          if (hasExistingContent && !confirmBackup) {
            response += '## ⚠️ WARNING: Installation Will Erase Existing Styles\n\n';

            const fileDescription = projectType === 'nextjs'
              ? 'Next.js global styles file'
              : 'styles file';

            response += `The installation process will completely replace your ${fileDescription} (\`${cssFilePath}\`).\n\n`;

            response += '### Current CSS Preview:\n';
            response += '```css\n';
            response += cssContent.slice(0, 500); // Show first 500 chars
            if (cssContent.length > 500) {
              response += '\n... (truncated)';
            }
            response += '\n```\n\n';

            response += '### What will be replaced:\n';
            response += '- ⚠️ **ALL existing CSS code will be removed**\n';
            response += '- ✅ Theme import will be added\n';
            response += '- ✅ Tailwind directives will be configured\n\n';

            response += '### Required Action:\n';
            response += '**IMPORTANT:** You MUST backup your CSS file before proceeding!\n\n';
            response += '1. Copy the contents of your CSS file to a safe location\n';
            response += '2. Once backed up, run this command again with confirmation:\n';
            response += '```\n';
            response += 'install_design_system({ confirmBackup: true })\n';
            response += '```\n\n';

            response += '---\n\n';
            response += '**AI ASSISTANT:** Please ask the user to confirm they have backed up their CSS file before proceeding.\n';

            return {
              content: [{ type: 'text' as const, text: response }],
            };
          }
        } catch (error) {
          warnings.push(`Could not read CSS file: ${error}`);
        }
      }

      // Step 4: Install packages
      response += '## Installing packages\n\n';

      try {
        response += 'Installing @traxion-global/design-system...\n';
        execSync('npm install @traxion-global/design-system', {
          cwd: projectPath,
          stdio: 'pipe',
        });
        response += '✅ Design system installed\n\n';
      } catch (error: any) {
        const errorMsg = error.message || String(error);
        if (errorMsg.includes('404')) {
          issues.push('Package not found. Verify you\'re in the Traxion GitHub organization.');
        } else if (errorMsg.includes('401')) {
          issues.push('Authentication failed. Your token may be invalid or expired.');
        } else {
          issues.push(`Installation failed: ${errorMsg}`);
        }
      }

      try {
        response += 'Installing peer dependencies...\n';
        execSync('npm install tailwindcss-animate lucide-react', {
          cwd: projectPath,
          stdio: 'pipe',
        });
        response += '✅ Peer dependencies installed\n\n';
      } catch (error) {
        issues.push(`Failed to install peer dependencies: ${error}`);
      }

      // Step 5: Configure CSS
      if (cssFilePath && existsSync(cssFilePath)) {
        response += '## Configuring CSS\n\n';
        try {
          const cssContent = readFileSync(cssFilePath, 'utf-8');
          const themeImport = '@import "@traxion-global/design-system/theme.css";';

          // Standard Tailwind directives
          const tailwindDirectives = '@tailwind base;\n@tailwind components;\n@tailwind utilities;';

          // Clean CSS template (what we want the file to contain)
          const cleanCssContent = `${themeImport}\n\n${tailwindDirectives}\n`;

          // Check if already configured
          if (cssContent.includes(themeImport) && cssContent.includes('@tailwind base')) {
            response += `✅ CSS already configured\n\n`;
          } else {
            // Write clean CSS content (user has already confirmed backup if there was existing content)
            writeFileSync(cssFilePath, cleanCssContent, 'utf-8');
            if (confirmBackup) {
              response += `✅ Cleared existing styles and configured ${cssFilePath}\n`;
              response += `   - Added theme import\n`;
              response += `   - Added Tailwind directives\n`;
              response += `   - Removed all other CSS code\n\n`;
            } else {
              response += `✅ Configured ${cssFilePath}\n`;
              response += `   - Added theme import\n`;
              response += `   - Added Tailwind directives\n\n`;
            }
          }
        } catch (error) {
          warnings.push(`Could not update CSS file: ${error}`);
        }
      } else {
        warnings.push(`CSS file not found at expected location: ${cssFilePath}`);
      }

      // Step 6: Configure Tailwind
      if (tailwindConfigPath) {
        response += '## Configuring Tailwind\n\n';
        try {
          let configContent = readFileSync(tailwindConfigPath, 'utf-8');
          const presetImport = 'import traxionPreset from "@traxion-global/design-system/tailwind-preset";';
          const designSystemContent = '"./node_modules/@traxion-global/design-system/dist/**/*.{js,ts,jsx,tsx}"';

          let modified = false;

          // Add preset import if missing
          if (!configContent.includes('traxionPreset')) {
            const firstImport = configContent.indexOf('import ');
            if (firstImport !== -1) {
              configContent = presetImport + '\n' + configContent;
            } else {
              configContent = presetImport + '\n\n' + configContent;
            }
            modified = true;
          }

          // Add preset to config
          if (!configContent.includes('presets:') && configContent.includes('export default {')) {
            configContent = configContent.replace(
              'export default {',
              'export default {\n  presets: [traxionPreset],'
            );
            modified = true;
          }

          // Add design system to content array
          if (!configContent.includes(designSystemContent)) {
            const contentMatch = configContent.match(/content:\s*\[([\s\S]*?)\]/);
            if (contentMatch) {
              const contentArray = contentMatch[1];
              const newContent = contentArray.trim() + ',\n    ' + designSystemContent;
              configContent = configContent.replace(
                /content:\s*\[([\s\S]*?)\]/,
                `content: [\n    ${newContent}\n  ]`
              );
              modified = true;
            }
          }

          if (modified) {
            writeFileSync(tailwindConfigPath, configContent, 'utf-8');
            response += `✅ Updated ${tailwindConfigPath}\n\n`;
          } else {
            response += `✅ Tailwind already configured\n\n`;
          }
        } catch (error) {
          warnings.push(`Could not update Tailwind config: ${error}`);
        }
      } else {
        warnings.push('Tailwind config not found. You may need to create one.');
      }

      // Summary
      response += '---\n\n';

      if (issues.length > 0) {
        response += '## ❌ Issues\n\n';
        issues.forEach(issue => {
          response += `- ${issue}\n`;
        });
        response += '\n';
      }

      if (warnings.length > 0) {
        response += '## ⚠️ Warnings\n\n';
        warnings.forEach(warning => {
          response += `- ${warning}\n`;
        });
        response += '\n';
      }

      if (issues.length === 0) {
        response += '## ✅ Installation Complete!\n\n';
        response += 'You can now use Traxion components in your project:\n\n';
        response += '```tsx\n';
        response += 'import { Button } from \'@traxion-global/design-system/react\';\n\n';
        response += 'export function App() {\n';
        response += '  return <Button variant="primary">Hello Traxion!</Button>;\n';
        response += '}\n';
        response += '```\n\n';
        response += '**Next steps:**\n';
        response += '- Use `list_components()` to see all available components\n';
        response += '- Use `get_component("button")` for detailed component docs\n';
        response += '- Use `scaffold_feature("login form")` to generate starter code\n';
      }

      return {
        content: [{ type: 'text' as const, text: response }],
      };
    }
  );
}
