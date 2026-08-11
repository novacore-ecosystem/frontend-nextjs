export type ThemeMode = "light" | "dark" | "system";

export type ThemePresetName =
  | "ocean"
  | "indigo"
  | "emerald"
  | "sunset"
  | "rose"
  | "violet"
  | "slate"
  | "neutral";

export type ThemeRadius = "none" | "small" | "medium" | "large";

export type ThemeDensity = "compact" | "comfortable";

export type ThemeStyle = "default" | "modern" | "soft" | "minimal";

/** Semantic design tokens every component consumes. Values are hex/CSS color strings. */
export interface ThemeTokens {
  background: string;
  surface: string;
  surfaceVariant: string;
  foreground: string;
  mutedForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  border: string;
  divider: string;
}

export interface ThemeConfig {
  /** Named preset, e.g. "ocean". Applied first; explicit fields below override it. */
  preset?: ThemePresetName;
  mode?: ThemeMode;
  style?: ThemeStyle;
  radius?: ThemeRadius;
  density?: ThemeDensity;
  /** Final override layer — wins over everything else. Partial semantic token / shape values. */
  overrides?: Partial<ThemeTokens> & { borderRadius?: number };
}

export interface ResolvedTheme {
  mode: ThemeMode;
  preset: ThemePresetName;
  style: ThemeStyle;
  radius: ThemeRadius;
  density: ThemeDensity;
  light: ThemeTokens;
  dark: ThemeTokens;
}
