# frontend-nextjs

NovaCore's Next.js frontend ecosystem. This repository is scoped to **Next.js only** — other
frameworks (Vue, Angular, Razor) live in separate repositories. Inside Next.js, UI-library
implementations are separated by package (`shadcn` today; `mui`/`antd` may follow later, each
independent).

## Layout

```text
frontend-nextjs/
├── packages/
│   └── shadcn/            @novacore/frontend-next-shadcn — Next.js + shadcn/Radix/Tailwind UI package
└── apps/
    └── playground/        @novacore/playground — dev/demo consumer (not a test suite)
```

## Install

```bash
pnpm install
pnpm --filter @novacore/frontend-next-shadcn build   # builds dist/ (JS + .d.ts + styles.css)
pnpm dev:playground                                   # runs the playground at localhost:3000
```

`@novacore/frontend-next-shadcn` depends on `@novacore/frontend-foundation` via a relative
`file:` path (`../../../frontend-foundation`), since that package lives in a sibling repository
and isn't published to a registry yet.

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
- `@novacore/frontend-next-shadcn/theme` — AdminProvider, useAdminTheme, ThemeCustomizer, resolveTheme, presets, tokens
- `@novacore/frontend-next-shadcn/forms` — Input, Textarea, Select, Checkbox, Switch, SearchInput, PasswordInput, FormField
- `@novacore/frontend-next-shadcn/data` — DataTable, fromPaginatedResult, EmptyState, LoadingState, ErrorState, StatusBadge
- `@novacore/frontend-next-shadcn/layout` — AdminLayout, AdminSidebar, AdminHeader, AdminPage, PageHeader, PermissionGate
- `@novacore/frontend-next-shadcn/styles.css` — precompiled CSS (Tailwind is an implementation detail; consumers do not install or configure Tailwind)

### Theme system

Semantic tokens (background/foreground/card/primary/secondary/muted/accent/destructive/success/warning/info/border/input/ring/radius),
resolved as `preset → base/color/style/radius → overrides` (later layers win), applied as
CSS custom properties (`--nc-*`) on `<html>` by `<AdminProvider>`. Supports `light` / `dark` /
`system`. Named presets (`zinc-blue`, `slate-violet`, `gray-green`, `neutral-orange`,
`stone-rose`, `zinc-teal`, `slate-red`) compose 5 base palettes × 8 accent colors — see
`packages/shadcn/src/theme/`.

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

## Known limitations (phase 1)

- Theme `style` variants (`modern`/`soft`/`compact`/`minimal`/`sharp`) are recorded on
  `resolveTheme()`'s output and exposed as a `data-nc-style` attribute, but only a couple of
  presets currently vary visual weight by style — most components don't yet branch on it.
- No automated tests, Storybook, or CI — explicitly out of scope for this phase.
- Command palette, Calendar, Accordion, DatePicker/DateRangePicker/NumberInput/CurrencyInput/
  FileUpload/ImageUpload, EntitySelect/EntityCombobox, ActivityTimeline/MetadataPanel, and
  schema-driven `AdminForm` are not implemented yet.
- No no-flash SSR theme script — the resolved theme applies client-side on mount, so there is a
  brief flash of the default (`zinc-blue`/medium/light) fallback theme baked into `globals.css`
  before `<AdminProvider>` hydrates.
