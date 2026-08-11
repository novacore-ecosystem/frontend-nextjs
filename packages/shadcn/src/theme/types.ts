export type ThemeMode = "light" | "dark" | "system";

export type ThemeBase = "zinc" | "slate" | "gray" | "neutral" | "stone";

export type ThemeColor =
  | "blue"
  | "green"
  | "red"
  | "orange"
  | "violet"
  | "rose"
  | "yellow"
  | "teal";

export type ThemeStyle = "default" | "modern" | "soft" | "compact" | "minimal" | "sharp";

export type ThemeRadius = "none" | "small" | "medium" | "large";

/** Semantic design tokens every component consumes. Values are HSL triplets ("H S% L%"). */
export interface ThemeTokens {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  success: string;
  "success-foreground": string;
  warning: string;
  "warning-foreground": string;
  info: string;
  "info-foreground": string;
  border: string;
  input: string;
  ring: string;
  radius: string;
}

export interface ThemeConfig {
  /** Named preset, e.g. "zinc-blue". Applied first; explicit fields below override it. */
  preset?: string;
  mode?: ThemeMode;
  base?: ThemeBase;
  color?: ThemeColor;
  style?: ThemeStyle;
  radius?: ThemeRadius;
  /** Final override layer — wins over everything else. Partial token values. */
  overrides?: Partial<ThemeTokens>;
}

export interface ResolvedTheme {
  mode: ThemeMode;
  base: ThemeBase;
  color: ThemeColor;
  style: ThemeStyle;
  radius: ThemeRadius;
  light: ThemeTokens;
  dark: ThemeTokens;
}
