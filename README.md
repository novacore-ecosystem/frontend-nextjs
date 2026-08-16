# frontend-nextjs

NovaCore's Next.js frontend ecosystem. This repository is scoped to **Next.js only** — other
frameworks (Vue, Angular, Razor) live in separate repositories. Inside Next.js, UI-library
implementations are separated by package: `shadcn` (admin-facing) and `mui` (client-facing)
today; `antd` may follow later, each independent.

## Layout

```text
frontend-nextjs/
├── packages/
│   ├── shadcn/             @novacore/frontend-next-shadcn — admin-facing UI (shadcn/Radix/Tailwind)
│   └── mui/                @novacore/frontend-next-mui — client-facing UI (MUI/Emotion)
└── apps/
    └── playground/         @novacore/playground — dev/demo consumer (not a test suite)
```

## Install

```bash
pnpm install
pnpm --filter @novacore/frontend-next-shadcn build   # builds dist/ (JS + .d.ts + styles.css)
pnpm --filter @novacore/frontend-next-mui build       # builds dist/ (JS + .d.ts, no CSS to compile)
pnpm dev:playground                                   # runs the playground at localhost:3000
```

Both packages depend on `@novacore/frontend-foundation` via a relative `file:` path
(`../../../frontend-foundation`), since that package lives in a sibling repository and isn't
published to a registry yet.

## `@novacore/frontend-next-shadcn`

Public API — consumers never import from `shadcn`/Radix/Tailwind directly, and no
component prop type is a re-export of an underlying library's type.

```tsx
// app/providers.tsx
"use client";
import { AdminProvider } from "@novacore/frontend-next-shadcn";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AdminProvider theme={{ preset: "zinc-blue", mode: "system" }}>{children}</AdminProvider>;
}
```

```tsx
// app/layout.tsx
import "@novacore/frontend-next-shadcn/styles.css";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
```

```tsx
// app/users/page.tsx
import { AdminPage, PageHeader, DataTable } from "@novacore/frontend-next-shadcn";
```

### Exports

- `@novacore/frontend-next-shadcn` — everything
- `@novacore/frontend-next-shadcn/theme` — AdminProvider, useAdminTheme, ThemeCustomizer, resolveTheme, presets, tokens, NOVACORE_ADMIN_THEME, NOVACORE_CHROME_OVERRIDES
- `@novacore/frontend-next-shadcn/forms` — Input, Textarea, Select, Checkbox, Switch, SearchInput, PasswordInput, FormField
- `@novacore/frontend-next-shadcn/data` — DataTable, fromPaginatedResult, EmptyState, LoadingState, ErrorState, StatusBadge, StatCard, StatCardRow, DataFreshness, useDataFreshness
- `@novacore/frontend-next-shadcn/layout` — AdminLayout, AdminSidebar, AdminHeader, ApplicationSwitcher, CommandPalette, AdminPage, PageHeader, AdminBreadcrumb, PermissionProvider, usePermission, PermissionGate, PermissionBoundary, PermissionButton, AccessDenied
- `@novacore/frontend-next-shadcn/styles.css` — precompiled CSS (Tailwind is an implementation detail; consumers do not install or configure Tailwind)

### Admin shell

```tsx
// app/admin/layout.tsx
"use client";
import { AdminLayout, AdminSidebar, AdminHeader, useAdminLayout, type NavigationGroup } from "@novacore/frontend-next-shadcn";

const NAV: NavigationGroup[] = [
  { id: "catalog", title: "Catalog", items: [{ id: "products", label: "Products", href: "/admin/products", permission: "product.read" }] },
];

function Sidebar() {
  const { sidebarCollapsed } = useAdminLayout();
  return <AdminSidebar groups={NAV} collapsed={sidebarCollapsed} />;
}

export default function AdminAreaLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<AdminHeader />}>
      {children}
    </AdminLayout>
  );
}
```

`AdminLayout` renders `sidebar` in both a collapsible desktop rail and a mobile `Sheet` drawer (the drawer's copy always stays expanded regardless of desktop collapse state). `AdminSidebar` takes grouped `NavigationItem`/`NavigationGroup` data with optional icons/badges/nested children, a `renderItem` render-prop for full custom rendering, and permission-aware filtering (see below). `AdminHeader` is slot-based (`applicationSwitcher`, `breadcrumb`, `search`, `notifications`, `localeSwitcher`, `themeToggle`, `actions`, `userMenu`) — populate only what the app needs. `ApplicationSwitcher` and `CommandPalette` (+ `useCommandPalette()` for the Cmd/Ctrl+K shortcut) round out cross-application navigation.

### Permission system

Framework-agnostic evaluation lives in `@novacore/frontend-foundation` (`hasPermission`/`hasAnyPermission`/`hasAllPermissions`); this package only adds the React layer:

```tsx
import { PermissionProvider, PermissionGate, PermissionBoundary } from "@novacore/frontend-next-shadcn";

// wrap once with the current actor's owned permissions
<PermissionProvider permissions={currentUser.permissions}>{children}</PermissionProvider>;

// hide UI
<PermissionGate permission="product.update" fallback={null}>
  <EditButton />
</PermissionGate>;

// guard an entire page/route — falls back to <AccessDenied> by default
<PermissionBoundary permission="system:full">
  <SettingsPage />
</PermissionBoundary>;
```

With no `<PermissionProvider>` mounted, every check is permissive (nothing is hidden) — the system is fully optional. `AdminSidebar` and `CommandPalette` both auto-source permissions from the nearest provider so you don't have to thread them through manually. **This is a UX layer only** — it hides unavailable actions and confusing navigation, it does not replace server-side authorization, which every backend endpoint must still enforce independently.

### Theme system

Semantic tokens (background/foreground/card/primary/secondary/muted/accent/destructive/success/warning/info/border/input/ring/radius),
resolved as `preset → base/color/style/radius → overrides` (later layers win), applied as
CSS custom properties (`--nc-*`) on `<html>` by `<AdminProvider>`. Supports `light` / `dark` /
`system`. Named presets (`zinc-blue`, `slate-violet`, `gray-green`, `neutral-orange`,
`stone-rose`, `zinc-teal`, `slate-red`) compose 5 base palettes × 8 accent colors — see
`packages/shadcn/src/theme/`.

`overrides` applies identically to both the resolved light and dark token sets
(`resolve-theme.ts`) — a mode-independent surface (e.g. chrome that stays dark regardless
of the app's light/dark mode) needs no engine change, just fixed override values for that
surface's tokens.

**`NOVACORE_ADMIN_THEME`** (`./theme` export, `src/theme/novacore.ts`) is the NovaCore
Admin brand baseline: `zinc` base, `violet` accent, `large` radius, plus
`NOVACORE_CHROME_OVERRIDES` — five `sidebar-*` keys fixed to a dark navy/indigo,
independent of light/dark mode, while `sidebar-primary` keeps tracking `color` so the
active-nav highlight stays theme-aware. Every NovaCore admin product should start from
this theme and override only `color` (and optionally `radius`) for its own identity:

```tsx
<AdminProvider theme={{ ...NOVACORE_ADMIN_THEME, color: "blue" }}>
```

Full rationale and the rest of the NovaCore Admin design baseline (KPI/freshness pattern,
list-page composition, business-identity-via-icon convention):
`nova-console/docs/reference/design-system.md`.

### KPI cards and data freshness

`StatCard`/`StatCardRow` (`./data`) render icon + value + optional trend + optional
freshness. Pass `freshness` whenever the value is approximate or cached — never let a KPI
imply real-time precision it doesn't have:

```tsx
<StatCard
  label="Total tenants"
  value={totalTenants}
  icon={<Building2 />}
  tone="brand"
  freshness={{ updatedAt: query.dataUpdatedAt, isFetching: query.isFetching }}
/>
```

`DataFreshness`/`useDataFreshness` (same export) render "Updated 2m ago" / "Cached ·
refresh in 42s" and accept `updatedAt`/`nextRefreshAt`/`ttlSeconds`/`isFetching` — shaped so
a real backend `refreshedAt`/`cacheTtl` contract can plug in later without changing the
component. They compose into `StatCard.freshness` or stand alone.

### RSC / client boundaries

Built with `tsup --bundle=false` so every source file compiles 1:1 into `dist/`, preserving
`"use client"` on exactly the files that need it (interactive components, hooks, the theme
provider). Server-safe components (`Card`, `Badge`, `PageHeader`, `AdminPage`, …) stay
importable from Server Components without dragging the whole package into the client boundary.
A post-build script (`scripts/postbuild-use-client.mjs`) re-verifies this via each chunk's
sourcemap as a safety net.

### DataTable pagination

`DataTablePaginationState` is **one-based** (`pageNumber`, not `pageIndex`) to match
`@novacore/frontend-foundation`'s `PaginatedResult` — the canonical shape every NovaCore
backend list endpoint returns. Use `fromPaginatedResult()` to adapt an API response directly.

## Known limitations

- Theme `style` variants (`modern`/`soft`/`compact`/`minimal`/`sharp`) are recorded on
  `resolveTheme()`'s output and exposed as a `data-nc-style` attribute, but only a couple of
  presets currently vary visual weight by style — most components don't yet branch on it.
- No automated tests, Storybook, or CI — explicitly out of scope so far.
- Calendar, Accordion, DatePicker/DateRangePicker/NumberInput/CurrencyInput/FileUpload/
  ImageUpload, EntitySelect/EntityCombobox, ActivityTimeline/MetadataPanel, and schema-driven
  `AdminForm` are not implemented yet. (Command palette shipped in phase 2.)
- No no-flash SSR theme script — the resolved theme applies client-side on mount, so there is a
  brief flash of the default (`zinc-blue`/medium/light) fallback theme baked into `globals.css`
  before `<AdminProvider>` hydrates.
- `AccessDenied`'s copy is plain props with English defaults, not wired into
  `@novacore/frontend-foundation`'s i18n system — pass translated strings via props if your app
  needs localization.

## `@novacore/frontend-next-mui`

Client-facing UI implementation (MUI + Emotion, hidden behind NovaCore's own API) for
storefronts, marketing pages, and customer-facing product experiences — a different design
philosophy from the admin-focused shadcn package, not a re-skin of it.

```tsx
// app/mui/layout.tsx (or app/providers.tsx)
"use client";
import { ClientProvider, ToastProvider } from "@novacore/frontend-next-mui";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProvider theme={{ preset: "indigo", mode: "system" }}>
      <ToastProvider>{children}</ToastProvider>
    </ClientProvider>
  );
}
```

```tsx
// app/mui/page.tsx
import { HeroSection, ProductGrid, Button } from "@novacore/frontend-next-mui";

export default function HomePage() {
  return (
    <>
      <HeroSection title="Furniture for a calmer home" actions={<Button>Shop now</Button>} />
      <ProductGrid products={products} />
    </>
  );
}
```

No Tailwind, no separate CSS import — MUI's Emotion-based theme system generates styles at
runtime through `<ClientProvider>` (which wraps `@mui/material-nextjs`'s `AppRouterCacheProvider`
for correct App Router SSR, `ThemeProvider`, and `CssBaseline`). This is an intentional
architectural divergence from the shadcn package: MUI's own styling system is used as-is rather
than forcing a Tailwind/CSS-variable pattern onto it.

### Exports

- `@novacore/frontend-next-mui` — everything
- `@novacore/frontend-next-mui/theme` — ClientProvider, useClientTheme, ThemeCustomizer, resolveTheme, presets
- `@novacore/frontend-next-mui/layout` — Container, Section, Stack, Grid, HeroSection, FeatureGrid, CTASection, StatsSection, TestimonialSection
- `@novacore/frontend-next-mui/navigation` — Header, NavigationMenu, Breadcrumb, Footer
- `@novacore/frontend-next-mui/forms` — Form, FormField, TextField, Select, Autocomplete, Checkbox/Switch/RadioGroup, PasswordField, SearchField, DateField, FileUpload
- `@novacore/frontend-next-mui/admin` — AdminLayout, AdminSidebar, AdminHeader, ApplicationSwitcher, CommandPalette, AdminPage, PageHeader, PermissionProvider, usePermission, PermissionGate, PermissionBoundary, PermissionButton, AccessDenied

### Admin shell + permission system

Phase 2 added a full admin shell to this package too (`packages/mui/src/components/admin/`) — same API shape as the shadcn package's (grouped `AdminNavigationItem`/`AdminNavigationGroup` nav, slot-based `AdminHeader`, `ApplicationSwitcher`, `CommandPalette`, and a `PermissionProvider`/`usePermission`/`PermissionGate`/`PermissionBoundary`/`PermissionButton`/`AccessDenied` permission layer built on the same `@novacore/frontend-foundation` engine), built from MUI's own `Drawer`/`List`/`Collapse`/`Menu`/`Dialog` primitives instead of shadcn's Radix ones. Nav/application types are prefixed `AdminNavigationItem`/`AdminNavigationGroup`/etc. (vs. shadcn's unprefixed names) to avoid colliding with this package's pre-existing marketing `NavigationItem` type. See the shadcn package's Admin shell / Permission system sections above — the usage patterns are identical, just imported from `@novacore/frontend-next-mui`.

### Theme system

Semantic tokens (background/surface/surfaceVariant/foreground/primary/secondary/success/warning/error/info/border/divider),
resolved as `preset → color/style/radius/density → overrides` (later layers win) and translated
into a real MUI `Theme` internally — components never see MUI's palette/theme types directly.
8 presets (`ocean`, `indigo`, `emerald`, `sunset`, `rose`, `violet`, `slate`, `neutral`) bundle a
primary/secondary hue with a cool- or warm-neutral surface tone; `radius` and `density`
(`compact`/`comfortable`) are independently overridable on top of any preset.

### RSC / client boundaries

Same `tsup --bundle=false` approach as the shadcn package (1:1 src→dist, directives preserved
per-file) — see [buglog bug-001]. MUI's own npm package already ships `"use client"` on every
interactive component, so NovaCore's wrapper files only need the directive when *they themselves*
use hooks; pure composition wrappers (`Card`, `Heading`, `Text`, most layout/hero components)
stay server-safe. Wrapped `onChange` handlers are only constructed when the caller actually
supplies a callback — an unconditional closure would crash `next build` the moment a display-only
usage (e.g. a read-only `<Rating>` inside a static product page) is rendered from a Server
Component (see buglog bug-002).

### Price formatting

`Price` formats amounts via `@novacore/frontend-foundation`'s `formatCurrency` (Intl-backed,
locale/CLDR-correct fraction digits and symbols) — the same "consume the foundation" pattern as
the shadcn package's `fromPaginatedResult`.

## Known limitations — `@novacore/frontend-next-mui`

- `DateField`/`DateRangeField` wrap the native `<input type="date">` rather than
  `@mui/x-date-pickers` — lighter dependency footprint for phase 1, upgradeable later.
- No no-flash SSR theme script — mode resolves to `"light"` on first paint and corrects to the
  system preference after mount (same tradeoff as the shadcn package).
- Still no admin-style `DataTable` in this package by design — phase 2 added a full admin
  *shell* (layout/sidebar/topbar/permissions) to this package, but dense tabular data display
  remains `packages/shadcn`'s job; mui's admin pages use `Card`/list-based layouts instead.
- Motion wrappers (`FadeIn`/`SlideIn`/`ScaleIn`) use `whileInView`, so headless/automated
  screenshot tools that capture before the IntersectionObserver fires may show elements as still
  hidden — real browsers trigger it on mount for above-the-fold content.
- `AccessDenied`'s copy is plain props with English defaults, same tradeoff as the shadcn
  package's version — see its Known limitations entry above.
