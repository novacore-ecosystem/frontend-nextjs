import MuiTypography from "@mui/material/Typography";
import * as React from "react";
import type { NovaSx, WithChildren } from "../../lib/types";

export type TextSize = "bodyLarge" | "body" | "bodySmall";
export type TextColor = "default" | "muted" | "primary" | "secondary" | "success" | "warning" | "error" | "info";

export interface TextProps extends WithChildren {
  size?: TextSize;
  color?: TextColor;
  weight?: "regular" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
  as?: React.ElementType;
  className?: string;
  sx?: NovaSx;
}

const SIZE_TO_FONT_SIZE: Record<TextSize, string> = {
  bodyLarge: "1.125rem",
  body: "1rem",
  bodySmall: "0.875rem",
};

const WEIGHT_MAP = { regular: 400, medium: 500, semibold: 600, bold: 700 };

const COLOR_MAP: Record<TextColor, string> = {
  default: "text.primary",
  muted: "text.secondary",
  primary: "primary.main",
  secondary: "secondary.main",
  success: "success.main",
  warning: "warning.main",
  error: "error.main",
  info: "info.main",
};

export function Text({ size = "body", color = "default", weight = "regular", align, as = "p", className, sx, children }: TextProps) {
  return (
    <MuiTypography
      component={as}
      align={align}
      className={className}
      sx={[
        { fontSize: SIZE_TO_FONT_SIZE[size], fontWeight: WEIGHT_MAP[weight], color: COLOR_MAP[color], lineHeight: 1.6 },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ] as any}
    >
      {children}
    </MuiTypography>
  );
}
