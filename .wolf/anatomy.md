# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-08-11T09:59:55.061Z
> Files: 152 tracked | Anatomy hits: 0 | Misses: 0

## ./

- `.gitignore` — Git ignore rules (~172 tok)
- `CLAUDE.md` — OpenWolf (~323 tok)
- `package.json` — Node.js package manifest (~146 tok)
- `pnpm-lock.yaml` — pnpm lock file (~40506 tok)
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
- `next.config.mjs` — Next.js configuration (~49 tok)
- `package.json` — Node.js package manifest (~171 tok)
- `tsconfig.json` — TypeScript configuration (~162 tok)
- `tsconfig.tsbuildinfo` (~37727 tok)

## apps/playground/src/app/

- `layout.tsx` — metadata (~145 tok)
- `page.tsx` — links (~512 tok)
  - fn `Home` L13-37 (~253 tok)
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

## apps/playground/src/app/mui/

- `layout.tsx` — MuiSectionLayout (~96 tok)
- `page.tsx` — NAV_ITEMS (~1366 tok)
  - fn `MuiHomePage` L32-137 (~1035 tok)

## apps/playground/src/app/mui/components/

- `page.tsx` — MuiComponentsPage — renders form — uses useState (~1346 tok)
  - fn `MuiComponentsPage` L34-148 (~1222 tok)

## apps/playground/src/app/mui/theme/

- `page.tsx` — MuiThemePage (~135 tok)

## apps/playground/src/app/theme/

- `page.tsx` — ThemePage (~129 tok)

## packages/mui/

- `package.json` — Node.js package manifest (~566 tok)
- `tsconfig.json` — TypeScript configuration (~135 tok)
- `tsup.config.ts` — /*.{ts,tsx}"], (~235 tok)

## packages/mui/scripts/

- `postbuild-use-client.mjs` — tsup/esbuild strips the "use client" directive during bundling (it isn't (~600 tok)
  - fn `walk` L17-66 (~392 tok)

## packages/mui/src/

- `index.ts` — Declares ContainerProps (~1636 tok)

## packages/mui/src/components/actions/

- `button.tsx` — VARIANT_MAP (~621 tok)
  - section `ButtonProps` L9-36 (~275 tok)
  - fn `Button` L37-71 (~250 tok)
- `icon-button.tsx` — SIZE_MAP (~212 tok)
- `link-button.tsx` — Semantic alias for Button used as a navigational link. (~86 tok)

## packages/mui/src/components/card/

- `card.tsx` — ELEVATION_MAP (~561 tok)
  - section `CardProps` L8-18 (~82 tok)
  - fn `Card` L19-38 (~172 tok)
  - fn `CardHeader` L39-46 (~78 tok)
  - fn `CardContent` L47-54 (~65 tok)
  - fn `CardFooter` L55-62 (~83 tok)
- `feature-card.tsx` — FeatureCard (~554 tok)
  - section `FeatureCardProps` L7-14 (~46 tok)
  - fn `FeatureCard` L15-48 (~243 tok)
  - section `ActionCardProps` L49-56 (~46 tok)
  - fn `ActionCard` L57-74 (~159 tok)
- `media-card.tsx` — MediaCard (~381 tok)

## packages/mui/src/components/data/

- `avatar.tsx` — SIZE_MAP (~197 tok)
- `badge.tsx` — TONE_TO_COLOR (~426 tok)
- `rating.tsx` — SIZE_MAP (~330 tok)
- `stat.tsx` — Stat (~244 tok)

## packages/mui/src/components/feedback/

- `alert.tsx` — Alert (~202 tok)
- `confirm-dialog.tsx` — ConfirmDialog — renders modal (~384 tok)
- `dialog.tsx` — Dialog (~494 tok)
- `drawer.tsx` — Drawer (~211 tok)
- `progress.tsx` — Progress (~504 tok)
  - section `ProgressProps` L9-15 (~36 tok)
  - fn `Progress` L16-22 (~122 tok)
  - section `SkeletonProps` L23-30 (~51 tok)
  - fn `Skeleton` L31-34 (~60 tok)
  - fn `Loading` L35-48 (~139 tok)
- `toast.tsx` — ToastContext — uses useCallback, useMemo, useContext (~561 tok)
  - section `ToastOptions` L9-14 (~27 tok)
  - section `ToastContextValue` L15-22 (~51 tok)
  - section `ActiveToast` L23-26 (~18 tok)
  - fn `ToastProvider` L27-62 (~348 tok)
  - fn `useToast` L63-70 (~57 tok)
- `tooltip.tsx` — SIDE_TO_PLACEMENT (~174 tok)

## packages/mui/src/components/forms/

- `autocomplete.tsx` — Autocomplete (~343 tok)
- `checkbox-radio-switch.tsx` — Checkbox (~750 tok)
  - section `CheckboxProps` L9-20 (~70 tok)
  - fn `Checkbox` L21-35 (~146 tok)
  - section `SwitchProps` L36-47 (~69 tok)
  - fn `Switch` L48-62 (~144 tok)
  - section `RadioOption` L63-68 (~28 tok)
  - section `RadioGroupProps` L69-78 (~55 tok)
  - fn `RadioGroup` L79-88 (~142 tok)
- `date-field.tsx` — Wraps the native `<input type="date">` (via MUI TextField) rather than (~575 tok)
  - section `DateFieldProps` L6-25 (~148 tok)
  - fn `DateField` L26-44 (~161 tok)
  - section `DateRangeFieldProps` L45-55 (~72 tok)
  - fn `DateRangeField` L56-64 (~146 tok)
- `file-upload.tsx` — Presentational drag/drop + click-to-browse area. Upload transport (to S3, an API, ...) is the application's responsibility. (~691 tok)
  - section `FileUploadProps` L9-20 (~100 tok)
  - fn `FileUpload` L21-78 (~524 tok)
- `form-field.tsx` — FormField (~310 tok)
- `form.tsx` — Form (~276 tok)
- `password-field.tsx` — PasswordField — uses useState (~550 tok)
  - section `PasswordFieldProps` L11-27 (~98 tok)
  - fn `PasswordField` L28-77 (~340 tok)
- `search-field.tsx` — SearchField (~454 tok)
- `select.tsx` — Select (~476 tok)
- `text-field.tsx` — TextField (~427 tok)
- `textarea.tsx` — Textarea (~338 tok)

## packages/mui/src/components/hero/

- `cta-section.tsx` — CTASection (~459 tok)
- `feature-section.tsx` — FeatureGrid (~655 tok)
  - section `FeatureItem` L9-14 (~29 tok)
  - section `FeatureGridProps` L15-23 (~56 tok)
  - fn `FeatureGrid` L24-68 (~479 tok)
- `hero-section.tsx` — HeroSection (~584 tok)
  - section `HeroSectionProps` L8-18 (~71 tok)
  - fn `HeroSection` L19-62 (~438 tok)
- `stats-section.tsx` — StatsSection (~333 tok)
- `testimonial-section.tsx` — TestimonialSection (~592 tok)
  - section `Testimonial` L10-16 (~30 tok)
  - section `TestimonialSectionProps` L17-23 (~38 tok)
  - fn `TestimonialSection` L24-62 (~425 tok)

## packages/mui/src/components/image/

- `responsive-image.tsx` — Thin wrapper over `next/image` — keeps Next's image optimization/loading (~443 tok)

## packages/mui/src/components/layout/

- `aspect-ratio.tsx` — AspectRatio (~185 tok)
- `box.tsx` — Box (~168 tok)
- `container.tsx` — MAX_WIDTH_MAP (~231 tok)
- `divider.tsx` — Divider (~120 tok)
- `flex.tsx` — Row-oriented convenience wrapper over Stack. (~66 tok)
- `grid.tsx` — CSS-grid based layout — own responsive contract, not MUI's Grid item/xs/sm/md API. (~506 tok)
  - section `GridProps` L5-11 (~41 tok)
  - fn `toTemplateColumns` L12-22 (~154 tok)
  - fn `Grid` L23-33 (~91 tok)
  - section `GridItemProps` L34-39 (~37 tok)
  - fn `GridItem` L40-53 (~138 tok)
- `section.tsx` — PADDING_MAP (~342 tok)
- `spacer.tsx` — Spacer (~120 tok)
- `stack.tsx` — ALIGN_MAP (~388 tok)

## packages/mui/src/components/motion/

- `motion.tsx` — Optional, tasteful entrance animations. Respects `prefers-reduced-motion`. Only loaded by files that import it. (~475 tok)

## packages/mui/src/components/navigation/

- `breadcrumb.tsx` — Breadcrumb (~290 tok)
- `footer.tsx` — Footer (~440 tok)
- `header.tsx` — Rendered inside the mobile drawer when the menu button is tapped. (~670 tok)
  - section `HeaderProps` L13-23 (~83 tok)
  - fn `Header` L24-61 (~464 tok)
- `navigation-menu.tsx` — NavigationMenu (~255 tok)

## packages/mui/src/components/product/

- `price.tsx` — Formats amounts via `@novacore/frontend-foundation`'s `formatCurrency` (Intl-backed, locale/CLDR-correct). (~403 tok)
- `product-badge.tsx` — KIND_TO_TONE (~181 tok)
- `product-card.tsx` — Renders a `ProductCardViewModel` — map your ProductService DTO into this shape at the call site. (~622 tok)
  - section `ProductCardViewModel` L11-24 (~76 tok)
  - section `ProductCardProps` L25-33 (~84 tok)
  - fn `ProductCard` L34-62 (~343 tok)
- `product-gallery.tsx` — ProductGallery — uses useState (~436 tok)
- `product-grid.tsx` — ProductGrid (~257 tok)
- `product-quantity-selector.tsx` — ProductQuantitySelector (~383 tok)
- `product-variant-selector.tsx` — Fully controlled — no internal state, so it stays composable inside either server- or client-rendered trees. (~555 tok)
  - section `ProductVariantOption` L6-11 (~28 tok)
  - section `ProductVariantSelectorProps` L12-21 (~89 tok)
  - fn `ProductVariantSelector` L22-61 (~391 tok)

## packages/mui/src/components/typography/

- `heading.tsx` — SIZE_TO_VARIANT (~384 tok)
- `misc.tsx` — Label (~652 tok)
  - section `LabelProps` L6-12 (~38 tok)
  - fn `Label` L13-30 (~151 tok)
  - section `CaptionProps` L31-35 (~27 tok)
  - fn `Caption` L36-43 (~78 tok)
  - section `LinkProps` L44-51 (~49 tok)
  - fn `Link` L52-66 (~106 tok)
  - section `CodeProps` L67-71 (~26 tok)
  - fn `Code` L72-86 (~124 tok)
- `text.tsx` — SIZE_TO_FONT_SIZE (~435 tok)

## packages/mui/src/exports/

- `forms.ts` — Declares FormProps (~308 tok)
- `layout.ts` — Declares ContainerProps (~360 tok)
- `navigation.ts` — Declares HeaderProps (~114 tok)
- `product.ts` — Declares ProductCardProps (~239 tok)

## packages/mui/src/lib/

- `types.ts` — Structural escape hatch for advanced style overrides (mirrors MUI's `sx` (~191 tok)

## packages/mui/src/theme/

- `client-provider.tsx` — Single high-level provider: MUI's Emotion cache (App Router SSR-safe via (~934 tok)
  - section `ThemeContextValue` L11-19 (~80 tok)
  - fn `getSystemMode` L20-24 (~60 tok)
  - section `ClientProviderProps` L25-35 (~104 tok)
  - fn `ClientProvider` L36-75 (~506 tok)
  - fn `useClientTheme` L76-83 (~60 tok)
- `create-mui-theme.ts` — Semantic Tokens -> MUI Theme. The only file in the package allowed to (~589 tok)
  - fn `createMuiTheme` L10-49 (~468 tok)
- `index.ts` (~111 tok)
- `resolve-theme.ts` — Config -> Resolved Theme -> Semantic Tokens. (~453 tok)
- `theme-customizer.tsx` — Dev/demo control panel for previewing mode, preset, radius, and density live. (~997 tok)
  - fn `chipButtonStyle` L16-31 (~136 tok)
  - fn `ThemeCustomizer` L32-113 (~695 tok)
- `tokens.ts` — Exports PRESET_NAMES, resolvePresetTokens, RADIUS_VALUES (~881 tok)
  - section `PresetDefinition` L18-36 (~398 tok)
  - fn `resolvePresetTokens` L37-65 (~197 tok)
- `types.ts` — Semantic design tokens every component consumes. Values are hex/CSS color strings. (~407 tok)

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
