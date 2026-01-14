#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig, getConfigPath } from './config.js';
import { OutlineClient } from './outline-client.js';
import { registerTools } from './tools.js';
import { registerResources } from './resources.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
async function main() {
    // Load configuration
    const configPath = getConfigPath();
    const config = loadConfig(configPath);
    // Create Outline API client
    const client = new OutlineClient(config);
    // Create MCP server
    const server = new McpServer({
        name: packageJson.name,
        version: packageJson.version,
    });
    // Register tools and resources
    registerTools(server, client);
    registerResources(server, client);
    // Connect via stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    console.error('Failed to start outline-mcp-server:', error.message);
    if (error.stack) {
        console.error(error.stack);
    }
    process.exit(1);
});
//# sourceMappingURL=index.js.map