# ez standard Dockerfile: a build stage for the frontend bundle, then an Alpine
# runtime that runs as the unprivileged `bun` user (uid 1000) with a wget
# healthcheck. Keep the Bun version in step with `bun-version` in .github/workflows.

# ---- build: frontend bundle ----
FROM oven/bun:1.4.5-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/bun.lock ./frontend/
RUN cd frontend && bun install --frozen-lockfile
COPY package.json ./
COPY frontend ./frontend
RUN cd frontend && bun run build

# ---- runtime ----
FROM oven/bun:1.4.5-alpine
ARG APP_VERSION=dev
LABEL org.opencontainers.image.title="ezjot" \
	org.opencontainers.image.source="https://github.com/c4lyp5o/ezjot" \
	org.opencontainers.image.licenses="MIT" \
	org.opencontainers.image.version="$APP_VERSION"
RUN apk add --no-cache tzdata
ENV TZ=Asia/Kuala_Lumpur \
	NODE_ENV=production \
	HOST=0.0.0.0 \
	PORT=5000
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile --ignore-scripts
COPY backend ./backend
COPY --from=build /app/public ./public
RUN mkdir -p /app/db /app/logs && chown -R bun:bun /app/db /app/logs
USER bun
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --start-interval=2s --retries=3 \
	CMD wget -qO- "http://127.0.0.1:${PORT}/api/v1/healthcheck" >/dev/null || exit 1
CMD ["bun", "backend/index.js"]
