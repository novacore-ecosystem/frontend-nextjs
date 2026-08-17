"use client";

import * as React from "react";
import type { AccessControlServices } from "./types";

const AccessControlContext = React.createContext<AccessControlServices | null>(null);

export interface AccessControlProviderProps {
  children: React.ReactNode;
  /** The consuming application's service adapters — see `AccessControlServices`. Unlike `PermissionProvider`/`I18nProvider`, there is no permissive default: every access-control module needs real data, so a missing provider is a mounting bug, not an optional feature. */
  services: AccessControlServices;
}

/**
 * Supplies the `PermissionService`/`RoleService`/`PositionService`/`PermissionAssignmentService`
 * adapters every access-control module (`PermissionManagement`/`RoleManagement`/
 * `PositionManagement`/`PermissionAssignment`, ...) reads from. Mount once near the app root,
 * inside your own data-fetching setup (e.g. a React Query `QueryClientProvider`), alongside
 * `AdminProvider`/`PermissionProvider`/`I18nProvider`:
 *
 * ```tsx
 * <AccessControlProvider services={{ permissions, roles, positions, assignments }}>
 *   <PermissionManagement />
 * </AccessControlProvider>
 * ```
 */
export function AccessControlProvider({ children, services }: AccessControlProviderProps) {
  return <AccessControlContext.Provider value={services}>{children}</AccessControlContext.Provider>;
}

/** Reads the nearest `<AccessControlProvider>`'s service adapters. Throws when none is mounted — every caller is a module that cannot render without real data. */
export function useAccessControlServices(): AccessControlServices {
  const ctx = React.useContext(AccessControlContext);
  if (!ctx) {
    throw new Error(
      "[@novacore/frontend-next-shadcn] Access control components must be rendered inside <AccessControlProvider services={{ ... }}>.",
    );
  }
  return ctx;
}
