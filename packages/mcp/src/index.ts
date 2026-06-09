#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ComponentRegistry } from './registry.js';
import { registerTools } from './tools/index.js';

// Initialize registry (reads from design-system package)
const registry = new ComponentRegistry();

// Create MCP server
const server = new McpServer({
  name: 'traxion-design-system',
  version: '0.16.0',
  description: 'MCP server for the Traxion Design System — serves components, tokens, and guidelines to AI assistants.',
});

// Register all tools
registerTools(server, registry);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[Traxion MCP] Server running on stdio');
}

main().catch((err) => {
  console.error('[Traxion MCP] Failed to start server:', err);
  process.exit(1);
});
