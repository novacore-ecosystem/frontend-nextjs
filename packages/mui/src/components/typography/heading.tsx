import MuiTypography from "@mui/material/Typography";
import * as React from "react";
import type { NovaSx, WithChildren } from "../../lib/types";

export type HeadingSize = "display" | "h1" | "h2" | "h3" | "h4";

export interface HeadingProps extends WithChildren {
  size?: HeadingSize;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  align?: "left" | "center" | "right";
  className?: string;
  sx?: NovaSx;
}

const SIZE_TO_VARIANT: Record<HeadingSize, "h1" | "h2" | "h3" | "h4"> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
};

const SIZE_TO_FONT_SIZE: Record<HeadingSize, { xs: string; md: string }> = {
  display: { xs: "2.5rem", md: "4rem" },
  h1: { xs: "2rem", md: "3rem" },
  h2: { xs: "1.75rem", md: "2.25rem" },
  h3: { xs: "1.375rem", md: "1.75rem" },
  h4: { xs: "1.125rem", md: "1.375rem" },
};

export function Heading({ size = "h2", as, align, className, sx, children }: HeadingProps) {
  const font = SIZE_TO_FONT_SIZE[size];
  return (
    <MuiTypography
      variant={SIZE_TO_VARIANT[size]}
      component={as ?? (size === "display" ? "h1" : SIZE_TO_VARIANT[size])}
      align={align}
      className={className}
      sx={[{ fontWeight: 700, letterSpacing: "-0.02em", fontSize: font }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      {children}
    </MuiTypography>
  );
}
