import type { CriteriaRequest, Locale, PaginatedResult } from "@novacore/frontend-foundation";

/**
 * A permission entry as surfaced to the UI. `id` is the raw permission key (e.g.
 * `"order:view"`) — see `@novacore/frontend-foundation`'s `Permission` type for the real
 * platform catalog. `category` groups permissions in `PermissionTree`/`PermissionManagement`;
 * an adapter backed by the real Auth service should derive it the same way the backend's
 * `PermissionGroupTranslation` does, but a simple `id.split(":")[0]` is a reasonable default
 * (see `derivePermissionCategory` in `permission-utils.ts`).
 */
export interface PermissionRecord {
  id: string;
  category: string;
  displayName: string;
  description?: string;
}

/** One locale's editable display copy for a single permission — mirrors the backend's `PermissionDefinitionTranslation` (one row per permission per language). */
export interface PermissionTranslationInput {
  locale: Locale;
  displayName: string;
  description?: string;
}

export interface PermissionGroup {
  category: string;
  categoryLabel: string;
  permissions: PermissionRecord[];
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

/** What kind of entity a `PermissionAssignment` is editing. `"user"` is reserved for a future per-member assignment screen (section 5) — not built yet, but the contract already accommodates it. */
export type AccessControlSubjectType = "role" | "position" | "user";

/**
 * Fetches/edits the platform's permission catalog. Deliberately **no create/delete** —
 * `@novacore/frontend-foundation`'s `Permissions` catalog is a fixed, code-first set mirrored
 * from the backend's `Permissions.cs`; only per-locale display copy is admin-editable there
 * (`PermissionDefinitionTranslation`). An adapter for a platform where permissions genuinely
 * are dynamic can still implement this interface — it just also exposes its own
 * creation/deletion UI outside `PermissionManagement`, which intentionally doesn't assume one.
 */
export interface PermissionService {
  getGroups(): Promise<PermissionGroup[]>;
  getById(id: string): Promise<PermissionRecord | null>;
  updateTranslations(id: string, translations: PermissionTranslationInput[]): Promise<PermissionRecord>;
}

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

/** Shared by Role/Position/(future User) permission assignment — one contract, one `PermissionAssignment` component, per section 7. */
export interface PermissionAssignmentService {
  getAssignedPermissions(subjectType: AccessControlSubjectType, subjectId: string): Promise<AssignedPermissions>;
  assignPermissions(subjectType: AccessControlSubjectType, subjectId: string, permissionIds: string[]): Promise<void>;
}

/** The full adapter surface a consuming application provides to `<AccessControlProvider>`. */
export interface AccessControlServices {
  permissions: PermissionService;
  roles: RoleService;
  positions: PositionService;
  assignments: PermissionAssignmentService;
}
