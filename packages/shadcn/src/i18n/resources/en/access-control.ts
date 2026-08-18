/** `PermissionManagement`/`RoleManagement`/`PositionManagement`/`PermissionAssignment`'s own UI text. English baseline — `vi`/`zh-CN` are shape-checked against this file. */

export const accessControlNavigation = {
  title: "Access Control",
};

export const permissions = {
  title: "Permissions",
  description: "Browse the permissions this application uses.",
  searchPlaceholder: "Search permissions…",
  columns: {
    identifier: "Identifier",
    category: "Category",
    name: "Name",
    description: "Description",
    permission: "Permission",
    status: "Status",
  },
  status: {
    active: "Active",
    inactive: "Not available",
    unknown: "Status unavailable",
  },
  entitlementUnavailable: "Unable to load your plan's permission availability — permissions are shown without an availability status.",
  empty: "No permissions match your search.",
  howTo: {
    title: "About permissions",
    whatIs:
      "A permission is a fixed capability defined by the backend (e.g. \"order:view\"). This list shows only the permissions this application uses; their names and descriptions are defined by the application and can't be edited here.",
    naming: "Identifiers follow a module:action format and are grouped by module in the list above.",
    assignment:
      "Permissions are granted to Roles, Positions, and Users, never directly here — use Role, Position, or User Permissions to change who holds a permission.",
  },
};

export const roles = {
  title: "Roles",
  description: "Manage roles and the permissions each one grants.",
  searchPlaceholder: "Search roles…",
  create: {
    trigger: "Create role",
    title: "Create role",
    description: "Define a new role and its description.",
    success: "Role created.",
  },
  edit: {
    title: "Edit role",
    description: "Manage this role's permissions and authorization settings.",
  },
  delete: {
    title: "Delete role",
    description: "This permanently deletes \"{{name}}\". Anyone holding this role will lose the permissions it grants.",
    success: "Role deleted.",
  },
  fields: {
    name: "Name",
    namePlaceholder: "e.g. Warehouse Manager",
    description: "Description",
    descriptionPlaceholder: "What this role is for",
  },
  tabs: {
    details: "Details",
    permissions: "Permissions",
  },
  columns: {
    name: "Name",
    description: "Description",
    permissionCount: "Permissions",
  },
  empty: "No roles match your search.",
  howTo: {
    title: "About roles",
    whatIs: "A Role is a named collection of permissions you can grant to a person as a single unit.",
    permissionAssignment: "Open a role and use its Permissions tab to choose which permissions it grants.",
    vsPosition:
      "Roles are purely a permission bundle. For organizational hierarchy and delegation, use Positions instead.",
  },
};

export const positions = {
  title: "Positions",
  description: "Manage the organizational hierarchy used to structure and delegate authorization.",
  searchPlaceholder: "Search positions…",
  view: {
    tree: "Tree",
    list: "List",
  },
  create: {
    trigger: "Create position",
    title: "Create position",
    description: "Define a new position in the org chart.",
    success: "Position created.",
  },
  addChild: "Add subordinate position",
  edit: {
    title: "Edit position",
    description: "Manage this position, assigned roles, and direct permissions.",
  },
  delete: {
    title: "Delete position",
    description: "This permanently deletes \"{{name}}\".",
    success: "Position deleted.",
    blocked: "This position has subordinate positions — reassign or delete them first.",
  },
  fields: {
    name: "Name",
    namePlaceholder: "e.g. Regional Supervisor",
    code: "Code",
    codePlaceholder: "e.g. REGIONAL_SUPERVISOR",
    description: "Description",
    parent: "Superior position",
    parentPlaceholder: "Select a superior position",
    noParent: "No superior (top-level position)",
  },
  tabs: {
    details: "Overview",
    roles: "Roles",
    permissions: "Permissions",
  },
  columns: {
    name: "Name",
    code: "Code",
    parent: "Superior",
  },
  empty: "No positions match your search.",
  howTo: {
    title: "About positions",
    whatIs:
      "A Position represents a place in the organizational hierarchy, not a permission bundle — it's used to structure who reports to whom and to manage delegated authorization.",
    hierarchy:
      "Every position may have one superior. A position inherits authorization context from its superior chain, shown as \"Inherited\" in its Permissions tab.",
    vsRole:
      "Positions model organizational structure and delegation; Roles model \"what a person can do.\" A person typically holds both a Position and one or more Roles.",
  },
};

export const assignment = {
  title: "Permission assignment",
  description: "Choose which permissions are assigned directly to this {{subject}}, separate from anything granted through its Roles.",
  searchPlaceholder: "Search permissions…",
  selectAll: "Select all",
  deselectAll: "Deselect all",
  inherited: "Inherited",
  readOnly: "Not grantable by you",
  unavailable: "Assigned, but not currently available under your plan",
  unsavedChanges: "You have unsaved changes.",
  save: "Save changes",
  cancel: "Cancel",
  saved: "Permissions updated.",
  empty: "No permissions match your search.",
  selectedCount: "{{selected}} / {{total}} permissions selected",
  subjectLabels: {
    role: "role",
    position: "position",
    user: "user",
  },
};

export const roleAssignment = {
  title: "Role assignment",
  description: "Choose which roles this {{subject}} holds.",
  searchPlaceholder: "Search roles…",
  columns: {
    name: "Name",
    description: "Description",
    permissionCount: "Permissions",
  },
  unsavedChanges: "You have unsaved changes.",
  save: "Save changes",
  cancel: "Cancel",
  saved: "Roles updated.",
  empty: "No roles match your search.",
  selectedCount: "{{selected}} / {{total}} roles selected",
};

export const userPermissions = {
  title: "User Permissions",
  description: "Search for users and grant them roles or permissions directly.",
  searchPlaceholder: "Search users…",
  columns: {
    name: "Name",
    secondary: "",
  },
  selectedCount: "{{count}} selected",
  clearSelection: "Clear selection",
  noneSelected: "Select one or more users above to manage their authorization.",
  empty: "No users match your search.",
  viewDetail: "Open full authorization detail",
  tabs: {
    roles: "Roles",
    directPermissions: "Direct Permissions",
  },
  bulk: {
    title: "Update authorization for {{count}} users",
    description: "Existing roles and permissions for each selected user are kept — this only adds what's checked below.",
    confirmTitle: "Apply changes?",
    confirmDescription: "This grants {{permissionCount}} permission(s) and {{roleCount}} role(s) to {{subjectCount}} user(s). Existing roles and permissions aren't affected.",
    confirmButton: "Apply",
    assign: "Apply",
    assigned: "Roles and permissions updated.",
  },
  howTo: {
    title: "About user permissions",
    whatIs:
      "Grant Roles or direct permissions to one or more users at once. Roles are reusable permission bundles; direct permissions are for exceptions.",
    singleVsBulk:
      "Selecting one user shows their full current Roles and direct permissions, editable immediately, with a link to their complete authorization detail page. Selecting several users switches to granting a chosen set of Roles/permissions to all of them at once — nothing already held is removed.",
    notUserManagement:
      "This page only manages authorization — user creation, search filters beyond keyword, and profile details live in this application's own user management, not here.",
  },
};

export const userAuthorizationDetail = {
  title: "User Authorization",
  description: "Manage this user's roles and direct permissions.",
  backLink: "Back to User Permissions",
  notFound: "This user could not be found.",
  tabs: {
    overview: "Overview",
    roles: "Roles",
    directPermissions: "Direct Permissions",
    effectivePermissions: "Effective Permissions",
  },
  overview: {
    empty: "No additional profile information is available.",
  },
  effectivePermissions: {
    description: "Every permission this user currently holds, and where each one comes from.",
    empty: "This user has no effective permissions yet.",
    sourceDirect: "Direct",
    sourceRole: "Role — {{name}}",
    unavailableTitle: "Currently unavailable",
    unavailableDescription: "Assigned via a role or directly, but not currently available under the tenant's plan.",
  },
};
