import type { registrationDefaults as enRegistrationDefaults } from "../en/registration-defaults";

export const registrationDefaults = {
  title: "注册默认设置",
  description: "自动授予每个注册到此应用的账户的角色和权限。",
  permissionsTitle: "默认权限",
  rolesTitle: "默认角色",
  unsavedChanges: "有未保存的更改",
  save: "保存",
  cancel: "取消",
  empty: "没有可配置的权限。",
} as const satisfies typeof enRegistrationDefaults;
