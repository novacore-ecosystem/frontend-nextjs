# OpenWolf

@.wolf/OPENWOLF.md

This project uses OpenWolf for context management. Read and follow .wolf/OPENWOLF.md every session. Check .wolf/cerebrum.md before generating code. Check .wolf/anatomy.md before reading files.


# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

This repository (`frontend-admin-nextjs`) is currently an empty scaffold. It has:
- A pnpm monorepo root (`package.json`, `packageManager: pnpm@10.15.0`) with no real scripts defined yet.
- `apps/playground/` — empty, presumably intended for a Next.js app.
- `packages/shadcn/` — empty, presumably intended for a shared shadcn/ui component package.
- No lockfile, no framework config, no source files, and no tests yet.

## Working here

Since there is no established structure, don't assume Next.js/shadcn conventions until they're actually scaffolded in this repo. When code is added:
- Update this file with real build/lint/test commands (check root and per-package `package.json` scripts).
- Document the monorepo workspace layout (likely pnpm workspaces linking `apps/*` and `packages/*`) once `pnpm-workspace.yaml` exists.
- Re-run `/init` or update this section once `apps/playground` and `packages/shadcn` have actual content.
