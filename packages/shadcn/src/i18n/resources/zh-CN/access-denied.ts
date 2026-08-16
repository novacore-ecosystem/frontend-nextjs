import type { accessDenied as enAccessDenied } from "../en/access-denied";

/** Simplified Chinese translation of `resources/en/access-denied.ts`. Kept shape-complete via `satisfies typeof enAccessDenied`. */
export const accessDenied = {
  title: "无访问权限",
  description: "您没有权限访问此页面。",
  backLabel: "返回",
  homeLabel: "前往仪表盘",
} as const satisfies typeof enAccessDenied;
