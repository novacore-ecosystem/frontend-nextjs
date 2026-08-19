import type { profile as enProfile } from "../en/profile";

/** Simplified Chinese translation of `resources/en/profile.ts`. Kept shape-complete via `satisfies typeof enProfile`. */
export const profile = {
  title: "个人资料",
  description: "管理您的个人信息和账户详情。",
  loading: "正在加载您的个人资料…",
  loadErrorTitle: "无法加载个人资料",
  loadErrorDescription: "加载个人资料时出错，请重试。",
  personalInfo: {
    title: "个人信息",
    displayName: "显示名称",
    email: "邮箱",
    update: "更新",
    saved: "已保存。",
  },
  avatar: {
    title: "头像",
    description: "上传照片以个性化您的账户。",
    upload: "上传照片",
    remove: "移除",
  },
  accountInfo: {
    title: "账户信息",
    username: "用户名",
    email: "邮箱",
    status: "状态",
    tenant: "租户",
    roles: "角色",
    empty: "暂无更多账户信息。",
  },
} as const satisfies typeof enProfile;
