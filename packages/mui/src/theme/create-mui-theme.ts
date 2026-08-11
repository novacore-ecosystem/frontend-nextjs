import { createTheme, type Theme } from "@mui/material/styles";
import type { ResolvedTheme, ThemeDensity, ThemeTokens } from "./types";

/**
 * Semantic Tokens -> MUI Theme. The only file in the package allowed to
 * import `createTheme`/`Theme` from MUI directly — every component
 * downstream consumes the resulting theme through MUI's `useTheme()` /
 * `sx` internally, never through a type this package re-exports.
 */
export function createMuiTheme(tokens: ThemeTokens, mode: "light" | "dark", resolved: ResolvedTheme, borderRadius: number): Theme {
  const density: ThemeDensity = resolved.density;
  const compact = density === "compact";

  return createTheme({
    palette: {
      mode,
      background: { default: tokens.background, paper: tokens.surface },
      text: { primary: tokens.foreground, secondary: tokens.mutedForeground },
      primary: { main: tokens.primary, contrastText: tokens.primaryForeground },
      secondary: { main: tokens.secondary, contrastText: tokens.secondaryForeground },
      success: { main: tokens.success },
      warning: { main: tokens.warning },
      error: { main: tokens.error },
      info: { main: tokens.info },
      divider: tokens.divider,
    },
    shape: { borderRadius },
    spacing: compact ? 6 : 8,
    typography: {
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiButton: {
        defaultProps: { size: compact ? "small" : "medium", disableElevation: true },
        styleOverrides: { root: { borderRadius } },
      },
      MuiTextField: { defaultProps: { size: compact ? "small" : "medium" } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiCard: {
        styleOverrides: {
          root: { border: `1px solid ${tokens.border}`, backgroundColor: tokens.surface },
        },
      },
      MuiChip: { styleOverrides: { root: { borderRadius: Math.max(borderRadius, 6) } } },
    },
  });
}
