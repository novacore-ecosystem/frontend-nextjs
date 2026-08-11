"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { useAdminTheme } from "./admin-provider";
import { THEME_PRESETS } from "./presets";
import { ACCENT_COLORS, BASE_PALETTES } from "./tokens";
import type { ThemeBase, ThemeColor, ThemeMode, ThemeRadius } from "./types";

const MODES: ThemeMode[] = ["light", "dark", "system"];
const RADII: ThemeRadius[] = ["none", "small", "medium", "large"];

export interface ThemeCustomizerProps {
  className?: string;
}

/** Dev/demo control panel for previewing mode, base palette, accent color, and radius live. */
export function ThemeCustomizer({ className }: ThemeCustomizerProps) {
  const { config, resolved, setThemeConfig } = useAdminTheme();

  return (
    <div className={cn("space-y-4 rounded-lg border border-border bg-card p-4 text-card-foreground", className)}>
      <section>
        <h3 className="mb-2 text-sm font-medium">Mode</h3>
        <div className="flex gap-2">
          {MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setThemeConfig((prev) => ({ ...prev, mode }))}
              className={cn(
                "rounded-md border px-3 py-1 text-xs capitalize",
                (config.mode ?? "system") === mode
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground",
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-medium">Base palette</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(BASE_PALETTES) as ThemeBase[]).map((base) => (
            <button
              key={base}
              type="button"
              onClick={() => setThemeConfig((prev) => ({ ...prev, base }))}
              className={cn(
                "rounded-md border px-3 py-1 text-xs capitalize",
                resolved.base === base
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border bg-background text-foreground",
              )}
            >
              {base}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-medium">Accent color</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(ACCENT_COLORS) as ThemeColor[]).map((color) => (
            <button
              key={color}
              type="button"
              aria-label={color}
              onClick={() => setThemeConfig((prev) => ({ ...prev, color }))}
              className={cn(
                "h-6 w-6 rounded-full border-2",
                resolved.color === color ? "border-foreground" : "border-transparent",
              )}
              style={{ backgroundColor: `hsl(${ACCENT_COLORS[color].light})` }}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-medium">Radius</h3>
        <div className="flex gap-2">
          {RADII.map((radius) => (
            <button
              key={radius}
              type="button"
              onClick={() => setThemeConfig((prev) => ({ ...prev, radius }))}
              className={cn(
                "rounded-md border px-3 py-1 text-xs capitalize",
                resolved.radius === radius
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border bg-background text-foreground",
              )}
            >
              {radius}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-medium">Presets</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(THEME_PRESETS).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setThemeConfig({ preset })}
              className="rounded-md border border-border bg-background px-3 py-1 text-xs text-foreground"
            >
              {preset}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
