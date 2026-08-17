"use client";

import { useTranslation } from "../../i18n";
import type { NavigationGroup } from "../admin/nav-types";
import { AccessControlPermissions } from "./access-control-permissions";

export interface AccessControlNavigationOptions {
  /** Overrides the group's own title. Defaults to a plain "Access Control" label — pass a translated string, or use `useAccessControlNavigation` for an auto-translated default. */
  title?: string;
  labels?: { permissions?: string; roles?: string; positions?: string };
  /** Hide specific entries, e.g. `{ permissions: true }` for an app that doesn't expose permission-translation editing. */
  hidden?: { permissions?: boolean; roles?: boolean; positions?: boolean };
}

/**
 * Builds a ready-to-render `NavigationGroup` for `AdminSidebar`/`CommandPalette` (section 15).
 * `basePath` is the route prefix the consuming application mounts these pages under (e.g.
 * `/admin/access-control`) — this module never assumes a route of its own (section 14). A
 * plain function (not a hook) so it can be called from outside React render, e.g. a static
 * nav config module; labels default to English. Prefer `useAccessControlNavigation` inside a
 * component for labels that follow the active `I18nProvider` locale automatically.
 */
export function createAccessControlNavigation(
  basePath: string,
  options: AccessControlNavigationOptions = {},
): NavigationGroup {
  const prefix = basePath.replace(/\/$/, "");
  const labels = { permissions: "Permissions", roles: "Roles", positions: "Positions", ...options.labels };
  const hidden = options.hidden ?? {};

  return {
    id: "access-control",
    title: options.title ?? "Access Control",
    items: [
      ...(hidden.permissions
        ? []
        : [
            {
              id: "access-control-permissions",
              label: labels.permissions,
              href: `${prefix}/permissions`,
              permission: AccessControlPermissions.permission.view,
            },
          ]),
      ...(hidden.roles
        ? []
        : [
            {
              id: "access-control-roles",
              label: labels.roles,
              href: `${prefix}/roles`,
              permission: AccessControlPermissions.role.view,
            },
          ]),
      ...(hidden.positions
        ? []
        : [
            {
              id: "access-control-positions",
              label: labels.positions,
              href: `${prefix}/positions`,
              permission: AccessControlPermissions.position.view,
            },
          ]),
    ],
  };
}

/** Reactive variant of `createAccessControlNavigation` — labels/title follow the active `I18nProvider` locale unless explicitly overridden via `options`. */
export function useAccessControlNavigation(basePath: string, options: AccessControlNavigationOptions = {}): NavigationGroup {
  const { t } = useTranslation();
  return createAccessControlNavigation(basePath, {
    ...options,
    title: options.title ?? t("accessControlNavigation.title"),
    labels: {
      permissions: t("permissions.title"),
      roles: t("roles.title"),
      positions: t("positions.title"),
      ...options.labels,
    },
  });
}
