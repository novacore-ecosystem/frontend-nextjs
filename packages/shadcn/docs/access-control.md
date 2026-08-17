# Access Control

Shared, complete Permission / Role / Position management for every NovaCore Admin application.
This is a platform module, not an app feature — do not reimplement these pages in a consuming
app; compose them.

```tsx
<PermissionManagement />
<RoleManagement />
<PositionManagement />
```

Each renders a full page: breadcrumb slot, header, toolbar, table/tree, dialogs, validation,
loading/error/empty states, and a How-To section — with built-in English/Vietnamese/Simplified
Chinese translations. No required props.

## Installation

Part of `@novacore/frontend-next-shadcn`, importable from the package root or the `./access-control`
subpath (identical exports — the subpath exists for consumers who prefer narrower imports):

```ts
import { PermissionManagement, RoleManagement, PositionManagement, AccessControlProvider } from "@novacore/frontend-next-shadcn";
// or
import { PermissionManagement, RoleManagement, PositionManagement, AccessControlProvider } from "@novacore/frontend-next-shadcn/access-control";
```

## Provider setup

The module depends on an abstraction, not a concrete HTTP client — implement `PermissionService`/
`RoleService`/`PositionService`/`PermissionAssignmentService` (see `src/components/access-control/types.ts`)
against your app's real API, then mount `AccessControlProvider` once:

```tsx
<AccessControlProvider services={{ permissions, roles, positions, assignments }}>
  {/* PermissionManagement / RoleManagement / PositionManagement anywhere below */}
</AccessControlProvider>
```

Unlike `PermissionProvider`/`I18nProvider`, there is **no permissive default** — every access-control
component throws a clear error if rendered without a provider, since there's no sane fallback for
missing data.

### Why `PermissionService` has no create/delete

`@novacore/frontend-foundation`'s `Permissions` catalog is a fixed, code-first set mirrored from
the backend's `Permissions.cs` — permission *keys* aren't a CRUD resource on the real NovaCore
backend, only their per-locale display copy is (`PermissionDefinitionTranslation`). `PermissionManagement`
reflects that: browse + search + edit display name/description, no create/delete flow. If your
backend's permission catalog genuinely is dynamic, that's a different module to build — don't
force it through this one.

### Position has no existing backend contract

`Position` doesn't exist anywhere in `@novacore/frontend-foundation` today — no permission keys,
no types. The `PositionService`/`PositionRecord`/`PositionTreeNode` contracts here are a clean,
forward-looking design (parent/child hierarchy via `parentId`) for you to implement against
whatever backend endpoints your application adds. `AccessControlPermissions.position.*` uses the
same `module:action` naming convention as the rest of the catalog, but `"position:view"`/
`"position:manage"` are **not yet real backend permission keys** — override them via each page's
underlying permission checks if your backend uses different identifiers once implemented.

## Navigation

```ts
import { createAccessControlNavigation } from "@novacore/frontend-next-shadcn";

const navigationGroups = [
  createAccessControlNavigation("/admin/access-control"),
  // ...your app's other NavigationGroups
];
```

Returns a ready-to-render `NavigationGroup` (Permissions / Roles / Positions), each entry already
permission-gated via `AccessControlPermissions`. Inside a component, prefer `useAccessControlNavigation`
for labels that follow the active `I18nProvider` locale automatically. Your app still owns whether
the group is shown, where it sits in the sidebar, and route prefix — this just saves re-typing the
three entries.

## Routing

The module owns page content, never a route. Mount each page under whatever path your app chooses:

```tsx
// app/admin/access-control/permissions/page.tsx
export default function Page() {
  return <PermissionManagement breadcrumb={<AdminBreadcrumb items={[{ label: "Access Control" }, { label: "Permissions" }]} />} />;
}
```

## Permission checks

Each page auto-gates its own Create/Edit/Delete actions using `usePermission()` against
`AccessControlPermissions` (`src/components/access-control/access-control-permissions.ts`) — you
don't hide buttons manually. Pass `readOnly` to force view-only regardless of the current actor's
permissions (e.g. an audit surface). Wrap your app in `PermissionProvider` as usual; with no
provider mounted, every check is permissive (nothing hidden) — same behavior as the rest of this
package's permission system.

## Customization

**Can override:** the service adapter (all data access), `breadcrumb`, `readOnly`, navigation
labels (`createAccessControlNavigation`'s `labels`/`hidden` options), and — since it flows through
the same `I18nProvider`/`translations` mechanism as the rest of the package — any individual UI
string, by supplying an override at the `accessControl`-relevant top-level keys (`permissions`,
`roles`, `positions`, `assignment`, `accessControlNavigation`) in your `I18nProvider`'s
`translations`/`tenantTranslations` prop.

**Should NOT override:** page layout/structure, table columns, dialog flow, validation behavior,
or the permission-tree/hierarchy interaction model — these are the point of a shared module. If a
business reason genuinely requires different behavior here, that's a signal to extend the shared
module (new prop, discussed as a real requirement), not to fork it in one app.

## Shared primitives

Reusable outside the three page components, if you're composing your own screen:

- `PermissionTree` — grouped, searchable permission checkbox tree (select all/deselect all,
  inherited/read-only locked indicators).
- `PermissionAssignment` — owns loading/save/dirty-state for one subject's permissions:
  `<PermissionAssignment subjectType="role" subjectId={id} />`. `RolePermissionAssignment`/
  `PositionPermissionAssignment` are `subjectType`-preset sugar over it.
- `PositionHierarchy` — presentational superior/subordinate tree (expand/collapse, `renderActions`
  escape hatch).
- `PositionSelector` — indented, cycle-safe single-select for choosing a superior position.

## Example: minimal new Admin application

```tsx
// access-control-services.ts — the only app-specific code this module requires
export const accessControlServices: AccessControlServices = {
  permissions: myPermissionApiAdapter,
  roles: myRoleApiAdapter,
  positions: myPositionApiAdapter,
  assignments: myAssignmentApiAdapter,
};

// app/admin/layout.tsx
<PermissionProvider permissions={currentUser.permissions}>
  <AccessControlProvider services={accessControlServices}>
    <AdminLayout sidebar={<AdminSidebar navigationGroups={[...appNav, createAccessControlNavigation("/admin/access-control")]} />}>
      {children}
    </AdminLayout>
  </AccessControlProvider>
</PermissionProvider>

// app/admin/access-control/permissions/page.tsx
export default () => <PermissionManagement />;
// app/admin/access-control/roles/page.tsx
export default () => <RoleManagement />;
// app/admin/access-control/positions/page.tsx
export default () => <PositionManagement />;
```

Three route files, one service adapter module, zero access-control UI code.
