import MuiBox from "@mui/material/Box";
import * as React from "react";
import type { NovaSx, WithChildren } from "../../lib/types";

export type SectionPadding = "none" | "sm" | "md" | "lg" | "xl";
export type SectionBackground = "default" | "surface" | "surfaceVariant";

export interface SectionProps extends WithChildren {
  padding?: SectionPadding;
  background?: SectionBackground;
  className?: string;
  sx?: NovaSx;
}

const PADDING_MAP: Record<SectionPadding, { xs: number; md: number }> = {
  none: { xs: 0, md: 0 },
  sm: { xs: 4, md: 6 },
  md: { xs: 6, md: 10 },
  lg: { xs: 8, md: 14 },
  xl: { xs: 10, md: 20 },
};

const BACKGROUND_MAP: Record<SectionBackground, string> = {
  default: "background.default",
  surface: "background.paper",
  surfaceVariant: "action.hover",
};

export function Section({ padding = "md", background = "default", className, sx, children }: SectionProps) {
  const py = PADDING_MAP[padding];
  return (
    <MuiBox
      component="section"
      className={className}
      sx={[{ py: { xs: py.xs, md: py.md }, bgcolor: BACKGROUND_MAP[background] }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      {children}
    </MuiBox>
  );
}
