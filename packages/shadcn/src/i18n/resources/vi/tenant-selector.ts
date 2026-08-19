import type { tenantSelector as enTenantSelector } from "../en/tenant-selector";

/** Vietnamese translation of `resources/en/tenant-selector.ts`. Kept shape-complete via `satisfies typeof enTenantSelector`. */
export const tenantSelector = {
  placeholder: "Chọn tổ chức…",
  searchPlaceholder: "Tìm kiếm tổ chức…",
  loading: "Đang tải danh sách tổ chức…",
  empty: "Không tìm thấy tổ chức nào.",
  error: "Không thể tải danh sách tổ chức. Vui lòng thử lại.",
} as const satisfies typeof enTenantSelector;
