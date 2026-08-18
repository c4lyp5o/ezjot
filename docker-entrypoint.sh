#!/bin/sh
set -e

# Data dirs may come from a volume created by an older (root) image — make
# them writable by the app user no matter who owns them.
chown -R bun:bun /app/db /app/logs 2>/dev/null || true

# Weekly purge cron (busybox crond daemonizes).
crond -b -l 2

# Drop privileges and run the app (su-exec execs, so bun becomes PID 1 and
# receives signals directly — clean stops, no orphaned processes).
exec su-exec bun:bun /usr/local/bin/bun backend/index.js
