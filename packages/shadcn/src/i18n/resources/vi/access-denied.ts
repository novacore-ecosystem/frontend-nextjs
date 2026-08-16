import type { accessDenied as enAccessDenied } from "../en/access-denied";

/** Vietnamese translation of `resources/en/access-denied.ts`. Kept shape-complete via `satisfies typeof enAccessDenied`. */
export const accessDenied = {
  title: "Không có quyền truy cập",
  description: "Bạn không có quyền truy cập trang này.",
  backLabel: "Quay lại",
  homeLabel: "Về trang chính",
} as const satisfies typeof enAccessDenied;
