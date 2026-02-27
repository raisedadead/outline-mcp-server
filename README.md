# Outline Wiki MCP Server

[![npm version](https://img.shields.io/npm/v/outline-wiki-mcp)](https://www.npmjs.com/package/outline-wiki-mcp)
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

### Local (stdio) - Claude Desktop / Claude Code

Add to your MCP client configuration:

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

### Remote (HTTP) - Claude.ai Web

Run the server in HTTP mode and connect from any remote MCP client:

```bash
OUTLINE_BASE_URL=https://your-instance.getoutline.com \
OUTLINE_API_KEY=ol_api_xxx \
npx outline-wiki-mcp --transport http
```

The MCP endpoint will be available at `http://localhost:3000/mcp`.

### Docker

```bash
docker compose up -d
```

Provide your credentials via a `.env` file or environment variables:

```bash
OUTLINE_BASE_URL=https://your-instance.getoutline.com
OUTLINE_API_KEY=ol_api_xxx
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

Config file values take precedence over environment variables. CLI flags take precedence over environment variables for
transport settings.

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

```bash
pnpm install        # Install dependencies
pnpm build          # Compile TypeScript
pnpm dev            # Watch mode
pnpm test           # Run tests
pnpm lint           # Type-check
```

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
