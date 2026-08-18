# Stage 1: Build the client
FROM oven/bun:1.2.13-alpine AS builder

WORKDIR /app

COPY client ./client
WORKDIR /app/client
RUN bun install && bun run build

# Stage 2: Production
FROM oven/bun:1.2.13-alpine

# Install for alpine
RUN apk update --no-cache && \
    apk add --no-cache curl tzdata su-exec

# Set timezone data
ENV TZ=Asia/Kuala_Lumpur
ENV NODE_ENV=production

# Run as the image's built-in non-root user (oven/bun ships `bun`, uid/gid 1000)

WORKDIR /app

# Install only production dependencies
COPY package.json bun.lock ./
RUN bun install --production

# Copy backend source code
COPY backend ./backend

# Copy built client files from the builder
COPY --from=builder /app/public /app/public

# Copy purge script (runs weekly via the container's cron)
COPY utils/purge.sh /etc/periodic/weekly/purge.sh
RUN chmod +x /etc/periodic/weekly/purge.sh

# Writable data dirs for the app user
RUN mkdir -p /app/db /app/logs && chown -R bun:bun /app/db /app/logs

# Expose your server port
EXPOSE 5000

# Add a health check to ensure the container is running properly
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/v1/healthcheck || exit 1

# Entrypoint fixes volume ownership, starts the weekly purge cron, then runs
# the app as the non-root user (busybox crond does not run by default in the
# oven/bun alpine image).
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
