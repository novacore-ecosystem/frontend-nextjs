import type { registrationDefaults as enRegistrationDefaults } from "../en/registration-defaults";

export const registrationDefaults = {
  title: "Mặc định đăng ký",
  description: "Vai trò và quyền hạn được tự động cấp cho mọi tài khoản đăng ký vào Ứng dụng này.",
  permissionsTitle: "Quyền hạn mặc định",
  rolesTitle: "Vai trò mặc định",
  unsavedChanges: "Có thay đổi chưa lưu",
  save: "Lưu",
  cancel: "Hủy",
  empty: "Không có quyền hạn nào để cấu hình.",
} as const satisfies typeof enRegistrationDefaults;
