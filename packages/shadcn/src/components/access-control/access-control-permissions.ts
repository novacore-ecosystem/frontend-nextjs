import { Permissions } from "@novacore/frontend-foundation";

/**
 * Centralized permission requirements the access-control modules gate their own actions
 * with (section 19: "expose the required permission metadata in a centralized way," not
 * hardcode a key inline at every `PermissionButton`/`PermissionBoundary`).
 *
 * `role`/`permission` map directly to `Permissions.Role`/`Permissions.Permission` from
 * `@novacore/frontend-foundation` — real backend-defined keys. `position` does not exist in
 * the backend's `Permissions.cs` catalog today (Position has no backend contract at all yet
 * — see `types.ts`'s doc comments); `"position:view"`/`"position:manage"` follow the same
 * `module:action` convention the rest of the catalog uses, as a forward-looking placeholder.
 * An adapter for a backend that doesn't have these keys yet can pass `permission` overrides
 * to the page components, or simply not enforce this layer (see each component's `permission`
 * prop) until the real keys exist.
 */
export const AccessControlPermissions = {
  permission: {
    view: Permissions.Permission.View,
    manage: Permissions.Permission.Manage,
  },
  role: {
    view: Permissions.Role.View,
    manage: Permissions.Role.Manage,
  },
  position: {
    view: "position:view",
    manage: "position:manage",
  },
} as const;
