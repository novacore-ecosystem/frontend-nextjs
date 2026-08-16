import type { sort as enSort } from "../en/sort";

/** Vietnamese translation of `resources/en/sort.ts`. Kept shape-complete via `satisfies typeof enSort`. */
export const sort = {
  trigger: "Sắp xếp",
  title: "Sắp xếp theo",
  description: "Sắp xếp theo nhiều trường, kể cả những trường không hiển thị dưới dạng cột.",
  noSorts: "Chưa có trường sắp xếp nào.",
  addSort: "Thêm sắp xếp",
  ascending: "Tăng dần",
  descending: "Giảm dần",
} as const satisfies typeof enSort;
