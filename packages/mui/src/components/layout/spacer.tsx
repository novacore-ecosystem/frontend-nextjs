import MuiBox from "@mui/material/Box";
import * as React from "react";
import type { Spacing } from "../../lib/types";

export interface SpacerProps {
  size?: Spacing;
  axis?: "horizontal" | "vertical";
}

export function Spacer({ size = 4, axis = "vertical" }: SpacerProps) {
  return <MuiBox sx={axis === "vertical" ? { height: (theme) => theme.spacing(size) } : { width: (theme) => theme.spacing(size) }} />;
}
