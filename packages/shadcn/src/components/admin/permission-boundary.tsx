"use client";

import * as React from "react";
import { AccessDenied, type AccessDeniedProps } from "./access-denied";
import { usePermission } from "./use-permission";

export interface PermissionBoundaryProps {
  permission: string | string[];
  /** `"any"` (default) requires one of `permission`; `"all"` requires every one. Ignored for a single string. */
  mode?: "any" | "all";
  /** Rendered when denied. Defaults to `<AccessDenied>`; pass `accessDeniedProps` to customize the default instead of replacing it entirely. */
  fallback?: React.ReactNode;
  accessDeniedProps?: AccessDeniedProps;
  children: React.ReactNode;
}

/**
 * Page/route-level permission guard — express "this page requires permission X" without
 * every application inventing its own `ProtectedPage`/`RequirePermission`. Renders
 * `children` when allowed, otherwise `fallback` (or `<AccessDenied>` by default).
 */
export function PermissionBoundary({ permission, mode = "any", fallback, accessDeniedProps, children }: PermissionBoundaryProps) {
  const { canAny, canAll } = usePermission();

  const required = Array.isArray(permission) ? permission : [permission];
  const allowed = mode === "all" ? canAll(required) : canAny(required);

  if (allowed) return <>{children}</>;
  return <>{fallback ?? <AccessDenied {...accessDeniedProps} />}</>;
}
