import MuiContainer from "@mui/material/Container";
import * as React from "react";
import type { NovaSx, WithChildren } from "../../lib/types";

export type ContainerMaxWidth = "sm" | "md" | "lg" | "xl" | "full";

export interface ContainerProps extends WithChildren {
  maxWidth?: ContainerMaxWidth;
  disableGutters?: boolean;
  className?: string;
  sx?: NovaSx;
}

const MAX_WIDTH_MAP: Record<ContainerMaxWidth, false | "sm" | "md" | "lg" | "xl"> = {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  full: false,
};

export function Container({ maxWidth = "lg", disableGutters, className, sx, children }: ContainerProps) {
  return (
    <MuiContainer maxWidth={MAX_WIDTH_MAP[maxWidth]} disableGutters={disableGutters} className={className} sx={sx as any}>
      {children}
    </MuiContainer>
  );
}
