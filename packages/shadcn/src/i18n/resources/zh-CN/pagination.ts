import type { pagination as enPagination } from "../en/pagination";

/** Simplified Chinese translation of `resources/en/pagination.ts`. Kept shape-complete via `satisfies typeof enPagination`. */
export const pagination = {
  showing: "显示第 {{from}}–{{to}} 条，共 {{total}} 条",
  rowsPerPage: "每页行数",
  next: "下一页",
  previous: "上一页",
} as const satisfies typeof enPagination;
