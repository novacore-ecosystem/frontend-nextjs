import type { ThemeBase, ThemeColor, ThemeRadius, ThemeStyle } from "./types";

export interface ThemePreset {
  base: ThemeBase;
  color: ThemeColor;
  style: ThemeStyle;
  radius: ThemeRadius;
}

export const DEFAULT_PRESET: ThemePreset = {
  base: "zinc",
  color: "blue",
  style: "default",
  radius: "medium",
};

/** Named, ready-made combinations. Consumers can also compose base/color/style/radius manually. */
export const THEME_PRESETS: Record<string, ThemePreset> = {
  "zinc-blue": { base: "zinc", color: "blue", style: "default", radius: "medium" },
  "slate-violet": { base: "slate", color: "violet", style: "default", radius: "medium" },
  "gray-green": { base: "gray", color: "green", style: "default", radius: "small" },
  "neutral-orange": { base: "neutral", color: "orange", style: "modern", radius: "large" },
  "stone-rose": { base: "stone", color: "rose", style: "soft", radius: "large" },
  "zinc-teal": { base: "zinc", color: "teal", style: "compact", radius: "small" },
  "slate-red": { base: "slate", color: "red", style: "sharp", radius: "none" },
};

export function resolvePreset(name?: string): ThemePreset {
  if (!name) return DEFAULT_PRESET;
  return THEME_PRESETS[name] ?? DEFAULT_PRESET;
}
