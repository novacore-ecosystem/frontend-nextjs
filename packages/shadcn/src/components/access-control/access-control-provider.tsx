"use client";

import * as React from "react";
import type { AccessControlServices } from "./types";

const AccessControlContext = React.createContext<Partial<AccessControlServices> | null>(null);

export interface AccessControlProviderProps {
  children: React.ReactNode;
  /**
   * The consuming application's service adapters — see `AccessControlServices`. Unlike
   * `PermissionProvider`/`I18nProvider`, there is no permissive default: every access-control
   * module needs real data, so a missing provider is a mounting bug, not an optional feature.
   *
   * Provide only the services your application actually uses — `RoleManagement`/`PositionManagement`/
   * `RoleAssignment` need `roles`/`positions`/`roleAssignments`, but an application with no Role/
   * Position domain of its own (e.g. a Root-level app that only grants a tenant its permission
   * entitlement via `<PermissionAssignment subjectType="tenant">`) only needs `assignments`. Each
   * component asks for the specific service(s) it needs via `useAccessControlService()` and throws a
   * clear, named error if that one is missing — don't invent stub `RoleService`/`PositionService`
   * implementations just to satisfy a type.
   */
  services: Partial<AccessControlServices>;
}

/**
 * Supplies the `RoleService`/`PositionService`/`PermissionAssignmentService`/`RoleAssignmentService`
 * adapters every access-control module (`PermissionManagement`/`RoleManagement`/`PositionManagement`/
 * `PermissionAssignment`/`RoleAssignment`, ...) reads from. Mount once near the app root, inside your
 * own data-fetching setup (e.g. a React Query `QueryClientProvider`), alongside
 * `AdminProvider`/`PermissionProvider`/`I18nProvider`:
 *
 * ```tsx
 * <AccessControlProvider services={{ roles, positions, assignments, roleAssignments }}>
 *   <RoleManagement permissions={myAppPermissions} />
 * </AccessControlProvider>
 * ```
 */
export function AccessControlProvider({ children, services }: AccessControlProviderProps) {
  return <AccessControlContext.Provider value={services}>{children}</AccessControlContext.Provider>;
}

/**
 * Reads the nearest `<AccessControlProvider>`'s service adapters, whatever subset was provided.
 * Throws when no provider is mounted at all. Most components should prefer `useAccessControlService()`
 * for the specific service(s) they actually need — this raw accessor is for components (like
 * `EffectivePermissions`) that need to check for an optional service's presence conditionally.
 */
export function useAccessControlServices(): Partial<AccessControlServices> {
  const ctx = React.useContext(AccessControlContext);
  if (!ctx) {
    throw new Error(
      "[@novacore/frontend-next-shadcn] Access control components must be rendered inside <AccessControlProvider services={{ ... }}>.",
    );
  }
  return ctx;
}

/**
 * Plain (non-hook) lookup for a required service on an already-fetched `Partial<AccessControlServices>`
 * object, throwing a clear, service-named error if it's missing — rather than a generic "Cannot read
 * properties of undefined" a few lines further into whichever call site first used it. Safe to call
 * conditionally (e.g. only when a component's `subjectType` prop actually needs that service), unlike
 * `useAccessControlService()` itself, which must run unconditionally like any hook.
 */
export function requireAccessControlService<K extends keyof AccessControlServices>(
  services: Partial<AccessControlServices>,
  key: K,
): AccessControlServices[K] {
  const service = services[key];
  if (!service) {
    throw new Error(
      `[@novacore/frontend-next-shadcn] <AccessControlProvider> is missing the "${key}" service, required by this component. Pass it via services={{ ${key}: ... }}.`,
    );
  }
  return service;
}

/**
 * Reads one required service off the nearest `<AccessControlProvider>`, throwing a clear,
 * service-named error if it wasn't provided. Prefer this over `useAccessControlServices()` for any
 * component with an unconditional dependency on a specific service; for a service only needed
 * conditionally (e.g. depending on a `subjectType` prop), call `useAccessControlServices()` once and
 * pass its result to `requireAccessControlService()` only inside that condition.
 */
export function useAccessControlService<K extends keyof AccessControlServices>(key: K): AccessControlServices[K] {
  return requireAccessControlService(useAccessControlServices(), key);
}
