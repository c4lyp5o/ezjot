# Changelog

All notable changes to ezjot are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org).

## [Unreleased]

## [2.1.1] - 2026-11-22

### Changed
- The Docker image follows the ez standard: Alpine, runs as the unprivileged `bun` user (uid 1000), and a `HEALTHCHECK` that reports healthy within seconds of start.
- CI is two workflows, `test.yml` and `publish.yml`. Merging to `master` publishes `:<version>`, `:latest` and `:sha-<commit>` after the tests (and an image boot check) pass; a `vX.Y.Z` tag is optional and adds a GitHub Release.
- The weekly purge runs inside the app (Saturday 03:00) instead of a root cron, so the container no longer starts as root. Docker installs use the frozen lockfile.
- `test.yml` now gates publishing; before, an image could publish while the tests were still running.
- Header, sidebar and sign-in use the shared ez `Brand`: the ez icon and the lowercase name.
- Dependencies updated (majors kept only where the tests passed), Docker image on oven/bun 1.4.5, Biome as the linter, and the shared ez favicon.

## [2.1.0]

Baseline for this changelog. See the git history for earlier changes.
