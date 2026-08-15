"use client";

import { hasAllPermissions, hasAnyPermission } from "@novacore/frontend-foundation";
import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../ui/command";
import type { ApplicationDefinition, NavigationGroup, NavigationItem } from "./nav-types";
import { usePermissionContext } from "./permission-provider";

function isItemVisible(item: NavigationItem, permissions: readonly string[] | undefined): boolean {
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
  navigationGroups?: NavigationGroup[];
  /** Owned permissions used to filter `permission`-tagged items. Falls back to the nearest `<PermissionProvider>` when omitted; if neither is present, every item is searchable. */
  permissions?: readonly string[];
  onNavigate?: (item: NavigationItem) => void;
  applications?: ApplicationDefinition[];
  onSelectApplication?: (application: ApplicationDefinition) => void;
  actions?: CommandPaletteAction[];
  placeholder?: string;
}

function flattenNavigationItems(groups: NavigationGroup[], permissions: readonly string[] | undefined): NavigationItem[] {
  const result: NavigationItem[] = [];
  const visit = (item: NavigationItem) => {
    if (!isItemVisible(item, permissions)) return;
    if (item.href) result.push(item);
    item.children?.forEach(visit);
  };
  for (const group of groups) {
    for (const item of group.items) visit(item);
  }
  return result;
}

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
  const permissions = permissionsProp ?? usePermissionContext()?.permissions;
  const navItems = React.useMemo(() => flattenNavigationItems(navigationGroups, permissions), [navigationGroups, permissions]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {actions.length > 0 ? (
          <>
            <CommandGroup heading="Quick actions">
              {actions.map((action) => (
                <CommandItem
                  key={action.id}
                  onSelect={() => {
                    action.onSelect();
                    onOpenChange(false);
                  }}
                >
                  {action.icon}
                  <span>{action.label}</span>
                  {action.shortcut ? <CommandShortcut>{action.shortcut}</CommandShortcut> : null}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        ) : null}

        {navItems.length > 0 ? (
          <CommandGroup heading="Navigation">
            {navItems.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => {
                  onNavigate?.(item);
                  onOpenChange(false);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {applications.length > 0 ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Switch application">
              {applications.map((app) => (
                <CommandItem
                  key={app.id}
                  onSelect={() => {
                    onSelectApplication?.(app);
                    onOpenChange(false);
                  }}
                >
                  {app.icon}
                  <span>{app.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : null}
      </CommandList>
    </CommandDialog>
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
