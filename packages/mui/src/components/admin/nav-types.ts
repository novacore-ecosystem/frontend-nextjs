import type * as React from "react";

/** Prefixed `Admin*` to avoid colliding with the existing marketing-nav `NavigationItem` (`../navigation/navigation-menu`). */
export interface AdminNavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  /** Hidden from the sidebar unless the current actor holds this permission (see `permissionMode` for multi-permission items). */
  permission?: string | string[];
  /** `"any"` (default) requires one of `permission`; `"all"` requires every one. */
  permissionMode?: "any" | "all";
  children?: AdminNavigationItem[];
  disabled?: boolean;
}

export interface AdminNavigationGroup {
  id: string;
  title?: string;
  items: AdminNavigationItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export interface AdminNavigationItemRenderProps {
  item: AdminNavigationItem;
  /** True when `item.href` matches the current location, as decided by the consumer (the sidebar has no router awareness). */
  active: boolean;
  /** True when the sidebar is in icon-only collapsed mode. */
  collapsed: boolean;
  depth: number;
}

export type AdminNavigationItemRenderer = (props: AdminNavigationItemRenderProps) => React.ReactNode;

export interface ApplicationDefinition {
  id: string;
  name: string;
  shortName?: string;
  description?: string;
  icon?: React.ReactNode;
  logo?: React.ReactNode;
  /** CSS color used as an accent dot/border to distinguish this application in the switcher. */
  accent?: string;
  href: string;
}
