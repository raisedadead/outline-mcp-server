FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# ---

FROM base AS build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts
COPY src/ src/
COPY tsconfig.json ./
RUN pnpm run build

# ---

FROM base AS prod-deps

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --ignore-scripts

# ---

FROM node:24-slim

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs app

WORKDIR /app

COPY --link --from=prod-deps /app/node_modules ./node_modules
COPY --link --from=build /app/dist ./dist
COPY --link package.json ./

ENV NODE_ENV=production
ENV MCP_TRANSPORT=http
ENV PORT=3000

EXPOSE 3000

USER app

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r=>{if(!r.ok)throw r;process.exit(0)}).catch(()=>process.exit(1))"

CMD ["node", "dist/index.js"]
