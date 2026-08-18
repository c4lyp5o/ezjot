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
    apk add --no-cache curl tzdata

# Set timezone data
ENV TZ=Asia/Kuala_Lumpur
ENV NODE_ENV=production

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

# Expose your server port
EXPOSE 5000

# Add a health check to ensure the container is running properly
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/v1/healthcheck || exit 1

# Start your app
CMD ["bun", "start"]
