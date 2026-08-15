"use client";

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
  /** Same groups passed to `<AdminSidebar>` — flattened and searched by label. */
  navigationGroups?: NavigationGroup[];
  onNavigate?: (item: NavigationItem) => void;
  applications?: ApplicationDefinition[];
  onSelectApplication?: (application: ApplicationDefinition) => void;
  actions?: CommandPaletteAction[];
  placeholder?: string;
}

function flattenNavigationItems(groups: NavigationGroup[]): NavigationItem[] {
  const result: NavigationItem[] = [];
  const visit = (item: NavigationItem) => {
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
  onNavigate,
  applications = [],
  onSelectApplication,
  actions = [],
  placeholder = "Search pages, actions, applications…",
}: CommandPaletteProps) {
  const navItems = React.useMemo(() => flattenNavigationItems(navigationGroups), [navigationGroups]);

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
