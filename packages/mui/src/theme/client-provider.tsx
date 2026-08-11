"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import * as React from "react";
import { createMuiTheme } from "./create-mui-theme";
import { resolveBorderRadius, resolveTheme } from "./resolve-theme";
import type { ResolvedTheme, ThemeConfig } from "./types";

interface ThemeContextValue {
  config: ThemeConfig;
  resolved: ResolvedTheme;
  effectiveMode: "light" | "dark";
  setThemeConfig: (config: ThemeConfig | ((prev: ThemeConfig) => ThemeConfig)) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemMode(): "light" | "dark" {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export interface ClientProviderProps {
  children: React.ReactNode;
  theme?: ThemeConfig;
}

/**
 * Single high-level provider: MUI's Emotion cache (App Router SSR-safe via
 * `AppRouterCacheProvider`), `ThemeProvider`, `CssBaseline`, and NovaCore's
 * own theme resolution/state. Consumers never touch `createTheme`, Emotion,
 * or `ThemeProvider` directly.
 */
export function ClientProvider({ children, theme }: ClientProviderProps) {
  const [config, setThemeConfig] = React.useState<ThemeConfig>(theme ?? {});
  const resolved = React.useMemo(() => resolveTheme(config), [config]);

  // Server and first client render always agree on "light" so there is no
  // hydration mismatch; system preference is applied after mount, which
  // trades a brief flash for correctness (documented limitation).
  const [systemMode, setSystemMode] = React.useState<"light" | "dark">("light");
  const effectiveMode: "light" | "dark" = resolved.mode === "system" ? systemMode : resolved.mode;

  React.useEffect(() => {
    setSystemMode(getSystemMode());
    if (resolved.mode !== "system" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event: MediaQueryListEvent) => setSystemMode(event.matches ? "dark" : "light");
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [resolved.mode]);

  const borderRadius = resolveBorderRadius(resolved, config);
  const muiTheme = React.useMemo(
    () => createMuiTheme(effectiveMode === "dark" ? resolved.dark : resolved.light, effectiveMode, resolved, borderRadius),
    [resolved, effectiveMode, borderRadius],
  );

  const value = React.useMemo<ThemeContextValue>(
    () => ({ config, resolved, effectiveMode, setThemeConfig }),
    [config, resolved, effectiveMode],
  );

  return (
    <AppRouterCacheProvider options={{ key: "novacore-mui" }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}

export function useClientTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useClientTheme must be used within <ClientProvider>");
  }
  return ctx;
}
