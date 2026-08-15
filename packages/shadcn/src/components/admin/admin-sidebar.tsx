"use client";

import { hasAllPermissions, hasAnyPermission } from "@novacore/frontend-foundation";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { cn } from "../../lib/cn";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ScrollArea } from "../ui/scroll-area";
import { Tooltip } from "../ui/tooltip";
import type { NavigationGroup, NavigationItem, NavigationItemRenderer, NavigationItemRenderProps } from "./nav-types";

function isItemVisible(item: NavigationItem, permissions: readonly string[] | undefined): boolean {
  if (!item.permission || !permissions) return true;
  const required = Array.isArray(item.permission) ? item.permission : [item.permission];
  return item.permissionMode === "all" ? hasAllPermissions(permissions, required) : hasAnyPermission(permissions, required);
}

function isHrefActive(href: string | undefined, activeHref: string | undefined): boolean {
  if (!href || !activeHref) return false;
  return activeHref === href || activeHref.startsWith(`${href}/`);
}

export interface AdminSidebarProps {
  groups: NavigationGroup[];
  /** Owned permissions used to filter `permission`-tagged items. Omit to render every item ungated. */
  permissions?: readonly string[];
  /** Current location, e.g. from `usePathname()` — used to compute each item's `active` state. The sidebar has no router awareness of its own. */
  activeHref?: string;
  /** Full custom renderer, given `{ item, active, collapsed, depth }`. Overrides the built-in icon+label+badge+chevron rendering entirely. */
  renderItem?: NavigationItemRenderer;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  /** Icon-only rail mode. */
  collapsed?: boolean;
  className?: string;
}

/** Grouped, permission-aware admin navigation. Renders inside `<AdminLayout sidebar={...}>`. */
export function AdminSidebar({
  groups,
  permissions,
  activeHref,
  renderItem,
  header,
  footer,
  collapsed = false,
  className,
}: AdminSidebarProps) {
  return (
    <div className={cn("flex h-full flex-col bg-sidebar text-sidebar-foreground", className)}>
      {header ? (
        <div className={cn("flex h-14 shrink-0 items-center border-b border-sidebar-border", collapsed ? "justify-center px-2" : "px-4")}>
          {header}
        </div>
      ) : null}
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-4 p-3">
          {groups.map((group) => (
            <SidebarGroupView
              key={group.id}
              group={group}
              permissions={permissions}
              activeHref={activeHref}
              renderItem={renderItem}
              collapsed={collapsed}
            />
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
}

function SidebarGroupView({ group, permissions, activeHref, renderItem, collapsed }: GroupViewProps) {
  const visibleItems = group.items.filter((item) => isItemVisible(item, permissions));
  if (visibleItems.length === 0) return null;

  const list = (
    <div className="flex flex-col gap-0.5">
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
    return (
      <Collapsible defaultOpen={group.defaultOpen ?? true}>
        <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/50 transition-colors hover:text-sidebar-foreground/80">
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
  activeHref?: string;
  renderItem?: NavigationItemRenderer;
  collapsed: boolean;
  depth: number;
}

function SidebarItemView({ item, permissions, activeHref, renderItem, collapsed, depth }: ItemViewProps) {
  const active = isHrefActive(item.href, activeHref);
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
    <Collapsible defaultOpen={active}>
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
    "flex w-full items-center gap-2.5 rounded-md py-2 text-sm font-medium transition-colors",
    collapsed ? "justify-center px-0" : "px-2.5",
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
