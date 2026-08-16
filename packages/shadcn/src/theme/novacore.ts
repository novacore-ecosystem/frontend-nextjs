import type { ThemeConfig, ThemeTokens } from "./types";

/**
 * Fixed dark-navy chrome, mode-independent — the sidebar's structural identity regardless
 * of whether the app's content area is in light or dark mode (`resolveTheme` assigns
 * `overrides` onto both the light and dark resolved token sets identically, so this
 * "always dark sidebar" effect needs no engine change, just these five neutral keys).
 *
 * Deliberately omits `primary`/`ring`/`sidebar-primary` — those keep tracking `color` so
 * the active-nav accent stays light/dark-aware and swappable per product.
 */
export const NOVACORE_CHROME_OVERRIDES: Partial<ThemeTokens> = {
  sidebar: "245 40% 13%",
  "sidebar-foreground": "240 20% 96%",
  "sidebar-border": "245 30% 22%",
  "sidebar-accent": "245 35% 19%",
  "sidebar-accent-foreground": "0 0% 100%",
};

/**
 * The NovaCore Admin design baseline. Any NovaCore admin product should start from this
 * theme and, if it needs its own identity, override only `color` (and optionally
 * `radius`) — never re-derive the chrome or accent from scratch:
 *
 * ```ts
 * <AdminProvider theme={{ ...NOVACORE_ADMIN_THEME, color: "blue" }}>
 * ```
 *
 * `style: "modern"` is set for forward intent, but no shipped CSS reads `data-nc-style`
 * yet — it currently has no visual effect.
 */
export const NOVACORE_ADMIN_THEME: ThemeConfig = {
  base: "zinc",
  color: "violet",
  style: "modern",
  radius: "large",
  overrides: NOVACORE_CHROME_OVERRIDES,
};
