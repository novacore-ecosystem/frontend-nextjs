import type { tenantSelector as enTenantSelector } from "../en/tenant-selector";

/** Simplified Chinese translation of `resources/en/tenant-selector.ts`. Kept shape-complete via `satisfies typeof enTenantSelector`. */
export const tenantSelector = {
  placeholder: "选择租户…",
  searchPlaceholder: "搜索租户…",
  loading: "正在加载租户…",
  empty: "未找到租户。",
  error: "无法加载租户，请重试。",
} as const satisfies typeof enTenantSelector;
