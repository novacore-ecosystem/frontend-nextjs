import { resolvePreset } from "./presets";
import { ACCENT_COLORS, RADIUS_VALUES, STATUS_TOKENS, resolveAccentTokens, resolveBaseTokens } from "./tokens";
import type { ResolvedTheme, ThemeConfig, ThemeTokens } from "./types";

/**
 * Config -> Resolved Theme -> Semantic Tokens.
 * Resolution order: preset defaults, then explicit base/color/style/radius fields,
 * then the `overrides` layer, which always wins.
 */
export function resolveTheme(config: ThemeConfig = {}): ResolvedTheme {
  const preset = resolvePreset(config.preset);

  const base = config.base ?? preset.base;
  const color = config.color ?? preset.color;
  const style = config.style ?? preset.style;
  const radius = config.radius ?? preset.radius;
  const mode = config.mode ?? "system";

  const baseTokens = resolveBaseTokens(base);
  const accentTokens = resolveAccentTokens(color);
  const radiusValue = RADIUS_VALUES[radius];

  const light: ThemeTokens = {
    ...baseTokens.light,
    ...accentTokens.light,
    ...STATUS_TOKENS.light,
    radius: radiusValue,
  } as ThemeTokens;

  const dark: ThemeTokens = {
    ...baseTokens.dark,
    ...accentTokens.dark,
    ...STATUS_TOKENS.dark,
    radius: radiusValue,
  } as ThemeTokens;

  if (config.overrides) {
    Object.assign(light, config.overrides);
    Object.assign(dark, config.overrides);
  }

  return { mode, base, color, style, radius, light, dark };
}

/** Converts resolved tokens into CSS custom properties (`--nc-<token>`). */
export function tokensToCssVars(tokens: ThemeTokens): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (key === "radius") {
      vars["--nc-radius"] = value;
    } else {
      vars[`--nc-${key}`] = value;
    }
  }
  return vars;
}

export { ACCENT_COLORS };
