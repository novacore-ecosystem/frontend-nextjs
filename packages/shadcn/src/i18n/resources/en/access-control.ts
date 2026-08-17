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
  },
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
    success: "Role created.",
  },
  edit: {
    title: "Edit role",
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
    success: "Position created.",
  },
  addChild: "Add subordinate position",
  edit: {
    title: "Edit position",
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
    details: "Details",
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
  description: "Choose which permissions this {{subject}} grants.",
  searchPlaceholder: "Search permissions…",
  selectAll: "Select all",
  deselectAll: "Deselect all",
  inherited: "Inherited",
  readOnly: "Not grantable by you",
  unsavedChanges: "You have unsaved changes.",
  save: "Save changes",
  cancel: "Cancel",
  saved: "Permissions updated.",
  empty: "No permissions match your search.",
  subjectLabels: {
    role: "role",
    position: "position",
    user: "user",
  },
};
