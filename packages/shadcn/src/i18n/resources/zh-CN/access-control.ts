import type {
  accessControlNavigation as enAccessControlNavigation,
  assignment as enAssignment,
  permissions as enPermissions,
  positions as enPositions,
  roles as enRoles,
  userPermissions as enUserPermissions,
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

export const userPermissions = {
  title: "用户权限",
  description: "搜索用户并直接为其授予权限。",
  searchPlaceholder: "搜索用户…",
  columns: {
    name: "姓名",
    secondary: "",
  },
  selectedCount: "已选择 {{count}} 项",
  clearSelection: "清除选择",
  noneSelected: "请在上方选择一个或多个用户以分配权限。",
  empty: "没有符合搜索条件的用户。",
  bulk: {
    title: "为 {{count}} 位用户授予权限",
    description: "每位所选用户现有的权限保持不变——此操作仅添加下方勾选的权限。",
    confirmTitle: "授予权限？",
    confirmDescription: "此操作将为 {{subjectCount}} 位用户授予 {{permissionCount}} 项权限。现有权限不受影响。",
    confirmButton: "授予权限",
    grant: "授予权限",
    granted: "权限已授予。",
  },
  howTo: {
    title: "关于用户权限",
    whatIs: "直接为一个或多个用户授予权限，作为其通过角色和职位获得的权限之外的补充。",
    singleVsBulk: "选择单个用户会显示其当前的完整权限，可像角色/职位分配一样编辑。选择多个用户则会切换为一次性为所有人授予一组选定的权限——不会移除任何已有权限。",
    notUserManagement: "此页面仅用于分配权限——用户创建、关键字之外的搜索筛选以及资料信息属于此应用程序自己的用户管理，不在此处。",
  },
} as const satisfies typeof enUserPermissions;
