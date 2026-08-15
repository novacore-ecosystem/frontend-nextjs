"use client";

import { hasAllPermissions, hasAnyPermission } from "@novacore/frontend-foundation";
import SearchIcon from "@mui/icons-material/Search";
import MuiBox from "@mui/material/Box";
import MuiDialog from "@mui/material/Dialog";
import MuiInputBase from "@mui/material/InputBase";
import MuiList from "@mui/material/List";
import MuiListItemButton from "@mui/material/ListItemButton";
import MuiListItemIcon from "@mui/material/ListItemIcon";
import MuiListItemText from "@mui/material/ListItemText";
import MuiListSubheader from "@mui/material/ListSubheader";
import MuiTypography from "@mui/material/Typography";
import * as React from "react";
import type { ApplicationDefinition, AdminNavigationGroup, AdminNavigationItem } from "./nav-types";
import { usePermissionContext } from "./permission-provider";

function isItemVisible(item: AdminNavigationItem, permissions: readonly string[] | undefined): boolean {
  if (!item.permission || !permissions) return true;
  const required = Array.isArray(item.permission) ? item.permission : [item.permission];
  return item.permissionMode === "all" ? hasAllPermissions(permissions, required) : hasAnyPermission(permissions, required);
}

export interface CommandPaletteAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Same groups passed to `<AdminSidebar>` — flattened, permission-filtered the same way, and searched by label. */
  navigationGroups?: AdminNavigationGroup[];
  /** Owned permissions used to filter `permission`-tagged items. Falls back to the nearest `<PermissionProvider>` when omitted; if neither is present, every item is searchable. */
  permissions?: readonly string[];
  onNavigate?: (item: AdminNavigationItem) => void;
  applications?: ApplicationDefinition[];
  onSelectApplication?: (application: ApplicationDefinition) => void;
  actions?: CommandPaletteAction[];
  placeholder?: string;
}

function flattenAdminNavigationItems(groups: AdminNavigationGroup[], permissions: readonly string[] | undefined): AdminNavigationItem[] {
  const result: AdminNavigationItem[] = [];
  const visit = (item: AdminNavigationItem) => {
    if (!isItemVisible(item, permissions)) return;
    if (item.href) result.push(item);
    item.children?.forEach(visit);
  };
  for (const group of groups) {
    for (const item of group.items) visit(item);
  }
  return result;
}

const SUBHEADER_SX = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  lineHeight: "28px",
};

/** Cmd/Ctrl+K global search over navigation, quick actions, and application switching. Pair with `useCommandPalette()` for the keyboard shortcut. */
export function CommandPalette({
  open,
  onOpenChange,
  navigationGroups = [],
  permissions: permissionsProp,
  onNavigate,
  applications = [],
  onSelectApplication,
  actions = [],
  placeholder = "Search pages, actions, applications…",
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState("");
  const permissions = permissionsProp ?? usePermissionContext()?.permissions;
  const navItems = React.useMemo(() => flattenAdminNavigationItems(navigationGroups, permissions), [navigationGroups, permissions]);

  React.useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const q = query.trim().toLowerCase();
  const filteredActions = q ? actions.filter((a) => a.label.toLowerCase().includes(q)) : actions;
  const filteredNav = q ? navItems.filter((i) => i.label.toLowerCase().includes(q)) : navItems;
  const filteredApps = q ? applications.filter((a) => a.name.toLowerCase().includes(q)) : applications;
  const hasResults = filteredActions.length > 0 || filteredNav.length > 0 || filteredApps.length > 0;

  return (
    <MuiDialog
      open={open}
      onClose={() => onOpenChange(false)}
      slotProps={{ paper: { sx: { position: "fixed", top: "20%", m: 0, width: "100%", maxWidth: 560, borderRadius: 2 } } }}
    >
      <MuiBox sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
        <MuiInputBase
          autoFocus
          fullWidth
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          sx={{ py: 1.5, fontSize: 14 }}
        />
      </MuiBox>
      <MuiBox sx={{ maxHeight: 360, overflowY: "auto", py: 1 }}>
        {!hasResults ? (
          <MuiTypography variant="body2" sx={{ py: 3, textAlign: "center", color: "text.secondary" }}>
            No results found.
          </MuiTypography>
        ) : null}

        {filteredActions.length > 0 ? (
          <MuiList subheader={<MuiListSubheader disableSticky sx={SUBHEADER_SX}>Quick actions</MuiListSubheader>} dense>
            {filteredActions.map((action) => (
              <MuiListItemButton
                key={action.id}
                onClick={() => {
                  action.onSelect();
                  onOpenChange(false);
                }}
                sx={{ borderRadius: 1, mx: 1 }}
              >
                {action.icon ? <MuiListItemIcon sx={{ minWidth: 32 }}>{action.icon}</MuiListItemIcon> : null}
                <MuiListItemText primary={action.label} />
                {action.shortcut ? (
                  <MuiTypography variant="caption" color="text.secondary">
                    {action.shortcut}
                  </MuiTypography>
                ) : null}
              </MuiListItemButton>
            ))}
          </MuiList>
        ) : null}

        {filteredNav.length > 0 ? (
          <MuiList subheader={<MuiListSubheader disableSticky sx={SUBHEADER_SX}>Navigation</MuiListSubheader>} dense>
            {filteredNav.map((item) => (
              <MuiListItemButton
                key={item.id}
                onClick={() => {
                  onNavigate?.(item);
                  onOpenChange(false);
                }}
                sx={{ borderRadius: 1, mx: 1 }}
              >
                {item.icon ? <MuiListItemIcon sx={{ minWidth: 32 }}>{item.icon}</MuiListItemIcon> : null}
                <MuiListItemText primary={item.label} />
              </MuiListItemButton>
            ))}
          </MuiList>
        ) : null}

        {filteredApps.length > 0 ? (
          <MuiList subheader={<MuiListSubheader disableSticky sx={SUBHEADER_SX}>Switch application</MuiListSubheader>} dense>
            {filteredApps.map((app) => (
              <MuiListItemButton
                key={app.id}
                onClick={() => {
                  onSelectApplication?.(app);
                  onOpenChange(false);
                }}
                sx={{ borderRadius: 1, mx: 1 }}
              >
                {app.icon ? <MuiListItemIcon sx={{ minWidth: 32 }}>{app.icon}</MuiListItemIcon> : null}
                <MuiListItemText primary={app.name} />
              </MuiListItemButton>
            ))}
          </MuiList>
        ) : null}
      </MuiBox>
    </MuiDialog>
  );
}

/** Owns open/close state and the global Cmd/Ctrl+K shortcut for `<CommandPalette>`. */
export function useCommandPalette() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { open, setOpen };
}
