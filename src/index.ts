#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { loadConfig, getConfigPath, getTransportConfig } from './config.js';
import { OutlineClient } from './outline-client.js';
import { registerTools } from './tools.js';
import { registerResources } from './resources.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
) as { name: string; version: string };

async function main(): Promise<void> {
  // Load configuration
  const configPath = getConfigPath();
  const config = loadConfig(configPath);
  const transportConfig = getTransportConfig();

  // Create Outline API client
  const client = new OutlineClient(config);

  if (transportConfig.transport === 'stdio') {
    await startStdio(client);
  } else {
    await startHttp(client, transportConfig.port);
  }
}

async function startStdio(client: OutlineClient): Promise<void> {
  const server = new McpServer({
    name: packageJson.name,
    version: packageJson.version,
  });

  registerTools(server, client);
  registerResources(server, client);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

async function startHttp(client: OutlineClient, port: number): Promise<void> {
  const sessions = new Map<
    string,
    { transport: StreamableHTTPServerTransport; server: McpServer }
  >();

  function createSession(): StreamableHTTPServerTransport {
    const server = new McpServer({
      name: packageJson.name,
      version: packageJson.version,
    });
    registerTools(server, client);
    registerResources(server, client);

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      enableJsonResponse: true,
      onsessioninitialized: (sessionId: string) => {
        sessions.set(sessionId, { transport, server });
      },
      onsessionclosed: (sessionId: string) => {
        const entry = sessions.get(sessionId);
        if (entry) {
          void entry.server.close();
          sessions.delete(sessionId);
        }
      },
    });

    void server.connect(transport);
    return transport;
  }

  const httpServer = createServer(async (req, res) => {
    const url = new URL(
      req.url ?? '/',
      `http://${req.headers.host ?? 'localhost'}`
    );

    if (url.pathname === '/health' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    if (url.pathname === '/mcp') {
      const sessionId = req.headers['mcp-session-id'] as string | undefined;

      if (sessionId) {
        const entry = sessions.get(sessionId);
        if (entry) {
          await entry.transport.handleRequest(req, res);
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              jsonrpc: '2.0',
              error: { code: -32000, message: 'Session not found' },
              id: null,
            })
          );
        }
        return;
      }

      const transport = createSession();
      await transport.handleRequest(req, res);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  });

  httpServer.listen(port, () => {
    console.log(`Outline Wiki MCP server (HTTP) listening on port ${port}`);
    console.log(`  MCP endpoint: http://localhost:${port}/mcp`);
    console.log(`  Health check: http://localhost:${port}/health`);
  });

  const shutdown = async () => {
    console.log('\nShutting down...');
    const closing = [...sessions.values()].map(({ transport, server }) =>
      transport.close().then(() => server.close())
    );
    await Promise.all(closing);
    httpServer.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((error: Error) => {
  console.error('Failed to start outline-wiki-mcp:', error.message);
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
});
