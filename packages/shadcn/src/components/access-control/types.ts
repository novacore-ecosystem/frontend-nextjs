import type { CriteriaRequest, PaginatedResult } from "@novacore/frontend-foundation";

/**
 * One permission as declared by the **consuming application** — not fetched from a backend.
 * Permission identifiers are a fixed, code-first platform catalog (mirrored from the backend's
 * `Permissions.cs`); a given admin application only ever cares about a subset of them, and that
 * subset — plus its localized presentation — is the application's own configuration, not runtime
 * data. See `docs/access-control.md`'s "Permission catalog" section.
 *
 * `translationKey`/`groupTranslationKey` are resolved through the active `I18nProvider` (the
 * same mechanism every other string in this package uses) — the application supplies the actual
 * `en`/`vi`/`zh-CN` copy via `I18nProvider`'s `translations` prop, this module never stores or
 * edits display copy itself.
 */
export interface PermissionDefinition {
  /** The canonical permission identifier, e.g. `"order:view"`. */
  id: string;
  /** Translation key resolved via the active `I18nProvider`'s translator, e.g. `"myApp.permissions.order.view"`. */
  translationKey: string;
  /** Optional translation key for read-only descriptive copy, e.g. shown as a table column/tooltip. Never editable through this module. */
  descriptionTranslationKey?: string;
  /** Groups this permission in `PermissionTree`/`PermissionManagement`. Defaults to `derivePermissionCategory(id)` when omitted. */
  group?: string;
  /** Translation key for `group`'s label. Falls back to the raw `group` string when omitted or unresolved. */
  groupTranslationKey?: string;
  /** Sort order within its group; ties broken by `id`. Omitted definitions sort after ordered ones. */
  order?: number;
}

/** A permission resolved for rendering — `PermissionTree`/`PermissionManagement`'s internal shape, produced from a `PermissionDefinition[]` by `resolvePermissionCatalog`. Not application-authored. */
export interface PermissionRecord {
  id: string;
  category: string;
  displayName: string;
  description?: string;
  /**
   * Whether the tenant currently owns this permission, per `annotateEntitlement`. `"unknown"`
   * means entitlement failed to load — never silently treated as unavailable (see task's "don't
   * confuse inactive with unknown" rule). Omitted only transiently while entitlement is loading.
   */
  entitled?: boolean | "unknown";
}

export interface PermissionGroup {
  category: string;
  categoryLabel: string;
  permissions: PermissionRecord[];
}

export type EntitlementStatus = "loading" | "ready" | "error";

/**
 * The tenant/root-tenant's current permission entitlement — the middle layer between the
 * application's static `PermissionDefinition[]` catalog and a subject's `AssignedPermissions`:
 * `Effective Permission = Application Catalog ∩ Tenant Entitlement ∩ Assignment`. Supplied via
 * `<TenantEntitlementProvider>`, typically sourced once from the application's bootstrap/session
 * flow (see `docs/access-control.md`'s "Tenant entitlement" section) — never fetched per-page.
 *
 * `entitledPermissionIds: "all"` means no entitlement gating is configured for this application
 * (the default when no provider is mounted) — every catalog permission renders as available, so
 * apps that don't model tenant packages/subscriptions are unaffected.
 */
export interface TenantEntitlementState {
  status: EntitlementStatus;
  entitledPermissionIds: string[] | "all";
}

/** An authorization subject selectable in `UserPermissionAssignment` — deliberately generic since a "user" may be a Member/Account/Employee/Operator depending on the consuming application's domain (see `docs/access-control.md`). */
export interface SubjectOption {
  id: string;
  displayName: string;
  secondaryText?: string;
}

/** One label/value pair of read-only profile metadata — open-ended so an application supplies only fields it actually has (status, department, position, tenant, ...) rather than this package inventing a fixed schema no backend may match. */
export interface SubjectDetailField {
  label: string;
  value: string;
}

/** A `SubjectOption` plus whatever additional profile metadata the application has, for `UserAuthorizationDetail`'s Overview tab. `fields` is omitted (not empty-arrayed) when the application has nothing further to show. */
export interface SubjectDetail extends SubjectOption {
  fields?: SubjectDetailField[];
}

/**
 * The consuming application's user/member search adapter for `UserPermissionAssignment`/
 * `UserAuthorizationDetail`. `search` reuses the platform's canonical `CriteriaRequest`/
 * `PaginatedResult` search contract — the same one `RoleService.getList`/`PositionService.getList`
 * already use — rather than a bespoke search type, so an app backed by a real
 * `POST /users/search`-style endpoint (per `CriteriaRequest`'s own doc comment) can implement this
 * with a single `httpClient` call. `getById` backs the detail page's profile header/Overview tab.
 */
export interface SubjectSearchProvider {
  search(request: CriteriaRequest): Promise<PaginatedResult<SubjectOption>>;
  getById(id: string): Promise<SubjectDetail | null>;
}

export interface RoleRecord {
  id: string;
  name: string;
  description?: string;
  /** Number of permissions currently assigned — omit if the adapter can't cheaply compute it; the list column hides itself when absent. */
  permissionCount?: number;
}

export interface RoleInput {
  name: string;
  description?: string;
}

export interface PositionRecord {
  id: string;
  name: string;
  code?: string;
  description?: string;
  /** `null` for a root (no superior) position. */
  parentId: string | null;
}

export interface PositionInput {
  name: string;
  code?: string;
  description?: string;
  parentId: string | null;
}

export interface PositionTreeNode extends PositionRecord {
  children: PositionTreeNode[];
}

/**
 * The set of permissions assigned to a subject (role/position/user), plus two optional
 * read-only overlays the tree renders as locked-and-checked: `inheritedPermissionIds`
 * (e.g. granted via a superior position, per section 8's delegation model) and
 * `readOnlyPermissionIds` (e.g. permissions the current actor can't themselves grant because
 * they don't hold them). Both default to empty — most adapters only need `permissionIds`.
 */
export interface AssignedPermissions {
  permissionIds: string[];
  inheritedPermissionIds?: string[];
  readOnlyPermissionIds?: string[];
}

/** One source a permission is granted through, for `EffectivePermissions`. `roleId`/`roleName` are present only when `type` is `"role"`. */
export interface EffectivePermissionSource {
  type: "direct" | "role";
  roleId?: string;
  roleName?: string;
}

/** A permission the subject currently holds, with every source it comes from (a permission may be granted by more than one role, or by both a role and directly). */
export interface EffectivePermission {
  id: string;
  sources: EffectivePermissionSource[];
}

/** What kind of entity a `PermissionAssignment` is editing. `"user"` covers `UserPermissionAssignment`'s single-subject path. */
export type AccessControlSubjectType = "role" | "position" | "user";

/** Positions and Users can hold Roles; Roles cannot (no "Role Group" concept — see `docs/access-control.md`). */
export type RoleAssignableSubjectType = "position" | "user";

export interface RoleService {
  getList(request: CriteriaRequest): Promise<PaginatedResult<RoleRecord>>;
  getById(id: string): Promise<RoleRecord | null>;
  create(input: RoleInput): Promise<RoleRecord>;
  update(id: string, input: RoleInput): Promise<RoleRecord>;
  delete(id: string): Promise<void>;
}

export interface PositionService {
  getList(request: CriteriaRequest): Promise<PaginatedResult<PositionRecord>>;
  getTree(): Promise<PositionTreeNode[]>;
  getById(id: string): Promise<PositionRecord | null>;
  create(input: PositionInput): Promise<PositionRecord>;
  update(id: string, input: PositionInput): Promise<PositionRecord>;
  delete(id: string): Promise<void>;
}

/** Shared by Role/Position/User permission assignment — one contract, one `PermissionAssignment` component. */
export interface PermissionAssignmentService {
  getAssignedPermissions(subjectType: AccessControlSubjectType, subjectId: string): Promise<AssignedPermissions>;
  assignPermissions(subjectType: AccessControlSubjectType, subjectId: string, permissionIds: string[]): Promise<void>;
}

/** Shared by Position/User Role assignment — one contract, one `RoleAssignment` component (mirrors `PermissionAssignmentService`/`PermissionAssignment`). */
export interface RoleAssignmentService {
  getAssignedRoleIds(subjectType: RoleAssignableSubjectType, subjectId: string): Promise<string[]>;
  assignRoles(subjectType: RoleAssignableSubjectType, subjectId: string, roleIds: string[]): Promise<void>;
}

/**
 * The full adapter surface a consuming application provides to `<AccessControlProvider>`.
 * Deliberately excludes the permission catalog — unlike roles/positions/assignments, the
 * catalog is static application configuration, not runtime data fetched from a service; it
 * flows into components as a `permissions: PermissionDefinition[]` prop instead (see
 * `docs/access-control.md`). Also excludes subject/user search — too application-specific to
 * standardize here, passed directly to `UserPermissionAssignment` as a `subjectProvider` prop.
 */
export interface AccessControlServices {
  roles: RoleService;
  positions: PositionService;
  assignments: PermissionAssignmentService;
  roleAssignments: RoleAssignmentService;
}
