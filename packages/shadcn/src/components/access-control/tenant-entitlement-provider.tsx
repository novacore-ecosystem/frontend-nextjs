"use client";

import * as React from "react";
import type { EntitlementStatus, TenantEntitlementState } from "./types";

const TenantEntitlementContext = React.createContext<TenantEntitlementState | null>(null);

export interface TenantEntitlementProviderProps {
  children: React.ReactNode;
  status: EntitlementStatus;
  /** "all" = no entitlement gating configured (every catalog permission renders as available). */
  entitledPermissionIds: string[] | "all";
}

/**
 * Supplies the tenant's root permission entitlement to every Access Control component in this
 * subtree (`PermissionManagement`, `PermissionTree`/`PermissionAssignment`/`UserPermissionAssignment`,
 * `EffectivePermissions`) via `useTenantEntitlement()` — consumed internally by those components,
 * so no entitlement prop needs to be threaded through application page code. Optional: with no
 * provider mounted, every permission renders as available (fail-open, mirrors `PermissionProvider`'s
 * own optionality), so applications that don't model tenant packages/subscriptions are unaffected.
 *
 * **Security note:** this is a UX layer only — it hides/flags permissions the tenant's current plan
 * doesn't include, and prevents the UI from creating new assignments to them. It is never a
 * substitute for server-side entitlement enforcement (see `docs/access-control.md`).
 */
export function TenantEntitlementProvider({ children, status, entitledPermissionIds }: TenantEntitlementProviderProps) {
  const value = React.useMemo<TenantEntitlementState>(
    () => ({ status, entitledPermissionIds }),
    [status, entitledPermissionIds],
  );
  return <TenantEntitlementContext.Provider value={value}>{children}</TenantEntitlementContext.Provider>;
}

/** `{ status: "ready", entitledPermissionIds: "all" }` when no `<TenantEntitlementProvider>` is mounted. */
export function useTenantEntitlement(): TenantEntitlementState {
  return React.useContext(TenantEntitlementContext) ?? { status: "ready", entitledPermissionIds: "all" };
}
