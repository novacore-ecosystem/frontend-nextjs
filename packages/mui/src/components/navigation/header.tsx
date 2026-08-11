"use client";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import MuiBox from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiIconButton from "@mui/material/IconButton";
import MuiToolbar from "@mui/material/Toolbar";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export interface HeaderProps {
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
  /** Rendered inside the mobile drawer when the menu button is tapped. */
  mobileNavigation?: React.ReactNode;
  sticky?: boolean;
  className?: string;
  sx?: NovaSx;
}

export function Header({ logo, navigation, actions, mobileNavigation, sticky = true, className, sx }: HeaderProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <MuiAppBar
      position={sticky ? "sticky" : "static"}
      color="transparent"
      elevation={0}
      className={className}
      sx={[{ bgcolor: "background.default", borderBottom: "1px solid", borderColor: "divider", backdropFilter: "blur(8px)" }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      <MuiToolbar sx={{ maxWidth: "lg", mx: "auto", width: "100%", px: { xs: 2, md: 4 } }}>
        <MuiBox sx={{ flexShrink: 0 }}>{logo}</MuiBox>
        <MuiBox sx={{ flex: 1, display: { xs: "none", md: "flex" }, justifyContent: "center" }}>{navigation}</MuiBox>
        <MuiBox sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>{actions}</MuiBox>
        {mobileNavigation ? (
          <MuiBox sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
            <MuiIconButton aria-label="Open menu" onClick={() => setOpen(true)}>
              <MenuIcon />
            </MuiIconButton>
          </MuiBox>
        ) : null}
      </MuiToolbar>

      <MuiDrawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <MuiBox sx={{ width: 280, p: 2 }}>
          <MuiBox sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <MuiIconButton aria-label="Close menu" onClick={() => setOpen(false)}>
              <CloseIcon />
            </MuiIconButton>
          </MuiBox>
          {mobileNavigation}
        </MuiBox>
      </MuiDrawer>
    </MuiAppBar>
  );
}
