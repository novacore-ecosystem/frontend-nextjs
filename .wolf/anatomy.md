# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-08-11T09:11:45.254Z
> Files: 71 tracked | Anatomy hits: 0 | Misses: 0

## ./

- `CLAUDE.md` — OpenWolf (~323 tok)
- `package.json` — Node.js package manifest (~146 tok)
- `pnpm-lock.yaml` — pnpm lock file (~32686 tok)
- `pnpm-workspace.yaml` (~12 tok)
- `README.md` — Project documentation (~1213 tok)

## .claude/

- `settings.json` (~514 tok)
- `settings.local.json` (~57 tok)

## .claude/commands/

- `reframe.md` — Mode: migrate [framework] (~551 tok)
- `security-audit.md` — Layer 1 — Dependencies (~510 tok)

## .claude/rules/

- `openwolf.md` (~328 tok)

## .codegraph/

- `.gitignore` — Git ignore rules (~61 tok)

## apps/playground/

- `next-env.d.ts` — / <reference types="next" /> (~75 tok)
- `next.config.mjs` — Next.js configuration (~25 tok)
- `package.json` — Node.js package manifest (~157 tok)
- `tsconfig.json` — TypeScript configuration (~162 tok)

## apps/playground/src/app/

- `layout.tsx` — metadata (~145 tok)
- `page.tsx` — links (~388 tok)
- `providers.tsx` — Providers (~80 tok)

## apps/playground/src/app/admin/

- `layout.tsx` — AdminAreaLayout (~226 tok)

## apps/playground/src/app/admin/dashboard/

- `page.tsx` — stats (~242 tok)

## apps/playground/src/app/admin/users/

- `page.tsx` — USERS — renders table — uses useState (~654 tok)
  - section `User` L14-42 (~213 tok)
  - fn `UsersPage` L43-82 (~383 tok)

## apps/playground/src/app/components/

- `page.tsx` — ComponentsPage — renders form, modal — uses useState (~1346 tok)
  - fn `ComponentsPage` L39-153 (~1196 tok)

## apps/playground/src/app/theme/

- `page.tsx` — ThemePage (~129 tok)

## packages/shadcn/

- `package.json` — Node.js package manifest (~725 tok)
- `postcss.config.js` — PostCSS configuration (~24 tok)
- `tailwind.config.ts` — Tailwind CSS configuration (~830 tok)
- `tsconfig.json` — TypeScript configuration (~135 tok)
- `tsup.config.ts` — /*.{ts,tsx}"], (~192 tok)

## packages/shadcn/scripts/

- `postbuild-use-client.mjs` — tsup/esbuild strips the "use client" directive during bundling (it isn't (~600 tok)
  - fn `walk` L17-66 (~392 tok)

## packages/shadcn/src/

- `index.ts` — Declares ButtonProps (~866 tok)

## packages/shadcn/src/components/admin/

- `admin-header.tsx` — AdminHeader (~156 tok)
- `admin-layout.tsx` — Generic admin shell: responsive sidebar + header + content. No domain assumptions. (~665 tok)
  - section `AdminLayoutContextValue` L7-13 (~55 tok)
  - fn `useAdminLayout` L14-19 (~60 tok)
  - section `AdminLayoutProps` L20-27 (~68 tok)
  - fn `AdminLayout` L28-59 (~307 tok)
  - fn `AdminSidebarToggle` L60-73 (~140 tok)
- `admin-sidebar.tsx` — AdminSidebar (~385 tok)
- `data-table.tsx` — Renders a cell for the row. Defaults to reading `row[id]` when omitted. (~2428 tok)
  - section `DataTableColumn` L11-21 (~86 tok)
  - section `DataTableSortState` L22-32 (~112 tok)
  - section `DataTablePaginationState` L33-39 (~56 tok)
  - fn `fromPaginatedResult` L40-49 (~80 tok)
  - section `DataTableProps` L50-69 (~175 tok)
  - fn `DataTable` L70-241 (~1810 tok)
- `page.tsx` — AdminPage (~681 tok)
  - fn `AdminPage` L4-7 (~57 tok)
  - fn `PageContainer` L8-11 (~56 tok)
  - fn `PageSection` L12-40 (~218 tok)
  - section `PageHeaderProps` L41-48 (~46 tok)
  - fn `PageHeader` L49-63 (~166 tok)
  - fn `Toolbar` L64-67 (~57 tok)
  - fn `ContentPanel` L68-71 (~62 tok)
- `permission-gate.tsx` — Injected by the consumer — decides whether the current actor has the permission(s). (~204 tok)
- `states.tsx` — EmptyState (~672 tok)
  - fn `EmptyState` L7-31 (~204 tok)
  - fn `LoadingState` L32-40 (~98 tok)
  - fn `ErrorState` L41-67 (~224 tok)
  - fn `SkeletonList` L68-77 (~85 tok)
- `status-badge.tsx` — TONE_TO_VARIANT (~186 tok)

## packages/shadcn/src/components/composed/

- `confirm-dialog.tsx` — ConfirmDialog — renders modal (~385 tok)
- `form-field.tsx` — FormField (~450 tok)
- `password-input.tsx` — PasswordInput — uses useState (~295 tok)
- `search-input.tsx` — SearchInput (~394 tok)

## packages/shadcn/src/components/ui/

- `avatar.tsx` — Avatar (~271 tok)
- `badge.tsx` — badgeVariants (~379 tok)
- `button.tsx` — Renders children as the root element (e.g. a Link) instead of a <button>. (~638 tok)
  - section `ButtonProps` L38-63 (~231 tok)
- `card.tsx` — Card (~504 tok)
- `checkbox.tsx` — Checkbox (~368 tok)
- `dialog.tsx` — Dialog — renders modal (~803 tok)
  - section `DialogProps` L8-14 (~42 tok)
  - fn `Dialog` L15-24 (~85 tok)
  - section `DialogContentProps` L25-30 (~35 tok)
  - fn `DialogContent` L31-52 (~282 tok)
  - fn `DialogHeader` L53-56 (~58 tok)
  - fn `DialogFooter` L57-76 (~252 tok)
- `dropdown-menu.tsx` — DropdownMenu (~952 tok)
  - section `DropdownMenuItemProps` L32-57 (~268 tok)
  - fn `DropdownMenuCheckboxItem` L58-87 (~268 tok)
  - fn `DropdownMenuLabel` L88-91 (~56 tok)
  - fn `DropdownMenuSeparator` L92-95 (~52 tok)
- `input.tsx` — Input (~229 tok)
- `label.tsx` — Label (~213 tok)
- `popover.tsx` — Popover (~354 tok)
- `select.tsx` — Select (~744 tok)
  - section `SelectOption` L8-13 (~26 tok)
  - section `SelectProps` L14-24 (~66 tok)
  - fn `Select` L25-63 (~597 tok)
- `separator.tsx` — Separator (~224 tok)
- `skeleton.tsx` — Skeleton (~72 tok)
- `switch.tsx` — Switch (~354 tok)
- `tabs.tsx` — Tabs (~466 tok)
- `textarea.tsx` — Textarea (~234 tok)
- `tooltip.tsx` — TooltipProvider (~322 tok)

## packages/shadcn/src/exports/

- `data.ts` — Declares DataTableProps (~122 tok)
- `forms.ts` — Declares InputProps (~209 tok)
- `layout.ts` — Declares AdminLayoutProps (~155 tok)

## packages/shadcn/src/lib/

- `cn.ts` — Exports cn (~49 tok)

## packages/shadcn/src/styles/

- `globals.css` — Styles: 4 rules, 52 vars, 1 layers (~630 tok)

## packages/shadcn/src/theme/

- `admin-provider.tsx` — ThemeContext — uses useMemo, useEffect, useContext (~776 tok)
  - section `ThemeContextValue` L7-15 (~80 tok)
  - fn `getSystemMode` L16-20 (~60 tok)
  - fn `applyTokens` L21-27 (~58 tok)
  - section `AdminProviderProps` L28-32 (~27 tok)
  - fn `AdminProvider` L33-65 (~428 tok)
  - fn `useAdminTheme` L66-75 (~68 tok)
- `index.ts` (~146 tok)
- `presets.ts` — Named, ready-made combinations. Consumers can also compose base/color/style/radius manually. (~351 tok)
- `resolve-theme.ts` — Config -> Resolved Theme -> Semantic Tokens. (~519 tok)
  - fn `resolveTheme` L10-45 (~302 tok)
  - fn `tokensToCssVars` L46-59 (~98 tok)
- `theme-customizer.tsx` — Dev/demo control panel for previewing mode, base palette, accent color, and radius live. (~1214 tok)
  - section `ThemeCustomizerProps` L13-17 (~46 tok)
  - fn `ThemeCustomizer` L18-123 (~1045 tok)
- `tokens.ts` — Neutral scale generator, parameterized by hue/saturation — avoids hand-writing 5 full palettes. (~1100 tok)
  - fn `buildBaseTokens` L4-50 (~444 tok)
  - fn `resolveBaseTokens` L51-55 (~39 tok)
  - section `AccentDefinition` L56-78 (~230 tok)
  - fn `resolveAccentTokens` L79-124 (~336 tok)
- `types.ts` — Semantic design tokens every component consumes. Values are HSL triplets ("H S% L%"). (~486 tok)
