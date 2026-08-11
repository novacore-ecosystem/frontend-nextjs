import MuiStack from "@mui/material/Stack";
import * as React from "react";
import type { NovaSx, ResponsiveValue, Spacing, WithChildren } from "../../lib/types";

export interface StackProps extends WithChildren {
  direction?: ResponsiveValue<"row" | "column">;
  spacing?: Spacing;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  className?: string;
  sx?: NovaSx;
}

const ALIGN_MAP = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline" };
const JUSTIFY_MAP = { start: "flex-start", center: "center", end: "flex-end", between: "space-between", around: "space-around", evenly: "space-evenly" };

export function Stack({ direction = "column", spacing = 2, align, justify, wrap, className, sx, children }: StackProps) {
  const stackProps: Record<string, unknown> = {
    direction,
    spacing,
    useFlexGap: true,
    className,
    sx: [
      {
        alignItems: align ? ALIGN_MAP[align] : undefined,
        justifyContent: justify ? JUSTIFY_MAP[justify] : undefined,
        flexWrap: wrap ? "wrap" : undefined,
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ],
  };
  return <MuiStack {...(stackProps as React.ComponentProps<typeof MuiStack>)}>{children}</MuiStack>;
}
