"use client";

import { hasAllPermissions, hasAnyPermission } from "@novacore/frontend-foundation";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { cn } from "../../lib/cn";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Tooltip } from "../ui/tooltip";
import type { NavigationGroup, NavigationItem, NavigationItemRenderer, NavigationItemRenderProps } from "./nav-types";
import { usePermissionContext } from "./permission-provider";

function isItemVisible(item: NavigationItem, permissions: readonly string[] | undefined): boolean {
  if (!item.permission || !permissions) return true;
  const required = Array.isArray(item.permission) ? item.permission : [item.permission];
  return item.permissionMode === "all" ? hasAllPermissions(permissions, required) : hasAnyPermission(permissions, required);
}

function isHrefActive(href: string | undefined, activeHref: string | undefined): boolean {
  if (!href || !activeHref) return false;
  return activeHref === href || activeHref.startsWith(`${href}/`);
}

/**
 * Sibling items (e.g. "All tenants" at `/tenants` and "New tenant" at `/tenants/new`) can
 * both prefix-match one `activeHref` — only the item whose `href` is the longest matching
 * prefix should render active. Flattens every item across every group (including nested
 * `children`) and returns the single best-matching href, or `undefined` if none match.
 */
function resolveBestMatchHref(groups: NavigationGroup[], activeHref: string | undefined): string | undefined {
  if (!activeHref) return undefined;
  let best: string | undefined;
  const visit = (item: NavigationItem) => {
    if (item.href && isHrefActive(item.href, activeHref) && (!best || item.href.length > best.length)) {
      best = item.href;
    }
    item.children?.forEach(visit);
  };
  groups.forEach((group) => group.items.forEach(visit));
  return best;
}

export interface AdminSidebarProps {
  groups: NavigationGroup[];
  /** Owned permissions used to filter `permission`-tagged items. Falls back to the nearest `<PermissionProvider>` when omitted; if neither is present, every item renders ungated. */
  permissions?: readonly string[];
  /** Current location, e.g. from `usePathname()` — used to compute each item's `active` state. The sidebar has no router awareness of its own. */
  activeHref?: string;
  /** Full custom renderer, given `{ item, active, collapsed, depth }`. Overrides the built-in icon+label+badge+chevron rendering entirely. */
  renderItem?: NavigationItemRenderer;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  /** Icon-only rail mode. */
  collapsed?: boolean;
  /** Controlled per-group open state, keyed by `group.id` — pass alongside `onGroupOpenChange` to own it externally (e.g. to persist it). Omit both to keep each group's `defaultOpen`-only uncontrolled behavior. */
  openGroupIds?: Record<string, boolean>;
  onGroupOpenChange?: (groupId: string, open: boolean) => void;
  className?: string;
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
  openGroupIds,
  onGroupOpenChange,
  className,
}: AdminSidebarProps) {
  const permissions = permissionsProp ?? usePermissionContext()?.permissions;
  const bestMatchHref = React.useMemo(() => resolveBestMatchHref(groups, activeHref), [groups, activeHref]);

  return (
    <div className={cn("flex h-full flex-col bg-sidebar text-sidebar-foreground", className)}>
      {header ? (
        <div className={cn("flex h-14 shrink-0 items-center border-b border-sidebar-border", collapsed ? "justify-center px-2" : "px-4")}>
          {header}
        </div>
      ) : null}
      <ScrollArea className="flex-1" hideScrollbar>
        <nav className="flex flex-col gap-4 p-3">
          {groups.map((group, index) => (
            <React.Fragment key={group.id}>
              {collapsed && index > 0 ? <Separator className="bg-sidebar-border" /> : null}
              <SidebarGroupView
                group={group}
                permissions={permissions}
                activeHref={bestMatchHref}
                renderItem={renderItem}
                collapsed={collapsed}
                open={openGroupIds?.[group.id]}
                onOpenChange={onGroupOpenChange ? (open) => onGroupOpenChange(group.id, open) : undefined}
              />
            </React.Fragment>
          ))}
        </nav>
      </ScrollArea>
      {footer ? <div className="shrink-0 border-t border-sidebar-border p-3">{footer}</div> : null}
    </div>
  );
}

interface GroupViewProps {
  group: NavigationGroup;
  permissions?: readonly string[];
  activeHref?: string;
  renderItem?: NavigationItemRenderer;
  collapsed: boolean;
  /** Controlled open state for this one group — undefined keeps the group's own `defaultOpen`-only uncontrolled behavior. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function SidebarGroupView({ group, permissions, activeHref, renderItem, collapsed, open, onOpenChange }: GroupViewProps) {
  const visibleItems = group.items.filter((item) => isItemVisible(item, permissions));
  if (visibleItems.length === 0) return null;

  const list = (
    <div className={cn("flex flex-col gap-0.5", collapsed && "items-center")}>
      {visibleItems.map((item) => (
        <SidebarItemView
          key={item.id}
          item={item}
          permissions={permissions}
          activeHref={activeHref}
          renderItem={renderItem}
          collapsed={collapsed}
          depth={0}
        />
      ))}
    </div>
  );

  if (!group.title || collapsed) return list;

  if (group.collapsible) {
    const collapsibleProps =
      open !== undefined ? { open, onOpenChange } : { defaultOpen: group.defaultOpen ?? true };
    return (
      <Collapsible {...collapsibleProps}>
        <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground/80">
          <span>{group.title}</span>
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=closed]:-rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>{list}</CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="px-2 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/50">{group.title}</p>
      {list}
    </div>
  );
}

interface ItemViewProps {
  item: NavigationItem;
  permissions?: readonly string[];
  /** Pre-resolved by `AdminSidebar` as the single longest-prefix-matching href across the whole tree — compare with `===`, not a prefix check, so sibling items never double-match. */
  activeHref?: string;
  renderItem?: NavigationItemRenderer;
  collapsed: boolean;
  depth: number;
}

function subtreeContainsHref(item: NavigationItem, href: string | undefined): boolean {
  if (!href) return false;
  if (item.href === href) return true;
  return item.children?.some((child) => subtreeContainsHref(child, href)) ?? false;
}

function SidebarItemView({ item, permissions, activeHref, renderItem, collapsed, depth }: ItemViewProps) {
  const active = item.href !== undefined && item.href === activeHref;
  const visibleChildren = item.children?.filter((child) => isItemVisible(child, permissions)) ?? [];

  const node = renderItem
    ? renderItem({ item, active, collapsed, depth })
    : <DefaultSidebarLink item={item} active={active} collapsed={collapsed} depth={depth} hasChildren={visibleChildren.length > 0} />;

  if (visibleChildren.length === 0) {
    return collapsed && item.label ? (
      <Tooltip content={item.label} side="right">
        {node}
      </Tooltip>
    ) : (
      node
    );
  }

  return (
    <Collapsible defaultOpen={subtreeContainsHref(item, activeHref)}>
      <CollapsibleTrigger asChild>{node}</CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-0.5 flex flex-col gap-0.5">
          {visibleChildren.map((child) => (
            <SidebarItemView
              key={child.id}
              item={child}
              permissions={permissions}
              activeHref={activeHref}
              renderItem={renderItem}
              collapsed={collapsed}
              depth={depth + 1}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function DefaultSidebarLink({
  item,
  active,
  collapsed,
  depth,
  hasChildren,
}: NavigationItemRenderProps & { hasChildren: boolean }) {
  const className = cn(
    "flex items-center gap-2.5 rounded-md text-sm font-medium transition-colors",
    collapsed ? "size-10 justify-center p-0" : "w-full px-2.5 py-2",
    depth > 0 && !collapsed && "pl-8",
    item.disabled && "pointer-events-none opacity-50",
    active
      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  );

  const inner = (
    <>
      {item.icon ? <span className="flex h-4 w-4 shrink-0 items-center justify-center">{item.icon}</span> : null}
      {!collapsed ? (
        <>
          <span className="flex-1 truncate text-left">{item.label}</span>
          {item.badge}
          {hasChildren ? <ChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform group-data-[state=closed]:-rotate-90" /> : null}
        </>
      ) : null}
    </>
  );

  if (item.href && !hasChildren) {
    return (
      <Link href={item.href} aria-current={active ? "page" : undefined} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={cn(className, "group")} disabled={item.disabled}>
      {inner}
    </button>
  );
}
