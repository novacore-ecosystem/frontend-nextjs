# STATUS — frontend-nextjs

> Single source of truth for resuming work. Read this FIRST when starting a session.
> Last updated: 2026-08-12

---

## ✅ Done

- **Workspace**: pnpm workspace (`pnpm-workspace.yaml`) with `apps/*` + `packages/*`.
- **`packages/shadcn` (`@novacore/frontend-next-shadcn`)**: full phase-1 admin-facing package.
  - Theme system: semantic tokens, 5 base palettes × 8 accent colors, light/dark/system, 7 named presets, override layer, `<AdminProvider>` (applies CSS vars to `<html>` client-side), `<ThemeCustomizer>`.
  - Primitives: Button, Input, Textarea, Label, Badge, Avatar, Card, Dialog, Popover, Tooltip, Tabs, Separator, Skeleton, Checkbox, Switch, Select, DropdownMenu.
  - Composed: SearchInput, PasswordInput, FormField/FormSection/FormActions, ConfirmDialog.
  - Admin: AdminLayout (responsive sidebar), AdminSidebar, AdminHeader, AdminPage/PageContainer/PageSection/PageHeader/Toolbar/ContentPanel, EmptyState/LoadingState/ErrorState/SkeletonList, StatusBadge, PermissionGate (contract-only), DataTable (sort/select/paginate, own contracts, `fromPaginatedResult()` bridges to `@novacore/frontend-foundation`'s `PaginatedResult`).
  - Build: `tsup --bundle=false` + `scripts/postbuild-use-client.mjs` safety net + Tailwind CLI compiling `dist/styles.css`.
  - Exports: `.`, `./theme`, `./forms`, `./data`, `./layout`, `./styles.css`.
- **`packages/mui` (`@novacore/frontend-next-mui`)**: full phase-1 client-facing package (storefronts/marketing/product pages — deliberately not an admin-dashboard re-skin).
  - Theme system: semantic tokens, 8 named presets (ocean/indigo/emerald/sunset/rose/violet/slate/neutral, each bundling primary+secondary hue with a cool/warm neutral tone), light/dark/system, radius + density dimensions, override layer, `<ClientProvider>` (wraps `@mui/material-nextjs`'s `AppRouterCacheProvider` + MUI `ThemeProvider` + `CssBaseline`), `<ThemeCustomizer>`.
  - Layout: Container, Box, Section, Stack, Flex, Grid/GridItem, Divider, Spacer, AspectRatio.
  - Typography: Heading, Text, Label, Caption, Link, Code.
  - Actions: Button (loading/variants), IconButton, LinkButton.
  - Navigation: Header (responsive mobile drawer), NavigationMenu, Breadcrumb, Footer/FooterColumn.
  - Hero/landing: HeroSection, FeatureGrid, CTASection, StatsSection, TestimonialSection.
  - Card: Card/CardHeader/CardContent/CardFooter, MediaCard, FeatureCard, ActionCard.
  - Product: ProductCard, ProductGrid, ProductGallery, Price (uses `formatCurrency` from `@novacore/frontend-foundation`), ProductBadge, ProductVariantSelector, ProductQuantitySelector.
  - Forms: Form/FormActions, FormField, TextField, Textarea, Select, Autocomplete, Checkbox/Switch/RadioGroup, PasswordField, SearchField, DateField/DateRangeField (native date input, no `@mui/x-date-pickers`), FileUpload.
  - Feedback: Alert, Dialog/DialogContent/DialogFooter, Drawer, ConfirmDialog, Tooltip, Progress/Skeleton/Loading, ToastProvider/useToast.
  - Data display: Avatar, Badge/Chip, Rating, Stat.
  - Image: ResponsiveImage (wraps `next/image`, error fallback).
  - Motion: FadeIn/SlideIn/ScaleIn (`motion` package, respects `prefers-reduced-motion`, only pulled in by files that import them).
  - Build: `tsup --bundle=false` + the same postbuild safety net (MUI's own npm dist already ships `"use client"` on interactive components, so most of our own wrappers stay server-safe automatically).
  - Exports: `.`, `./theme`, `./layout`, `./navigation`, `./forms`, `./product`.
- **`apps/playground` (`@novacore/playground`)**: App Router demo.
  - shadcn routes: `/`, `/components`, `/theme`, `/admin/dashboard`, `/admin/users`.
  - mui routes: `/mui` (full storefront: Header → Hero → Stats → Featured products → Features → Testimonials → CTA → Footer), `/mui/components` (forms/feedback/product-configurator/toast showcase), `/mui/theme` (ThemeCustomizer).
- **Verified manually**: both packages build (JS+DTS, +CSS for shadcn) and typecheck clean; playground `next build` succeeds for all 9 routes (static, no RSC/hydration errors); `next dev` serves all routes 200 with clean console/terminal logs; screenshots confirm both packages render correctly (light mode, theme customizers, DataTable, storefront layout).
- **Bugs found and fixed this phase** (see `.wolf/buglog.json`): tsup stripping `"use client"` (bug-001, shadcn), RSC "event handlers cannot be passed to Client Component" crash from unconditionally-constructed onChange closures in display-only usage (bug-002, mui), MUI Stack not forwarding alignItems/justifyContent/flexWrap as system props in v9.3.1 (bug-003, mui).

---

## 🚀 Next phase

**Goal:** Iterate based on user review of both phase-1 packages (architecture/API/visuals may be adjusted).

### Acceptance criteria
1. User has reviewed `packages/shadcn` and `packages/mui` structure + playground pages and given feedback.
2. Any requested API/visual adjustments are applied.

### Open decisions
- Whether to add a no-flash SSR theme script to either package (both currently resolve mode to "light" on first paint, correcting to system preference post-mount).
- shadcn: which composed/admin components to prioritize next (DatePicker, CurrencyInput, EntitySelect, schema-driven AdminForm, Command palette, Accordion, Calendar were explicitly deferred).
- mui: whether to upgrade DateField/DateRangeField to `@mui/x-date-pickers` for a richer calendar UI, and whether to add `packages/antd` next per the original multi-adapter roadmap.

---

## 📁 Active architecture

- **Stack:** pnpm workspace, Next.js 15 App Router, React 18, TypeScript, tsup (`bundle:false`) for both package builds.
- **shadcn stack:** Tailwind v3 (compiled to a shipped CSS file), Radix UI primitives (wrapped, not re-exported), class-variance-authority.
- **mui stack:** MUI 9.3.1 + Emotion, `@mui/material-nextjs` (App Router SSR), `@mui/icons-material`, `motion` (optional, per-component).
- **Key packages:** `packages/shadcn` (admin UI), `packages/mui` (client-facing UI), `apps/playground` (demo consumer for both), external `@novacore/frontend-foundation` (framework/UI-agnostic utilities, consumed not modified, referenced via `file:../../../frontend-foundation`).
- **Patterns:** own prop-type contracts in both packages (no leaking Radix/MUI types), `"use client"` only on files that actually need it, DataTable pagination is 1-based to match backend `PaginatedResult`, wrapped onChange handlers only construct closures when the caller supplies a callback (RSC-safety pattern learned from bug-002).

---

## ⚠️ External blockers (don't block coding)

- `@novacore/frontend-foundation` is consumed via a relative `file:` path since it isn't published — will need a registry or workspace restructure before either package can be a real standalone deployable package.

---

## 🔧 Useful commands

```bash
pnpm install
pnpm --filter @novacore/frontend-next-shadcn build   # dist/ (JS + .d.ts + styles.css)
pnpm --filter @novacore/frontend-next-mui build       # dist/ (JS + .d.ts)
pnpm -r typecheck
pnpm dev:playground                                   # http://localhost:3000
pnpm --filter @novacore/playground build              # next build
```

---

## 📚 References (read IF needed)

- `.wolf/cerebrum.md` — User Preferences + Do-Not-Repeat + Decision Log
- `.wolf/anatomy.md` — token-efficient file index
- `.wolf/buglog.json` — known bugs + fixes
- `README.md` — full public-facing documentation of what was built
