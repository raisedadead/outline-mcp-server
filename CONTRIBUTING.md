# Contributing

## Development Setup

```bash
git clone https://github.com/raisedadead/outline-wiki-mcp.git
cd outline-wiki-mcp
pnpm install
```

### Commands

| Command         | Description                   |
| --------------- | ----------------------------- |
| `pnpm build`    | Compile TypeScript to `dist/` |
| `pnpm dev`      | Watch mode for development    |
| `pnpm test`     | Run tests in watch mode       |
| `pnpm test:run` | Run tests once                |
| `pnpm lint`     | Type-check without emitting   |

### Testing Locally

```bash
pnpm build
claude mcp add -e OUTLINE_BASE_URL=https://your-instance.com -e OUTLINE_API_KEY=ol_api_xxx -s user outline -- node $(pwd)/dist/index.js
```

Restart Claude Code and run `/mcp` to verify.

## Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commits are validated by commitlint via
a git hook.

### Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

| Type       | Description                        | Release |
| ---------- | ---------------------------------- | ------- |
| `feat`     | New feature                        | Minor   |
| `fix`      | Bug fix                            | Patch   |
| `docs`     | Documentation only                 | None    |
| `style`    | Formatting, no code change         | None    |
| `refactor` | Code change, no new feature or fix | None    |
| `perf`     | Performance improvement            | Patch   |
| `test`     | Adding or updating tests           | None    |
| `build`    | Build system or dependencies       | None    |
| `ci`       | CI configuration                   | None    |
| `chore`    | Other changes                      | None    |

### Breaking Changes

For major version bumps, either:

- Add `!` after type: `feat!: remove deprecated API`
- Add footer: `BREAKING CHANGE: description`

### Examples

```bash
git commit -m "feat: add document export tool"
git commit -m "fix: handle pagination for large collections"
git commit -m "docs: update API key instructions"
git commit -m "feat!: change default permissions"
```

## Publishing

Releases are fully automated via [semantic-release](https://github.com/semantic-release/semantic-release).

### How It Works

1. Push commits to `main`
2. GitHub Actions analyzes commit messages
3. Version is determined automatically:
   - `fix:` commits trigger patch release (1.0.x)
   - `feat:` commits trigger minor release (1.x.0)
   - Breaking changes trigger major release (x.0.0)
4. CHANGELOG.md is updated
5. GitHub release is created with notes
6. Package is published to npm with provenance

### Authentication

Publishing uses npm OIDC trusted publishing:

- No npm tokens to manage or rotate
- Cryptographic provenance links package to source
- Configured via npm trusted publishers settings

### Manual Publishing

For the initial publish or emergencies:

```bash
pnpm build
npm publish --access public --provenance
```

## Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make changes with conventional commits
4. Run `pnpm test:run && pnpm lint`
5. Open a PR against `main`
