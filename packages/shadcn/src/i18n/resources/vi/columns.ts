import type { columns as enColumns } from "../en/columns";

/** Vietnamese translation of `resources/en/columns.ts`. Kept shape-complete via `satisfies typeof enColumns`. */
export const columns = {
  trigger: "Cột",
  title: "Cột hiển thị",
  clear: "Xóa",
} as const satisfies typeof enColumns;
