# STATUS — frontend-nextjs

> Single source of truth for resuming work. Read this FIRST when starting a session.
> Last updated: 2026-08-11

---

## ✅ Done

- **Workspace**: pnpm workspace (`pnpm-workspace.yaml`) with `apps/*` + `packages/*`.
- **`packages/shadcn` (`@novacore/frontend-next-shadcn`)**: full phase-1 package.
  - Theme system: semantic tokens, 5 base palettes × 8 accent colors, light/dark/system, 7 named presets, override layer, `<AdminProvider>` (applies CSS vars to `<html>` client-side), `<ThemeCustomizer>`.
  - Primitives: Button, Input, Textarea, Label, Badge, Avatar, Card, Dialog, Popover, Tooltip, Tabs, Separator, Skeleton, Checkbox, Switch, Select, DropdownMenu.
  - Composed: SearchInput, PasswordInput, FormField/FormSection/FormActions, ConfirmDialog.
  - Admin: AdminLayout (responsive sidebar), AdminSidebar, AdminHeader, AdminPage/PageContainer/PageSection/PageHeader/Toolbar/ContentPanel, EmptyState/LoadingState/ErrorState/SkeletonList, StatusBadge, PermissionGate (contract-only), DataTable (sort/select/paginate, own contracts, `fromPaginatedResult()` bridges to `@novacore/frontend-foundation`'s `PaginatedResult`).
  - No underlying UI-library types leaked through public props (own interfaces throughout).
  - Build: `tsup --bundle=false` (1:1 src→dist, preserves per-file `"use client"`) + `scripts/postbuild-use-client.mjs` safety net + Tailwind CLI compiling `dist/styles.css` (package-owned CSS, consumers need zero Tailwind config).
  - Exports: `.`, `./theme`, `./forms`, `./data`, `./layout`, `./styles.css`.
  - Depends on `@novacore/frontend-foundation` via `file:../../../frontend-foundation` (sibling repo, not yet published).
- **`apps/playground` (`@novacore/playground`)**: App Router demo — `/`, `/components`, `/theme`, `/admin/dashboard`, `/admin/users` (AdminLayout + DataTable with dummy data).
- **Verified manually**: `pnpm build` (JS+DTS+CSS) succeeds, `tsc --noEmit` clean, playground `next build` succeeds (all routes static, no RSC/hydration errors), `next dev` serves all routes 200 with no console errors, screenshots confirm theme tokens/components/DataTable/ThemeCustomizer render correctly.

---

## 🚀 Next phase

**Goal:** Iterate based on user review of the phase-1 implementation (architecture/API/visuals may be adjusted).

### Acceptance criteria
1. User has reviewed `packages/shadcn` structure and playground pages and given feedback.
2. Any requested API/visual adjustments are applied.

### Open decisions
- Whether to add a no-flash SSR theme script (inline `<script>` in `<head>` reading a cookie/localStorage) to eliminate the light-theme flash before `<AdminProvider>` hydrates.
- Which composed/admin components to prioritize next (DatePicker, CurrencyInput, EntitySelect, schema-driven AdminForm, Command palette, Accordion, Calendar were explicitly deferred).
- Whether `style` variants (modern/soft/compact/minimal/sharp) need real per-component visual branching or stay a metadata-only hook for now.

---

## 📁 Active architecture

- **Stack:** pnpm workspace, Next.js 15 App Router, React 18, TypeScript, Tailwind v3 (compiled to a shipped CSS file, not a consumer dependency), Radix UI primitives (wrapped, not re-exported), class-variance-authority, tsup (bundle:false) for package builds.
- **Key packages:** `packages/shadcn` (UI implementation), `apps/playground` (demo consumer), external `@novacore/frontend-foundation` (framework/UI-agnostic utilities, consumed not modified).
- **Patterns:** own prop-type contracts (no leaking Radix/shadcn types), `"use client"` only on files that need it, semantic design tokens (`--nc-*` CSS vars) resolved from preset→config→overrides, DataTable pagination is 1-based to match backend `PaginatedResult`.

---

## ⚠️ External blockers (don't block coding)

- `@novacore/frontend-foundation` is consumed via a relative `file:` path since it isn't published — will need a registry or workspace restructure before this can be a real standalone deployable package.

---

## 🔧 Useful commands

```bash
pnpm install
pnpm --filter @novacore/frontend-next-shadcn build   # dist/ (JS + .d.ts + styles.css)
pnpm --filter @novacore/frontend-next-shadcn typecheck
pnpm dev:playground                                   # http://localhost:3000
pnpm --filter @novacore/playground build              # next build
```

---

## 📚 References (read IF needed)

- `.wolf/cerebrum.md` — User Preferences + Do-Not-Repeat + Decision Log
- `.wolf/anatomy.md` — token-efficient file index
- `.wolf/buglog.json` — known bugs + fixes
- `README.md` — full public-facing documentation of what was built
