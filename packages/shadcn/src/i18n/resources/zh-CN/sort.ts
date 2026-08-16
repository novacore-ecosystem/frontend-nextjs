import type { sort as enSort } from "../en/sort";

/** Simplified Chinese translation of `resources/en/sort.ts`. Kept shape-complete via `satisfies typeof enSort`. */
export const sort = {
  trigger: "排序",
  title: "排序方式",
  description: "按多个字段排序，包括未显示为表格列的字段。",
  noSorts: "暂无排序字段。",
  addSort: "添加排序",
  ascending: "升序",
  descending: "降序",
} as const satisfies typeof enSort;
