import type { pagination as enPagination } from "../en/pagination";

/** Vietnamese translation of `resources/en/pagination.ts`. Kept shape-complete via `satisfies typeof enPagination`. */
export const pagination = {
  showing: "Hiển thị {{from}}–{{to}} trên {{total}}",
  rowsPerPage: "Số dòng mỗi trang",
  next: "Tiếp theo",
  previous: "Trước",
} as const satisfies typeof enPagination;
