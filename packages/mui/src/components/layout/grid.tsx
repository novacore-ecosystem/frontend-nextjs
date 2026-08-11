import MuiBox from "@mui/material/Box";
import * as React from "react";
import type { NovaSx, ResponsiveValue, Spacing, WithChildren } from "../../lib/types";

export interface GridProps extends WithChildren {
  columns?: ResponsiveValue<number>;
  gap?: Spacing;
  className?: string;
  sx?: NovaSx;
}

function toTemplateColumns(columns: ResponsiveValue<number> | undefined) {
  if (columns === undefined) return { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" };
  if (typeof columns === "number") return `repeat(${columns}, 1fr)`;
  const out: Record<string, string> = {};
  for (const [breakpoint, value] of Object.entries(columns)) {
    if (value !== undefined) out[breakpoint] = `repeat(${value}, 1fr)`;
  }
  return out;
}

/** CSS-grid based layout — own responsive contract, not MUI's Grid item/xs/sm/md API. */
export function Grid({ columns, gap = 3, className, sx, children }: GridProps) {
  return (
    <MuiBox
      className={className}
      sx={[{ display: "grid", gridTemplateColumns: toTemplateColumns(columns), gap }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      {children}
    </MuiBox>
  );
}

export interface GridItemProps extends WithChildren {
  span?: ResponsiveValue<number>;
  className?: string;
  sx?: NovaSx;
}

export function GridItem({ span, className, sx, children }: GridItemProps) {
  const gridColumn =
    span === undefined
      ? undefined
      : typeof span === "number"
        ? `span ${span} / span ${span}`
        : Object.fromEntries(Object.entries(span).map(([bp, value]) => [bp, `span ${value} / span ${value}`]));
  return (
    <MuiBox className={className} sx={[{ gridColumn }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}>
      {children}
    </MuiBox>
  );
}
