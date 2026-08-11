import type { ThemeBase, ThemeColor, ThemeRadius, ThemeTokens } from "./types";

/** Neutral scale generator, parameterized by hue/saturation — avoids hand-writing 5 full palettes. */
function buildBaseTokens(hue: number, sat: number): { light: Partial<ThemeTokens>; dark: Partial<ThemeTokens> } {
  const h = hue;
  const s = sat;
  return {
    light: {
      background: `0 0% 100%`,
      foreground: `${h} ${s * 2.5}% 3.9%`,
      card: `0 0% 100%`,
      "card-foreground": `${h} ${s * 2.5}% 3.9%`,
      popover: `0 0% 100%`,
      "popover-foreground": `${h} ${s * 2.5}% 3.9%`,
      secondary: `${h} ${s}% 95.9%`,
      "secondary-foreground": `${h} ${s * 1.5}% 10%`,
      muted: `${h} ${s}% 95.9%`,
      "muted-foreground": `${h} ${s * 0.8}% 46.1%`,
      accent: `${h} ${s}% 95.9%`,
      "accent-foreground": `${h} ${s * 1.5}% 10%`,
      border: `${h} ${s}% 90%`,
      input: `${h} ${s}% 90%`,
    },
    dark: {
      background: `${h} ${s * 2.5}% 3.9%`,
      foreground: `0 0% 98%`,
      card: `${h} ${s * 2.5}% 3.9%`,
      "card-foreground": `0 0% 98%`,
      popover: `${h} ${s * 2.5}% 3.9%`,
      "popover-foreground": `0 0% 98%`,
      secondary: `${h} ${s * 0.8}% 15.9%`,
      "secondary-foreground": `0 0% 98%`,
      muted: `${h} ${s * 0.8}% 15.9%`,
      "muted-foreground": `${h} ${s}% 64.9%`,
      accent: `${h} ${s * 0.8}% 15.9%`,
      "accent-foreground": `0 0% 98%`,
      border: `${h} ${s * 0.8}% 15.9%`,
      input: `${h} ${s * 0.8}% 15.9%`,
    },
  };
}

export const BASE_PALETTES: Record<ThemeBase, { hue: number; sat: number }> = {
  zinc: { hue: 240, sat: 5 },
  slate: { hue: 215, sat: 16 },
  gray: { hue: 220, sat: 9 },
  neutral: { hue: 0, sat: 0 },
  stone: { hue: 25, sat: 6 },
};

export function resolveBaseTokens(base: ThemeBase) {
  const { hue, sat } = BASE_PALETTES[base];
  return buildBaseTokens(hue, sat);
}

interface AccentDefinition {
  light: string;
  dark: string;
  foregroundLight?: string;
  foregroundDark?: string;
}

export const ACCENT_COLORS: Record<ThemeColor, AccentDefinition> = {
  blue: { light: "221.2 83.2% 53.3%", dark: "217.2 91.2% 59.8%" },
  green: { light: "142.1 76.2% 36.3%", dark: "142.1 70.6% 45.3%" },
  red: { light: "0 72.2% 50.6%", dark: "0 72.2% 50.6%" },
  orange: { light: "24.6 95% 53.1%", dark: "20.5 90.2% 48.2%" },
  violet: { light: "262.1 83.3% 57.8%", dark: "263.4 70% 50.4%" },
  rose: { light: "346.8 77.2% 49.8%", dark: "346.8 77.2% 49.8%" },
  yellow: {
    light: "47.9 95.8% 53.1%",
    dark: "47.9 95.8% 53.1%",
    foregroundLight: "26 83.3% 14.1%",
    foregroundDark: "26 83.3% 14.1%",
  },
  teal: { light: "173.4 80.4% 40%", dark: "172.5 66% 50.4%" },
};

export function resolveAccentTokens(color: ThemeColor) {
  const accent = ACCENT_COLORS[color];
  return {
    light: {
      primary: accent.light,
      "primary-foreground": accent.foregroundLight ?? "0 0% 98%",
      ring: accent.light,
    },
    dark: {
      primary: accent.dark,
      "primary-foreground": accent.foregroundDark ?? "0 0% 98%",
      ring: accent.dark,
    },
  };
}

export const STATUS_TOKENS = {
  light: {
    destructive: "0 84.2% 60.2%",
    "destructive-foreground": "0 0% 98%",
    success: "142.1 76.2% 36.3%",
    "success-foreground": "0 0% 98%",
    warning: "32.5 94.6% 43.7%",
    "warning-foreground": "0 0% 98%",
    info: "199.4 89.1% 48.4%",
    "info-foreground": "0 0% 98%",
  },
  dark: {
    destructive: "0 62.8% 30.6%",
    "destructive-foreground": "0 0% 98%",
    success: "142.1 70.6% 45.3%",
    "success-foreground": "0 0% 98%",
    warning: "32.5 94.6% 43.7%",
    "warning-foreground": "0 0% 98%",
    info: "199.4 89.1% 48.4%",
    "info-foreground": "0 0% 98%",
  },
} as const;

export const RADIUS_VALUES: Record<ThemeRadius, string> = {
  none: "0px",
  small: "0.3rem",
  medium: "0.5rem",
  large: "0.75rem",
};
