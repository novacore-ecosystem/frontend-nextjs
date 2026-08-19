import type { profile as enProfile } from "../en/profile";

/** Vietnamese translation of `resources/en/profile.ts`. Kept shape-complete via `satisfies typeof enProfile`. */
export const profile = {
  title: "Hồ sơ",
  description: "Quản lý thông tin cá nhân và chi tiết tài khoản của bạn.",
  loading: "Đang tải hồ sơ của bạn…",
  loadErrorTitle: "Không thể tải hồ sơ",
  loadErrorDescription: "Đã xảy ra lỗi khi tải hồ sơ của bạn. Vui lòng thử lại.",
  personalInfo: {
    title: "Thông tin cá nhân",
    displayName: "Tên hiển thị",
    email: "Email",
    update: "Cập nhật",
    saved: "Đã lưu.",
  },
  avatar: {
    title: "Ảnh đại diện",
    description: "Tải lên ảnh để cá nhân hóa tài khoản của bạn.",
    upload: "Tải ảnh lên",
    remove: "Xóa",
  },
  accountInfo: {
    title: "Thông tin tài khoản",
    username: "Tên đăng nhập",
    email: "Email",
    status: "Trạng thái",
    tenant: "Tổ chức",
    roles: "Vai trò",
    empty: "Không có thêm thông tin tài khoản nào.",
  },
} as const satisfies typeof enProfile;
