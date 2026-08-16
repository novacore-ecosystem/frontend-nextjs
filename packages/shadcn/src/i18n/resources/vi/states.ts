import type { states as enStates } from "../en/states";

/** Vietnamese translation of `resources/en/states.ts`. Kept shape-complete via `satisfies typeof enStates`. */
export const states = {
  emptyTitle: "Chưa có dữ liệu",
  loading: "Đang tải…",
  errorTitle: "Đã xảy ra lỗi",
  retry: "Thử lại",
} as const satisfies typeof enStates;
