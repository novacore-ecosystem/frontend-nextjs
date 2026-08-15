"use client";

import * as React from "react";

interface PermissionContextValue {
  permissions: readonly string[];
}

const PermissionContext = React.createContext<PermissionContextValue | null>(null);

export interface PermissionProviderProps {
  children: React.ReactNode;
  /** The current actor's owned permission keys — e.g. `CurrentUserAuthorization.permissions` from `@novacore/frontend-foundation`. */
  permissions: readonly string[];
}

/**
 * Supplies owned permissions to `usePermission()`/`PermissionGate`/`PermissionBoundary`/`AdminSidebar`
 * for this subtree. Optional — components that consume permissions fall back to a permissive
 * "show everything" default when no provider is mounted, so apps that don't use the permission
 * system are unaffected.
 */
export function PermissionProvider({ children, permissions }: PermissionProviderProps) {
  const value = React.useMemo<PermissionContextValue>(() => ({ permissions }), [permissions]);
  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

/** Raw context accessor — `null` when no `<PermissionProvider>` is mounted. Prefer `usePermission()` for gating logic. */
export function usePermissionContext(): PermissionContextValue | null {
  return React.useContext(PermissionContext);
}
