"use client";

import { hasAllPermissions, hasAnyPermission, hasPermission, type Permission } from "@novacore/frontend-foundation";
import * as React from "react";
import { usePermissionContext } from "./permission-provider";

export interface UsePermissionResult {
  /** Owned permission keys from the nearest `<PermissionProvider>`, or `[]` if none is mounted. */
  permissions: readonly string[];
  can: (permission: Permission | string) => boolean;
  canAny: (permissions: readonly (Permission | string)[]) => boolean;
  canAll: (permissions: readonly (Permission | string)[]) => boolean;
}

/**
 * React adapter over `@novacore/frontend-foundation`'s framework-agnostic permission
 * evaluation (`hasPermission`/`hasAnyPermission`/`hasAllPermissions`) — no permission
 * logic is duplicated here.
 *
 * **Security note:** this is a UX layer only (hide unavailable actions, avoid confusing
 * navigation). It is never a substitute for server-side authorization — the backend must
 * still enforce every permission check.
 *
 * With no `<PermissionProvider>` mounted, every check returns `true` (nothing is hidden) —
 * this keeps the permission system fully optional for apps that don't use it. Once a
 * provider IS mounted, evaluation is real: an authenticated actor with zero permissions is
 * correctly denied everything (aside from `Permissions.Root`).
 */
export function usePermission(): UsePermissionResult {
  const ctx = usePermissionContext();
  const hasProvider = ctx !== null;
  const permissions = ctx?.permissions ?? [];

  const can = React.useCallback(
    (permission: Permission | string) => (hasProvider ? hasPermission(permissions, permission) : true),
    [hasProvider, permissions],
  );
  const canAny = React.useCallback(
    (required: readonly (Permission | string)[]) => (hasProvider ? hasAnyPermission(permissions, required) : true),
    [hasProvider, permissions],
  );
  const canAll = React.useCallback(
    (required: readonly (Permission | string)[]) => (hasProvider ? hasAllPermissions(permissions, required) : true),
    [hasProvider, permissions],
  );

  return React.useMemo(() => ({ permissions, can, canAny, canAll }), [permissions, can, canAny, canAll]);
}
