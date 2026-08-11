import * as React from "react";

export interface PermissionGateProps {
  permission: string | string[];
  /** Injected by the consumer — decides whether the current actor has the permission(s). */
  can: (permission: string | string[]) => boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Contract-only permission gate. The actual permission resolution (roles, claims, RBAC/ABAC)
 * is entirely owned by the consuming application via the `can` prop — this component has no
 * knowledge of any specific auth system.
 */
export function PermissionGate({ permission, can, fallback = null, children }: PermissionGateProps) {
  return can(permission) ? <>{children}</> : <>{fallback}</>;
}
