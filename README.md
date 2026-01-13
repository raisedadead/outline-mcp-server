# outline-mcp

MCP server for Outline wiki integration. Enables Claude to read, search, and manage documents in your Outline workspace.

## Installation

### For Claude Code Users

Add to your Claude Code MCP settings (`~/.claude/claude_code_config.json`):

```json
{
  "mcpServers": {
    "outline": {
      "command": "npx",
      "args": ["-y", "github:YOUR_ORG/outline-mcp"],
      "env": {
        "OUTLINE_BASE_URL": "https://your-outline-instance.com",
        "OUTLINE_API_KEY": "ol_api_xxx"
      }
    }
  }
}
```

Replace `YOUR_ORG/outline-mcp` with the actual GitHub repo path.

### Manual Installation

```bash
# Clone and install
git clone https://github.com/YOUR_ORG/outline-mcp.git
cd outline-mcp
npm install
npm run build

# Run
OUTLINE_BASE_URL="https://your-outline.com" \
OUTLINE_API_KEY="ol_api_xxx" \
node dist/index.js
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OUTLINE_BASE_URL` | Yes | Your Outline instance URL |
| `OUTLINE_API_KEY` | Yes | API key from Outline Settings > API |

### Config File (Optional)

You can also use a JSON config file:

```bash
node dist/index.js --config config.json
```

```json
{
  "outline": {
    "baseUrl": "https://your-outline-instance.com",
    "apiKey": "ol_api_xxx"
  }
}
```

Environment variables take precedence, config file values override them.

## Available Tools

| Tool | Description |
|------|-------------|
| `outline_search` | Search documents by query |
| `outline_get_document` | Get document content by ID |
| `outline_list_collections` | List all collections |
| `outline_list_documents` | List documents (optionally filtered) |
| `outline_create_document` | Create a new document |
| `outline_update_document` | Update an existing document |
| `outline_move_document` | Move document between collections |

## Available Resources

| Resource | URI |
|----------|-----|
| All Collections | `outline://collections` |
| Collection Details | `outline://collections/{id}` |
| Document Content | `outline://documents/{id}` |

## Getting Your API Key

1. Open your Outline instance
2. Go to **Settings** > **API**
3. Click **Create API Key**
4. Copy the key (starts with `ol_api_`)

## License

MIT
