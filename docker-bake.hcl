variable "TAG" {
  default = "latest"
}

variable "REGISTRY" {
  default = "ghcr.io"
}

variable "REPO" {
  default = "raisedadead/outline-wiki-mcp"
}

group "default" {
  targets = ["local"]
}

target "docker-metadata-action" {}

target "_base" {
  context    = "."
  dockerfile = "Dockerfile"
  labels = {
    "org.opencontainers.image.title"         = "outline-wiki-mcp"
    "org.opencontainers.image.description"   = "MCP server for Outline wiki integration"
    "org.opencontainers.image.url"           = "https://github.com/raisedadead/outline-wiki-mcp"
    "org.opencontainers.image.source"        = "https://github.com/raisedadead/outline-wiki-mcp"
    "org.opencontainers.image.documentation" = "https://github.com/raisedadead/outline-wiki-mcp#readme"
    "org.opencontainers.image.licenses"      = "MIT"
    "org.opencontainers.image.vendor"        = "Mrugesh Mohapatra"
    "org.opencontainers.image.authors"       = "Mrugesh Mohapatra"
  }
}

target "local" {
  inherits = ["_base"]
  tags     = ["${REPO}:${TAG}"]
  output   = ["type=docker"]
}

target "ci" {
  inherits   = ["_base", "docker-metadata-action"]
  platforms  = ["linux/amd64", "linux/arm64"]
  cache-from = ["type=gha"]
  cache-to   = ["type=gha,mode=max"]
  output     = ["type=registry"]
}
