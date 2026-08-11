import MuiBox from "@mui/material/Box";
import * as React from "react";
import type { NovaSx, WithChildren } from "../../lib/types";

export interface AspectRatioProps extends WithChildren {
  ratio?: number;
  className?: string;
  sx?: NovaSx;
}

export function AspectRatio({ ratio = 16 / 9, className, sx, children }: AspectRatioProps) {
  return (
    <MuiBox
      className={className}
      sx={[{ position: "relative", width: "100%", aspectRatio: `${ratio}`, overflow: "hidden" }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      <MuiBox sx={{ position: "absolute", inset: 0 }}>{children}</MuiBox>
    </MuiBox>
  );
}
