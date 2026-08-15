"use client";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import MuiBox from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiIconButton from "@mui/material/IconButton";
import * as React from "react";
import type { NovaSx } from "../../lib/types";
import { useClientTheme } from "../../theme/client-provider";

interface AdminLayoutContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  /** Desktop icon-only rail mode. The `sidebar` slot must read this itself (e.g. pass it to `<AdminSidebar collapsed>`) — the layout only owns the state and the rail width. */
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

const AdminLayoutContext = React.createContext<AdminLayoutContextValue | null>(null);

export function useAdminLayout(): AdminLayoutContextValue {
  const ctx = React.useContext(AdminLayoutContext);
  if (!ctx) throw new Error("useAdminLayout must be used within <AdminLayout>");
  return ctx;
}

export interface AdminLayoutProps {
  /** Rendered inside the desktop rail and the mobile drawer. Typically `<AdminSidebar>` — read `sidebarCollapsed` via `useAdminLayout()` to switch it to icon-only mode. */
  sidebar: React.ReactNode;
  /** Rendered as the sticky topbar. Typically `<AdminHeader>`. */
  topbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  sx?: NovaSx;
  defaultCollapsed?: boolean;
  sidebarWidth?: number;
  collapsedWidth?: number;
}

/** Generic admin shell: responsive sidebar rail/drawer + topbar + content. No domain assumptions. */
export function AdminLayout({
  sidebar,
  topbar,
  children,
  className,
  sx,
  defaultCollapsed = false,
  sidebarWidth = 264,
  collapsedWidth = 68,
}: AdminLayoutProps) {
  const { resolved, effectiveMode } = useClientTheme();
  const tokens = effectiveMode === "dark" ? resolved.dark : resolved.light;

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(defaultCollapsed);

  const contextValue = React.useMemo<AdminLayoutContextValue>(
    () => ({ sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed }),
    [sidebarOpen, sidebarCollapsed],
  );
  // The `sidebar` node is mounted twice (desktop rail + mobile drawer). Forcing
  // `sidebarCollapsed: false` for the mobile copy keeps icon-only rail mode a
  // desktop-only concept — a full-width mobile drawer has no reason to collapse.
  const mobileContextValue = React.useMemo<AdminLayoutContextValue>(
    () => ({ ...contextValue, sidebarCollapsed: false }),
    [contextValue],
  );

  return (
    <AdminLayoutContext.Provider value={contextValue}>
      <MuiBox
        className={className}
        sx={[
          { display: "flex", minHeight: "100vh", bgcolor: "background.default", color: "text.primary" },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ] as any}
      >
        <MuiBox
          sx={{
            display: { xs: "none", md: "block" },
            flexShrink: 0,
            overflow: "hidden",
            borderRight: "1px solid",
            borderColor: tokens.sidebarBorder,
            width: sidebarCollapsed ? collapsedWidth : sidebarWidth,
            transition: (theme) => theme.transitions.create("width", { duration: 200 }),
          }}
        >
          {sidebar}
        </MuiBox>

        <MuiDrawer
          anchor="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          slotProps={{ paper: { sx: { width: 288, bgcolor: "transparent", boxShadow: "none" } } }}
        >
          <AdminLayoutContext.Provider value={mobileContextValue}>{sidebar}</AdminLayoutContext.Provider>
        </MuiDrawer>

        <MuiBox sx={{ display: "flex", minWidth: 0, flex: 1, flexDirection: "column" }}>
          {topbar}
          <MuiBox component="main" sx={{ flex: 1, overflowX: "hidden" }}>
            {children}
          </MuiBox>
        </MuiBox>
      </MuiBox>
    </AdminLayoutContext.Provider>
  );
}

export function AdminSidebarToggle({ sx }: { sx?: NovaSx }) {
  const { sidebarOpen, setSidebarOpen } = useAdminLayout();
  return (
    <MuiIconButton
      aria-label="Toggle navigation"
      onClick={() => setSidebarOpen(!sidebarOpen)}
      sx={[{ display: { md: "none" } }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      {sidebarOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
    </MuiIconButton>
  );
}

export function AdminSidebarCollapseToggle({ sx }: { sx?: NovaSx }) {
  const { sidebarCollapsed, setSidebarCollapsed } = useAdminLayout();
  return (
    <MuiIconButton
      aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      onClick={() => setSidebarCollapsed((prev) => !prev)}
      sx={[{ display: { xs: "none", md: "inline-flex" } }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      <ViewSidebarIcon fontSize="small" />
    </MuiIconButton>
  );
}
