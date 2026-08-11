"use client";

import * as React from "react";
import { resolveTheme, tokensToCssVars } from "./resolve-theme";
import type { ResolvedTheme, ThemeConfig, ThemeMode, ThemeTokens } from "./types";

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

function applyTokens(root: HTMLElement, tokens: ThemeTokens) {
  const vars = tokensToCssVars(tokens);
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

export interface AdminProviderProps {
  children: React.ReactNode;
  theme?: ThemeConfig;
}

export function AdminProvider({ children, theme }: AdminProviderProps) {
  const [config, setThemeConfig] = React.useState<ThemeConfig>(theme ?? {});
  const resolved = React.useMemo(() => resolveTheme(config), [config]);

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

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", effectiveMode === "dark");
    applyTokens(root, effectiveMode === "dark" ? resolved.dark : resolved.light);
    root.setAttribute("data-nc-base", resolved.base);
    root.setAttribute("data-nc-color", resolved.color);
    root.setAttribute("data-nc-style", resolved.style);
  }, [resolved, effectiveMode]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ config, resolved, effectiveMode, setThemeConfig }),
    [config, resolved, effectiveMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAdminTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useAdminTheme must be used within <AdminProvider>");
  }
  return ctx;
}

export type { ThemeMode };
