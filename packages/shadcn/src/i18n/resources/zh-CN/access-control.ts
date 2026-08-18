import type {
  accessControlNavigation as enAccessControlNavigation,
  assignment as enAssignment,
  permissions as enPermissions,
  positions as enPositions,
  roleAssignment as enRoleAssignment,
  roles as enRoles,
  userAuthorizationDetail as enUserAuthorizationDetail,
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
    permission: "权限",
    status: "状态",
  },
  status: {
    active: "已启用",
    inactive: "不可用",
    unknown: "状态未知",
  },
  entitlementUnavailable: "无法加载租户的权限可用性信息——权限将不显示可用性状态。",
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
    description: "定义一个新角色及其描述。",
    success: "角色已创建。",
  },
  edit: {
    title: "编辑角色",
    description: "管理此角色的权限与授权设置。",
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
    description: "在组织架构中定义一个新职位。",
    success: "职位已创建。",
  },
  addChild: "添加下级职位",
  edit: {
    title: "编辑职位",
    description: "管理此职位、已分配的角色及直接权限。",
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
    details: "概览",
    roles: "角色",
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
  description: "选择直接分配给此{{subject}}的权限，与通过角色获得的权限相区分。",
  searchPlaceholder: "搜索权限…",
  selectAll: "全选",
  deselectAll: "取消全选",
  inherited: "继承",
  readOnly: "您无法授予此权限",
  unavailable: "已分配，但目前您的套餐不包含此权限",
  unsavedChanges: "您有未保存的更改。",
  save: "保存更改",
  cancel: "取消",
  saved: "权限已更新。",
  empty: "没有符合搜索条件的权限。",
  selectedCount: "已选择 {{selected}} / {{total}} 项权限",
  subjectLabels: {
    role: "角色",
    position: "职位",
    user: "用户",
  },
} as const satisfies typeof enAssignment;

export const roleAssignment = {
  title: "角色分配",
  description: "选择此{{subject}}所持有的角色。",
  searchPlaceholder: "搜索角色…",
  columns: {
    name: "名称",
    description: "描述",
    permissionCount: "权限数",
  },
  unsavedChanges: "您有未保存的更改。",
  save: "保存更改",
  cancel: "取消",
  saved: "角色已更新。",
  empty: "没有符合搜索条件的角色。",
  selectedCount: "已选择 {{selected}} / {{total}} 个角色",
} as const satisfies typeof enRoleAssignment;

export const userPermissions = {
  title: "用户权限",
  description: "搜索用户并直接为其授予角色或权限。",
  searchPlaceholder: "搜索用户…",
  columns: {
    name: "姓名",
    secondary: "",
  },
  selectedCount: "已选择 {{count}} 项",
  clearSelection: "清除选择",
  noneSelected: "请在上方选择一个或多个用户以管理其权限。",
  empty: "没有符合搜索条件的用户。",
  viewDetail: "打开完整权限详情",
  tabs: {
    roles: "角色",
    directPermissions: "直接权限",
  },
  bulk: {
    title: "为 {{count}} 位用户更新权限",
    description: "每位所选用户现有的角色和权限保持不变——此操作仅添加下方勾选的内容。",
    confirmTitle: "应用更改？",
    confirmDescription: "此操作将为 {{subjectCount}} 位用户授予 {{permissionCount}} 项权限和 {{roleCount}} 个角色。现有角色和权限不受影响。",
    confirmButton: "应用",
    assign: "应用",
    assigned: "角色和权限已更新。",
  },
  howTo: {
    title: "关于用户权限",
    whatIs: "一次性为一个或多个用户授予角色或直接权限。角色是可复用的权限组合；直接权限用于处理例外情况。",
    singleVsBulk: "选择单个用户会显示其当前完整的角色和直接权限，可立即编辑，并附有指向完整权限详情页的链接。选择多个用户则会切换为一次性为所有人授予一组选定的角色/权限——不会移除任何已有内容。",
    notUserManagement: "此页面仅用于管理权限——用户创建、关键字之外的搜索筛选以及资料信息属于此应用程序自己的用户管理，不在此处。",
  },
} as const satisfies typeof enUserPermissions;

export const userAuthorizationDetail = {
  title: "用户权限详情",
  description: "管理此用户的角色与直接权限。",
  backLink: "返回用户权限",
  notFound: "未找到该用户。",
  tabs: {
    overview: "概览",
    roles: "角色",
    directPermissions: "直接权限",
    effectivePermissions: "生效权限",
  },
  overview: {
    empty: "暂无更多资料信息。",
  },
  effectivePermissions: {
    description: "该用户当前持有的所有权限，及各自的来源。",
    empty: "该用户暂无生效权限。",
    sourceDirect: "直接授予",
    sourceRole: "角色 — {{name}}",
    unavailableTitle: "当前不可用",
    unavailableDescription: "通过角色或直接授予，但目前租户的套餐不包含此权限。",
  },
} as const satisfies typeof enUserAuthorizationDetail;
