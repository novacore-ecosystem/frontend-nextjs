import MuiBox from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import * as React from "react";
import type { NovaSx, WithChildren } from "../../lib/types";

export interface DrawerProps extends WithChildren {
  open: boolean;
  onClose: () => void;
  anchor?: "left" | "right" | "top" | "bottom";
  width?: number;
  className?: string;
  sx?: NovaSx;
}

export function Drawer({ open, onClose, anchor = "right", width = 360, className, sx, children }: DrawerProps) {
  return (
    <MuiDrawer anchor={anchor} open={open} onClose={onClose} className={className} sx={sx as any}>
      <MuiBox sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : width, p: 2 }}>{children}</MuiBox>
    </MuiDrawer>
  );
}
