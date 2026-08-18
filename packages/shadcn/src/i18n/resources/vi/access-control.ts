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
  },
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
    success: "Đã tạo vai trò.",
  },
  edit: {
    title: "Sửa vai trò",
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
    success: "Đã tạo vị trí.",
  },
  addChild: "Thêm vị trí cấp dưới",
  edit: {
    title: "Sửa vị trí",
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
  },
  howTo: {
    title: "Về quyền người dùng",
    whatIs: "Cấp Vai trò hoặc quyền trực tiếp cho một hoặc nhiều người dùng cùng lúc. Vai trò là gói quyền có thể tái sử dụng; quyền trực tiếp dành cho các trường hợp ngoại lệ.",
    singleVsBulk:
      "Chọn một người dùng sẽ hiển thị đầy đủ Vai trò và quyền trực tiếp hiện tại của họ, có thể chỉnh sửa ngay, kèm liên kết đến trang phân quyền đầy đủ. Chọn nhiều người dùng sẽ chuyển sang cấp một tập hợp Vai trò/quyền đã chọn cho tất cả cùng lúc — không có gì hiện có bị gỡ bỏ.",
    notUserManagement:
      "Trang này chỉ quản lý phân quyền — việc tạo người dùng, các bộ lọc tìm kiếm ngoài từ khóa, và thông tin hồ sơ thuộc về hệ thống quản lý người dùng riêng của ứng dụng, không phải ở đây.",
  },
} as const satisfies typeof enUserPermissions;

export const userAuthorizationDetail = {
  title: "Phân quyền người dùng",
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
  },
} as const satisfies typeof enUserAuthorizationDetail;
