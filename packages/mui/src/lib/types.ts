import type * as React from "react";

/**
 * Structural escape hatch for advanced style overrides (mirrors MUI's `sx`
 * shape without importing/re-exporting MUI's `SxProps<Theme>` type by
 * name — see mission rule "never leak MUI types"). Most components don't
 * need it; it exists for the rare advanced case per the explicit escape
 * hatch requirement.
 */
export type NovaSx = Record<string, unknown> | ReadonlyArray<Record<string, unknown> | boolean | undefined>;

export type Spacing = number | string;

export type ResponsiveValue<T> = T | Partial<Record<"xs" | "sm" | "md" | "lg" | "xl", T>>;

export interface WithChildren {
  children?: React.ReactNode;
}
