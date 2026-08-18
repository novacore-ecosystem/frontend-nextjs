# Access Control

Shared, complete Permission / Role / Position / User authorization management for every NovaCore
Admin application. This is a platform module, not an app feature — do not reimplement these pages
in a consuming app; compose them.

```tsx
<PermissionManagement permissions={myAppPermissions} />
<RoleManagement permissions={myAppPermissions} />
<PositionManagement permissions={myAppPermissions} />
<UserPermissionAssignment permissions={myAppPermissions} subjectProvider={myAppSubjectProvider} />
<UserAuthorizationDetail subjectId={id} permissions={myAppPermissions} subjectProvider={myAppSubjectProvider} />
```

Each renders a full page: breadcrumb slot, header, toolbar, table/tree, dialogs, validation,
loading/error/empty states, and a How-To section — with built-in English/Vietnamese/Simplified
Chinese translations. The only required prop is `permissions` — the application's own permission
catalog (see "Permission catalog" below).

## Authorization model

```
Role
 └── Permission[]

Position
 ├── Role[]              (reusable permission bundles it holds)
 └── Direct Permission[]  (exceptions, granted straight to the Position)

User
 ├── Role[]
 └── Direct Permission[]
```

Two intentionally-separate mechanisms, both always available — never forced through one or the
other. Roles are reusable permission bundles (define once in Role Management, assign to any
number of Positions/Users). Direct permissions are for one-off exceptions that don't warrant a
whole Role. There is deliberately **no "Role Group" concept** — Roles cannot hold other Roles.

## Installation

Part of `@novacore/frontend-next-shadcn`, importable from the package root or the `./access-control`
subpath (identical exports — the subpath exists for consumers who prefer narrower imports):

```ts
import { PermissionManagement, RoleManagement, PositionManagement, UserPermissionAssignment, UserAuthorizationDetail, AccessControlProvider } from "@novacore/frontend-next-shadcn";
// or
import { PermissionManagement, RoleManagement, PositionManagement, UserPermissionAssignment, UserAuthorizationDetail, AccessControlProvider } from "@novacore/frontend-next-shadcn/access-control";
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

`descriptionTranslationKey` is optional supporting copy shown as secondary text under the
permission's name in `PermissionManagement` and as a tooltip context in assignment UIs — keep it
short (one sentence answering "what does this allow?"), the same style as `translationKey` itself.
The raw `id` is intentionally never rendered as visible text anywhere in this module (only as a
`data-permission-id` attribute, for devtools/debugging) — administrators see localized name/
description, not the wire format; the identifier remains available to application code via the
`permissions` prop itself for API calls, assignment, and tooling.

## Tenant entitlement

Three concepts must stay separate, and this package models exactly the first and third — the
second (tenant entitlement) sits between them and is what this section covers:

```
Application Permission Catalog   →  PermissionDefinition[] (static, application-owned, above)
Tenant Root Entitlement          →  TenantEntitlementProvider (this section)
Assignment (Role/Position/User)  →  AssignedPermissions / RoleAssignmentService (below)
```

A tenant's subscription/package may not currently include every permission the application
defines — that's an *entitlement* concern, distinct from whether a Role/Position/User has been
*assigned* the permission. `TenantEntitlementProvider` supplies this to every Access Control
component in a subtree:

```tsx
import { TenantEntitlementProvider } from "@novacore/frontend-next-shadcn";

<TenantEntitlementProvider status={entitlementQuery.status} entitledPermissionIds={entitlementQuery.entitledIds}>
  {children}
</TenantEntitlementProvider>
```

- `status: "loading" | "ready" | "error"` — while `"loading"`, `PermissionManagement` shows a
  skeleton instead of a table; on `"error"`, it shows a non-blocking banner and marks every
  permission's status `"unknown"` rather than silently rendering it as unavailable (an entitlement
  fetch failure must never look identical to "the tenant doesn't have this").
- `entitledPermissionIds: string[] | "all"` — `"all"` (the default when no provider is mounted at
  all) means no entitlement gating is configured; every catalog permission renders as available.
  Otherwise, it's the tenant's currently-owned subset of permission ids.

Consumed *internally* — `PermissionManagement` (Status column), `PermissionTree`/
`PermissionAssignment`/`RolePermissionAssignment`/`PositionPermissionAssignment`/
`UserPermissionAssignment` (assignment locking), and `EffectivePermissions` (partitioning effective
vs. currently-unavailable) all call `useTenantEntitlement()` themselves. No page-level prop changes
are needed to adopt this — mount the provider once, typically fed from your application's bootstrap/
session flow, the same way `PermissionProvider`/`AccessControlProvider` already are.

**Assignment semantics under entitlement** (`PermissionTree`'s `unavailableIds` prop, derived via
`deriveUnavailablePermissionIds(catalogIds, entitlement)`):

- A permission the tenant doesn't currently own, **already assigned**, renders checked with a
  distinct "unavailable" indicator — and can be unchecked (explicitly removed) but not re-checked.
- A permission the tenant doesn't currently own, **not assigned**, renders disabled — the UI can't
  create a new assignment to it.
- Neither state ever deletes or filters an existing assignment automatically. A tenant package
  downgrade only shrinks `entitledPermissionIds`; existing `AssignedPermissions.permissionIds`
  untouched by an admin are preserved verbatim and become effective again automatically the moment
  the tenant's package is upgraded back — no re-assignment needed.

**Security note:** entitlement here, like `usePermission()`, is UX only — it improves what the
admin sees and prevents the UI from proposing an invalid new assignment, but it is never a
substitute for server-side entitlement enforcement. The backend must independently intersect
candidate permissions with its own (cached) root-tenant entitlement before authorizing anything.

## Provider setup

Role/Position/assignment data still flows through service adapters — implement `RoleService`/
`PositionService`/`PermissionAssignmentService`/`RoleAssignmentService` (see
`src/components/access-control/types.ts`) against your app's real API, then mount
`AccessControlProvider` once:

```tsx
<AccessControlProvider services={{ roles, positions, assignments, roleAssignments }}>
  {/* PermissionManagement / RoleManagement / PositionManagement / UserPermissionAssignment / UserAuthorizationDetail anywhere below */}
</AccessControlProvider>
```

Unlike `PermissionProvider`/`I18nProvider`, there is **no permissive default** — every access-control
component throws a clear error if rendered without a provider, since there's no sane fallback for
missing data. Note `AccessControlServices` has no `permissions` key — the catalog is a prop, not
a service (see above), and subject/user search for `UserPermissionAssignment`/
`UserAuthorizationDetail` is a separate `subjectProvider` prop, not part of this provider either
(too application-specific to standardize — see "User Permission Assignment" below).

## Role assignment

`RoleAssignmentService` is the Position/User → Role[] half of the model, separate from
`PermissionAssignmentService` (which still also handles Role → Permission[], unchanged):

```ts
export type RoleAssignableSubjectType = "position" | "user"; // not "role" — no Role Group

export interface RoleAssignmentService {
  getAssignedRoleIds(subjectType: RoleAssignableSubjectType, subjectId: string): Promise<string[]>;
  assignRoles(subjectType: RoleAssignableSubjectType, subjectId: string, roleIds: string[]): Promise<void>;
}
```

`RoleAssignment` (and its `PositionRoleAssignment`/`UserRoleAssignment` sugar) is the reusable
picker: loads the full role catalog once (roles are typically a small list, unlike permissions)
plus the subject's currently-assigned roles, and renders a searchable checkbox list — same
load/dirty-state/save/cancel shape as `PermissionAssignment`, just for roles instead of
permissions. `PositionManagement`'s edit sheet uses it for its **Roles** tab, alongside the
existing **Permissions** tab (direct permissions — unchanged, still only ever direct, never
shows Roles).

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

export interface SubjectDetailField { label: string; value: string }
export interface SubjectDetail extends SubjectOption { fields?: SubjectDetailField[] }

export interface SubjectSearchProvider {
  search(request: CriteriaRequest): Promise<PaginatedResult<SubjectOption>>;
  getById(id: string): Promise<SubjectDetail | null>;
}
```

`SubjectSearchProvider.search` reuses the platform's canonical `CriteriaRequest`/`PaginatedResult`
search contract — the same one `RoleService.getList`/`PositionService.getList` already use — so an
app backed by a real search endpoint (Users included, per `CriteriaRequest`'s own doc comment) can
implement this with one `httpClient` call. `getById` backs `UserAuthorizationDetail`'s header and
Overview tab — `fields` is open-ended precisely so you only ever surface metadata your backend
actually has (status, department, position, tenant, ...), never an invented fixed schema.
`subjectProvider` is **not** part of `AccessControlServices` — pass it directly as a prop, since
(unlike Role/Position/assignment data) it's too application-specific to standardize into the
shared provider.

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

- **One user selected** — a `Roles`/`Direct Permissions` tab pair, each the full
  `UserRoleAssignment`/`PermissionAssignment` editor (identical to Role/Position): loads current
  state, lets you check/uncheck freely, Save replaces that subject's set with exactly what's
  checked. If `getDetailHref` is supplied, a link to the full `UserAuthorizationDetail` page for
  this user is rendered alongside (see below).
- **Multiple users selected** — the same `Roles`/`Direct Permissions` tabs, but each starts
  unchecked (roles/permissions being *granted*, not each user's current individual state, which
  may differ per user) and share one combined "Apply" action + one confirmation dialog summarizing
  "grants N permissions and M roles to K users." Confirming is an **additive grant** for both:
  each selected user's *existing* roles and permissions (fetched individually first) are
  preserved, and the checked ones are added on top — a bulk action never silently revokes
  anything a user already held for an unrelated reason.

The running selection (`Map<id, SubjectOption>`) survives searches/pagination, and the toolbar
shows a live "N selected" count with a "Clear selection" action.

## Effective Permissions & User Authorization Detail

`UserAuthorizationDetail` is the complete single-user workspace — different from
`UserPermissionAssignment`'s bulk page, which operates on many users and links here for the full
picture on one:

```tsx
<UserAuthorizationDetail subjectId={id} permissions={myAppPermissions} subjectProvider={myAppSubjectProvider} />
```

A full page (not a `Sheet`), with tabs: **Overview** (renders `SubjectDetail.fields` — whatever
read-only profile metadata your adapter supplies, e.g. status/department/position; nothing is
invented if your backend doesn't have a field), **Roles** (`UserRoleAssignment`), **Direct
Permissions** (`PermissionAssignment`, reused unchanged), and **Effective Permissions**.

`EffectivePermissions` answers "what can this person actually do, and why" — every permission the
subject holds, whether via a Role or granted directly, each tagged with its source(s) (a
permission can come from more than one place at once):

```ts
export interface EffectivePermissionSource { type: "direct" | "role"; roleId?: string; roleName?: string }
export interface EffectivePermission { id: string; sources: EffectivePermissionSource[] }
```

**This is computed client-side**, by composing existing services: direct permissions +
`roleAssignments.getAssignedRoleIds` + one `assignments.getAssignedPermissions("role", ...)` per
assigned role (parallelized). That's correct — the underlying assignment relationships are real —
but it's an **N+1 read** (one round trip per role the subject holds), which is fine against a
mocked or small-role-count backend but not a substitute for a real backend endpoint at scale. If
your backend can compute this itself (e.g. a single `GET /users/{id}/effective-permissions`),
that's strictly better; this frontend composition is the fallback when it can't, not the
recommended long-term source of truth.

`getById` on `SubjectSearchProvider` (see below) backs the Overview tab and page header — it's a
required method alongside `search`, added specifically to support this page.

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
- `RoleAssignment` — the Role[] equivalent of `PermissionAssignment`:
  `<RoleAssignment subjectType="position" subjectId={id} />`. `PositionRoleAssignment`/
  `UserRoleAssignment` are `subjectType`-preset sugar over it.
- `EffectivePermissions` — read-only merged Role+Direct permission view with source badges, see
  above.
- `PositionHierarchy` — presentational superior/subordinate tree (expand/collapse, `renderActions`
  escape hatch).
- `PositionSelector` — indented, cycle-safe single-select for choosing a superior position.
- `DataTable`'s `selectable`/`selectedRowIds`/`onSelectedRowIdsChange` — what `UserPermissionAssignment`/
  `RoleAssignment` are built on for paginated/searchable multi-select; reuse it directly if
  composing a custom subject or role picker.
- `SheetContent`'s `size="wide"` — `w-full sm:w-[85vw] lg:w-[65vw] lg:max-w-5xl`, used by
  `RoleManagement`/`PositionManagement`'s edit sheets now that they hold a real authorization
  workspace (Roles + Permissions tabs), not just a details form. Reuse it for any other
  content-heavy `Sheet` rather than repeating a `max-w-*` className by hand.

## Example: minimal new Admin application

```tsx
// access-control-permissions.ts — the application's own permission catalog
export const myAppPermissions: PermissionDefinition[] = [ /* ... */ ];

// access-control-services.ts — the app-specific service adapters this module requires
export const accessControlServices: AccessControlServices = {
  roles: myRoleApiAdapter,
  positions: myPositionApiAdapter,
  assignments: myAssignmentApiAdapter,
  roleAssignments: myRoleAssignmentApiAdapter,
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
export default () => (
  <UserPermissionAssignment
    permissions={myAppPermissions}
    subjectProvider={myAppSubjectProvider}
    getDetailHref={(id) => `/admin/access-control/user-permissions/${id}`}
  />
);
// app/admin/access-control/user-permissions/[id]/page.tsx
export default ({ params }) => (
  <UserAuthorizationDetail subjectId={params.id} permissions={myAppPermissions} subjectProvider={myAppSubjectProvider} />
);
```

Five route files, one permission catalog, one service adapter module, zero access-control UI
code. `myAppTranslations` is where `myAppPermissions`' `translationKey`/`groupTranslationKey`
values actually resolve — see "Permission catalog" above.
