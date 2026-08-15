import type { ThemePresetName, ThemeTokens } from "./types";

const STATUS = {
  light: { success: "#16a34a", warning: "#d97706", error: "#dc2626", info: "#0284c7" },
  dark: { success: "#22c55e", warning: "#f59e0b", error: "#ef4444", info: "#38bdf8" },
};

const NEUTRAL_COOL = {
  light: {
    background: "#ffffff",
    surface: "#ffffff",
    surfaceVariant: "#f4f4f5",
    foreground: "#18181b",
    mutedForeground: "#71717a",
    border: "#e4e4e7",
    divider: "#e4e4e7",
    sidebar: "#f7f7f8",
    sidebarBorder: "#e4e4e7",
    sidebarAccent: "#ececee",
  },
  dark: {
    background: "#09090b",
    surface: "#18181b",
    surfaceVariant: "#27272a",
    foreground: "#fafafa",
    mutedForeground: "#a1a1aa",
    border: "#27272a",
    divider: "#27272a",
    sidebar: "#050506",
    sidebarBorder: "#1f1f22",
    sidebarAccent: "#1f1f22",
  },
};

const NEUTRAL_WARM = {
  light: {
    background: "#fffbf7",
    surface: "#ffffff",
    surfaceVariant: "#f5efe9",
    foreground: "#1c1917",
    mutedForeground: "#78716c",
    border: "#e7e0d9",
    divider: "#e7e0d9",
    sidebar: "#faf7f4",
    sidebarBorder: "#e7e0d9",
    sidebarAccent: "#efe8e1",
  },
  dark: {
    background: "#0c0a09",
    surface: "#1c1917",
    surfaceVariant: "#292524",
    foreground: "#fafaf9",
    mutedForeground: "#a8a29e",
    border: "#292524",
    divider: "#292524",
    sidebar: "#070605",
    sidebarBorder: "#241f1b",
    sidebarAccent: "#241f1b",
  },
};

interface PresetDefinition {
  neutral: typeof NEUTRAL_COOL;
  primary: { light: string; dark: string };
  secondary: { light: string; dark: string };
}

const PRESET_DEFINITIONS: Record<ThemePresetName, PresetDefinition> = {
  ocean: { neutral: NEUTRAL_COOL, primary: { light: "#0284c7", dark: "#38bdf8" }, secondary: { light: "#0d9488", dark: "#2dd4bf" } },
  indigo: { neutral: NEUTRAL_COOL, primary: { light: "#4f46e5", dark: "#818cf8" }, secondary: { light: "#7c3aed", dark: "#a78bfa" } },
  emerald: { neutral: NEUTRAL_COOL, primary: { light: "#059669", dark: "#34d399" }, secondary: { light: "#0d9488", dark: "#2dd4bf" } },
  sunset: { neutral: NEUTRAL_WARM, primary: { light: "#ea580c", dark: "#fb923c" }, secondary: { light: "#dc2626", dark: "#f87171" } },
  rose: { neutral: NEUTRAL_WARM, primary: { light: "#e11d48", dark: "#fb7185" }, secondary: { light: "#db2777", dark: "#f472b6" } },
  violet: { neutral: NEUTRAL_COOL, primary: { light: "#7c3aed", dark: "#a78bfa" }, secondary: { light: "#4f46e5", dark: "#818cf8" } },
  slate: { neutral: NEUTRAL_COOL, primary: { light: "#475569", dark: "#94a3b8" }, secondary: { light: "#0284c7", dark: "#38bdf8" } },
  neutral: { neutral: NEUTRAL_COOL, primary: { light: "#404040", dark: "#a3a3a3" }, secondary: { light: "#525252", dark: "#d4d4d4" } },
};

export const PRESET_NAMES = Object.keys(PRESET_DEFINITIONS) as ThemePresetName[];

export function resolvePresetTokens(preset: ThemePresetName): { light: ThemeTokens; dark: ThemeTokens } {
  const def = PRESET_DEFINITIONS[preset];
  return {
    light: {
      ...def.neutral.light,
      sidebarForeground: def.neutral.light.foreground,
      sidebarAccentForeground: def.neutral.light.foreground,
      primary: def.primary.light,
      primaryForeground: "#ffffff",
      secondary: def.secondary.light,
      secondaryForeground: "#ffffff",
      sidebarPrimary: def.primary.light,
      sidebarPrimaryForeground: "#ffffff",
      ...STATUS.light,
    },
    dark: {
      ...def.neutral.dark,
      sidebarForeground: def.neutral.dark.foreground,
      sidebarAccentForeground: def.neutral.dark.foreground,
      primary: def.primary.dark,
      primaryForeground: "#0a0a0a",
      secondary: def.secondary.dark,
      secondaryForeground: "#0a0a0a",
      sidebarPrimary: def.primary.dark,
      sidebarPrimaryForeground: "#0a0a0a",
      ...STATUS.dark,
    },
  };
}

export const RADIUS_VALUES = {
  none: 0,
  small: 4,
  medium: 8,
  large: 14,
} as const;
