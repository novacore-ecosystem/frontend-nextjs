import { RADIUS_VALUES, resolvePresetTokens } from "./tokens";
import type { ResolvedTheme, ThemeConfig, ThemeTokens } from "./types";

const DEFAULT_CONFIG: Required<Pick<ThemeConfig, "preset" | "mode" | "style" | "radius" | "density">> = {
  preset: "indigo",
  mode: "system",
  style: "default",
  radius: "medium",
  density: "comfortable",
};

/**
 * Config -> Resolved Theme -> Semantic Tokens.
 * Resolution order: NovaCore defaults, then the selected preset, then the
 * `overrides` layer, which always wins. MUI's own theme is derived from
 * this in create-mui-theme.ts — components never resolve raw MUI palette
 * values themselves.
 */
export function resolveTheme(config: ThemeConfig = {}): ResolvedTheme {
  const preset = config.preset ?? DEFAULT_CONFIG.preset;
  const mode = config.mode ?? DEFAULT_CONFIG.mode;
  const style = config.style ?? DEFAULT_CONFIG.style;
  const radius = config.radius ?? DEFAULT_CONFIG.radius;
  const density = config.density ?? DEFAULT_CONFIG.density;

  const presetTokens = resolvePresetTokens(preset);

  const light: ThemeTokens = { ...presetTokens.light };
  const dark: ThemeTokens = { ...presetTokens.dark };

  if (config.overrides) {
    const { borderRadius, ...tokenOverrides } = config.overrides;
    Object.assign(light, tokenOverrides);
    Object.assign(dark, tokenOverrides);
  }

  return { mode, preset, style, radius, density, light, dark };
}

export function resolveBorderRadius(resolved: ResolvedTheme, config?: ThemeConfig): number {
  return config?.overrides?.borderRadius ?? RADIUS_VALUES[resolved.radius];
}
