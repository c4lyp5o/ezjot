# Changelog

All notable changes to ezjot are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org).

## [Unreleased]

## [2.2.0] - 2026-11-22

### Upgrading
Everything now lives in one folder, `/data` (`DATA_DIR`): `ezjot.sqlite` and `logs/`.

1. Stop the container.
2. Move `ezjot.sqlite` from your old `/app/db` volume into one host folder.
3. Mount it as `- ./ezjot-data:/data` and start it.

If you skip this, the app keeps using the old database and logs a warning, so nothing is lost.

### Changed
- All state lives under one folder, `DATA_DIR` (`/data` in the image, `data/` when run from source), declared as a Docker volume. See **Upgrading**.
- The Docker image follows the ez standard: Alpine, runs as the unprivileged `bun` user (uid 1000), and a `HEALTHCHECK` that reports healthy within seconds of start.
- CI is two workflows, `test.yml` and `publish.yml`. Merging to `master` publishes `:<version>`, `:latest` and `:sha-<commit>` after the tests (and an image boot check) pass; a `vX.Y.Z` tag is optional and adds a GitHub Release.
- Every push to `development` publishes `:development` and `:sha-<commit>` after the tests, so unreleased changes can be tried without touching `master`.
- The weekly purge runs inside the app (Saturday 03:00) instead of a root cron, so the container no longer starts as root. Docker installs use the frozen lockfile.
- `test.yml` now gates publishing; before, an image could publish while the tests were still running.
- Header, sidebar and sign-in use the shared ez `Brand`: the ez icon and the lowercase name.
- Dependencies updated (majors kept only where the tests passed), Docker image on oven/bun 1.4.5, Biome as the linter, and the shared ez favicon.

## [2.1.0]

Baseline for this changelog. See the git history for earlier changes.
