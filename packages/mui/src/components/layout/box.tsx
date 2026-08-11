import MuiBox from "@mui/material/Box";
import * as React from "react";
import type { NovaSx, WithChildren } from "../../lib/types";

export interface BoxProps extends WithChildren {
  as?: React.ElementType;
  className?: string;
  sx?: NovaSx;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export function Box({ as, className, sx, children, ...rest }: BoxProps) {
  const boxProps: Record<string, unknown> = { className, sx, ...rest };
  if (as) boxProps.component = as;
  return (
    <MuiBox {...(boxProps as React.ComponentProps<typeof MuiBox>)}>{children}</MuiBox>
  );
}
