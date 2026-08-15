import type * as React from "react";

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  /** Hidden from the sidebar unless the current actor holds this permission (see `permissionMode` for multi-permission items). */
  permission?: string | string[];
  /** `"any"` (default) requires one of `permission`; `"all"` requires every one. */
  permissionMode?: "any" | "all";
  children?: NavigationItem[];
  disabled?: boolean;
}

export interface NavigationGroup {
  id: string;
  title?: string;
  items: NavigationItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export interface NavigationItemRenderProps {
  item: NavigationItem;
  /** True when `item.href` matches the current location, as decided by the consumer (the sidebar has no router awareness). */
  active: boolean;
  /** True when the sidebar is in icon-only collapsed mode. */
  collapsed: boolean;
  depth: number;
}

export type NavigationItemRenderer = (props: NavigationItemRenderProps) => React.ReactNode;

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
