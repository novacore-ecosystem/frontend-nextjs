"use client";

import { hasAllPermissions, hasAnyPermission } from "@novacore/frontend-foundation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiBox from "@mui/material/Box";
import MuiCollapse from "@mui/material/Collapse";
import MuiList from "@mui/material/List";
import MuiListItemButton from "@mui/material/ListItemButton";
import MuiListItemIcon from "@mui/material/ListItemIcon";
import MuiListItemText from "@mui/material/ListItemText";
import MuiTooltip from "@mui/material/Tooltip";
import MuiTypography from "@mui/material/Typography";
import Link from "next/link";
import * as React from "react";
import type { NovaSx } from "../../lib/types";
import { useClientTheme } from "../../theme/client-provider";
import type { ThemeTokens } from "../../theme/types";
import type {
  AdminNavigationGroup,
  AdminNavigationItem,
  AdminNavigationItemRenderer,
  AdminNavigationItemRenderProps,
} from "./nav-types";
import { usePermissionContext } from "./permission-provider";

function isItemVisible(item: AdminNavigationItem, permissions: readonly string[] | undefined): boolean {
  if (!item.permission || !permissions) return true;
  const required = Array.isArray(item.permission) ? item.permission : [item.permission];
  return item.permissionMode === "all" ? hasAllPermissions(permissions, required) : hasAnyPermission(permissions, required);
}

function isHrefActive(href: string | undefined, activeHref: string | undefined): boolean {
  if (!href || !activeHref) return false;
  return activeHref === href || activeHref.startsWith(`${href}/`);
}

export interface AdminSidebarProps {
  groups: AdminNavigationGroup[];
  /** Owned permissions used to filter `permission`-tagged items. Falls back to the nearest `<PermissionProvider>` when omitted; if neither is present, every item renders ungated. */
  permissions?: readonly string[];
  /** Current location, e.g. from `usePathname()` — used to compute each item's `active` state. The sidebar has no router awareness of its own. */
  activeHref?: string;
  /** Full custom renderer, given `{ item, active, collapsed, depth }`. Overrides the built-in icon+label+badge+chevron rendering entirely. */
  renderItem?: AdminNavigationItemRenderer;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  /** Icon-only rail mode. */
  collapsed?: boolean;
  className?: string;
  sx?: NovaSx;
}

/** Grouped, permission-aware admin navigation. Renders inside `<AdminLayout sidebar={...}>`. */
export function AdminSidebar({
  groups,
  permissions: permissionsProp,
  activeHref,
  renderItem,
  header,
  footer,
  collapsed = false,
  className,
  sx,
}: AdminSidebarProps) {
  const permissions = permissionsProp ?? usePermissionContext()?.permissions;
  const { resolved, effectiveMode } = useClientTheme();
  const tokens = effectiveMode === "dark" ? resolved.dark : resolved.light;

  return (
    <MuiBox
      className={className}
      sx={[
        { display: "flex", flexDirection: "column", height: "100%", bgcolor: tokens.sidebar, color: tokens.sidebarForeground },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ] as any}
    >
      {header ? (
        <MuiBox
          sx={{
            display: "flex",
            alignItems: "center",
            height: 56,
            flexShrink: 0,
            borderBottom: "1px solid",
            borderColor: tokens.sidebarBorder,
            px: collapsed ? 1 : 2,
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          {header}
        </MuiBox>
      ) : null}
      <MuiBox sx={{ flex: 1, overflowY: "auto", py: 1.5, px: 1.5 }}>
        <MuiList disablePadding sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {groups.map((group) => (
            <SidebarGroupView
              key={group.id}
              group={group}
              permissions={permissions}
              activeHref={activeHref}
              renderItem={renderItem}
              collapsed={collapsed}
              tokens={tokens}
            />
          ))}
        </MuiList>
      </MuiBox>
      {footer ? (
        <MuiBox sx={{ flexShrink: 0, borderTop: "1px solid", borderColor: tokens.sidebarBorder, p: 1.5 }}>{footer}</MuiBox>
      ) : null}
    </MuiBox>
  );
}

interface GroupViewProps {
  group: AdminNavigationGroup;
  permissions?: readonly string[];
  activeHref?: string;
  renderItem?: AdminNavigationItemRenderer;
  collapsed: boolean;
  tokens: ThemeTokens;
}

function SidebarGroupView({ group, permissions, activeHref, renderItem, collapsed, tokens }: GroupViewProps) {
  const [open, setOpen] = React.useState(group.defaultOpen ?? true);
  const visibleItems = group.items.filter((item) => isItemVisible(item, permissions));
  if (visibleItems.length === 0) return null;

  const list = (
    <MuiBox sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
      {visibleItems.map((item) => (
        <SidebarItemView
          key={item.id}
          item={item}
          permissions={permissions}
          activeHref={activeHref}
          renderItem={renderItem}
          collapsed={collapsed}
          depth={0}
          tokens={tokens}
        />
      ))}
    </MuiBox>
  );

  if (!group.title || collapsed) return list;

  return (
    <MuiBox>
      {group.collapsible ? (
        <MuiListItemButton
          onClick={() => setOpen((prev) => !prev)}
          sx={{ px: 1, py: 0.5, borderRadius: 1, minHeight: 0 }}
        >
          <MuiTypography variant="caption" sx={{ flex: 1, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: `${tokens.sidebarForeground}80` }}>
            {group.title}
          </MuiTypography>
          <ExpandMoreIcon fontSize="small" sx={{ transform: open ? "none" : "rotate(-90deg)", transition: (t) => t.transitions.create("transform"), opacity: 0.6 }} />
        </MuiListItemButton>
      ) : (
        <MuiTypography
          variant="caption"
          sx={{ display: "block", px: 1, mb: 0.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: `${tokens.sidebarForeground}80` }}
        >
          {group.title}
        </MuiTypography>
      )}
      <MuiCollapse in={!group.collapsible || open}>{list}</MuiCollapse>
    </MuiBox>
  );
}

interface ItemViewProps {
  item: AdminNavigationItem;
  permissions?: readonly string[];
  activeHref?: string;
  renderItem?: AdminNavigationItemRenderer;
  collapsed: boolean;
  depth: number;
  tokens: ThemeTokens;
}

function SidebarItemView({ item, permissions, activeHref, renderItem, collapsed, depth, tokens }: ItemViewProps) {
  const [open, setOpen] = React.useState(true);
  const active = isHrefActive(item.href, activeHref);
  const visibleChildren = item.children?.filter((child) => isItemVisible(child, permissions)) ?? [];
  const hasChildren = visibleChildren.length > 0;

  const node = renderItem ? (
    renderItem({ item, active, collapsed, depth })
  ) : (
    <DefaultSidebarLink
      item={item}
      active={active}
      collapsed={collapsed}
      depth={depth}
      hasChildren={hasChildren}
      open={open}
      onToggle={() => setOpen((prev) => !prev)}
      tokens={tokens}
    />
  );

  const wrapped =
    !hasChildren && collapsed && item.label ? (
      <MuiTooltip title={item.label} placement="right" arrow>
        {node as React.ReactElement}
      </MuiTooltip>
    ) : (
      node
    );

  if (!hasChildren) return wrapped;

  return (
    <MuiBox>
      {wrapped}
      <MuiCollapse in={open}>
        <MuiBox sx={{ mt: 0.25, display: "flex", flexDirection: "column", gap: 0.25 }}>
          {visibleChildren.map((child) => (
            <SidebarItemView
              key={child.id}
              item={child}
              permissions={permissions}
              activeHref={activeHref}
              renderItem={renderItem}
              collapsed={collapsed}
              depth={depth + 1}
              tokens={tokens}
            />
          ))}
        </MuiBox>
      </MuiCollapse>
    </MuiBox>
  );
}

function DefaultSidebarLink({
  item,
  active,
  collapsed,
  depth,
  hasChildren,
  open,
  onToggle,
  tokens,
}: AdminNavigationItemRenderProps & { hasChildren: boolean; open: boolean; onToggle: () => void; tokens: ThemeTokens }) {
  const commonProps = {
    sx: {
      borderRadius: 1.5,
      minHeight: 0,
      py: 1,
      px: collapsed ? 0 : 1.25,
      pl: depth > 0 && !collapsed ? 4 : collapsed ? 0 : 1.25,
      justifyContent: collapsed ? "center" : "flex-start",
      gap: 1.25,
      color: active ? tokens.sidebarPrimaryForeground : tokens.sidebarForeground,
      bgcolor: active ? tokens.sidebarPrimary : "transparent",
      opacity: item.disabled ? 0.5 : 1,
      pointerEvents: item.disabled ? "none" : "auto",
      "&:hover": { bgcolor: active ? tokens.sidebarPrimary : tokens.sidebarAccent },
    },
  } as const;

  const content = (
    <>
      {item.icon ? (
        <MuiListItemIcon sx={{ minWidth: 0, color: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {item.icon}
        </MuiListItemIcon>
      ) : null}
      {!collapsed ? (
        <>
          <MuiListItemText
            primary={item.label}
            slotProps={{ primary: { noWrap: true, sx: { fontSize: 14, fontWeight: 500 } } }}
            sx={{ my: 0 }}
          />
          {item.badge}
          {hasChildren ? (
            <ExpandMoreIcon fontSize="small" sx={{ transform: open ? "none" : "rotate(-90deg)", transition: (t) => t.transitions.create("transform"), opacity: 0.7 }} />
          ) : null}
        </>
      ) : null}
    </>
  );

  if (item.href && !hasChildren) {
    return (
      <MuiListItemButton component={Link as any} href={item.href} {...commonProps}>
        {content}
      </MuiListItemButton>
    );
  }

  return (
    <MuiListItemButton onClick={onToggle} {...commonProps}>
      {content}
    </MuiListItemButton>
  );
}
