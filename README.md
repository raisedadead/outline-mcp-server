# Outline Wiki MCP Server

[![npm version](https://img.shields.io/npm/v/outline-wiki-mcp)](https://www.npmjs.com/package/outline-wiki-mcp)
[![Docker](https://img.shields.io/badge/ghcr.io-outline--wiki--mcp-blue)](https://ghcr.io/raisedadead/outline-wiki-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-green.svg)](https://modelcontextprotocol.io)

A [Model Context Protocol](https://modelcontextprotocol.io) server for [Outline](https://www.getoutline.com/) wiki
integration. Enables LLM applications to search, read, create, and manage wiki documents through a standardized
interface.

Supports both **stdio** (for local tools like Claude Desktop, Claude Code) and **HTTP** transport (for remote clients
like Claude.ai web).

## Features

- **Full-text Search** - Find documents across your entire wiki
- **Document Management** - Create, read, update, delete, and move documents
- **Collection Organization** - Browse and manage document collections
- **Archive & Restore** - Soft-delete with archive/restore functionality
- **Draft Access** - Work with unpublished drafts
- **Markdown Export** - Export documents as clean markdown
- **MCP Resources** - Browse collections and documents via resource URIs
- **Dual Transport** - Run as a local stdio server or remote HTTP service

## Quick Start

### Prerequisites

- [Outline](https://www.getoutline.com/) instance (cloud or self-hosted)
- API key from Outline > **Settings** > **API** > **Create API Key**

## Installation

### npx (stdio)

Zero-install, runs locally via stdio transport:

```bash
OUTLINE_BASE_URL=https://your-instance.getoutline.com \
OUTLINE_API_KEY=ol_api_xxx \
npx -y outline-wiki-mcp
```

### Docker (HTTP)

Pull the pre-built image from GHCR and run in HTTP mode:

```bash
docker run -d \
  -p 3000:3000 \
  -e OUTLINE_BASE_URL=https://your-instance.getoutline.com \
  -e OUTLINE_API_KEY=ol_api_xxx \
  ghcr.io/raisedadead/outline-wiki-mcp:latest
```

The MCP endpoint will be available at `http://localhost:3000/mcp`.

### Docker Compose

Create a `.env` file with your credentials:

```bash
OUTLINE_BASE_URL=https://your-instance.getoutline.com
OUTLINE_API_KEY=ol_api_xxx
```

Then start the service:

```bash
docker compose up -d
```

The `docker-compose.yml` included in the repository:

```yaml
services:
  outline-wiki-mcp:
    image: ghcr.io/raisedadead/outline-wiki-mcp:latest
    build: .
    ports:
      - '${PORT:-3000}:3000'
    environment:
      - OUTLINE_BASE_URL=${OUTLINE_BASE_URL}
      - OUTLINE_API_KEY=${OUTLINE_API_KEY}
      - MCP_TRANSPORT=http
      - PORT=3000
    restart: unless-stopped
```

### From Source

```bash
git clone https://github.com/raisedadead/outline-wiki-mcp.git
cd outline-wiki-mcp
pnpm install
pnpm build
```

Run in stdio mode:

```bash
OUTLINE_BASE_URL=https://your-instance.getoutline.com \
OUTLINE_API_KEY=ol_api_xxx \
pnpm start
```

Run in HTTP mode:

```bash
OUTLINE_BASE_URL=https://your-instance.getoutline.com \
OUTLINE_API_KEY=ol_api_xxx \
pnpm start:http
```

## Client Configuration

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "outline": {
      "command": "npx",
      "args": ["-y", "outline-wiki-mcp"],
      "env": {
        "OUTLINE_BASE_URL": "https://your-instance.getoutline.com",
        "OUTLINE_API_KEY": "ol_api_xxx"
      }
    }
  }
}
```

### Claude Code CLI (stdio)

```bash
claude mcp add \
  -e OUTLINE_BASE_URL=https://your-instance.getoutline.com \
  -e OUTLINE_API_KEY=ol_api_xxx \
  -s user \
  outline -- npx -y outline-wiki-mcp
```

### Claude Code CLI (HTTP)

First start the server in HTTP mode (using Docker or npx), then add the remote endpoint:

```bash
claude mcp add -s user --transport http outline http://localhost:3000/mcp
```

### Claude.ai Web

Add as a remote MCP server in Claude.ai settings using the HTTP endpoint URL:

```
http://localhost:3000/mcp
```

Replace `localhost:3000` with your deployed server address.

### Generic MCP Client

**stdio transport:**

```json
{
  "mcpServers": {
    "outline": {
      "command": "npx",
      "args": ["-y", "outline-wiki-mcp"],
      "env": {
        "OUTLINE_BASE_URL": "https://your-instance.getoutline.com",
        "OUTLINE_API_KEY": "ol_api_xxx"
      }
    }
  }
}
```

**HTTP transport:**

```json
{
  "mcpServers": {
    "outline": {
      "transport": "http",
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

## Configuration

| Option    | CLI Flag      | Environment Variable | Default |
| --------- | ------------- | -------------------- | ------- |
| Transport | `--transport` | `MCP_TRANSPORT`      | `stdio` |
| Port      | `--port`      | `PORT`               | `3000`  |
| Base URL  | -             | `OUTLINE_BASE_URL`   | -       |
| API Key   | -             | `OUTLINE_API_KEY`    | -       |

A JSON config file can also be used for Outline credentials:

```bash
npx outline-wiki-mcp --config /path/to/config.json
```

```json
{
  "outline": {
    "baseUrl": "https://your-instance.getoutline.com",
    "apiKey": "ol_api_xxx"
  }
}
```

**Precedence rules:**

1. Config file values override environment variables for Outline credentials
2. CLI flags (`--transport`, `--port`) override environment variables
3. Environment variables (`MCP_TRANSPORT`, `PORT`) override defaults

## Tools

### Document Operations

| Tool                         | Description                             |
| ---------------------------- | --------------------------------------- |
| `outline_search`             | Full-text search across all documents   |
| `outline_get_document`       | Retrieve document content by ID         |
| `outline_list_documents`     | List documents in a collection          |
| `outline_create_document`    | Create a new document                   |
| `outline_update_document`    | Update an existing document             |
| `outline_move_document`      | Move document to a different collection |
| `outline_delete_document`    | Permanently delete a document           |
| `outline_archive_document`   | Archive a document (soft delete)        |
| `outline_unarchive_document` | Restore an archived document            |
| `outline_list_drafts`        | List all unpublished drafts             |
| `outline_export_document`    | Export document as clean markdown       |

### Collection Operations

| Tool                        | Description                  |
| --------------------------- | ---------------------------- |
| `outline_list_collections`  | List all collections         |
| `outline_get_collection`    | Get collection details by ID |
| `outline_create_collection` | Create a new collection      |
| `outline_update_collection` | Update collection properties |
| `outline_delete_collection` | Delete a collection          |

## Resources

Browse your wiki structure using MCP resource URIs:

| URI Pattern                  | Description                       |
| ---------------------------- | --------------------------------- |
| `outline://collections`      | List all collections              |
| `outline://collections/{id}` | Collection details with documents |
| `outline://documents/{id}`   | Document content in markdown      |

## Development

| Command        | Description        |
| -------------- | ------------------ |
| `pnpm install` | Install deps       |
| `pnpm build`   | Compile TypeScript |
| `pnpm dev`     | Watch mode         |
| `pnpm test`    | Run tests          |
| `pnpm lint`    | Type-check         |

### Running Locally

```bash
# stdio mode (default)
OUTLINE_BASE_URL=https://your-instance.getoutline.com \
OUTLINE_API_KEY=ol_api_xxx \
pnpm start

# HTTP mode
OUTLINE_BASE_URL=https://your-instance.getoutline.com \
OUTLINE_API_KEY=ol_api_xxx \
pnpm start:http
```

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, testing guidelines, and commit
conventions.

## License

MIT - see [LICENSE](LICENSE)

## Links

- [Outline](https://www.getoutline.com/) - Knowledge base for teams
- [Outline API](https://www.getoutline.com/developers) - API reference
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP specification
- [MCP Servers](https://github.com/modelcontextprotocol/servers) - Reference implementations
