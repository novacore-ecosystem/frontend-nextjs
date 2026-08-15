"use client";

import * as React from "react";
import { usePermission } from "./use-permission";

export interface PermissionGateProps {
  /** No permission set — always renders `children`. Lets call sites conditionally gate without a branch. */
  permission?: string | string[];
  /** `"any"` (default) requires one of `permission`; `"all"` requires every one. Ignored for a single string. */
  mode?: "any" | "all";
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Conditionally renders `children` based on the current actor's permissions, read from the
 * nearest `<PermissionProvider>`. Renders `fallback` (default `null`) when denied.
 *
 * With no `<PermissionProvider>` mounted, `usePermission()` is permissive — see its doc
 * comment. This component is a UX layer only, not an authorization boundary.
 */
export function PermissionGate({ permission, mode = "any", fallback = null, children }: PermissionGateProps) {
  const { canAny, canAll } = usePermission();

  if (!permission) return <>{children}</>;

  const required = Array.isArray(permission) ? permission : [permission];
  const allowed = mode === "all" ? canAll(required) : canAny(required);

  return allowed ? <>{children}</> : <>{fallback}</>;
}
