import MuiDivider from "@mui/material/Divider";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  sx?: NovaSx;
}

export function Divider({ orientation = "horizontal", className, sx }: DividerProps) {
  return <MuiDivider orientation={orientation} className={className} sx={sx as any} />;
}
