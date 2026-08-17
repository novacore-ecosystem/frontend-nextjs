# Access Control

Shared, complete Permission / Role / Position management for every NovaCore Admin application.
This is a platform module, not an app feature — do not reimplement these pages in a consuming
app; compose them.

```tsx
<PermissionManagement permissions={myAppPermissions} />
<RoleManagement permissions={myAppPermissions} />
<PositionManagement permissions={myAppPermissions} />
<UserPermissionAssignment permissions={myAppPermissions} subjectProvider={myAppSubjectProvider} />
```

Each renders a full page: breadcrumb slot, header, toolbar, table/tree, dialogs, validation,
loading/error/empty states, and a How-To section — with built-in English/Vietnamese/Simplified
Chinese translations. The only required prop is `permissions` — the application's own permission
catalog (see "Permission catalog" below).

## Installation

Part of `@novacore/frontend-next-shadcn`, importable from the package root or the `./access-control`
subpath (identical exports — the subpath exists for consumers who prefer narrower imports):

```ts
import { PermissionManagement, RoleManagement, PositionManagement, UserPermissionAssignment, AccessControlProvider } from "@novacore/frontend-next-shadcn";
// or
import { PermissionManagement, RoleManagement, PositionManagement, UserPermissionAssignment, AccessControlProvider } from "@novacore/frontend-next-shadcn/access-control";
```

## Permission catalog

Unlike Role/Position/assignment data, the permission catalog is **not fetched from a service** —
it's static application configuration, passed as a `permissions: PermissionDefinition[]` prop:

```ts
import type { PermissionDefinition } from "@novacore/frontend-next-shadcn";

export const myAppPermissions: PermissionDefinition[] = [
  { id: "order:view", translationKey: "myApp.permissions.order.view", group: "order", groupTranslationKey: "myApp.groups.order" },
  { id: "order:manage", translationKey: "myApp.permissions.order.manage", group: "order", groupTranslationKey: "myApp.groups.order" },
];
```

- **`id`** is the canonical backend permission key (see `@novacore/frontend-foundation`'s
  `Permissions` catalog for the real platform-wide set). The backend's catalog may be far larger
  than any one application needs — this list is the application's own *subset*, not a mirror of
  everything the backend supports. Don't pad it with permissions your app doesn't actually use.
- **`translationKey`/`groupTranslationKey`** are resolved via the active `I18nProvider`'s
  translator (`t(key)`) — supply the real `en`/`vi`/`zh-CN` copy through `I18nProvider`'s
  `translations` prop, the same mechanism every other string in this package uses. If a key is
  missing, the translator's default `onMissingKey: "key"` behavior returns the key itself
  (visible but non-fatal) for permissions, and falls back to the raw `group` string for
  `groupTranslationKey`.
- **`group`** defaults to `derivePermissionCategory(id)` (the text before the first `:`) when
  omitted.

`resolvePermissionCatalog(permissions, t)` (exported alongside the components) is what every
access-control component calls internally to turn this into render-ready groups — you won't
normally call it yourself unless you're composing a custom screen with `PermissionTree` directly.

**Why there's no create/edit/delete for permissions:** `@novacore/frontend-foundation`'s
`Permissions` catalog is a fixed, code-first set mirrored from the backend's `Permissions.cs` —
permission keys aren't a CRUD resource, and their display copy is application configuration, not
admin-editable runtime data (permissions are system-defined capabilities, not business content).
`PermissionManagement` reflects that: browse + search only, on whatever catalog you pass it.

## Provider setup

Role/Position/assignment data still flows through service adapters — implement `RoleService`/
`PositionService`/`PermissionAssignmentService` (see `src/components/access-control/types.ts`)
against your app's real API, then mount `AccessControlProvider` once:

```tsx
<AccessControlProvider services={{ roles, positions, assignments }}>
  {/* PermissionManagement / RoleManagement / PositionManagement / UserPermissionAssignment anywhere below */}
</AccessControlProvider>
```

Unlike `PermissionProvider`/`I18nProvider`, there is **no permissive default** — every access-control
component throws a clear error if rendered without a provider, since there's no sane fallback for
missing data. Note `AccessControlServices` has no `permissions` key — the catalog is a prop, not
a service (see above), and subject/user search for `UserPermissionAssignment` is a separate
`subjectProvider` prop, not part of this provider either (too application-specific to standardize
— see "User Permission Assignment" below).

## User Permission Assignment

`UserPermissionAssignment` grants permissions directly to users/members — a capability the
platform was missing entirely (Role/Position assignment existed, but nothing let an admin grant
a permission to one specific person without wrapping them in a Role first). It's deliberately a
**separate module from any User Management page** — assigning permissions is an access-control
concern, not a user-CRUD concern, and folding it into a user list would make that page responsible
for user search *and* filtering *and* permission UI *and* selection state *and* role management,
all at once.

```tsx
<UserPermissionAssignment permissions={myAppPermissions} subjectProvider={myAppSubjectProvider} />
```

### Subject search is application-provided

There's no universal "user" entity across NovaCore apps — it might be a User, Member, Account,
Employee, or Operator, and every application's identity system is different. Rather than baking
a concrete entity into this module, it depends on a generic adapter:

```ts
export interface SubjectOption {
  id: string;
  displayName: string;
  secondaryText?: string;
}

export interface SubjectSearchProvider {
  search(request: CriteriaRequest): Promise<PaginatedResult<SubjectOption>>;
}
```

`SubjectSearchProvider` reuses the platform's canonical `CriteriaRequest`/`PaginatedResult` search
contract — the same one `RoleService.getList`/`PositionService.getList` already use — so an app
backed by a real search endpoint (Users included, per `CriteriaRequest`'s own doc comment) can
implement this with one `httpClient` call. `subjectProvider` is **not** part of `AccessControlServices`
— pass it directly as a prop, since (unlike Role/Position/assignment data) it's too
application-specific to standardize into the shared provider.

The component never loads an entire user list — every keystroke/page/filter change re-queries
`subjectProvider.search()` server-side, so it scales to large installations the same way
Role/Position's paginated lists do.

### Filters

Only a search box ships built in. For application-specific filters (department, status, tenant,
...), supply `renderFilters` — the component owns the resulting `CriteriaFilter[]` state and
threads it into every search call; you only supply the controls:

```tsx
<UserPermissionAssignment
  permissions={myAppPermissions}
  subjectProvider={myAppSubjectProvider}
  renderFilters={({ filters, onFiltersChange }) => (
    <DepartmentFilter value={filters} onChange={onFiltersChange} />
  )}
/>
```

### Selection and assignment semantics

- **One user selected** — the full `PermissionAssignment` editor (identical to Role/Position):
  loads their current permissions, lets you check/uncheck freely, Save replaces their permission
  set with exactly what's checked.
- **Multiple users selected** — a fresh, unchecked `PermissionTree` (the same selector Role/Position
  use) plus a confirmation dialog summarizing "grants N permissions to M users." Confirming is an
  **additive grant**: each selected user's *existing* permissions (fetched individually first) are
  preserved, and the checked permissions are added on top — a bulk action never silently revokes
  a permission a user already held for an unrelated reason.

The running selection (`Map<id, SubjectOption>`) survives searches/pagination, and the toolbar
shows a live "N selected" count with a "Clear selection" action.

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

Returns a ready-to-render `NavigationGroup` (Permissions / Roles / Positions / User Permissions),
each entry already permission-gated via `AccessControlPermissions`. Inside a component, prefer
`useAccessControlNavigation` for labels that follow the active `I18nProvider` locale automatically.
Your app still owns whether the group is shown, where it sits in the sidebar, and route prefix —
this just saves re-typing the four entries. Pass `hidden: { userPermissions: true }` if your app
doesn't mount `UserPermissionAssignment`.

## Routing

The module owns page content, never a route. Mount each page under whatever path your app chooses:

```tsx
// app/admin/access-control/permissions/page.tsx
export default function Page() {
  return (
    <PermissionManagement
      permissions={myAppPermissions}
      breadcrumb={<AdminBreadcrumb items={[{ label: "Access Control" }, { label: "Permissions" }]} />}
    />
  );
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
labels (`createAccessControlNavigation`'s `labels`/`hidden` options), `UserPermissionAssignment`'s
`renderFilters`, and — since it flows through the same `I18nProvider`/`translations` mechanism as
the rest of the package — any individual UI string, by supplying an override at the
`accessControl`-relevant top-level keys (`permissions`, `roles`, `positions`, `assignment`,
`userPermissions`, `accessControlNavigation`) in your `I18nProvider`'s
`translations`/`tenantTranslations` prop.

**Should NOT override:** page layout/structure, table columns, dialog flow, validation behavior,
or the permission-tree/hierarchy interaction model — these are the point of a shared module. If a
business reason genuinely requires different behavior here, that's a signal to extend the shared
module (new prop, discussed as a real requirement), not to fork it in one app.

## Shared primitives

Reusable outside the three page components, if you're composing your own screen:

- `PermissionTree` — grouped, searchable permission checkbox tree (select all/deselect all,
  inherited/read-only locked indicators). Takes already-resolved `PermissionGroup[]` — pass it
  `resolvePermissionCatalog(permissions, t)`'s result if composing a custom screen.
- `resolvePermissionCatalog(permissions, t)` — turns a `PermissionDefinition[]` into the
  `PermissionGroup[]` shape `PermissionTree` renders.
- `PermissionAssignment` — owns loading/save/dirty-state for one subject's permissions:
  `<PermissionAssignment permissions={myAppPermissions} subjectType="role" subjectId={id} />`.
  `RolePermissionAssignment`/`PositionPermissionAssignment` are `subjectType`-preset sugar over it.
- `PositionHierarchy` — presentational superior/subordinate tree (expand/collapse, `renderActions`
  escape hatch).
- `PositionSelector` — indented, cycle-safe single-select for choosing a superior position.
- `DataTable`'s `selectable`/`selectedRowIds`/`onSelectedRowIdsChange` — what `UserPermissionAssignment`
  is built on for paginated multi-select; reuse it directly if composing a custom subject picker.

## Example: minimal new Admin application

```tsx
// access-control-permissions.ts — the application's own permission catalog
export const myAppPermissions: PermissionDefinition[] = [ /* ... */ ];

// access-control-services.ts — the app-specific service adapters this module requires
export const accessControlServices: AccessControlServices = {
  roles: myRoleApiAdapter,
  positions: myPositionApiAdapter,
  assignments: myAssignmentApiAdapter,
};
export const myAppSubjectProvider: SubjectSearchProvider = myUserSearchApiAdapter;

// app/admin/layout.tsx
<PermissionProvider permissions={currentUser.permissions}>
  <I18nProvider locale={locale} onLocaleChange={setLocale} translations={myAppTranslations}>
    <AccessControlProvider services={accessControlServices}>
      <AdminLayout sidebar={<AdminSidebar navigationGroups={[...appNav, createAccessControlNavigation("/admin/access-control")]} />}>
        {children}
      </AdminLayout>
    </AccessControlProvider>
  </I18nProvider>
</PermissionProvider>

// app/admin/access-control/permissions/page.tsx
export default () => <PermissionManagement permissions={myAppPermissions} />;
// app/admin/access-control/roles/page.tsx
export default () => <RoleManagement permissions={myAppPermissions} />;
// app/admin/access-control/positions/page.tsx
export default () => <PositionManagement permissions={myAppPermissions} />;
// app/admin/access-control/user-permissions/page.tsx
export default () => <UserPermissionAssignment permissions={myAppPermissions} subjectProvider={myAppSubjectProvider} />;
```

Four route files, one permission catalog, one service adapter module, zero access-control UI
code. `myAppTranslations` is where `myAppPermissions`' `translationKey`/`groupTranslationKey`
values actually resolve — see "Permission catalog" above.
