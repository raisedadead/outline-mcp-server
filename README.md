# outline-mcp

MCP server that connects Claude to your [Outline](https://www.getoutline.com/) wiki. Search, read, create, and manage documents directly from Claude Code.

## Features

- **Search** - Full-text search across all documents
- **Read** - Retrieve document content in markdown
- **Write** - Create and update documents programmatically
- **Organize** - Move documents between collections, archive/restore
- **Browse** - Navigate collections via MCP resources
- **Export** - Get clean markdown exports

## Quick Start

```bash
claude mcp add -e OUTLINE_BASE_URL=https://your-instance.com -e OUTLINE_API_KEY=ol_api_xxx -s user outline -- npx -y github:YOUR_ORG/outline-mcp
```

Restart Claude Code, then run `/mcp` to verify the connection.

### Get Your API Key

1. Open Outline > **Settings** > **API**
2. Click **Create API Key**
3. Copy the key (starts with `ol_api_`)

## Tools

### Documents

| Tool | Description |
|------|-------------|
| `outline_search` | Search documents by query |
| `outline_get_document` | Get document content by ID |
| `outline_list_documents` | List documents in a collection |
| `outline_create_document` | Create a new document |
| `outline_update_document` | Update existing document |
| `outline_move_document` | Move document between collections |
| `outline_delete_document` | Delete a document |
| `outline_archive_document` | Archive a document (soft delete) |
| `outline_unarchive_document` | Restore archived document |
| `outline_list_drafts` | List unpublished drafts |
| `outline_export_document` | Export as clean markdown |

### Collections

| Tool | Description |
|------|-------------|
| `outline_list_collections` | List all collections |
| `outline_get_collection` | Get collection details |
| `outline_create_collection` | Create a new collection |
| `outline_update_collection` | Update collection |
| `outline_delete_collection` | Delete collection |

## Resources

| URI | Description |
|-----|-------------|
| `outline://collections` | All collections |
| `outline://collections/{id}` | Collection with document list |
| `outline://documents/{id}` | Document content |

## Development

```bash
git clone https://github.com/YOUR_ORG/outline-mcp.git
cd outline-mcp
pnpm install && pnpm build

# Test locally
claude mcp add -e OUTLINE_BASE_URL=https://your-instance.com -e OUTLINE_API_KEY=ol_api_xxx -s user outline -- node $(pwd)/dist/index.js
```

## Server Management

```bash
claude mcp list            # List servers
claude mcp get outline     # Server details
claude mcp remove outline  # Remove server
```

## License

MIT
