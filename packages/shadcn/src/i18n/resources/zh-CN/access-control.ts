import type {
  accessControlNavigation as enAccessControlNavigation,
  assignment as enAssignment,
  permissions as enPermissions,
  positions as enPositions,
  roles as enRoles,
} from "../en/access-control";

/** Simplified Chinese translation of `resources/en/access-control.ts`. Kept shape-complete via `satisfies typeof en*`. */

export const accessControlNavigation = {
  title: "访问控制",
} as const satisfies typeof enAccessControlNavigation;

export const permissions = {
  title: "权限",
  description: "浏览此应用程序使用的权限。",
  searchPlaceholder: "搜索权限…",
  columns: {
    identifier: "标识符",
    category: "分类",
    name: "名称",
    description: "描述",
  },
  empty: "没有符合搜索条件的权限。",
  howTo: {
    title: "关于权限",
    whatIs: "权限是由后端定义的固定能力（例如 \"order:view\"）。此列表仅显示此应用程序使用的权限；其名称和描述由应用程序定义，无法在此编辑。",
    naming: "标识符遵循 模块:操作 的格式，并在上方列表中按模块分组。",
    assignment: "权限被授予给角色、职位和用户，而不是直接在此授予——请使用角色管理、职位管理或用户权限来更改谁持有某项权限。",
  },
} as const satisfies typeof enPermissions;

export const roles = {
  title: "角色",
  description: "管理角色以及每个角色授予的权限。",
  searchPlaceholder: "搜索角色…",
  create: {
    trigger: "创建角色",
    title: "创建角色",
    success: "角色已创建。",
  },
  edit: {
    title: "编辑角色",
  },
  delete: {
    title: "删除角色",
    description: "此操作将永久删除“{{name}}”。持有该角色的人员将失去其授予的权限。",
    success: "角色已删除。",
  },
  fields: {
    name: "名称",
    namePlaceholder: "例如：仓库经理",
    description: "描述",
    descriptionPlaceholder: "该角色的用途",
  },
  tabs: {
    details: "详情",
    permissions: "权限",
  },
  columns: {
    name: "名称",
    description: "描述",
    permissionCount: "权限数",
  },
  empty: "没有符合搜索条件的角色。",
  howTo: {
    title: "关于角色",
    whatIs: "角色是一组具名的权限集合，可作为一个整体授予某个人。",
    permissionAssignment: "打开某个角色，使用其“权限”标签页选择该角色授予哪些权限。",
    vsPosition: "角色只是权限的组合。如需组织层级与授权委托，请使用职位。",
  },
} as const satisfies typeof enRoles;

export const positions = {
  title: "职位",
  description: "管理用于组织架构与授权委托的层级结构。",
  searchPlaceholder: "搜索职位…",
  view: {
    tree: "树形",
    list: "列表",
  },
  create: {
    trigger: "创建职位",
    title: "创建职位",
    success: "职位已创建。",
  },
  addChild: "添加下级职位",
  edit: {
    title: "编辑职位",
  },
  delete: {
    title: "删除职位",
    description: "此操作将永久删除“{{name}}”。",
    success: "职位已删除。",
    blocked: "该职位存在下级职位——请先重新分配或删除它们。",
  },
  fields: {
    name: "名称",
    namePlaceholder: "例如：区域主管",
    code: "编码",
    codePlaceholder: "例如：REGIONAL_SUPERVISOR",
    description: "描述",
    parent: "上级职位",
    parentPlaceholder: "选择上级职位",
    noParent: "无上级（最高级职位）",
  },
  tabs: {
    details: "详情",
    permissions: "权限",
  },
  columns: {
    name: "名称",
    code: "编码",
    parent: "上级",
  },
  empty: "没有符合搜索条件的职位。",
  howTo: {
    title: "关于职位",
    whatIs: "职位表示组织层级中的一个位置，而不是权限组合——用于表示汇报关系并管理授权委托。",
    hierarchy: "每个职位最多只能有一个上级。职位会继承其上级链的授权上下文，在“权限”标签页中显示为“继承”。",
    vsRole: "职位表示组织结构与授权委托；角色表示“一个人可以做什么”。一个人通常同时拥有一个职位和一个或多个角色。",
  },
} as const satisfies typeof enPositions;

export const assignment = {
  title: "权限分配",
  description: "选择此{{subject}}授予哪些权限。",
  searchPlaceholder: "搜索权限…",
  selectAll: "全选",
  deselectAll: "取消全选",
  inherited: "继承",
  readOnly: "您无法授予此权限",
  unsavedChanges: "您有未保存的更改。",
  save: "保存更改",
  cancel: "取消",
  saved: "权限已更新。",
  empty: "没有符合搜索条件的权限。",
  subjectLabels: {
    role: "角色",
    position: "职位",
    user: "用户",
  },
} as const satisfies typeof enAssignment;
