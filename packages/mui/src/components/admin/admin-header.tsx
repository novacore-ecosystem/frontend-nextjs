import MuiAppBar from "@mui/material/AppBar";
import MuiBox from "@mui/material/Box";
import MuiDivider from "@mui/material/Divider";
import MuiToolbar from "@mui/material/Toolbar";
import * as React from "react";
import type { NovaSx } from "../../lib/types";
import { AdminSidebarToggle } from "./admin-layout";

export interface AdminHeaderProps {
  /** Freeform leading content — rendered after the app switcher/breadcrumb, before the trailing slots. Kept for simple/legacy usage; prefer the named slots below for a consistent layout. */
  children?: React.ReactNode;
  applicationSwitcher?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  search?: React.ReactNode;
  notifications?: React.ReactNode;
  localeSwitcher?: React.ReactNode;
  themeToggle?: React.ReactNode;
  actions?: React.ReactNode;
  userMenu?: React.ReactNode;
  className?: string;
  sx?: NovaSx;
}

/** Admin topbar: sidebar toggle + app switcher + breadcrumb on the left, search/notifications/locale/theme/actions/user menu on the right. Every slot is optional — pass only what the app needs. */
export function AdminHeader({
  children,
  applicationSwitcher,
  breadcrumb,
  search,
  notifications,
  localeSwitcher,
  themeToggle,
  actions,
  userMenu,
  className,
  sx,
}: AdminHeaderProps) {
  const hasTrailing = search || notifications || localeSwitcher || themeToggle || actions || userMenu;

  return (
    <MuiAppBar
      position="sticky"
      color="transparent"
      elevation={0}
      className={className}
      sx={[
        { bgcolor: "background.default", borderBottom: "1px solid", borderColor: "divider", backdropFilter: "blur(8px)" },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ] as any}
    >
      <MuiToolbar sx={{ minHeight: 56, gap: 1.5, px: 2 }}>
        <AdminSidebarToggle />
        {applicationSwitcher}
        {breadcrumb}
        <MuiBox sx={{ display: "flex", flex: 1, minWidth: 0, alignItems: "center", gap: 1.5 }}>{children}</MuiBox>

        {hasTrailing ? (
          <MuiBox sx={{ display: "flex", flexShrink: 0, alignItems: "center", gap: 0.75 }}>
            {search}
            {notifications}
            {localeSwitcher}
            {themeToggle}
            {actions}
            {userMenu ? (
              <>
                <MuiDivider orientation="vertical" flexItem sx={{ mx: 0.5, alignSelf: "center", height: 24 }} />
                {userMenu}
              </>
            ) : null}
          </MuiBox>
        ) : null}
      </MuiToolbar>
    </MuiAppBar>
  );
}
