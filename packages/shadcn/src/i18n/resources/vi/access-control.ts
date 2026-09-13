import type {
  accessControlNavigation as enAccessControlNavigation,
  assignment as enAssignment,
  auditLog as enAuditLog,
  permissions as enPermissions,
  positions as enPositions,
  quickReview as enQuickReview,
  roleAssignment as enRoleAssignment,
  roleEditor as enRoleEditor,
  roles as enRoles,
  userAuthorizationDetail as enUserAuthorizationDetail,
  userPermissions as enUserPermissions,
} from "../en/access-control";

/** Vietnamese translation of `resources/en/access-control.ts`. Kept shape-complete via `satisfies typeof en*`. */

export const accessControlNavigation = {
  title: "Kiểm soát truy cập",
} as const satisfies typeof enAccessControlNavigation;

export const permissions = {
  title: "Quyền hạn",
  description: "Xem các quyền hạn mà ứng dụng này sử dụng.",
  searchPlaceholder: "Tìm kiếm quyền hạn…",
  columns: {
    identifier: "Mã định danh",
    category: "Nhóm",
    name: "Tên",
    description: "Mô tả",
    permission: "Quyền hạn",
    status: "Trạng thái",
  },
  status: {
    active: "Đang hoạt động",
    inactive: "Không khả dụng",
    unknown: "Không xác định trạng thái",
    disabled: "Đã tắt",
  },
  entitlementUnavailable: "Không thể tải thông tin gói quyền hạn của tenant — quyền hạn được hiển thị mà không có trạng thái khả dụng.",
  empty: "Không có quyền hạn nào khớp với tìm kiếm của bạn.",
  howTo: {
    title: "Về quyền hạn",
    whatIs:
      "Quyền hạn là một năng lực cố định do backend định nghĩa (ví dụ \"order:view\"). Danh sách này chỉ hiển thị các quyền mà ứng dụng này sử dụng; tên và mô tả do ứng dụng định nghĩa và không thể chỉnh sửa tại đây.",
    naming: "Mã định danh có dạng module:action và được nhóm theo module trong danh sách ở trên.",
    assignment:
      "Quyền hạn được cấp cho Vai trò, Vị trí và Người dùng, không cấp trực tiếp tại đây — dùng Quản lý vai trò, Quản lý vị trí, hoặc Quyền người dùng để thay đổi ai đang nắm giữ một quyền.",
  },
} as const satisfies typeof enPermissions;

export const roles = {
  title: "Vai trò",
  description: "Quản lý vai trò và các quyền hạn mà mỗi vai trò cấp.",
  searchPlaceholder: "Tìm kiếm vai trò…",
  create: {
    trigger: "Tạo vai trò",
    title: "Tạo vai trò",
    description: "Xác định một vai trò mới và mô tả của nó.",
    success: "Đã tạo vai trò.",
  },
  edit: {
    title: "Sửa vai trò",
    description: "Quản lý quyền hạn và cài đặt phân quyền của vai trò này.",
  },
  delete: {
    title: "Xóa vai trò",
    description: "Thao tác này sẽ xóa vĩnh viễn \"{{name}}\". Người đang giữ vai trò này sẽ mất các quyền mà nó cấp.",
    success: "Đã xóa vai trò.",
  },
  fields: {
    name: "Tên",
    namePlaceholder: "Ví dụ: Quản lý kho",
    description: "Mô tả",
    descriptionPlaceholder: "Vai trò này dùng để làm gì",
  },
  tabs: {
    details: "Chi tiết",
    permissions: "Quyền hạn",
  },
  columns: {
    name: "Tên",
    description: "Mô tả",
    permissionCount: "Số quyền",
  },
  empty: "Không có vai trò nào khớp với tìm kiếm của bạn.",
  howTo: {
    title: "Về vai trò",
    whatIs: "Vai trò là một tập hợp các quyền hạn có tên, cho phép bạn cấp cho một người như một đơn vị duy nhất.",
    permissionAssignment: "Mở một vai trò và dùng tab Quyền hạn của vai trò đó để chọn những quyền mà nó cấp.",
    vsPosition: "Vai trò chỉ đơn thuần là một gói quyền hạn. Với cấu trúc tổ chức và ủy quyền, hãy dùng Vị trí.",
  },
} as const satisfies typeof enRoles;

export const positions = {
  title: "Vị trí",
  description: "Quản lý cấu trúc tổ chức dùng để phân cấp và ủy quyền phân quyền.",
  searchPlaceholder: "Tìm kiếm vị trí…",
  view: {
    tree: "Cây",
    list: "Danh sách",
  },
  create: {
    trigger: "Tạo vị trí",
    title: "Tạo vị trí",
    description: "Xác định một vị trí mới trong sơ đồ tổ chức.",
    success: "Đã tạo vị trí.",
  },
  addChild: "Thêm vị trí cấp dưới",
  edit: {
    title: "Sửa vị trí",
    description: "Quản lý vị trí này, các vai trò được gán và quyền hạn trực tiếp.",
  },
  delete: {
    title: "Xóa vị trí",
    description: "Thao tác này sẽ xóa vĩnh viễn \"{{name}}\".",
    success: "Đã xóa vị trí.",
    blocked: "Vị trí này còn vị trí cấp dưới — hãy chuyển hoặc xóa chúng trước.",
  },
  fields: {
    name: "Tên",
    namePlaceholder: "Ví dụ: Giám sát khu vực",
    code: "Mã",
    codePlaceholder: "Ví dụ: REGIONAL_SUPERVISOR",
    description: "Mô tả",
    parent: "Vị trí cấp trên",
    parentPlaceholder: "Chọn vị trí cấp trên",
    noParent: "Không có cấp trên (vị trí cao nhất)",
  },
  tabs: {
    details: "Tổng quan",
    roles: "Vai trò",
    permissions: "Quyền hạn",
  },
  columns: {
    name: "Tên",
    code: "Mã",
    parent: "Cấp trên",
  },
  empty: "Không có vị trí nào khớp với tìm kiếm của bạn.",
  howTo: {
    title: "Về vị trí",
    whatIs:
      "Vị trí thể hiện một chỗ đứng trong cấu trúc tổ chức, không phải một gói quyền hạn — dùng để thể hiện ai báo cáo cho ai và quản lý việc ủy quyền.",
    hierarchy:
      "Mỗi vị trí có thể có một cấp trên. Một vị trí kế thừa ngữ cảnh phân quyền từ chuỗi cấp trên của nó, hiển thị là \"Kế thừa\" trong tab Quyền hạn.",
    vsRole:
      "Vị trí thể hiện cấu trúc tổ chức và ủy quyền; Vai trò thể hiện \"một người có thể làm gì\". Một người thường vừa giữ một Vị trí vừa giữ một hoặc nhiều Vai trò.",
  },
} as const satisfies typeof enPositions;

export const assignment = {
  title: "Gán quyền hạn",
  description: "Chọn những quyền hạn được gán trực tiếp cho {{subject}} này, tách biệt với những quyền có được qua Vai trò.",
  searchPlaceholder: "Tìm kiếm quyền hạn…",
  selectAll: "Chọn tất cả",
  deselectAll: "Bỏ chọn tất cả",
  inherited: "Kế thừa",
  readOnly: "Bạn không thể cấp quyền này",
  unavailable: "Đã được gán, nhưng hiện không khả dụng theo gói của bạn",
  disabledDefaultReason: "Quyền này chưa khả dụng trong ứng dụng này.",
  unsavedChanges: "Bạn có thay đổi chưa lưu.",
  save: "Lưu thay đổi",
  cancel: "Hủy",
  saved: "Đã cập nhật quyền hạn.",
  empty: "Không có quyền hạn nào khớp với tìm kiếm của bạn.",
  selectedCount: "Đã chọn {{selected}} / {{total}} quyền hạn",
  subjectLabels: {
    role: "vai trò",
    position: "vị trí",
    user: "người dùng",
    tenant: "tenant",
  },
} as const satisfies typeof enAssignment;

export const roleAssignment = {
  title: "Gán vai trò",
  description: "Chọn những vai trò mà {{subject}} này nắm giữ.",
  searchPlaceholder: "Tìm kiếm vai trò…",
  columns: {
    name: "Tên",
    description: "Mô tả",
    permissionCount: "Số quyền",
  },
  unsavedChanges: "Bạn có thay đổi chưa lưu.",
  save: "Lưu thay đổi",
  cancel: "Hủy",
  saved: "Đã cập nhật vai trò.",
  empty: "Không có vai trò nào khớp với tìm kiếm của bạn.",
  selectedCount: "Đã chọn {{selected}} / {{total}} vai trò",
} as const satisfies typeof enRoleAssignment;

export const userPermissions = {
  title: "Quyền người dùng",
  description: "Tìm kiếm người dùng và cấp vai trò hoặc quyền trực tiếp cho họ.",
  searchPlaceholder: "Tìm kiếm người dùng…",
  columns: {
    name: "Tên",
    secondary: "",
    roles: "Vai trò",
    permissions: "Quyền hạn",
    permissionBreakdown: "{{direct}} trực tiếp · {{fromRoles}} từ vai trò",
  },
  selectedCount: "Đã chọn {{count}}",
  clearSelection: "Bỏ chọn",
  noneSelected: "Chọn một hoặc nhiều người dùng ở trên để quản lý phân quyền.",
  empty: "Không có người dùng nào khớp với tìm kiếm của bạn.",
  viewDetail: "Mở trang phân quyền đầy đủ",
  tabs: {
    roles: "Vai trò",
    directPermissions: "Quyền trực tiếp",
  },
  bulk: {
    title: "Cập nhật phân quyền cho {{count}} người dùng",
    description: "Vai trò và quyền hiện có của mỗi người dùng được chọn vẫn giữ nguyên — thao tác này chỉ thêm những gì được chọn bên dưới.",
    confirmTitle: "Áp dụng thay đổi?",
    confirmDescription: "Thao tác này sẽ cấp {{permissionCount}} quyền và {{roleCount}} vai trò cho {{subjectCount}} người dùng. Vai trò và quyền hiện có không bị ảnh hưởng.",
    confirmButton: "Áp dụng",
    assign: "Áp dụng",
    assigned: "Đã cập nhật vai trò và quyền hạn.",
    mode: {
      grant: "Cấp quyền",
      revoke: "Thu hồi",
    },
    revoke: {
      description: "Chọn một quyền để gỡ khỏi mọi người dùng đã chọn đang có quyền đó. Người dùng chưa có quyền này sẽ không bị ảnh hưởng.",
      searchPlaceholder: "Tìm kiếm quyền hạn…",
      empty: "Không có quyền hạn nào khớp với tìm kiếm của bạn.",
      trigger: "Thu hồi quyền",
      confirmTitle: "Thu hồi quyền?",
      confirmDescription: "Thao tác này sẽ thu hồi \"{{permission}}\" khỏi những người (trong số {{subjectCount}} người dùng đã chọn) hiện đang có quyền này. Người dùng chưa có quyền này sẽ không bị ảnh hưởng.",
      confirmButton: "Thu hồi",
      revoked: "Đã thu hồi quyền ở những nơi đang được cấp.",
    },
    review: {
      title: "Xem lại",
      rolesLabel: "Vai trò sẽ cấp",
      permissionsLabel: "Quyền hạn sẽ cấp",
      revokeLabel: "Quyền hạn sẽ thu hồi",
      empty: "Chưa chọn gì cả — hãy chọn vai trò hoặc quyền hạn ở trên.",
    },
  },
  summary: {
    chip: "{{roles}} vai trò, {{direct}} quyền trực tiếp đang có",
  },
  howTo: {
    title: "Về quyền người dùng",
    whatIs: "Cấp Vai trò hoặc quyền trực tiếp cho một hoặc nhiều người dùng cùng lúc. Vai trò là gói quyền có thể tái sử dụng; quyền trực tiếp dành cho các trường hợp ngoại lệ.",
    singleVsBulk:
      "Chọn một người dùng sẽ hiển thị đầy đủ Vai trò và quyền trực tiếp hiện tại của họ, có thể chỉnh sửa ngay, kèm liên kết đến trang phân quyền đầy đủ. Chọn nhiều người dùng sẽ chuyển sang thao tác Cấp quyền hoặc Thu hồi: Cấp quyền thêm một tập hợp Vai trò/quyền đã chọn cho tất cả cùng lúc (không có gì hiện có bị gỡ bỏ); Thu hồi gỡ một quyền đã chọn khỏi những người đang có quyền đó (những người khác không bị ảnh hưởng).",
    notUserManagement:
      "Trang này chỉ quản lý phân quyền — việc tạo người dùng, các bộ lọc tìm kiếm ngoài từ khóa, và thông tin hồ sơ thuộc về hệ thống quản lý người dùng riêng của ứng dụng, không phải ở đây.",
  },
} as const satisfies typeof enUserPermissions;

export const auditLog = {
  title: "Lịch sử thay đổi",
  titleFor: "Lịch sử thay đổi — {{name}}",
  trigger: "Xem lịch sử thay đổi",
  loading: "Đang tải…",
  empty: "Chưa có thay đổi nào.",
  systemActor: "Hệ thống",
  viewDetail: "Xem chi tiết",
  backToList: "Quay lại",
  noChangeData: "Không tìm thấy dữ liệu thay đổi cho mục này.",
  pageOf: "Trang {{page}} / {{total}}",
  columns: {
    time: "Thời gian",
    actor: "Người thực hiện",
    permissionChanges: "Thay đổi quyền hạn",
    roleChanges: "Thay đổi vai trò",
  },
  granted: "Đã cấp ({{count}})",
  revoked: "Đã thu hồi ({{count}})",
  groups: {
    roles: "Vai trò",
    rolesDescription: "Vai trò được gán hoặc gỡ bỏ trong lần thay đổi này.",
    permissions: "Quyền hạn",
    permissionsDescription: "Quyền hạn được cấp hoặc thu hồi trực tiếp trong lần thay đổi này.",
  },
} as const satisfies typeof enAuditLog;

export const quickReview = {
  trigger: "Xem nhanh",
  title: "Xem nhanh",
  loadingDetail: "Đang tải chi tiết quyền hạn…",
  errorDetail: "Không thể tải chi tiết quyền hạn. Vui lòng thử lại.",
  stats: {
    roles: "Vai trò",
    total: "Tổng số",
    direct: "Trực tiếp",
    fromRoles: "Từ vai trò",
  },
  rolePermissions: {
    title: "Quyền từ vai trò",
    subtitle: "Quyền được kế thừa từ các vai trò đã gán cho người dùng này.",
    empty: "Chưa có vai trò nào được gán.",
    roleEmpty: "Vai trò này chưa có quyền nào.",
    loading: "Đang tải quyền của vai trò…",
  },
  directPermissions: {
    title: "Quyền trực tiếp",
    subtitle: "Quyền được cấp trực tiếp cho người dùng này, không qua vai trò.",
    empty: "Không có quyền nào được cấp trực tiếp.",
  },
  rootBadge: {
    title: "ROOT",
    subtitle: "Toàn quyền hệ thống — bỏ qua mọi kiểm tra quyền khác.",
  },
  editPermissions: "Sửa quyền & vai trò",
} as const satisfies typeof enQuickReview;

export const roleEditor = {
  createTitle: "Tạo vai trò",
  editTitle: "Sửa vai trò",
  back: "Quay lại danh sách vai trò",
  notFound: "Không tìm thấy vai trò này.",
  fields: {
    name: "Tên",
    namePlaceholder: "VD: Quản lý kho",
    description: "Mô tả",
    descriptionPlaceholder: "Vai trò này dùng để làm gì",
  },
  permissionsSectionTitle: "Quyền của vai trò",
  permissionsCreateHint: "Lưu vai trò trước để có thể gán quyền.",
  save: "Lưu",
  createSuccess: "Đã tạo vai trò.",
  updateSuccess: "Đã cập nhật vai trò.",
} as const satisfies typeof enRoleEditor;

export const userAuthorizationDetail = {
  title: "Phân quyền người dùng",
  description: "Quản lý vai trò và quyền trực tiếp của người dùng này.",
  backLink: "Quay lại Quyền người dùng",
  notFound: "Không tìm thấy người dùng này.",
  tabs: {
    overview: "Tổng quan",
    roles: "Vai trò",
    directPermissions: "Quyền trực tiếp",
    effectivePermissions: "Quyền hiệu lực",
  },
  overview: {
    empty: "Không có thêm thông tin hồ sơ nào.",
  },
  effectivePermissions: {
    description: "Mọi quyền mà người dùng này đang có, và nguồn gốc của từng quyền.",
    empty: "Người dùng này chưa có quyền hiệu lực nào.",
    sourceDirect: "Trực tiếp",
    sourceRole: "Vai trò — {{name}}",
    unavailableTitle: "Hiện không khả dụng",
    unavailableDescription: "Được gán qua vai trò hoặc trực tiếp, nhưng hiện không khả dụng theo gói của tenant.",
  },
} as const satisfies typeof enUserAuthorizationDetail;
