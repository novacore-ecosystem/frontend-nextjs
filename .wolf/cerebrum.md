# Cerebrum

> OpenWolf's learning memory. Updated automatically as the AI learns from interactions.
> Do not edit manually unless correcting an error.
> Last updated: 2026-08-11

## User Preferences

<!-- How the user likes things done. Code style, tools, patterns, communication. -->

## Key Learnings

- **Project:** frontend-nextjs — NovaCore Next.js UI ecosystem. `packages/shadcn` = `@novacore/frontend-next-shadcn`, `apps/playground` = demo consumer. Governed by a detailed system-prompt spec (see original mission) covering: hide shadcn/Radix/Tailwind entirely behind NovaCore's own contracts, per-file RSC client/server boundaries, ship precompiled CSS so consumers never touch Tailwind.
- `@novacore/frontend-foundation` (sibling repo at `../../frontend-foundation` relative to this repo's root, i.e. `FrontEnd/Common/frontend-foundation`) is framework/UI-agnostic — has `PaginatedResult`/`PAGINATION_DEFAULTS` (1-based `pageNumber`, canonical shape for every NovaCore backend list endpoint) and an `authorization` module (`Permission`, `hasPermission`, etc.). Consume it, never refactor it. Referenced via `"file:../../../frontend-foundation"` in `packages/shadcn/package.json` since it isn't published to a registry — not a pnpm workspace member (lives outside this repo's `pnpm-workspace.yaml` scope entirely).
- `tsup` + esbuild **strips `"use client"` directives** during bundling (`bundle: true`/code-splitting) because it's not part of the ECMAScript spec — esbuild treats the bare string-literal expression statement as dead code. Fix: `bundle: false` in tsup config so every source file transpiles 1:1 into `dist/` (no chunk merging), which preserves the directive per-file naturally. A `scripts/postbuild-use-client.mjs` safety net also exists (reads each `.js.map`'s `sources` to detect which compiled files trace back to a `"use client"` source file, and re-prepends the directive if missing) — currently patches 0 files since `bundle:false` already handles it, but keep it as a guard.
- Tailwind CSS variables for this package are prefixed `--nc-*` (not the bare `--background` etc. shadcn convention) to avoid colliding with a consuming app's own CSS variable names when the compiled `styles.css` is imported into the app's global scope.
- DataTable's own `DataTablePaginationState` uses `pageNumber` (1-based), matching `@novacore/frontend-foundation`'s `PaginatedResult` convention — do not use 0-based `pageIndex`, it would need a translation layer at every real API call site.

## Do-Not-Repeat

<!-- Mistakes made and corrected. Each entry prevents the same mistake recurring. -->
- [2026-08-11] First attempt bundled `packages/shadcn` with tsup's default (`bundle: true`, code-splitting, 5 barrel entry points). This merged client- and server-safe components into shared chunks and esbuild silently dropped every `"use client"` directive — the compiled package had *zero* `"use client"` markers anywhere, which would break RSC boundaries in the consuming Next.js app the moment a Server Component imported an interactive component (AdminLayout's `useState`, etc.) without its own client wrapper. Fixed by switching to `bundle: false` (one output file per source file) plus a sourcemap-based postbuild safety net. Always verify directive survival in `dist/` output directly (`head -c N dist/**/*.js`) after building any React component library with tsup/esbuild — don't assume it "just works".

## Decision Log

<!-- Significant technical decisions with rationale. Why X was chosen over Y. -->
- [2026-08-11] Theme resolution is done in JS (`resolveTheme()` → CSS custom properties applied via `AdminProvider`'s `useEffect`), not via static CSS classes per base×color combination. Rationale: a static approach would need 5 bases × 8 colors × 4 radii × N styles of prebuilt CSS variants (combinatorial explosion), whereas resolving in JS keeps `dist/styles.css` small (one token layer) and matches the spec's "Config → Resolved Theme → Semantic Tokens → CSS Variables" diagram exactly. Tradeoff: theme applies post-hydration (documented flash-of-default-theme limitation in README), no SSR no-flash script yet.
- [2026-08-11] DataTable was built from scratch (no TanStack Table dependency) specifically to guarantee zero underlying-table-library type leakage and to avoid pulling in a large new dependency for phase 1. Covers sorting, row selection, pagination, loading/empty/error states, bulk actions slot — no column resizing/reordering/virtualization yet.
- [2026-08-11] Package uses Tailwind v3 (not v4) for the CSS build — v3's PostCSS/CLI pipeline is simpler to point at a package's own `src/**/*.{ts,tsx}` and ship a static compiled `dist/styles.css`, which is the "package-owned CSS" requirement from the spec (consumers must not need Tailwind installed or configured).
